# Automatische Prüfung: Dateinamen in der Detailansicht mit Ellipsis und Tooltip versehen

Von Scrumy automatisch ausgeführt, kein Modellurteil: `npm ci` (oder `npm install` ohne Lockfile), danach `npm test`/`npm run lint`/`npm run build`, je nachdem was das jeweilige package.json anbietet.

### backend
npm ci/install: exit 0
npm run test: exit 0

Ausgabe:
```
added 92 packages in 888ms
__SCRUMY_CHECK__ install exit=0

> knowledge-hub-backend@1.0.0 test
> node --test test/upload.test.js test/kommentare.test.js test/db.test.js

TAP version 13
# Subtest: waitForDatabase meldet Erfolg, sobald die Datenbank bereit ist
ok 1 - waitForDatabase meldet Erfolg, sobald die Datenbank bereit ist
  ---
  duration_ms: 3.68151
  type: 'test'
  ...
# Subtest: waitForDatabase wirft eine klare Meldung, wenn die Datenbank dauerhaft nicht erreichbar ist
ok 2 - waitForDatabase wirft eine klare Meldung, wenn die Datenbank dauerhaft nicht erreichbar ist
  ---
  duration_ms: 3.447045
  type: 'test'
  ...
# Subtest: createKommentar legt einen Kommentar mit Rückgabe an
ok 3 - createKommentar legt einen Kommentar mit Rückgabe an
  ---
  duration_ms: 1.654813
  type: 'test'
  ...
# Subtest: listKommentare liefert genau die Kommentare einer Datei
ok 4 - listKommentare liefert genau die Kommentare einer Datei
  ---
  duration_ms: 0.936953
  type: 'test'
  ...
# Subtest: writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem
ok 5 - writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem
  ---
  duration_ms: 1.501181
  type: 'test'
  ...
# Subtest: writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad
ok 6 - writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad
  ---
  duration_ms: 0.503736
  type: 'test'
  ...
# Subtest: safeFilename entfernt unsichere Zeichen
ok 7 - safeFilename entfernt unsichere Zeichen
  ---
  duration_ms: 0.177845
  type: 'test'
  ...
# Subtest: contentTypeFor liefert den MIME-Typ anhand der Dateinamens-Endung
ok 8 - contentTypeFor liefert den MIME-Typ anhand der Dateinamens-Endung
  ---
  duration_ms: 0.178106
  type: 'test'
  ...
# Subtest: GET /files/:id/download liefert die Datei mit Content-Type und als Download
ok 9 - GET /files/:id/download liefert die Datei mit Content-Type und als Download
  ---
  duration_ms: 101.303544
  type: 'test'
  ...
# Subtest: GET /api/files/:id liefert die Metadaten einer Datei
ok 10 - GET /api/files/:id liefert die Metadaten einer Datei
  ---
  duration_ms: 14.863706
  type: 'test'
  ...
# Subtest: GET /api/files/:id antwortet mit 404 für unbekannte IDs
ok 11 - GET /api/files/:id antwortet mit 404 für unbekannte IDs
  ---
  duration_ms: 4.529749
  type: 'test'
  ...
# Subtest: GET /api/files/:id antwortet mit 400 für ungültige IDs
ok 12 - GET /api/files/:id antwortet mit 400 für ungültige IDs
  ---
  duration_ms: 3.515761
  type: 'test'
  ...
# Subtest: GET /files/:id/download antwortet mit 404 für unbekannte IDs
ok 13 - GET /files/:id/download antwortet mit 404 für unbekannte IDs
  ---
  duration_ms: 3.992457
  type: 'test'
  ...
# Subtest: parseFormData extrahiert Name und Inhalt einer multipart-Datei
ok 14 - parseFormData extrahiert Name und Inhalt einer multipart-Datei
  ---
  duration_ms: 0.582093
  type: 'test'
  ...
1..14
# tests 14
# suites 0
# pass 14
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 356.880736
__SCRUMY_CHECK__ test exit=0
```

### frontend
npm ci/install: exit 0
npm run test: exit 0
npm run lint: exit 0
npm run build: exit 0

Ausgabe:
```
added 249 packages in 2s
__SCRUMY_CHECK__ install exit=0

> knowledge-hub-frontend@1.0.0 test
> vitest run


[1m[46m RUN [49m[22m [36mv3.2.7 [39m[90m/workspaces/frontend[39m

 [32m✓[39m src/App.test.jsx [2m([22m[2m22 tests[22m[2m)[22m[33m 549[2mms[22m[39m
 [32m✓[39m src/components/Kommentare.test.jsx [2m([22m[2m7 tests[22m[2m)[22m[32m 293[2mms[22m[39m
 [32m✓[39m src/__tests__/api.test.js [2m([22m[2m7 tests[22m[2m)[22m[32m 30[2mms[22m[39m
 [32m✓[39m src/components/Sidebar.test.jsx [2m([22m[2m4 tests[22m[2m)[22m[32m 155[2mms[22m[39m
 [32m✓[39m src/components/FileDetail.test.jsx [2m([22m[2m2 tests[22m[2m)[22m[32m 133[2mms[22m[39m

[2m Test Files [22m [1m[32m5 passed[39m[22m[90m (5)[39m
[2m      Tests [22m [1m[32m42 passed[39m[22m[90m (42)[39m
[2m   Start at [22m 20:27:38
[2m   Duration [22m 4.62s[2m (transform 203ms, setup 0ms, collect 654ms, tests 1.16s, environment 1.72s, prepare 408ms)[22m

__SCRUMY_CHECK__ test exit=0

> knowledge-hub-frontend@1.0.0 lint
> echo "Lint folgt in einem späteren Ticket"

Lint folgt in einem späteren Ticket
__SCRUMY_CHECK__ lint exit=0

> knowledge-hub-frontend@1.0.0 build
> vite build

[36mvite v6.4.3 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 47 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  0.40 kB[22m[1m[22m[2m │ gzip:  0.26 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-pIIqhhpc.css  [39m[1m[2m 16.70 kB[22m[1m[22m[2m │ gzip:  4.14 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-ChJodeoV.js   [39m[1m[2m195.99 kB[22m[1m[22m[2m │ gzip: 61.27 kB[22m
[32m✓ built in 1.32s[39m
__SCRUMY_CHECK__ build exit=0

npm warn deprecated whatwg-encoding@3.1.1: Use @exodus/bytes instead for a more spec-conformant and faster implementation
```
