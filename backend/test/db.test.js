const test = require('node:test');
const assert = require('node:assert');
const { waitForDatabase } = require('../db');

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Stub eines pg-Pools: schlägt die ersten `failing` Aufrufe mit einem
// Verbindungsfehler fehl, danach liefert er erfolgreich "SELECT 1".
function flakyPool(failing) {
  let calls = 0;
  return {
    async query() {
      calls += 1;
      if (calls <= failing) {
        const err = new Error('connect ECONNREFUSED 172.21.0.2:5432');
        err.code = 'ECONNREFUSED';
        throw err;
      }
      return { rows: [{ '?column?': 1 }], rowCount: 1 };
    },
    _calls: () => calls,
  };
}

test('waitForDatabase meldet Erfolg, sobald die Datenbank bereit ist', async () => {
  // Die Datenbank ist erst beim dritten Versuch erreichbar.
  const pool = flakyPool(2);
  await waitForDatabase(pool, { retries: 5, delayMs: 1 });
  assert.ok(pool._calls() >= 3, 'Erfolg erst nach mindestens drei Versuchen');
});

test('waitForDatabase wirft eine klare Meldung, wenn die Datenbank dauerhaft nicht erreichbar ist', async () => {
  const pool = flakyPool(100);
  await assert.rejects(
    waitForDatabase(pool, { retries: 3, delayMs: 1 }),
    /Datenbank .* ist nach 3 Versuchen nicht erreichbar.*ECONNREFUSED/
  );
  assert.strictEqual(pool._calls(), 3, 'Genau die erlaubten Versuche muessen laufen');
});
