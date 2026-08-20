import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
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

/** Metadaten einer hochgeladenen Datei im API-Vertrag. */
function fileMeta(overrides = {}) {
  return {
    id: 99,
    name: "hochgeladen.txt",
    size: 100,
    created_at: "2026-08-20T12:00:00Z",
    ...overrides,
  };
}

/**
 * Gemeinsamer Assistent für Upload-Tests: mockt die Dateiliste leer, rendert
 * die App und wartet, bis der leere Zustand sichtbar ist. Danach liefert er
 * das versteckte <input type="file"> zurück, über das Tests den Upload
 * auslösen. `upload` bestimmt, wie sich api.uploadFile verhält (Promise oder
 * Funktion); ohne Angabe gelingt ein Standard-Upload.
 */
async function renderUploadTest({ upload } = {}) {
  vi.spyOn(api, "getFiles").mockResolvedValue([]);
  const uploadMock =
    upload === undefined
      ? vi.spyOn(api, "uploadFile").mockResolvedValue(fileMeta())
      : vi.spyOn(api, "uploadFile").mockImplementation(upload);
  const { container } = render(<App />);

  await waitFor(() => {
    expect(
      screen.getByRole("heading", { name: "Noch keine Dateien vorhanden" })
    ).toBeTruthy();
  });

  const fileInput = container.querySelector('input[type="file"]');
  return { fileInput, uploadMock };
}

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
    // Upload-Button erfüllt die Mindest-Klickziele von 44×44 px
    const uploadButton = screen.getByRole("button", {
      name: "Datei auswählen",
    });
    expect(uploadButton.className).toContain("min-h-11");
    expect(uploadButton.className).toContain("min-w-11");
  });

  it("zeigt beim initialen Laden einen Ladezustand", () => {
    vi.spyOn(api, "getFiles").mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(screen.getByText("Wird geladen …")).toBeTruthy();
  });

  it("zeigt bei leerer Dateiliste den leeren Zustand", async () => {
    vi.spyOn(api, "getFiles").mockResolvedValue([]);
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Noch keine Dateien vorhanden" })
      ).toBeTruthy();
    });
    expect(api.getFiles).toHaveBeenCalledTimes(1);
  });

  it("zeigt bei Ladefehler einen Fehlerzustand und lädt über Retry erneut", async () => {
    const fetchMock = vi
      .spyOn(api, "getFiles")
      .mockRejectedValueOnce(new Error("Netzwerkfehler"))
      .mockResolvedValueOnce([
        { id: 7, name: "retry.txt", size: 100, created_at: "2026-08-20T10:00:00Z" },
      ]);
    render(<App />);

    // Fehlerzustand erscheint in Sidebar und Hauptbereich (Dateiliste);
    // hier wird der Retry der Hauptansicht geprüft.
    const dateiliste = await screen.findByRole("region", {
      name: "Dateiliste",
    });
    await waitFor(() => {
      expect(within(dateiliste).getByRole("alert")).toBeTruthy();
    });
    expect(screen.queryByText("retry.txt")).toBeNull();

    fireEvent.click(
      within(dateiliste).getByRole("button", { name: "Erneut versuchen" })
    );

    await waitFor(() => {
      expect(screen.getAllByText("retry.txt").length).toBeGreaterThan(0);
    });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("zeigt nach erfolgreichem Laden die Dateien als Liste an", async () => {
    vi.spyOn(api, "getFiles").mockResolvedValue([
      { id: 1, name: "vertrag.pdf", size: 2048, created_at: "2026-08-20T10:00:00Z" },
      { id: 2, name: "notizen.txt", size: 100, created_at: "2026-08-19T09:30:00Z" },
    ]);
    render(<App />);

    await waitFor(() => {
      expect(screen.getAllByText("vertrag.pdf").length).toBeGreaterThan(0);
      expect(screen.getAllByText("notizen.txt").length).toBeGreaterThan(0);
    });
    expect(screen.queryByText("Wird geladen …")).toBeNull();
    expect(screen.queryByText("Noch keine Dateien vorhanden")).toBeNull();
  });

  it("zeigt einen neu hochgeladenen Upload unmittelbar in der Liste", async () => {
    const uploadMock = vi.fn().mockResolvedValue(
      fileMeta({
        id: 3,
        name: "frisch.pdf",
        size: 500,
        created_at: "2026-08-20T11:00:00Z",
      })
    );
    const { fileInput } = await renderUploadTest({ upload: uploadMock });
    const file = new File(["Inhalt"], "frisch.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getAllByText("frisch.pdf").length).toBeGreaterThan(0);
    });
    expect(uploadMock).toHaveBeenCalledWith(file);
    // Kein erneutes Laden der kompletten Liste – Upload-Ergebnis aktualisiert direkt.
    expect(api.getFiles).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole("heading", { name: "Noch keine Dateien vorhanden" })
    ).toBeNull();
  });

  it("zeigt bei fehlgeschlagenem Upload das Alert-Muster mit Fehlermeldung", async () => {
    const { fileInput } = await renderUploadTest({
      upload: () => Promise.reject(new Error("Upload kaputt")),
    });

    fireEvent.change(fileInput, {
      target: { files: [new File(["x"], "kaputt.txt")] },
    });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
    expect(screen.getByText("Upload fehlgeschlagen")).toBeTruthy();
    expect(
      screen.getByText(
        "Datei konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut."
      )
    ).toBeTruthy();
  });

  it("zeigt während des Uploads einen Spinner im Button und deaktiviert diesen", async () => {
    let finishUpload;
    const pendingUpload = new Promise((resolve) => {
      finishUpload = resolve;
    });
    const { fileInput } = await renderUploadTest({
      upload: () => pendingUpload,
    });

    fireEvent.change(fileInput, {
      target: { files: [new File(["x"], "laufend.txt")] },
    });

    // Solange der Upload läuft: deaktivierter Button mit Spinner als
    // Overlay – Mindest-Klickziele bleiben erhalten.
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Wird hochgeladen/ });
      expect(button.disabled).toBe(true);
      expect(button.className).toContain("min-h-11");
      expect(button.className).toContain("min-w-11");
      expect(button.querySelector("svg.animate-spin")).toBeTruthy();
    });

    finishUpload(fileMeta({ id: 5, name: "laufend.txt" }));

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /Wird hochgeladen/ })
      ).toBeNull();
    });
    expect(screen.getAllByText("laufend.txt").length).toBeGreaterThan(0);
  });

  it("zeigt nach erfolgreichem Upload einen kurzen Erfolgs-Hinweis", async () => {
    const { fileInput } = await renderUploadTest({
      upload: () => Promise.resolve(fileMeta({ id: 7, name: "erfolg.txt" })),
    });

    fireEvent.change(fileInput, {
      target: { files: [new File(["x"], "erfolg.txt")] },
    });

    await waitFor(() => {
      expect(screen.getByText("Upload erfolgreich")).toBeTruthy();
    });
    expect(screen.getByText("Datei erfolgreich hochgeladen.")).toBeTruthy();
    expect(screen.getByRole("alert")).toBeTruthy();
  });

  it("öffnet per Klick in der Sidebar die Detailansicht der Datei und zeigt die Auswahl in der Sidebar hervor", async () => {
    vi.spyOn(api, "getFiles").mockResolvedValue([
      { id: 1, name: "vertrag.pdf", size: 2048, created_at: "2026-08-20T10:00:00Z" },
    ]);
    vi.spyOn(api, "fetchFile").mockResolvedValue({
      id: 1,
      name: "vertrag.pdf",
      mime_type: "application/pdf",
      size: 2048,
      uploaded_at: "2026-08-20T10:00:00Z",
    });
    vi.spyOn(api, "fetchKommentare").mockResolvedValue([]);

    render(<App />);

    // Schritte 1–2: Dateien geladen, Startansicht (Upload + Dateiliste) sichtbar,
    // Klick-Handler existiert in der Sidebar (aria-label je Datei).
    const sidebar = await screen.findByRole("complementary", {
      name: "Seitenleiste",
    });
    await waitFor(() => {
      expect(
        within(sidebar).getByRole("button", {
          name: "Kommentare für vertrag.pdf anzeigen",
        })
      ).toBeTruthy();
    });
    expect(screen.getByText("Willkommen im Knowledge Hub")).toBeTruthy();
    // Noch keine Datei ausgewählt: nur Dateiliste, keine Detailansicht.
    expect(screen.queryByText("Zurück zur Dateiliste")).toBeNull();

    fireEvent.click(
      within(sidebar).getByRole("button", {
        name: "Kommentare für vertrag.pdf anzeigen",
      })
    );

    // Schritt 3: Hauptansicht wechselt zur Detailansicht der gewählten Datei.
    await waitFor(() => {
      expect(screen.getByText("Zurück zur Dateiliste")).toBeTruthy();
      expect(
        screen.getByRole("heading", { name: "Kommentare" })
      ).toBeTruthy();
    });

    // Die ausgewählte Datei ist in der Sidebar farblich hervorgehoben
    // (shadcn-Akzentfläche, vgl. Design-Konzept „ausgewählte Zeilen").
    const selectedButton = within(sidebar).getByRole("button", {
      name: "Kommentare für vertrag.pdf anzeigen",
    });
    expect(selectedButton.className).toContain("bg-accent");

    // Dateiname erscheint in Sidebar und Detailansicht.
    expect(screen.getAllByText("vertrag.pdf").length).toBeGreaterThanOrEqual(2);
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

  it("rendert die Dateien als Cards mit Größe und Datum und Download-Button", () => {
    render(
      <FileList
        status="success"
        files={[{ id: 9, name: "bericht.pdf", size: 1536, created_at: "2026-08-20T10:00:00Z" }]}
      />
    );

    expect(screen.getByText("bericht.pdf")).toBeTruthy();
    expect(screen.getByText(/1,5 kB/)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "bericht.pdf herunterladen" })
    ).toBeTruthy();
  });

  it("zeigt beim fehlgeschlagenen Download eine Alert-Fehlermeldung", async () => {
    vi.spyOn(api, "downloadFile").mockRejectedValue(new Error("Datei weg"));
    render(
      <FileList
        status="success"
        files={[{ id: 9, name: "kaputt.pdf", size: 512, created_at: "2026-08-20T10:00:00Z" }]}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "kaputt.pdf herunterladen" })
    );

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
    expect(
      screen.getByText(/„kaputt.pdf" konnte nicht heruntergeladen werden/)
    ).toBeTruthy();
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
