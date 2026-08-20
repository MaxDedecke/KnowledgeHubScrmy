const express = require('express');
const { pool, initSchema } = require('./db');
const { upload, registerFile, downloadFile } = require('./upload');
const { createKommentar, listKommentare } = require('./kommentare');

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json());

// POST /upload – nimmt eine Datei (Multipart-Feld "file") an und speichert sie.
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Keine Datei im Feld "file" angegeben.' });
    }
    const infos = {
      originalName: req.file.originalname,
      storedPath: req.file.path,
      size: req.file.size,
    };
    const record = await registerFile(pool, infos);
    res.status(201).json(record);
  } catch (err) {
    console.error('Upload fehlgeschlagen:', err);
    res.status(500).json({ error: 'Datei konnte nicht gespeichert werden.' });
  }
});

// GET /files – liefert die Liste aller gespeicherten Dateien (neueste zuerst).
app.get('/files', async (_req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, size, created_at FROM files ORDER BY created_at DESC, id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Dateiliste konnte nicht geladen werden:', err);
    res.status(500).json({ error: 'Dateiliste konnte nicht geladen werden.' });
  }
});

// POST /files/:id/kommentare – legt einen Kommentar zu einer Datei an.
app.post('/files/:id/kommentare', async (req, res) => {
  try {
    const fileId = Number(req.params.id);
    if (!Number.isInteger(fileId) || fileId <= 0) {
      return res.status(400).json({ error: 'Ungültige Datei-ID.' });
    }
    const text = (req.body && req.body.text) || '';
    if (typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Kommentartext fehlt oder ist leer.' });
    }

    const file = await pool.query('SELECT id FROM files WHERE id = $1', [fileId]);
    if (file.rowCount === 0) {
      return res.status(404).json({ error: 'Datei nicht gefunden.' });
    }

    const kommentar = await createKommentar(pool, { fileId, text });
    res.status(201).json(kommentar);
  } catch (err) {
    console.error('Kommentar konnte nicht angelegt werden:', err);
    res.status(500).json({ error: 'Kommentar konnte nicht gespeichert werden.' });
  }
});

// GET /files/:id/download – liefert die gespeicherte Datei zum Download,
// mit korrektem Content-Type und Content-Disposition-Header.
app.get('/files/:id/download', downloadFile(pool));

// GET /files/:id/kommentare – liefert alle Kommentare der Datei.
app.get('/files/:id/kommentare', async (req, res) => {
  try {
    const fileId = Number(req.params.id);
    if (!Number.isInteger(fileId) || fileId <= 0) {
      return res.status(400).json({ error: 'Ungültige Datei-ID.' });
    }

    const file = await pool.query('SELECT id FROM files WHERE id = $1', [fileId]);
    if (file.rowCount === 0) {
      return res.status(404).json({ error: 'Datei nicht gefunden.' });
    }

    const kommentare = await listKommentare(pool, fileId);
    res.json(kommentare);
  } catch (err) {
    console.error('Kommentare konnten nicht geladen werden:', err);
    res.status(500).json({ error: 'Kommentare konnten nicht geladen werden.' });
  }
});

/**
 * Startet Schema-Initialisierung und HTTP-Server.
 * Wird beim direkten Start (npm start) ausgeführt.
 */
async function startServer() {
  await initSchema();
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend läuft auf Port ${PORT}`);
  });
  return server;
}

module.exports = { app, pool, startServer, PORT };

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Start fehlgeschlagen:', err);
    process.exit(1);
  });
}
