// Basis-URL des Backends: Standard ist der Compose-Servicename im internen
// Docker-Netz. Für lokale Entwicklung ohne Compose kann per
// VITE_API_BASE_URL überschrieben werden.
const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://backend:3000";

/**
 * Lädt die Liste aller hochgeladenen Dateien vom Backend (GET /api/files).
 * Wirft bei Netzwerk- oder HTTP-Fehlern, damit die Oberfläche den
 * Fehlerzustand anzeigen kann.
 *
 * @returns {Promise<Array<{id: number, name: string, size: number, created_at: string}>>}
 */
export async function fetchFiles() {
  const response = await fetch(`${API_BASE_URL}/api/files`);
  if (!response.ok) {
    throw new Error(
      `Dateiliste konnte nicht geladen werden (HTTP ${response.status})`
    );
  }
  return response.json();
}

/**
 * Lädt eine Datei als Multipart-Upload zum Backend hoch (POST /api/files,
 * Backend-Pfad /upload). Liefert den gespeicherten Metadatensatz im selben
 * Format wie fetchFiles zurück, damit die Dateiliste ohne erneutes Laden
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
