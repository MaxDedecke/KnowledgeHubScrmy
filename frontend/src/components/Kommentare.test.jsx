import { afterEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import App from "../App.jsx";
import KommentarFormular from "./KommentarFormular.jsx";
import * as api from "../api.js";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const DATEI = {
  id: 7,
  name: "vertrag.pdf",
  size: 2048,
  created_at: "2026-08-20T10:00:00Z",
};

const KOMMENTAR = {
  id: 1,
  file_id: 7,
  text: "Wichtiger Hinweis aus dem Papierordner",
  created_at: "2026-08-20T11:00:00Z",
};

function renderAppMitDateien() {
  vi.spyOn(api, "fetchFiles").mockResolvedValue([DATEI]);
  vi.spyOn(api, "fetchFile").mockResolvedValue(DATEI);
  return render(<App />);
}

async function dateiAuswaehlen() {
  fireEvent.click(
    await screen.findByRole("button", {
      name: `Kommentare für ${DATEI.name} anzeigen`,
    })
  );
}

describe("KommentarListe (in App integriert)", () => {
  it("lädt und zeigt nach Klick auf eine Datei deren Kommentare an", async () => {
    renderAppMitDateien();
    vi.spyOn(api, "fetchKommentare").mockResolvedValue([KOMMENTAR]);

    await dateiAuswaehlen();

    await waitFor(() => {
      expect(screen.getByText(KOMMENTAR.text)).toBeTruthy();
    });
    expect(api.fetchKommentare).toHaveBeenCalledWith(DATEI.id);
    // Kommentar ist klar der Datei zugeordnet (Karte nennt die Datei)
    expect(screen.getByText(`zu ${DATEI.name}`)).toBeTruthy();
  });

  it("zeigt bei einer Datei ohne Kommentare den Leerzustand", async () => {
    renderAppMitDateien();
    vi.spyOn(api, "fetchKommentare").mockResolvedValue([]);

    await dateiAuswaehlen();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Noch keine Kommentare" })
      ).toBeTruthy();
    });
  });

  it("zeigt bei Ladefehler einen Fehlerzustand und lädt über Retry erneut", async () => {
    renderAppMitDateien();
    const kommentarMock = vi
      .spyOn(api, "fetchKommentare")
      .mockRejectedValueOnce(new Error("Netzwerkfehler"))
      .mockResolvedValueOnce([KOMMENTAR]);

    await dateiAuswaehlen();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeTruthy();
    });
    expect(screen.queryByText(KOMMENTAR.text)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Erneut versuchen" }));

    await waitFor(() => {
      expect(screen.getByText(KOMMENTAR.text)).toBeTruthy();
    });
    expect(kommentarMock).toHaveBeenCalledTimes(2);
  });

  it("zeigt einen neu gespeicherten Kommentar unmittelbar in der Liste", async () => {
    renderAppMitDateien();
    vi.spyOn(api, "fetchKommentare").mockResolvedValue([]);
    vi.spyOn(api, "createKommentar").mockResolvedValue(KOMMENTAR);

    await dateiAuswaehlen();

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Noch keine Kommentare" })
      ).toBeTruthy();
    });

    const textarea = screen.getByRole("textbox", { name: "Kommentartext" });
    fireEvent.change(textarea, { target: { value: KOMMENTAR.text } });
    fireEvent.click(screen.getByRole("button", { name: "Kommentar speichern" }));

    await waitFor(() => {
      expect(screen.getByText(KOMMENTAR.text)).toBeTruthy();
    });
    expect(api.createKommentar).toHaveBeenCalledWith(DATEI.id, KOMMENTAR.text);
    // Eingabe ist nach dem Speichern geleert
    expect(textarea.value).toBe("");
    // Kein erneutes Laden der Liste – POST-Ergebnis aktualisiert direkt
    expect(api.fetchKommentare).toHaveBeenCalledTimes(1);
  });
});

describe("KommentarFormular", () => {
  it("deaktiviert das Speichern bei leerem Text", () => {
    render(<KommentarFormular fileId={7} onSaved={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Kommentar speichern" }).disabled
    ).toBe(true);
  });

  it("speichert den Text und meldet den Kommentar nach oben", async () => {
    const onSaved = vi.fn();
    vi.spyOn(api, "createKommentar").mockResolvedValue(KOMMENTAR);
    render(<KommentarFormular fileId={7} onSaved={onSaved} />);

    const textarea = screen.getByRole("textbox", { name: "Kommentartext" });
    fireEvent.change(textarea, {
      target: { value: `  ${KOMMENTAR.text}  ` },
    });
    fireEvent.click(screen.getByRole("button", { name: "Kommentar speichern" }));

    await waitFor(() => {
      expect(api.createKommentar).toHaveBeenCalledWith(7, KOMMENTAR.text);
    });
    expect(onSaved).toHaveBeenCalledWith(KOMMENTAR);
  });

  it("zeigt bei einem Speicherfehler eine Fehlermeldung", async () => {
    vi.spyOn(api, "createKommentar").mockRejectedValue(new Error("Kaputt"));
    render(<KommentarFormular fileId={7} onSaved={() => {}} />);

    const textarea = screen.getByRole("textbox", { name: "Kommentartext" });
    fireEvent.change(textarea, { target: { value: "Hinweis" } });
    fireEvent.click(screen.getByRole("button", { name: "Kommentar speichern" }));

    await waitFor(() => {
      expect(
        screen.getByRole("alert")
      ).toBeTruthy();
    });
    expect(
      screen.getByText(/Kommentar konnte nicht gespeichert werden/)
    ).toBeTruthy();
  });
});
