# Automatische Prüfung: Backend-Grundgerüst mit Upload-API und Postgres-Anbindung

Von Scrumy automatisch ausgeführt, kein Modellurteil: `npm ci` (oder `npm install` ohne Lockfile), danach `npm test`/`npm run lint`/`npm run build`, je nachdem was das jeweilige package.json anbietet.

### backend
npm ci/install: exit 0
npm run test: exit 0

Ausgabe:
```
added 92 packages in 895ms
__SCRUMY_CHECK__ install exit=0

> knowledge-hub-backend@1.0.0 test
> node --test test/upload.test.js

TAP version 13
# Subtest: writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem
ok 1 - writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem
  ---
  duration_ms: 1.782688
  type: 'test'
  ...
# Subtest: writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad
ok 2 - writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad
  ---
  duration_ms: 0.677093
  type: 'test'
  ...
# Subtest: safeFilename entfernt unsichere Zeichen
ok 3 - safeFilename entfernt unsichere Zeichen
  ---
  duration_ms: 0.12251
  type: 'test'
  ...
# Subtest: parseFormData extrahiert Name und Inhalt einer multipart-Datei
ok 4 - parseFormData extrahiert Name und Inhalt einer multipart-Datei
  ---
  duration_ms: 0.425798
  type: 'test'
  ...
1..4
# tests 4
# suites 0
# pass 4
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 70.540302
__SCRUMY_CHECK__ test exit=0
```

### frontend
npm ci/install: exit 0
npm run test: exit 0
npm run lint: exit 0
npm run build: exit 0

Ausgabe:
```
added 68 packages in 808ms
__SCRUMY_CHECK__ install exit=0

> knowledge-hub-frontend@1.0.0 test
> echo "Frontend-Tests folgen in einem späteren Ticket"

Frontend-Tests folgen in einem späteren Ticket
__SCRUMY_CHECK__ test exit=0

> knowledge-hub-frontend@1.0.0 lint
> echo "Lint folgt in einem späteren Ticket"

Lint folgt in einem späteren Ticket
__SCRUMY_CHECK__ lint exit=0

> knowledge-hub-frontend@1.0.0 build
> echo "Frontend-Build folgt in einem späteren Ticket"

Frontend-Build folgt in einem späteren Ticket
__SCRUMY_CHECK__ build exit=0
```
