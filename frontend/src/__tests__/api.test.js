import { afterEach, describe, expect, it, vi } from "vitest";
import { downloadFile } from "../api.js";

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
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

    expect(global.fetch).toHaveBeenCalledWith("http://backend:3000/api/files/7/download");
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
    expect(global.fetch).toHaveBeenCalledWith("http://backend:3000/api/files/99/download");
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
