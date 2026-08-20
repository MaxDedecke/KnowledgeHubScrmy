/**
 * Legt einen neuen Kommentar zu einer Datei an und liefert den
 * gespeicherten Datensatz zurück. Prüft nicht selbst, ob die Datei existiert –
 * das übernimmt der Aufrufer (Route), damit die pure Logik testbar bleibt.
 */
async function createKommentar(db, kommentar) {
  const result = await db.query(
    `INSERT INTO kommentare (file_id, text) VALUES ($1, $2)
     RETURNING id, file_id, text, created_at`,
    [kommentar.fileId, kommentar.text]
  );
  return result.rows[0];
}

/**
 * Liefert alle Kommentare einer Datei in chronologischer Reihenfolge
 * (älteste zuerst).
 */
async function listKommentare(db, fileId) {
  const result = await db.query(
    `SELECT id, file_id, text, created_at
     FROM kommentare
     WHERE file_id = $1
     ORDER BY created_at ASC, id ASC`,
    [fileId]
  );
  return result.rows;
}

module.exports = { createKommentar, listKommentare };
