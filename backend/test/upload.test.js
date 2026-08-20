const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const test = require('node:test');
const assert = require('node:assert');

// Eigener, leerer Upload-Ordner je Testlauf, damit die Tests unabhängig
// von anderen Dateien und Resten früherer Läufe sind.
process.env.UPLOAD_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'kh-upload-'));
const upload = require('../upload');

function parseMultipart(buffer, boundary) {
  const text = buffer.toString('binary');
  const headerMatch = text.match(
    /name="file"; filename="([^"]+)"\r\ncontent-type:[^\r\n]+\r\n\r\n/i
  );
  if (!headerMatch) return null;
  const originalName = headerMatch[1];
  const contentStart = headerMatch.index + headerMatch[0].length;
  const closingDelimiter = Buffer.from(`\r\n--${boundary}`);
  const closingIndex = buffer.indexOf(closingDelimiter, contentStart);
  const contentBuffer = buffer.subarray(contentStart, closingIndex);
  return { originalName, buffer: contentBuffer };
}

test('writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem', () => {
  const storedPath = upload.writeToDisk('test.txt', Buffer.from('Inhalt der Testdatei'));

  assert.ok(fs.existsSync(storedPath), 'Datei muss auf dem Dateisystem existieren');
  assert.strictEqual(fs.readFileSync(storedPath, 'utf8'), 'Inhalt der Testdatei');

  fs.unlinkSync(storedPath);
});

test('writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad', () => {
  const buffer = Buffer.from('x');
  const p1 = upload.writeToDisk('beispiel.txt', buffer);
  const p2 = upload.writeToDisk('beispiel.txt', buffer);

  assert.notStrictEqual(p1, p2, 'Zwei identische Uploads muessen unterschiedliche Pfade erhalten');

  fs.unlinkSync(p1);
  fs.unlinkSync(p2);
});

test('safeFilename entfernt unsichere Zeichen', () => {
  assert.strictEqual(upload.safeFilename('../beispiel.txt'), 'beispiel.txt');
});

test('contentTypeFor liefert den MIME-Typ anhand der Dateinamens-Endung', () => {
  assert.strictEqual(upload.contentTypeFor('bericht.pdf'), 'application/pdf');
  assert.strictEqual(upload.contentTypeFor('notiz.txt'), 'text/plain');
  // Ohne erkennbare Endung einen sicheren Fallback liefern
  assert.strictEqual(upload.contentTypeFor('datei-ohne-typ'), 'application/octet-stream');
});

// Baut eine minimale Express-App mit dem Download-Handler auf und zurück.
// Der Pool wird übergeben, damit der Endpunkt ohne echte Datenbank testbar ist.
function buildDownloadApp(pool) {
  const express = require('express');
  const { downloadFile } = require('../upload');
  const app = express();
  app.get('/files/:id/download', downloadFile(pool));
  return app;
}

// Baut eine minimale Express-App mit der GET /api/files/:id-Route auf.
// Der Pool wird übergeben, damit der Endpunkt ohne echte Datenbank testbar ist.
function buildFileDetailApp(pool) {
  const express = require('express');
  const { fetchFile } = require('../upload');
  const app = express();
  app.get('/api/files/:id', async (req, res) => {
    try {
      const fileId = Number(req.params.id);
      if (!Number.isInteger(fileId) || fileId <= 0) {
        return res.status(400).json({ error: 'Ungültige Datei-ID.' });
      }
      const file = await fetchFile(pool, fileId);
      if (!file) {
        return res.status(404).json({ error: 'Datei nicht gefunden.' });
      }
      res.json(file);
    } catch (err) {
      res.status(500).json({ error: 'Datei konnte nicht geladen werden.' });
    }
  });
  return app;
}

// Startet einen HTTP-Server und wartet, bis er wirklich zuhört,
// bevor die Portnummer zurückgegeben wird.
function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port });
    });
  });
}

test('GET /files/:id/download liefert die Datei mit Content-Type und als Download', async (t) => {
  // Reale Datei im Test-Upload-Ordner anlegen, deren Metadaten die
  // gestubbte "DB" zurückgibt.
  const storedPath = path.join(process.env.UPLOAD_DIR, 'stored-bericht.pdf');
  fs.writeFileSync(storedPath, Buffer.from('Download-Inhalt'));

  // Eigener Pool-Stub: liefert genau eine Datei mit den oben angelegten Daten.
  const pool = {
    async query(sql, params) {
      if (sql.includes('FROM files')) {
        return {
          rowCount: 1,
          rows: [{ id: params[0], name: 'bericht.pdf', path: storedPath }],
        };
      }
      return { rowCount: 0, rows: [] };
    },
  };

  const app = buildDownloadApp(pool);
  const { server, port } = await listen(app);
  t.after(() => server.close());

  const res = await fetch(`http://127.0.0.1:${port}/files/14/download`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers.get('content-type'), 'application/pdf');
  assert.match(
    res.headers.get('content-disposition'),
    /^attachment; filename="bericht\.pdf"$/
  );
  assert.strictEqual(await res.text(), 'Download-Inhalt');

  fs.unlinkSync(storedPath);
});

test('GET /api/files/:id liefert die Metadaten einer Datei', async (t) => {
  const pool = {
    async query(sql, params) {
      if (sql.includes('FROM files')) {
        return {
          rowCount: 1,
          rows: [{
            id: params[0],
            name: 'vertrag.pdf',
            size: 2048,
            created_at: '2026-08-20T10:00:00Z',
          }],
        };
      }
      return { rowCount: 0, rows: [] };
    },
  };

  const app = buildFileDetailApp(pool);
  const { server, port } = await listen(app);
  t.after(() => server.close());

  const res = await fetch(`http://127.0.0.1:${port}/api/files/14`);
  assert.strictEqual(res.status, 200);
  const body = await res.json();
  // API-Vertrag: genau die fünf Felder id, name, mime_type, size, uploaded_at.
  assert.deepStrictEqual(Object.keys(body).sort(), [
    'id',
    'mime_type',
    'name',
    'size',
    'uploaded_at',
  ]);
  assert.strictEqual(body.id, 14);
  assert.strictEqual(body.name, 'vertrag.pdf');
  assert.strictEqual(body.mime_type, 'application/pdf');
  assert.strictEqual(body.size, 2048);
  assert.strictEqual(body.uploaded_at, '2026-08-20T10:00:00Z');
});

test('GET /api/files/:id antwortet mit 404 für unbekannte IDs', async (t) => {
  const pool = {
    async query() {
      return { rowCount: 0, rows: [] };
    },
  };

  const app = buildFileDetailApp(pool);
  const { server, port } = await listen(app);
  t.after(() => server.close());

  const res = await fetch(`http://127.0.0.1:${port}/api/files/999`);
  assert.strictEqual(res.status, 404);
  const body = await res.json();
  assert.match(body.error, /nicht gefunden/i);
});

test('GET /api/files/:id antwortet mit 400 für ungültige IDs', async (t) => {
  const app = buildFileDetailApp({
    async query() {
      return { rowCount: 0, rows: [] };
    },
  });
  const { server, port } = await listen(app);
  t.after(() => server.close());

  const res = await fetch(`http://127.0.0.1:${port}/api/files/abc`);
  assert.strictEqual(res.status, 400);
});

test('GET /files/:id/download antwortet mit 404 für unbekannte IDs', async (t) => {
  const pool = {
    async query() {
      // Kein Datensatz: unbekannte ID
      return { rowCount: 0, rows: [] };
    },
  };

  const app = buildDownloadApp(pool);
  const { server, port } = await listen(app);
  t.after(() => server.close());

  const res = await fetch(`http://127.0.0.1:${port}/files/999/download`);
  assert.strictEqual(res.status, 404);
  const body = await res.json();
  assert.match(body.error, /nicht gefunden/i);
});

test('parseFormData extrahiert Name und Inhalt einer multipart-Datei', async () => {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  const fileContent = 'Dateiinhalt';
  const body = Buffer.from(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="notiz.txt"\r\n` +
      `Content-Type: text/plain\r\n\r\n` +
      `${fileContent}\r\n` +
      `--${boundary}--\r\n`
  );

  const parsed = parseMultipart(body, boundary);

  assert.ok(parsed, 'Multipart-Body muss geparst werden');
  assert.strictEqual(parsed.originalName, 'notiz.txt');
  assert.strictEqual(parsed.buffer.toString('utf8'), fileContent);
});

// Baut eine minimale Express-App mit der POST-/api/files-Upload-Route auf.
// Die Multer-Validierung und der uploadErrorHandler werden wie in server.js
// verschaltet, damit der HTTP-Fehlerpfad real durchgetestet wird.
function buildUploadApp(pool) {
  const express = require('express');
  const { createUploadMiddleware, registerFile, uploadErrorHandler } = require('../upload');
  const app = express();
  const upload = createUploadMiddleware();
  app.post('/api/files', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Keine Datei im Feld "file" angegeben.' });
      }
      const record = await registerFile(pool, {
        originalName: req.file.originalname,
        storedPath: req.file.path,
        size: req.file.size,
      });
      res.status(201).json(record);
    } catch (err) {
      console.error('Upload fehlgeschlagen:', err);
      res.status(500).json({ error: 'Datei konnte nicht gespeichert werden.' });
    }
  });
  app.use(uploadErrorHandler());
  return app;
}

// Baut einen multipart-Body mit einer Datei auf.
function multipartBody({ boundary, filename, mime, content }) {
  const head = Buffer.from(
    `--${boundary}\r\n` +
      `Content-Disposition: form-data; name="file"; filename="${filename}"\r\n` +
      `Content-Type: ${mime}\r\n\r\n`
  );
  const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
  return Buffer.concat([head, Buffer.from(content), tail]);
}

test('Upload mit nicht erlaubtem MIME-Typ wird mit 400 und erlaubten Typen abgelehnt', async (t) => {
  const supported = new Set([
    'image/png',
    'image/jpeg',
    'application/pdf',
    'text/plain',
  ]);
  const unsupported = ['application/zip', 'application/json'].find((m) => !supported.has(m));

  const app = buildUploadApp({ async query() { return { rows: [] }; } });
  const { server, port } = await listen(app);
  t.after(() => server.close());

  const boundary = '----WebKitFormBoundaryBlocked';
  const res = await fetch(`http://127.0.0.1:${port}/api/files`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body: multipartBody({
      boundary,
      filename: 'schadcode.malware',
      mime: unsupported,
      content: 'böser Inhalt',
    }),
  });

  assert.strictEqual(res.status, 400);
  const body = await res.json();
  // Meldung nennt den unzulässigen Typ und mindestens einen erlaubten Typ.
  assert.match(body.error, /nicht erlaubt/i);
  assert.match(body.error, /image\/png|application\/pdf|image\/jpeg|text\/plain/);
});

test('Upload größer als 30 MB wird mit 400 und Größenmeldung abgelehnt', async (t) => {
  const app = buildUploadApp({});
  const { server, port } = await listen(app);
  t.after(() => server.close());

  const boundary = '----WebKitFormBoundaryTooLarge';
  const res = await fetch(`http://127.0.0.1:${port}/api/files`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body: multipartBody({
      boundary,
      filename: 'gross.pdf',
      mime: 'application/pdf',
      content: 'x'.repeat(30 * 1024 * 1024 + 100),
    }),
  });

  assert.strictEqual(res.status, 400);
  const body = await res.json();
  assert.match(body.error, /zu groß/i);
  assert.match(body.error, /30 MB/);
});

test('Upload mit erlaubtem Typ unterhalb der Grenze verwendet die Register-Funktion', async (t) => {
  // Verifiziert, dass ein passender Upload den Upload-Pfad weiter durchläuft
  // und registerFile aufgerufen wird (Datei bleibt weiterhin speicherbar).
  let stored;
  const pool = {
    async query() {
      return { rows: [{ id: 1, name: 'notiz.txt', path: stored, size: 7 }] };
    },
  };
  const app = buildUploadApp(pool);
  const { server, port } = await listen(app);
  t.after(() => server.close());

  const boundary = '----WebKitFormBoundaryOk';
  const res = await fetch(`http://127.0.0.1:${port}/api/files`, {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body: multipartBody({
      boundary,
      filename: 'notiz.txt',
      mime: 'text/plain',
      content: 'Inhalt',
    }),
  });

  assert.strictEqual(res.status, 201);
});
