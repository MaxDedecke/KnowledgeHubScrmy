const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');

/**
 * Entfernt unsichere Zeichen aus einem Dateinamen und begrenzt ihn.
 */
function safeFilename(name) {
  const base = path.basename(name || 'datei');
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, '_');
  return cleaned || 'datei';
}

/**
 * Ermittelt anhand der Dateinamens-Endung den passenden Content-Type.
 * Fällt ohne erkennbare Endung auf application/octet-stream zurück.
 */
function contentTypeFor(name) {
  return mime.lookup(name) || 'application/octet-stream';
}

/**
 * Baut einen eindeutigen Speichernamen (Zeitstempel + Zufallssuffix + bereinigter Name),
 * damit auch zwei Uploads in derselben Millisekunde nicht kollidieren.
 */
function buildStoredName(originalName) {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeFilename(originalName)}`;
}

function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
  return UPLOAD_DIR;
}

/**
 * Schreibt einen Datei-Puffer in das Dateisystem des Containers und
 * liefert den absoluten Speicherpfad zurück.
 */
function writeToDisk(name, buffer) {
  const dir = ensureUploadDir();
  const storedPath = path.join(dir, buildStoredName(name));
  fs.writeFileSync(storedPath, buffer);
  return storedPath;
}

/**
 * Legt den Metadatensatz einer hochgeladenen Datei in der Tabelle `files` an.
 */
async function registerFile(db, file) {
  const result = await db.query(
    `INSERT INTO files (name, path, size) VALUES ($1, $2, $3)
     RETURNING id, name, path, size, created_at`,
    [file.originalName, file.storedPath, file.size]
  );
  return result.rows[0];
}

/**
 * Liefert die Metadaten einer einzelnen Datei anhand ihrer ID
 * (GET /files/:id). Unbekannte IDs werden mit `null` beantwortet,
 * damit die Route sauber 404 liefern kann.
 */
async function fetchFile(db, fileId) {
  const result = await db.query(
    'SELECT id, name, size, created_at FROM files WHERE id = $1',
    [fileId]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
}

/**
 * Liefert einen Handler für GET /files/:id/download.
 * Der Handler lädt die Datei mit korrektem Content-Type und als Download
 * (Content-Disposition: attachment) aus. Unbekannte oder nicht mehr auf dem
 * Dateisystem vorhandene Dateien beantwortet er mit 404.
 */
function downloadFile(db) {
  return async function download(req, res) {
    try {
      const fileId = Number(req.params.id);
      if (!Number.isInteger(fileId) || fileId <= 0) {
        return res.status(404).json({ error: 'Datei nicht gefunden.' });
      }

      const result = await db.query(
        'SELECT id, name, path FROM files WHERE id = $1',
        [fileId]
      );
      if (result.rowCount === 0 || !result.rows[0]) {
        return res.status(404).json({ error: 'Datei nicht gefunden.' });
      }

      const file = result.rows[0];
      if (!file.path || !fs.existsSync(file.path)) {
        return res.status(404).json({ error: 'Datei nicht gefunden.' });
      }

      res.setHeader('Content-Type', contentTypeFor(file.name));
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${file.name.replace(/[\\"]/g, '_')}"`
      );
      return res.sendFile(file.path);
    } catch (err) {
      console.error('Datei konnte nicht geladen werden:', err);
      return res.status(500).json({ error: 'Datei konnte nicht geladen werden.' });
    }
  };
}

/**
 * Baut die Multer-Middleware für Multipart-Uploads auf.
 * Multer wird lazy geladen, damit die pure Upload-Logik ohne
 * installierte Abhängigkeiten testbar bleibt.
 */
function createUploadMiddleware() {
  const multer = require('multer');
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, ensureUploadDir());
    },
    filename(req, file, cb) {
      cb(null, buildStoredName(file.originalname));
    },
  });
  return multer({ storage });
}

module.exports = {
  UPLOAD_DIR,
  safeFilename,
  buildStoredName,
  ensureUploadDir,
  writeToDisk,
  registerFile,
  createUploadMiddleware,
  contentTypeFor,
  downloadFile,
  fetchFile,
};
