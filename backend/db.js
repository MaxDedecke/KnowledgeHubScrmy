const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PG_HOST || 'database',
  port: Number(process.env.PG_PORT || 5432),
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  database: process.env.PG_DATABASE || 'knowledge',
});

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS files (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      size BIGINT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS kommentare (
      id SERIAL PRIMARY KEY,
      file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
      text TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

// Wartet, bis die Postgres-Verbindung steht, und versucht es dabei in
// kurzen Abständen erneut. Postgres ist im Docker-Setup direkt nach dem
// Containerstart noch nicht immer bereit; ohne Wiederholung stürzt das
// Backend sonst sofort mit ECONNREFUSED ab.
// Nach maximaler Wartezeit wird eine klare Meldung geworfen.
async function waitForDatabase(pool, { retries = 20, delayMs = 500 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      // Ein "SELECT 1" genügt, um die Verbindung zu prüfen; die
      // Schema-Initialisierung läuft anschließend separat in initSchema().
      await pool.query('SELECT 1');
      return;
    } catch (err) {
      lastError = err;
      if (attempt === retries) break;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error(
    `Datenbank (${process.env.PG_HOST || 'database'}:${process.env.PG_PORT || 5432}) ist nach ${retries} Versuchen nicht erreichbar. Letzter Fehler: ${lastError ? lastError.message : 'unbekannt'}`
  );
}

module.exports = { pool, initSchema, waitForDatabase };
