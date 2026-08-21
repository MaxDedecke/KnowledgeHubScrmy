# Automatische Prüfung: Upload-Button mit Ladezustand und Deaktivierung während der Übertragung ergänzen

Von Scrumy automatisch ausgeführt, kein Modellurteil: `npm ci` (oder `npm install` ohne Lockfile), danach `npm test`/`npm run lint`/`npm run build`, je nachdem was das jeweilige package.json anbietet.

### backend
npm ci/install: exit 0
npm run test: exit 0

Ausgabe:
```
added 92 packages in 898ms
__SCRUMY_CHECK__ install exit=0

> knowledge-hub-backend@1.0.0 test
> node --test test/upload.test.js test/kommentare.test.js test/db.test.js

TAP version 13
# Subtest: waitForDatabase meldet Erfolg, sobald die Datenbank bereit ist
ok 1 - waitForDatabase meldet Erfolg, sobald die Datenbank bereit ist
  ---
  duration_ms: 4.225622
  type: 'test'
  ...
# Subtest: waitForDatabase wirft eine klare Meldung, wenn die Datenbank dauerhaft nicht erreichbar ist
ok 2 - waitForDatabase wirft eine klare Meldung, wenn die Datenbank dauerhaft nicht erreichbar ist
  ---
  duration_ms: 2.561265
  type: 'test'
  ...
# Subtest: createKommentar legt einen Kommentar mit Rückgabe an
ok 3 - createKommentar legt einen Kommentar mit Rückgabe an
  ---
  duration_ms: 1.690032
  type: 'test'
  ...
# Subtest: listKommentare liefert genau die Kommentare einer Datei
ok 4 - listKommentare liefert genau die Kommentare einer Datei
  ---
  duration_ms: 1.069606
  type: 'test'
  ...
# Subtest: writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem
ok 5 - writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem
  ---
  duration_ms: 2.055477
  type: 'test'
  ...
# Subtest: writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad
ok 6 - writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad
  ---
  duration_ms: 0.669393
  type: 'test'
  ...
# Subtest: safeFilename entfernt unsichere Zeichen
ok 7 - safeFilename entfernt unsichere Zeichen
  ---
  duration_ms: 0.111604
  type: 'test'
  ...
# Subtest: contentTypeFor liefert den MIME-Typ anhand der Dateinamens-Endung
ok 8 - contentTypeFor liefert den MIME-Typ anhand der Dateinamens-Endung
  ---
  duration_ms: 0.157627
  type: 'test'
  ...
# Subtest: GET /files/:id/download liefert die Datei mit Content-Type und als Download
ok 9 - GET /files/:id/download liefert die Datei mit Content-Type und als Download
  ---
  duration_ms: 113.695419
  type: 'test'
  ...
# Subtest: GET /api/files/:id liefert die Metadaten einer Datei
ok 10 - GET /api/files/:id liefert die Metadaten einer Datei
  ---
  duration_ms: 11.515481
  type: 'test'
  ...
# Subtest: GET /api/files/:id antwortet mit 404 für unbekannte IDs
ok 11 - GET /api/files/:id antwortet mit 404 für unbekannte IDs
  ---
  duration_ms: 5.559452
  type: 'test'
  ...
# Subtest: GET /api/files/:id antwortet mit 400 für ungültige IDs
ok 12 - GET /api/files/:id antwortet mit 400 für ungültige IDs
  ---
  duration_ms: 4.040877
  type: 'test'
  ...
# Subtest: GET /files/:id/download antwortet mit 404 für unbekannte IDs
ok 13 - GET /files/:id/download antwortet mit 404 für unbekannte IDs
  ---
  duration_ms: 4.730799
  type: 'test'
  ...
# Subtest: parseFormData extrahiert Name und Inhalt einer multipart-Datei
ok 14 - parseFormData extrahiert Name und Inhalt einer multipart-Datei
  ---
  duration_ms: 0.564099
  type: 'test'
  ...
# Subtest: Upload mit nicht erlaubtem MIME-Typ wird mit 400 und erlaubten Typen abgelehnt
ok 15 - Upload mit nicht erlaubtem MIME-Typ wird mit 400 und erlaubten Typen abgelehnt
  ---
  duration_ms: 25.883222
  type: 'test'
  ...
# Subtest: Upload größer als 30 MB wird mit 400 und Größenmeldung abgelehnt
ok 16 - Upload größer als 30 MB wird mit 400 und Größenmeldung abgelehnt
  ---
  duration_ms: 186.754606
  type: 'test'
  ...
# Subtest: Upload mit erlaubtem Typ unterhalb der Grenze verwendet die Register-Funktion
ok 17 - Upload mit erlaubtem Typ unterhalb der Grenze verwendet die Register-Funktion
  ---
  duration_ms: 5.039765
  type: 'test'
  ...
# Subtest: Integration: text/plain-Upload erscheint in der Dateiliste und ist per Download abrufbar
ok 18 - Integration: text/plain-Upload erscheint in der Dateiliste und ist per Download abrufbar
  ---
  duration_ms: 19.096445
  type: 'test'
  ...
1..18
# tests 18
# suites 0
# pass 18
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 589.752166
__SCRUMY_CHECK__ test exit=0
```

### frontend
npm ci/install: exit 0
npm run test: exit 0
npm run lint: exit 0
npm run build: exit 0

Ausgabe:
```
added 271 packages in 3s
__SCRUMY_CHECK__ install exit=0

> knowledge-hub-frontend@1.0.0 test
> vitest run


[1m[46m RUN [49m[22m [36mv3.2.7 [39m[90m/workspaces/frontend[39m

 [32m✓[39m src/App.test.jsx [2m([22m[2m26 tests[22m[2m)[22m[33m 830[2mms[22m[39m
 [32m✓[39m src/components/Kommentare.test.jsx [2m([22m[2m7 tests[22m[2m)[22m[33m 379[2mms[22m[39m
 [32m✓[39m src/__tests__/api.test.js [2m([22m[2m10 tests[22m[2m)[22m[32m 37[2mms[22m[39m
 [32m✓[39m src/components/Sidebar.test.jsx [2m([22m[2m4 tests[22m[2m)[22m[32m 157[2mms[22m[39m
 [32m✓[39m src/components/FileDetail.test.jsx [2m([22m[2m2 tests[22m[2m)[22m[32m 147[2mms[22m[39m
 [32m✓[39m src/components/DateiName.test.jsx [2m([22m[2m3 tests[22m[2m)[22m[32m 103[2mms[22m[39m

[2m Test Files [22m [1m[32m6 passed[39m[22m[90m (6)[39m
[2m      Tests [22m [1m[32m52 passed[39m[22m[90m (52)[39m
[2m   Start at [22m 08:18:31
[2m   Duration [22m 6.20s[2m (transform 262ms, setup 0ms, collect 1.12s, tests 1.65s, environment 2.15s, prepare 484ms)[22m

__SCRUMY_CHECK__ test exit=0

> knowledge-hub-frontend@1.0.0 lint
> echo "Lint folgt in einem späteren Ticket"

Lint folgt in einem späteren Ticket
__SCRUMY_CHECK__ lint exit=0

> knowledge-hub-frontend@1.0.0 build
> vite build

[36mvite v6.4.3 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 73 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  0.40 kB[22m[1m[22m[2m │ gzip:  0.27 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-E6u_uSsB.css  [39m[1m[2m 17.08 kB[22m[1m[22m[2m │ gzip:  4.20 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-DqfzRBXy.js   [39m[1m[2m247.44 kB[22m[1m[22m[2m │ gzip: 80.09 kB[22m
[32m✓ built in 1.58s[39m
__SCRUMY_CHECK__ build exit=0

npm warn deprecated whatwg-encoding@3.1.1: Use @exodus/bytes instead for a more spec-conformant and faster implementation
```
