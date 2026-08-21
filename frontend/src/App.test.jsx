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

  it("öffnet nach erfolgreichem Upload die neue Datei direkt in der Detailansicht und markiert sie in der Sidebar", async () => {
    vi.spyOn(api, "getFiles").mockResolvedValue([]);
    const hochgeladen = fileMeta({
      id: 4,
      name: "neu.txt",
      size: 200,
      created_at: "2026-08-20T11:30:00Z",
    });
    const uploadMock = vi.spyOn(api, "uploadFile").mockResolvedValue(hochgeladen);
    vi.spyOn(api, "fetchFile").mockResolvedValue({
      id: 4,
      name: "neu.txt",
      mime_type: "text/plain",
      size: 200,
      uploaded_at: "2026-08-20T11:30:00Z",
    });
    vi.spyOn(api, "fetchKommentare").mockResolvedValue([]);
    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Noch keine Dateien vorhanden" })
      ).toBeTruthy();
    });

    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, {
      target: { files: [new File(["Inhalt"], "neu.txt")] },
    });

    // Ohne weiteren Klick öffnet sich direkt die Detailansicht der
    // hochgeladenen Datei (Kommentarliste sichtbar).
    await waitFor(() => {
      expect(screen.getByText("Zurück zur Dateiliste")).toBeTruthy();
      expect(screen.getByRole("heading", { name: "Kommentare" })).toBeTruthy();
    });
    expect(uploadMock).toHaveBeenCalledTimes(1);

    // Die Detailansicht lädt genau die frisch hochgeladene Datei.
    expect(api.fetchFile).toHaveBeenCalledWith(4);

    // Die Sidebar markiert die neue Datei farblich als ausgewählt.
    const sidebar = screen.getByRole("complementary", { name: "Seitenleiste" });
    const selectedButton = within(sidebar).getByRole("button", {
      name: "Kommentare für neu.txt anzeigen",
    });
    expect(selectedButton.className).toContain("bg-accent");
  });

  it("zeigt bei fehlgeschlagenem Upload die konkrete Backend-Fehlermeldung im Alert", async () => {
    const { fileInput } = await renderUploadTest({
      upload: () =>
        Promise.reject(
          new Error("Datei ist zu groß. Maximale Größe ist 30 MB.")
        ),
    });

    fireEvent.change(fileInput, {
      target: { files: [new File(["x"], "gross.pdf")] },
    });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
    expect(screen.getByText("Upload fehlgeschlagen")).toBeTruthy();
    // Die exakte, vom Backend gelieferte Meldung erscheint im Alert –
    // nicht mehr die generische Standardmeldung.
    expect(
      screen.getByText("Datei ist zu groß. Maximale Größe ist 30 MB.")
    ).toBeTruthy();
    expect(
      screen.queryByText(
        "Datei konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut."
      )
    ).toBeNull();
  });

  it("zeigt unter dem Upload-Button den Hinweis auf erlaubte Dateitypen und die 30-MB-Grenze", async () => {
    vi.spyOn(api, "getFiles").mockResolvedValue([]);
    render(<App />);

    expect(
      screen.getByText(
        "Erlaubte Dateitypen: PNG, JPEG, PDF, TXT · max. 30 MB"
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

  it("durchspielt den Upload-Erfolgsablauf: deaktivierter Button + Spinner, automatisch geöffnete Datei, ausgeblendeter Erfolgs-Alert", async () => {
    let finishUpload;
    const pendingUpload = new Promise((resolve) => {
      finishUpload = resolve;
    });
    const hochgeladen = fileMeta({ id: 8, name: "ablauf.txt", size: 300 });
    const { fileInput } = await renderUploadTest({
      upload: () => pendingUpload,
    });

    // 1. Datei auswählen und Upload auslösen.
    fireEvent.change(fileInput, {
      target: { files: [new File(["Inhalt"], "ablauf.txt")] },
    });

    // 2. Während der Übertragung: Button deaktiviert und zeigt einen Spinner.
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Wird hochgeladen/ });
      expect(button.disabled).toBe(true);
      expect(button.querySelector("svg.animate-spin")).toBeTruthy();
    });

    // 3. Erfolgreiche Antwort: Ladezustand endet, die neue Datei wird
    // automatisch ausgewählt und geöffnet, der Erfolgs-Alert ist ausgeblendet.
    finishUpload(hochgeladen);
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /Wird hochgeladen/ })
      ).toBeNull();
      expect(screen.getByText("Zurück zur Dateiliste")).toBeTruthy();
    });
    // Der Button ist wieder aktiv (Ladezustand freigegeben).
    expect(
      screen.getByRole("button", { name: "Datei auswählen" }).disabled
    ).toBe(false);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.queryByText("Upload erfolgreich")).toBeNull();
    expect(screen.queryByText("Datei erfolgreich hochgeladen.")).toBeNull();
  });

  it("gibt im Upload-Fehlerfall den Ladezustand frei und zeigt einen Fehler-Alert", async () => {
    let rejectUpload;
    const pendingUpload = new Promise((_, reject) => {
      rejectUpload = reject;
    });
    const { fileInput } = await renderUploadTest({
      upload: () => pendingUpload,
    });

    fireEvent.change(fileInput, {
      target: { files: [new File(["x"], "kaputt.txt")] },
    });

    // 1. Während der Übertragung ist der Button deaktiviert.
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /Wird hochgeladen/ });
      expect(button.disabled).toBe(true);
    });

    // 2. Fehlerantwort: Ladezustand wird freigegeben ...
    rejectUpload(new Error("Datei ist zu groß. Maximale Größe ist 30 MB."));
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /Wird hochgeladen/ })
      ).toBeNull();
    });
    // ... der Button ist wieder aktiv ...
    expect(
      screen.getByRole("button", { name: "Datei auswählen" }).disabled
    ).toBe(false);
    // ... und ein Fehler-Alert erscheint mit der konkreten Meldung.
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText("Upload fehlgeschlagen")).toBeTruthy();
    expect(
      screen.getByText("Datei ist zu groß. Maximale Größe ist 30 MB.")
    ).toBeTruthy();
  });

  it("blendet den Erfolgs-Alert nach erfolgreichem Upload aus, sobald die neue Datei geöffnet ist", async () => {
    const { fileInput } = await renderUploadTest({
      upload: () => Promise.resolve(fileMeta({ id: 7, name: "erfolg.txt" })),
    });

    fireEvent.change(fileInput, {
      target: { files: [new File(["x"], "erfolg.txt")] },
    });

    // Die neue Datei ist automatisch ausgewählt und die Detailansicht offen.
    await waitFor(() => {
      expect(screen.getByText("Zurück zur Dateiliste")).toBeTruthy();
    });
    // Nach dem Öffnen der neuen Datei ist der Erfolgs-Alert ausgeblendet.
    expect(screen.queryByText("Upload erfolgreich")).toBeNull();
    expect(screen.queryByText("Datei erfolgreich hochgeladen.")).toBeNull();
    expect(screen.queryByRole("alert")).toBeNull();
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

  it("setzt die Auswahl zurück und kehrt zur Startansicht, wenn die aktive Datei erneut geklickt wird", async () => {
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

    // Erst die Datei auswählen → Detailansicht öffnet sich.
    const sidebar = await screen.findByRole("complementary", {
      name: "Seitenleiste",
    });
    const button = within(sidebar).getByRole("button", {
      name: "Kommentare für vertrag.pdf anzeigen",
    });
    fireEvent.click(button);
    expect(screen.getByText("Zurück zur Dateiliste")).toBeTruthy();
    expect(button.className).toContain("bg-accent");

    // Erneuter Klick auf die aktive Datei setzt die Auswahl zurück.
    fireEvent.click(button);

    // Startansicht (Dateiliste) ist wieder sichtbar, keine Detailansicht.
    expect(screen.getByText("Willkommen im Knowledge Hub")).toBeTruthy();
    expect(
      screen.getByRole("region", { name: "Dateiliste" })
    ).toBeTruthy();
    expect(screen.queryByText("Zurück zur Dateiliste")).toBeNull();
    // In der Sidebar ist keine Datei mehr hervorgehoben.
    expect(button.className).not.toContain("bg-accent");
  });

  it("öffnet die Sidebar auf Mobile als Off-Canvas-Panel und schließt es über den X-Button", async () => {
    vi.spyOn(api, "getFiles").mockResolvedValue([]);
    render(<App />);

    // Geschlossen: kein dialog, aber der Hamburger ist sichtbar.
    expect(screen.queryByRole("dialog", { name: "Mobile Navigation" })).toBeNull();
    const openButton = screen.getByRole("button", { name: "Navigation öffnen" });
    expect(openButton.className).toContain("md:hidden");

    fireEvent.click(openButton);

    const panel = await screen.findByRole("dialog", {
      name: "Mobile Navigation",
    });
    expect(within(panel).getByRole("complementary", { name: "Seitenleiste" })).toBeTruthy();
    expect(within(panel).getByRole("heading", { name: "Dateien" })).toBeTruthy();
    expect(openButton.getAttribute("aria-expanded")).toBe("true");

    // Schließen über den X-Button im Panel.
    fireEvent.click(within(panel).getByRole("button", { name: "Navigation schließen" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Mobile Navigation" })).toBeNull();
    });
  });

  it("schließt die mobile Navigation per Klick auf den Backdrop", async () => {
    vi.spyOn(api, "getFiles").mockResolvedValue([]);
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "Navigation öffnen" }));
    const panel = await screen.findByRole("dialog", {
      name: "Mobile Navigation",
    });

    fireEvent.click(within(panel).getByTestId("sidebar-backdrop"));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Mobile Navigation" })).toBeNull();
    });
  });

  it("beschriftet den Hamburger dynamisch und zeichnet die mobile Sidebar als Dialog aus", async () => {
    vi.spyOn(api, "getFiles").mockResolvedValue([]);
    render(<App />);

    // Geschlossen: Hamburger mit aussagekräftigem Label, aria-expanded false.
    const toggleButton = screen.getByRole("button", {
      name: "Navigation öffnen",
    });
    expect(toggleButton.getAttribute("aria-label")).toBe("Navigation öffnen");
    expect(toggleButton.getAttribute("aria-expanded")).toBe("false");
    expect(toggleButton.getAttribute("aria-haspopup")).toBe("true");

    fireEvent.click(toggleButton);
    const panel = await screen.findByRole("dialog", {
      name: "Mobile Navigation",
    });

    // Dialog-Rolle und Modal-Verhalten sind gesetzt, Overlay ist aria-hidden.
    expect(panel.getAttribute("aria-modal")).toBe("true");
    expect(panel.getAttribute("tabindex")).toBe("-1");
    expect(
      within(panel).getByTestId("sidebar-backdrop").getAttribute("aria-hidden")
    ).toBe("true");

    // Der geöffnete Zustand schlägt sich auch in der Button-Beschriftung nieder.
    expect(toggleButton.getAttribute("aria-label")).toBe("Navigation schließen");
    expect(toggleButton.getAttribute("aria-expanded")).toBe("true");
  });

  it("verschiebt den Fokus beim Öffnen in die Sidebar und beim Schließen zurück zum Hamburger", async () => {
    vi.spyOn(api, "getFiles").mockResolvedValue([]);
    render(<App />);

    const toggleButton = screen.getByRole("button", {
      name: "Navigation öffnen",
    });
    fireEvent.click(toggleButton);
    const panel = await screen.findByRole("dialog", {
      name: "Mobile Navigation",
    });

    // Fokus wandert beim Öffnen in den Dialog (tabIndex={-1} macht ihn
    // programmatisch fokussierbar, ohne in die Tab-Reihenfolge zu rücken).
    await waitFor(() => {
      expect(document.activeElement).toBe(panel);
    });

    fireEvent.click(
      within(panel).getByRole("button", { name: "Navigation schließen" })
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Mobile Navigation" })
      ).toBeNull();
    });
    // Fokus ist zum Hamburger-Button zurückgekehrt.
    await waitFor(() => {
      expect(document.activeElement).toBe(toggleButton);
    });
  });

  it("schließt die mobile Navigation per Escape und führt den Fokus zurück", async () => {
    vi.spyOn(api, "getFiles").mockResolvedValue([]);
    render(<App />);

    const toggleButton = screen.getByRole("button", {
      name: "Navigation öffnen",
    });
    fireEvent.click(toggleButton);
    const panel = await screen.findByRole("dialog", {
      name: "Mobile Navigation",
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(panel);
    });

    // Escape auf Dokumentebene (der Listener hängt an document) schließt das Panel.
    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Mobile Navigation" })
      ).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(toggleButton);
    });
  });

  it("schließt das Off-Canvas-Panel, sobald im Panel eine Datei ausgewählt wird", async () => {
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

    fireEvent.click(screen.getByRole("button", { name: "Navigation öffnen" }));
    const panel = await screen.findByRole("dialog", {
      name: "Mobile Navigation",
    });
    await waitFor(() => {
      expect(
        within(panel).getByRole("button", {
          name: "Kommentare für vertrag.pdf anzeigen",
        })
      ).toBeTruthy();
    });

    fireEvent.click(
      within(panel).getByRole("button", {
        name: "Kommentare für vertrag.pdf anzeigen",
      })
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Mobile Navigation" })).toBeNull();
    });
    // Auswahl hat die Detailansicht geöffnet.
    expect(screen.getByText("Zurück zur Dateiliste")).toBeTruthy();
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
