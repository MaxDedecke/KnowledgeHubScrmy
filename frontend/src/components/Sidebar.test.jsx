import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import App from "../App.jsx";
import * as api from "../api.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

/**
 * Rendert die App mit gemockter Dateiliste und liefert die Sidebar
 * (role complementary "Seitenleiste"), sobald sie im DOM steht.
 * Die Sidebar bezieht Dateien und Zustand über App.jsx, die beim
 * Mount `getFiles()` lädt – das Mock steuert damit den Zustand der Sidebar.
 */
async function renderSidebar({ files, getFilesImpl } = {}) {
  if (getFilesImpl) {
    vi.spyOn(api, "getFiles").mockImplementation(getFilesImpl);
  } else {
    vi.spyOn(api, "getFiles").mockResolvedValue(files ?? []);
  }
  render(<App />);
  return screen.findByRole("complementary", { name: "Seitenleiste" });
}

describe("Sidebar", () => {
  it("zeigt während des Ladens den Ladezustand der ListState-Komponente", async () => {
    // getFiles bleibt offen: Sidebar bleibt im Ladezustand.
    const sidebar = await renderSidebar({
      getFilesImpl: () => new Promise(() => {}),
    });

    expect(
      within(sidebar).getByText("Dateien werden geladen …")
    ).toBeTruthy();
  });

  it("zeigt bei leerer Dateiliste den Leerzustand der ListState-Komponente", async () => {
    const sidebar = await renderSidebar({ files: [] });

    await waitFor(() => {
      expect(
        within(sidebar).getByRole("heading", { name: "Noch keine Dateien" })
      ).toBeTruthy();
    });
  });

  it("zeigt bei API-Fehler den Fehlerzustand der ListState-Komponente", async () => {
    const sidebar = await renderSidebar({
      getFilesImpl: () => Promise.reject(new Error("Netzwerkfehler")),
    });

    await waitFor(() => {
      expect(within(sidebar).getByRole("alert")).toBeTruthy();
    });
    expect(
      within(sidebar).getByText("Dateien konnten nicht geladen werden")
    ).toBeTruthy();
  });

  it("zeigt im Erfolgsfall alle Dateien mit Name und Upload-Datum", async () => {
    const sidebar = await renderSidebar({
      files: [
        { id: 1, name: "vertrag.pdf", size: 2048, created_at: "2026-08-20T10:00:00Z" },
        { id: 2, name: "notizen.txt", size: 100, created_at: "2026-07-15T09:30:00Z" },
      ],
    });

    await waitFor(() => {
      expect(
        within(sidebar).getByRole("button", {
          name: "Kommentare für vertrag.pdf anzeigen",
        })
      ).toBeTruthy();
      expect(
        within(sidebar).getByRole("button", {
          name: "Kommentare für notizen.txt anzeigen",
        })
      ).toBeTruthy();
    });
    // Upload-Datum als lesbar formatiertes Datum (formatDate aus FileList.jsx)
    expect(within(sidebar).getByText(/20\.08\.2026/)).toBeTruthy();
    expect(within(sidebar).getByText(/15\.07\.2026/)).toBeTruthy();
  });
});
