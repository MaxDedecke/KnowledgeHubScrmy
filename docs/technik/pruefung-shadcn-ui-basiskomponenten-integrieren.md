# Automatische Prüfung: shadcn/ui-Basiskomponenten integrieren

Von Scrumy automatisch ausgeführt, kein Modellurteil: `npm ci` (oder `npm install` ohne Lockfile), danach `npm test`/`npm run lint`/`npm run build`, je nachdem was das jeweilige package.json anbietet.

### backend
npm ci/install: exit 0
npm run test: exit 0

Ausgabe:
```
added 92 packages in 880ms
__SCRUMY_CHECK__ install exit=0

> knowledge-hub-backend@1.0.0 test
> node --test test/upload.test.js

TAP version 13
# Subtest: writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem
ok 1 - writeToDisk speichert den Dateiinhalt auf dem Container-Dateisystem
  ---
  duration_ms: 1.741182
  type: 'test'
  ...
# Subtest: writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad
ok 2 - writeToDisk erzeugt pro Aufruf einen eindeutigen Speicherpfad
  ---
  duration_ms: 0.570147
  type: 'test'
  ...
# Subtest: safeFilename entfernt unsichere Zeichen
ok 3 - safeFilename entfernt unsichere Zeichen
  ---
  duration_ms: 0.10831
  type: 'test'
  ...
# Subtest: parseFormData extrahiert Name und Inhalt einer multipart-Datei
ok 4 - parseFormData extrahiert Name und Inhalt einer multipart-Datei
  ---
  duration_ms: 0.322875
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
# duration_ms 65.03084
__SCRUMY_CHECK__ test exit=0
```

### frontend
npm ci/install: exit 0
npm run test: exit 0
npm run lint: exit 0
npm run build: exit 0

Ausgabe:
```
added 249 packages in 3s
__SCRUMY_CHECK__ install exit=0

> knowledge-hub-frontend@1.0.0 test
> vitest run


[1m[46m RUN [49m[22m [36mv3.2.7 [39m[90m/workspaces/frontend[39m

 [32m✓[39m src/App.test.jsx [2m([22m[2m9 tests[22m[2m)[22m[32m 212[2mms[22m[39m

[2m Test Files [22m [1m[32m1 passed[39m[22m[90m (1)[39m
[2m      Tests [22m [1m[32m9 passed[39m[22m[90m (9)[39m
[2m   Start at [22m 18:00:39
[2m   Duration [22m 1.18s[2m (transform 107ms, setup 0ms, collect 247ms, tests 212ms, environment 368ms, prepare 182ms)[22m

__SCRUMY_CHECK__ test exit=0

> knowledge-hub-frontend@1.0.0 lint
> echo "Lint folgt in einem späteren Ticket"

Lint folgt in einem späteren Ticket
__SCRUMY_CHECK__ lint exit=0

> knowledge-hub-frontend@1.0.0 build
> vite build

[36mvite v6.4.3 [32mbuilding for production...[36m[39m
transforming...
[32m✓[39m 38 modules transformed.
rendering chunks...
computing gzip size...
[2mdist/[22m[32mindex.html                 [39m[1m[2m  0.40 kB[22m[1m[22m[2m │ gzip:  0.27 kB[22m
[2mdist/[22m[2massets/[22m[35mindex-Cb8NZXcA.css  [39m[1m[2m 13.94 kB[22m[1m[22m[2m │ gzip:  3.57 kB[22m
[2mdist/[22m[2massets/[22m[36mindex-CYULpV_b.js   [39m[1m[2m178.11 kB[22m[1m[22m[2m │ gzip: 57.75 kB[22m
[32m✓ built in 1.23s[39m
__SCRUMY_CHECK__ build exit=0

npm warn deprecated whatwg-encoding@3.1.1: Use @exodus/bytes instead for a more spec-conformant and faster implementation
```
