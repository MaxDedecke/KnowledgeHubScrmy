# Automatische Prüfung: Gemeinsame Empty-State- und Alert-Darstellung in einer kleinen Komponente zusammenfassen

Von Scrumy automatisch ausgeführt, kein Modellurteil: `npm ci` (oder `npm install` ohne Lockfile), danach `npm test`/`npm run lint`/`npm run build`, je nachdem was das jeweilige package.json anbietet.

### backend
npm ci/install: exit 0
npm run test: exit 0

Ausgabe:
```
added 92 packages in 991ms
__SCRUMY_CHECK__ install exit=0

> knowledge-hub-backend@1.0.0 test
> node --test test/upload.test.js test/kommentare.test.js

TAP version 13
# Subtest: createKommentar legt einen Kommentar mit Rückgabe an
ok 1 - createKommentar legt einen Kommentar mit Rückgabe an
  ---
  duration_ms: 1.775219
  type: 'test'
  ...
# Subtest: listKommentare liefert genau die Kommentare einer Datei
ok 2 - listKommentare liefert genau die Kommentare einer Datei
  ---
  duration_ms: 1.117391
  type: 'test'
  ...
# Subtest: writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem
ok 3 - writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem
  ---
  duration_ms: 2.079679
  type: 'test'
  ...
# Subtest: writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad
ok 4 - writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad
  ---
  duration_ms: 0.539524
  type: 'test'
  ...
# Subtest: safeFilename entfernt unsichere Zeichen
ok 5 - safeFilename entfernt unsichere Zeichen
  ---
  duration_ms: 0.127766
  type: 'test'
  ...
# Subtest: contentTypeFor liefert den MIME-Typ anhand der Dateinamens-Endung
ok 6 - contentTypeFor liefert den MIME-Typ anhand der Dateinamens-Endung
  ---
  duration_ms: 0.178296
  type: 'test'
  ...
# Subtest: GET /files/:id/download liefert die Datei mit Content-Type und als Download
ok 7 - GET /files/:id/download liefert die Datei mit Content-Type und als Download
  ---
  duration_ms: 112.746374
  type: 'test'
  ...
# Subtest: GET /api/files/:id liefert die Metadaten einer Datei
ok 8 - GET /api/files/:id liefert die Metadaten einer Datei
  ---
  duration_ms: 14.422697
  type: 'test'
  ...
# Subtest: GET /api/files/:id antwortet mit 404 für unbekannte IDs
ok 9 - GET /api/files/:id antwortet mit 404 für unbekannte IDs
  ---
  duration_ms: 4.681198
  type: 'test'
  ...
# Subtest: GET /api/files/:id antwortet mit 400 für ungültige IDs
ok 10 - GET /api/files/:id antwortet mit 400 für ungültige IDs
  ---
  duration_ms: 3.499107
  type: 'test'
  ...
# Subtest: GET /files/:id/download antwortet mit 404 für unbekannte IDs
ok 11 - GET /files/:id/download antwortet mit 404 für unbekannte IDs
  ---
  duration_ms: 4.739639
  type: 'test'
  ...
# Subtest: parseFormData extrahiert Name und Inhalt einer multipart-Datei
ok 12 - parseFormData extrahiert Name und Inhalt einer multipart-Datei
  ---
  duration_ms: 0.750866
  type: 'test'
  ...
1..12
# tests 12
# suites 0
# pass 12
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 300.932833
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

 [32m✓[39m src/App.test.jsx [2m([22m[2m12 tests[22m[2m)[22m[32m 264[2mms[22m[39m
 [32m✓[39m src/components/Kommentare.test.jsx [2m([22m[2m7 tests[22m[2m)[22m[33m 324[2mms[22m[39m
 [32m✓[39m src/__tests__/api.test.js [2m([22m[2m3 tests[22m[2m)[22m[32m 26[2mms[22m[39m
 [32m✓[39m src/components/FileDetail.test.jsx [2m([22m[2m2 tests[22m[2m)[22m[32m 156[2mms[22m[39m

[2m Test Files [22m [1m[32m4 passed[39m[22m[90m (4)[39m
[2m      Tests [22m [1m[32m24 passed[39m[22m[90m (24)[39m
[2m   Start at [22m 19:02:34
[2m   Duration [22m 3.76s[2m (transform 210ms, setup 0ms, collect 590ms, tests 770ms, environment 1.47s, prepare 337ms)[22m

__SCRUMY_CHECK__ test exit=0

> knowledge-hub-frontend@1.0.0 lint
> echo "Lint folgt in einem späteren Ticket"

Lint folgt in einem späteren Ticket
__SCRUMY_CHECK__ lint exit=0

> knowledge-hub-frontend@1.0.0 build
> vite build

[36mvite v6.4.3 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 46 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  0.40 kB[22m[1m[22m[2m │ gzip:  0.27 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-NAPjrRP-.css  [39m[1m[2m 15.34 kB[22m[1m[22m[2m │ gzip:  3.90 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-C8xrMxMf.js   [39m[1m[2m190.11 kB[22m[1m[22m[2m │ gzip: 60.17 kB[22m
[32m✓ built in 1.37s[39m
__SCRUMY_CHECK__ build exit=0

npm warn deprecated whatwg-encoding@3.1.1: Use @exodus/bytes instead for a more spec-conformant and faster implementation
```
