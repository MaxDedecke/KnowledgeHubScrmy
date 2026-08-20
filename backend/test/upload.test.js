const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
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
