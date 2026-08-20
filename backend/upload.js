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
 * (GET /files/:id) im API-Vertrag mit genau den Feldern
 * id, name, mime_type, size, uploaded_at. Unbekannte IDs werden mit
 * `null` beantwortet, damit die Route sauber 404 liefern kann.
 * Der MIME-Typ wird aus dem Dateinamen abgeleitet (wie beim Download),
 * der Upload-Zeitpunkt ist in der DB als `created_at` gespeichert.
 */
async function fetchFile(db, fileId) {
  const result = await db.query(
    'SELECT id, name, size, created_at FROM files WHERE id = $1',
    [fileId]
  );
  if (result.rowCount === 0 || !result.rows[0]) return null;

  const row = result.rows[0];
  return {
    id: row.id,
    name: row.name,
    mime_type: contentTypeFor(row.name),
    size: row.size,
    uploaded_at: row.created_at,
  };
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

// Erlaubte MIME-Typen für Uploads. Andere Dateien werden mit 400 abgewiesen.
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'application/pdf',
  'text/plain',
];

// Maximale Upload-Größe in Byte: 30 MB.
const MAX_FILE_SIZE = 30 * 1024 * 1024;

/**
 * Prüft, ob ein vom Client gesendeter MIME-Typ zum Hochladen erlaubt ist.
 */
function isAllowedMimeType(mime) {
  return ALLOWED_MIME_TYPES.includes(mime);
}

/**
 * Baut die Multer-Middleware für Multipart-Uploads auf.
 * Multer wird lazy geladen, damit die pure Upload-Logik ohne
 * installierte Abhängigkeiten testbar bleibt.
 * Die Middleware prüft bereits beim Einlesen den Dateityp (fileFilter)
 * und begrenzt die Dateigröße (fileSize), unzulässige Dateien werden also
 * gar nicht erst vollständig auf die Platte geschrieben.
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
  const fileFilter = (req, file, cb) => {
    if (!isAllowedMimeType(file.mimetype)) {
      const err = new Error(
        `Dateityp "${file.mimetype}" ist nicht erlaubt. Erlaubt sind: ${ALLOWED_MIME_TYPES.join(', ')}.`
      );
      err.isUploadValidation = true;
      return cb(err);
    }
    cb(null, true);
  };
  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter,
  });
}

/**
 * Express-Fehler-Middleware für Uploads. Übersetzt die von Multer bzw. der
 * Validierung erzeugten Fehler in verständliche HTTP-400-Meldungen, die das
 * Frontend direkt anzeigen kann. Nicht-Upload-Fehler reicht sie an die
 * allgemeine Express-Fehlerbehandlung weiter.
 */
function uploadErrorHandler() {
  return function uploadValidationError(err, _req, res, next) {
    if (err && err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: `Datei ist zu groß. Maximale Größe ist 30 MB.`,
      });
    }
    if (err && err.isUploadValidation) {
      return res.status(400).json({ error: err.message });
    }
    return next(err);
  };
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
  isAllowedMimeType,
  uploadErrorHandler,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
};
