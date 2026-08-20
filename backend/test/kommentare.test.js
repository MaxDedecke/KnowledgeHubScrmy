const test = require('node:test');
const assert = require('node:assert');
const kommentare = require('../kommentare');

// Simpler In-Memory-Klon des pg-Pools, damit die pure Kommentar-Logik ohne
// Datenbank und ohne installierte Abhängigkeiten getestet werden kann.
function fakeDb() {
  const rows = [];
  return {
    _rows: rows,
    async query(sql, params) {
      if (sql.includes('INSERT INTO kommentare')) {
        const row = {
          id: rows.length + 1,
          file_id: params[0],
          text: params[1],
          created_at: new Date().toISOString(),
        };
        rows.push(row);
        // RETURNING: nur den neu angelegten Datensatz liefern
        return { rows: [row], rowCount: 1 };
      }
      if (sql.includes('FROM kommentare')) {
        // WHERE file_id = <param> auswerten
        const fileId = params[0];
        return {
          rows: rows.filter((r) => r.file_id === fileId),
          rowCount: rows.filter((r) => r.file_id === fileId).length,
        };
      }
      throw new Error('Unbekannte SQL-Abfrage: ' + sql);
    },
  };
}

test('createKommentar legt einen Kommentar mit Rückgabe an', async () => {
  const db = fakeDb();
  const kommentar = await kommentare.createKommentar(db, {
    fileId: 7,
    text: 'Hinweis aus dem Ordner',
  });

  assert.strictEqual(kommentar.file_id, 7);
  assert.strictEqual(kommentar.text, 'Hinweis aus dem Ordner');
  assert.ok(kommentar.id >= 1, 'Kommentar muss eine ID erhalten');
  assert.strictEqual(db._rows.length, 1);
});

test('listKommentare liefert genau die Kommentare einer Datei', async () => {
  const db = fakeDb();
  await kommentare.createKommentar(db, { fileId: 7, text: 'Erster' });
  await kommentare.createKommentar(db, { fileId: 7, text: 'Zweiter' });
  await kommentare.createKommentar(db, { fileId: 99, text: 'Andere Datei' });

  const liste7 = await kommentare.listKommentare(db, 7);
  assert.strictEqual(liste7.length, 2, 'Datei 7 muss beide eigenen Kommentare haben');
  assert.deepStrictEqual(
    liste7.map((k) => k.text),
    ['Erster', 'Zweiter'],
    'Kommentare der Datei 7 in Anlege-Reihenfolge'
  );

  const liste99 = await kommentare.listKommentare(db, 99);
  assert.strictEqual(liste99.length, 1);
  assert.strictEqual(liste99[0].text, 'Andere Datei');
});
