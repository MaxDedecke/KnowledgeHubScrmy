import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import FileDetail from "./FileDetail.jsx";
import * as api from "../api.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const DATEI = {
  id: 7,
  name: "vertrag.pdf",
  mime_type: "application/pdf",
  size: 2048,
  uploaded_at: "2026-08-20T10:00:00Z",
};

describe("FileDetail", () => {
  it("zeigt den Download-Button mit Dateinamen und lädt die Datei über die API herunter", async () => {
    vi.spyOn(api, "fetchFile").mockResolvedValue(DATEI);
    vi.spyOn(api, "fetchKommentare").mockResolvedValue([]);
    const downloadMock = vi.spyOn(api, "downloadFile").mockResolvedValue();

    render(<FileDetail fileId={DATEI.id} onBack={() => {}} />);

    const downloadButton = await screen.findByRole("button", {
      name: `${DATEI.name} herunterladen`,
    });
    // Button zeigt den Dateinamen an
    expect(downloadButton.textContent).toContain(DATEI.name);
    // Download-Button erfüllt die Mindest-Klickziele von 44×44 px
    expect(downloadButton.className).toContain("min-h-11");
    expect(downloadButton.className).toContain("min-w-11");

    fireEvent.click(downloadButton);
    await waitFor(() => {
      expect(downloadMock).toHaveBeenCalledWith(DATEI.id);
    });
  });

  it("zeigt bei einem fehlgeschlagenen Download eine Fehlermeldung", async () => {
    vi.spyOn(api, "fetchFile").mockResolvedValue(DATEI);
    vi.spyOn(api, "fetchKommentare").mockResolvedValue([]);
    vi.spyOn(api, "downloadFile").mockRejectedValue(new Error("Datei weg"));

    render(<FileDetail fileId={DATEI.id} onBack={() => {}} />);

    const downloadButton = await screen.findByRole("button", {
      name: `${DATEI.name} herunterladen`,
    });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
    expect(
      screen.getByText(/konnte nicht heruntergeladen werden/)
    ).toBeTruthy();
  });
});
