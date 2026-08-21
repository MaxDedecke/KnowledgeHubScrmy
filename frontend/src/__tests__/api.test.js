import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createKommentar,
  downloadFile,
  fetchFile,
  fetchKommentare,
  getFiles,
  uploadFile,
} from "../api.js";

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("getFiles", () => {
  it("ruft GET /api/files auf und liefert die Dateiliste mit ID, Name und Upload-Datum", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 3, name: "vertrag.pdf", size: 2048, created_at: "2026-08-20T10:00:00Z" },
        { id: 1, name: "notizen.txt", size: 100, created_at: "2026-08-19T09:30:00Z" },
      ],
    });

    const files = await getFiles();

    expect(global.fetch).toHaveBeenCalledWith("/api/files");
    expect(files).toEqual([
      { id: 3, name: "vertrag.pdf", size: 2048, created_at: "2026-08-20T10:00:00Z" },
      { id: 1, name: "notizen.txt", size: 100, created_at: "2026-08-19T09:30:00Z" },
    ]);
    // Felder, die die Sidebar für die Dateiliste benötigt, sind vorhanden.
    expect(files[0]).toMatchObject({
      id: 3,
      name: "vertrag.pdf",
      created_at: "2026-08-20T10:00:00Z",
    });
  });

  it("weist bei leerer Liste ein leeres Array zurück", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    await expect(getFiles()).resolves.toEqual([]);
  });

  it("lehnt das Promise bei HTTP-Fehler (500) ab", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(getFiles()).rejects.toThrow(
      "Dateiliste konnte nicht geladen werden (HTTP 500)"
    );
  });

  it("lehnt das Promise bei Netzwerkfehler ab", async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    await expect(getFiles()).rejects.toThrow(TypeError);
  });
});

describe("fetchFile", () => {
  it("ruft GET /api/files/:id auf und liefert Metadaten der Datei", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 4,
        name: "test.pdf",
        mime_type: "application/pdf",
        size: 1024,
        uploaded_at: "2026-08-20T10:00:00Z",
      }),
    });

    const file = await fetchFile(4);

    expect(global.fetch).toHaveBeenCalledWith("/api/files/4");
    expect(file).toMatchObject({ id: 4, name: "test.pdf" });
  });

  it("wirft bei einem Fehler den Fehler", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(fetchFile(99)).rejects.toThrow(
      "Datei konnte nicht geladen werden (HTTP 404)"
    );
  });
});

describe("uploadFile", () => {
  it("leitet die konkrete Fehlermeldung des Backends bei abgelehntem Upload weiter", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({
        error: "Datei ist zu groß. Maximale Größe ist 30 MB.",
      }),
    });

    await expect(
      uploadFile(new File(["x"], "gross.pdf"))
    ).rejects.toThrow("Datei ist zu groß. Maximale Größe ist 30 MB.");
  });

  it("leitet die Meldung für nicht erlaubte Dateitypen unverändert weiter", async () => {
    const message =
      'Dateityp "application/zip" ist nicht erlaubt. Erlaubt sind: image/png, image/jpeg, application/pdf, text/plain.';
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ error: message }),
    });

    await expect(
      uploadFile(new File(["x"], "schadcode.malware"))
    ).rejects.toThrow(message);
  });

  it("liefert die Metadaten der hochgeladenen Datei im Erfolgsfall zurück", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({
        id: 3,
        name: "notiz.txt",
        size: 7,
        created_at: "2026-08-20T12:00:00Z",
      }),
    });

    const file = new File(["Inhalt"], "notiz.txt", { type: "text/plain" });
    const result = await uploadFile(file);

    expect(global.fetch).toHaveBeenCalledWith("/api/files", {
      method: "POST",
      body: expect.any(FormData),
    });
    expect(result).toMatchObject({ id: 3, name: "notiz.txt" });
  });
});

describe("downloadFile", () => {
  it("lädt die Datei im Erfolgsfall über Blob und temporären Link herunter", async () => {
    const blob = new Blob(["inhalt"], { type: "text/plain" });
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => blob,
      headers: new Headers({
        "Content-Disposition": 'attachment; filename="vertrag.pdf"',
      }),
    });

    // Klick auf den temporären Link abfangen, damit jsdom nichts echt öffnet.
    let clickedLink = null;
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(function () {
        clickedLink = this;
      });
    // jsdom kennt URL.createObjectURL nicht – direkt mocken.
    const createSpy = vi.fn().mockReturnValue("blob:mock");
    URL.createObjectURL = createSpy;
    const revokeSpy = vi.fn();
    URL.revokeObjectURL = revokeSpy;

    await downloadFile(7);

    expect(global.fetch).toHaveBeenCalledWith("/api/files/7/download");
    expect(clickedLink).not.toBeNull();
    expect(clickedLink.href).toBe("blob:mock");
    expect(clickedLink.download).toBe("vertrag.pdf");
    expect(clickSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalledWith(blob);
    expect(revokeSpy).toHaveBeenCalledWith("blob:mock");
    // Temporärer Link wurde wieder aus dem DOM entfernt.
    expect(document.querySelector('a[download]')).toBeNull();
  });

  it("wirft bei einem 404 den Fehler und startet keinen Download", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(downloadFile(99)).rejects.toThrow(
      "Datei konnte nicht heruntergeladen werden (HTTP 404)"
    );
    expect(global.fetch).toHaveBeenCalledWith("/api/files/99/download");
    expect(document.querySelector('a[download]')).toBeNull();
  });

  it("wirft bei einem Serverfehler (500) eine Exception", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(downloadFile(5)).rejects.toThrow(
      /Datei konnte nicht heruntergeladen werden/
    );
    expect(document.querySelector('a[download]')).toBeNull();
  });
});

describe("fetchKommentare", () => {
  it("ruft GET /api/files/:id/kommentare auf und liefert Kommentare", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, file_id: 2, text: "Erster Kommentar", created_at: "2026-08-20T11:00:00Z" },
      ],
    });

    const kommentare = await fetchKommentare(2);

    expect(global.fetch).toHaveBeenCalledWith("/api/files/2/kommentare");
    expect(kommentare).toHaveLength(1);
    expect(kommentare[0]).toMatchObject({ id: 1, text: "Erster Kommentar" });
  });

  it("wirft bei einem Fehler den Fehler", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(fetchKommentare(2)).rejects.toThrow(
      "Kommentare konnten nicht geladen werden (HTTP 500)"
    );
  });
});

describe("createKommentar", () => {
  it("sendet POST /api/files/:id/kommentare und liefert neuen Kommentar", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 5,
        file_id: 2,
        text: "Neuer Kommentar",
        created_at: "2026-08-20T12:00:00Z",
      }),
    });

    const neuerKommentar = await createKommentar(2, "Neuer Kommentar");

    expect(global.fetch).toHaveBeenCalledWith("/api/files/2/kommentare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "Neuer Kommentar" }),
    });
    expect(neuerKommentar).toMatchObject({ id: 5, text: "Neuer Kommentar" });
  });

  it("wirft bei einem Fehler den Fehler", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 400,
    });

    await expect(createKommentar(2, "Ungültig")).rejects.toThrow(
      "Kommentar konnte nicht gespeichert werden (HTTP 400)"
    );
  });
});
