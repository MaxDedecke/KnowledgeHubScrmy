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
