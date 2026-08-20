const fs = require('fs');
const path = require('path');

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
};
