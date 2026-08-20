// Basis-URL des Backends: Standard ist der Compose-Servicename im internen
// Docker-Netz. Für lokale Entwicklung ohne Compose kann per
// VITE_API_BASE_URL überschrieben werden.
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://backend:3000";

/**
 * Lädt die Liste aller hochgeladenen Dateien vom Backend (GET /api/files).
 * Liefert pro Datei ID, Name und Upload-Zeitpunkt (created_at). Wirft bei
 * Netzwerk- oder HTTP-Fehlern (rejected Promise), damit die Oberfläche den
 * Fehlerzustand anzeigen kann.
 *
 * @returns {Promise<Array<{id: number, name: string, size: number, created_at: string}>>}
 */
export async function getFiles() {
  const response = await fetch(`${API_BASE_URL}/api/files`);
  if (!response.ok) {
    throw new Error(
      `Dateiliste konnte nicht geladen werden (HTTP ${response.status})`
    );
  }
  return response.json();
}

/**
 * Lädt die Metadaten einer einzelnen Datei (GET /api/files/:id).
 * Wirft bei Netzwerk- oder HTTP-Fehlern (z. B. 404 bei unbekannter Datei),
 * damit die Oberfläche den Fehlerzustand anzeigen kann.
 *
 * @param {number} fileId ID der Datei.
 * @returns {Promise<{id: number, name: string, mime_type: string, size: number, uploaded_at: string}>}
 */
export async function fetchFile(fileId) {
  const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`);
  if (!response.ok) {
    throw new Error(
      `Datei konnte nicht geladen werden (HTTP ${response.status})`
    );
  }
  return response.json();
}

/**
 * Lädt die Datei über den Backend-Endpunkt GET /api/files/:id/download herunter
 * und stößt den Browser-Download über einen Blob und temporären Link an.
 * Wirft bei Netzwerk- oder HTTP-Fehlern (z. B. 404 bei gelöschter Datei),
 * damit die Oberfläche den Fehler sichtbar machen kann.
 *
 * @param {number} fileId ID der Datei.
 */
export async function downloadFile(fileId) {
  const response = await fetch(`${API_BASE_URL}/api/files/${fileId}/download`);
  if (!response.ok) {
    throw new Error(
      `Datei konnte nicht heruntergeladen werden (HTTP ${response.status})`
    );
  }
  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition") || "";
  const match = disposition.match(/filename="?([^";]+)"?/i);
  const filename = match ? match[1] : `datei-${fileId}.bin`;

  // Temporären Objekt-URL erzeugen und Klick simulieren, damit der Browser
  // die Datei mit korrektem Dateinamen herunterlädt.
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Lädt eine Datei als Multipart-Upload zum Backend hoch (POST /api/files,
 * Backend-Pfad /upload). Liefert den gespeicherten Metadatensatz im selben
 * Format wie getFiles zurück, damit die Dateiliste ohne erneutes Laden
 * aktualisiert werden kann.
 *
 * @param {File} file Datei aus der Dateiauswahl des Browsers.
 * @returns {Promise<{id: number, name: string, size: number, created_at: string}>}
 */
export async function uploadFile(file) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch(`${API_BASE_URL}/api/files`, {
    method: "POST",
    body,
  });
  if (!response.ok) {
    throw new Error(`Datei konnte nicht hochgeladen werden (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * Lädt alle Kommentare einer Datei (GET /api/files/:id/kommentare).
 * Wirft bei Netzwerk- oder HTTP-Fehlern, damit die Oberfläche den
 * Fehlerzustand anzeigen kann.
 *
 * @param {number} fileId ID der Datei.
 * @returns {Promise<Array<{id: number, file_id: number, text: string, created_at: string}>>}
 */
export async function fetchKommentare(fileId) {
  const response = await fetch(`${API_BASE_URL}/api/files/${fileId}/kommentare`);
  if (!response.ok) {
    throw new Error(
      `Kommentare konnten nicht geladen werden (HTTP ${response.status})`
    );
  }
  return response.json();
}

/**
 * Speichert einen neuen Kommentar zu einer Datei (POST /api/files/:id/kommentare).
 * Liefert den gespeicherten Kommentar zurück, damit die Kommentarliste ohne
 * erneutes Laden aktualisiert werden kann.
 *
 * @param {number} fileId ID der Datei.
 * @param {string} text Kommentartext.
 * @returns {Promise<{id: number, file_id: number, text: string, created_at: string}>}
 */
export async function createKommentar(fileId, text) {
  const response = await fetch(`${API_BASE_URL}/api/files/${fileId}/kommentare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error(
      `Kommentar konnte nicht gespeichert werden (HTTP ${response.status})`
    );
  }
  return response.json();
}
