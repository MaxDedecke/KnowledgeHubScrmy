import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "./App.jsx";
import FileList, { formatBytes } from "./components/FileList.jsx";
import * as api from "./api.js";

// Vitest läuft ohne globals: true, daher räumt @testing-library/react nicht
// automatisch auf. Ohne explizites Cleanup bleiben gerenderte Komponenten
// zwischen Tests stehen und führen zu Mehrfach-Treffern.
afterEach(() => {
  cleanup();
});

describe("App", () => {
  it("rendert die responsive Grundfläche mit Titel", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Knowledge Hub" })
    ).toBeTruthy();
    expect(
      screen.getByRole("heading", { name: /Willkommen im Knowledge Hub/ })
    ).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Datei auswählen" })
    ).toBeTruthy();
  });

  it("zeigt beim initialen Laden einen Ladezustand", () => {
    vi.spyOn(api, "fetchFiles").mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(screen.getByText("Wird geladen …")).toBeTruthy();
  });

  it("zeigt bei leerer Dateiliste den leeren Zustand", async () => {
    vi.spyOn(api, "fetchFiles").mockResolvedValue([]);
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Noch keine Dateien vorhanden" })
      ).toBeTruthy();
    });
    expect(api.fetchFiles).toHaveBeenCalledTimes(1);
  });

  it("zeigt bei Ladefehler einen Fehlerzustand und lädt über Retry erneut", async () => {
    const fetchMock = vi
      .spyOn(api, "fetchFiles")
      .mockRejectedValueOnce(new Error("Netzwerkfehler"))
      .mockResolvedValueOnce([
        { id: 7, name: "retry.txt", size: 100, created_at: "2026-08-20T10:00:00Z" },
      ]);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
    expect(screen.queryByText("retry.txt")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Erneut versuchen" }));

    await waitFor(() => {
      expect(screen.getByText("retry.txt")).toBeTruthy();
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("zeigt nach erfolgreichem Laden die Dateien als Liste an", async () => {
    vi.spyOn(api, "fetchFiles").mockResolvedValue([
      { id: 1, name: "vertrag.pdf", size: 2048, created_at: "2026-08-20T10:00:00Z" },
      { id: 2, name: "notizen.txt", size: 100, created_at: "2026-08-19T09:30:00Z" },
    ]);
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("vertrag.pdf")).toBeTruthy();
      expect(screen.getByText("notizen.txt")).toBeTruthy();
    });
    expect(screen.queryByText("Wird geladen …")).toBeNull();
    expect(screen.queryByText("Noch keine Dateien vorhanden")).toBeNull();
  });
});

describe("FileList", () => {
  it("rendert den Fehlerzustand und gibt den Klick auf Retry weiter", () => {
    const onRetry = vi.fn();
    render(<FileList status="error" onRetry={onRetry} />);

    expect(screen.getByRole("alert")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Erneut versuchen" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("rendert bei leerer Liste den Hinweis ohne Dateien", () => {
    render(<FileList status="empty" />);

    expect(
      screen.getByRole("heading", { name: "Noch keine Dateien vorhanden" })
    ).toBeTruthy();
  });

  it("rendert die Dateien als Cards mit Größe und Datum", () => {
    render(
      <FileList
        status="success"
        files={[{ id: 9, name: "bericht.pdf", size: 1536, created_at: "2026-08-20T10:00:00Z" }]}
      />
    );

    expect(screen.getByText("bericht.pdf")).toBeTruthy();
    expect(screen.getByText(/1,5 kB/)).toBeTruthy();
  });
});

describe("formatBytes", () => {
  it("formatiert Bytes, kB und MB", () => {
    expect(formatBytes(500)).toBe("500 B");
    expect(formatBytes(2048)).toBe("2,0 kB");
    expect(formatBytes(3 * 1024 * 1024)).toBe("3,0 MB");
    expect(formatBytes(-1)).toBe("Unbekannte Größe");
  });
});
