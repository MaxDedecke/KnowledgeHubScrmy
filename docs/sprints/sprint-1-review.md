# Sprint 1 – Review

## Was geliefert wurde

Das Grundgerüst des Knowledge Hubs steht. In diesem Sprint wurden vollständig umgesetzt:

- **Docker-Compose-Umgebung** mit drei Containern (Frontend, Backend, Postgres), nur das Frontend veröffentlicht einen Port (8081); Backend und Datenbank sprechen sich intern an.
- **Backend-Grundgerüst** mit Upload-API (`POST /upload`, `GET /files`) und Postgres-Anbindung.
- **Frontend-Grundgerüst** als Vite/React-App mit Tailwind und echten `start`-, `test`- und `build`-Skripten.
- **shadcn/ui-Basiskomponenten** integriert und die Startseite darauf umgestellt.
- **Dateiliste mit Lade-, Leer- und Fehlerzustand** inklusive end-to-end-Upload.
- **Backend-API für Kommentare** (`POST`/`GET /files/:id/kommentare`) auf Basis einer neuen Postgres-Tabelle.
- **Kommentare im Frontend anzeigen und erfassen** mit Lade-, Leer- und Fehlerzustand.

Alle Tickets sind als „Fertig" markiert. Nach dem Stand der Tests laufen Backend- und Frontend-Unit-Tests durch (`node --test` bzw. Vitest), der Build ist grün.

## Was offen blieb (und warum)

**Die Integrationsprüfung ist nicht bestanden.** Der volle Stack (Frontend, Backend, Datenbank) lässt sich nicht gemeinsam starten. Der Backend-Container beendet sich sofort mit folgendem Fehler:

```
TypeError: Cannot read properties of undefined (reading 'single')
    at Object.<anonymous> (/app/server.js:12:28)
    ...
```

`app.post('/upload', upload.single('file'), ...)` schlägt fehl, weil `upload.single` nicht definiert ist. Das deutet auf eine fehlende/inkonsistente Multer-Einbindung im Backend hin – `upload` wird vermutlich nicht korrekt importiert oder die Abhängigkeit ist im Container nicht vorhanden. Das Problem liegt also konkret im Backend-Startpfad, nicht in der Compose-Konfiguration oder der Datenbank.

**Offene Klärung außerdem:** Zum Ticket „Frontend-Grundgeschicht mit Tailwind aufsetzen" wurde ein Schritt durch einen Neustart abgebrochen („Setzt das Ticket um (Schritt 11)"). Es ist unklar, ob dieser Schritt tatsächlich offen ist oder bereits erledigt wurde. Das sollte schnell beantwortet werden, damit kein vermeintlich offener Punkt unter den Teppich fällt.

## Wo der Auftraggeber gefragt ist

1. **Soll der abgebrochene Schritt aus „Frontend-Grundgeschicht mit Tailwind aufsetzen" wiederholt werden?** Da alle anderen Tickets grün sind, könnte er bereits erledigt sein – aber das Team braucht da eine klare Ansage, um nichts doppelt anzufassen.

2. **Zum Blocker in der Integrationsprüfung:** Das ist ein technischer Fehler, den wir eigenständig beheben können. Sie müssen das entscheiden nur, wenn der Fehler nicht bis zum nächsten Sprint gelöst ist – dann würde ich eine bewusste Priorisierung vorschlagen.

## Empfehlung für den nächsten Sprint

- **Im Sprint 1 die Integrationsprüfung zum Laufen bringen:** Der Backend-Fehler (`upload` undefiniert) ist ein Klarere Stirling. Ich würde dafür ein kleines Ticket (die Anpassung in `server.js`, sicherstellen dass Multer installiert und korrekt importiert ist) sofort in Sprint 2 aufnehmen, damit der volle Stack per `docker compose up` startet.
- **Offene Klärung klären** (siehe oben), um nichts Unerledigtes zu verschleppen.
- Danach: Der nächste inhaltliche Schritt wäre, die hochgeladenen Dateien auch abrufbar und die Kommentare als „gehört" zu verknüpfen – so bald die Basis stabil steht.

Ich schlage vor, das Backend-Fix bald zu platzieren und den Sprint nicht abzuschließen, bis die Integrationsprüfung grün ist – der Kern des Sprints, hochladen und kommentieren, ist sonst technisch nicht erlebbar.

## Anhang: Integrationsprüfung (voller Stack)
NICHT bestanden. Voller Stack NICHT erreichbar: Dienst „backend" ist unerwartet beendet worden (Code 1). Log unten prüft die Ursache.

Log:
knowledge-hub-db        | The files belonging to this database system will be owned by user "postgres".
knowledge-hub-frontend  | 
knowledge-hub-frontend  | > knowledge-hub-frontend@1.0.0 start
knowledge-hub-frontend  | > vite --host 0.0.0.0 --port 8081
knowledge-hub-frontend  | 
knowledge-hub-frontend  | 
knowledge-hub-frontend  |   VITE v6.4.3  ready in 172 ms
knowledge-hub-frontend  | 
knowledge-hub-frontend  |   ➜  Local:   http://localhost:8081/
knowledge-hub-frontend  |   ➜  Network: http://172.21.0.4:8081/
knowledge-hub-db        | This user must also own the server process.
knowledge-hub-db        | 
knowledge-hub-db        | The database cluster will be initialized with locale "en_US.utf8".
knowledge-hub-db        | The default database encoding has accordingly been set to "UTF8".
knowledge-hub-db        | The default text search configuration will be set to "english".
knowledge-hub-db        | 
knowledge-hub-db        | Data page checksums are disabled.
knowledge-hub-db        | 
knowledge-hub-db        | fixing permissions on existing directory /var/lib/postgresql/data ... ok
knowledge-hub-db        | creating subdirectories ... ok
knowledge-hub-db        | selecting dynamic shared memory implementation ... posix
knowledge-hub-db        | selecting default max_connections ... 100
knowledge-hub-db        | selecting default shared_buffers ... 128MB
knowledge-hub-db        | selecting default time zone ... Etc/UTC
knowledge-hub-backend   | 
knowledge-hub-backend   | > knowledge-hub-backend@1.0.0 start
knowledge-hub-backend   | > node server.js
knowledge-hub-backend   | 
knowledge-hub-backend   | /app/server.js:12
knowledge-hub-backend   | app.post('/upload', upload.single('file'), async (req, res) => {
knowledge-hub-backend   |                            ^
knowledge-hub-backend   | 
knowledge-hub-backend   | TypeError: Cannot read properties of undefined (reading 'single')
knowledge-hub-backend   |     at Object.<anonymous> (/app/server.js:12:28)
knowledge-hub-backend   |     at Module._compile (node:internal/modules/cjs/loader:1781:14)
knowledge-hub-backend   |     at Object..js (node:internal/modules/cjs/loader:1913:10)
knowledge-hub-backend   |     at Module.load (node:internal/modules/cjs/loader:1505:32)
knowledge-hub-backend   |     at Function._load (node:internal/modules/cjs/loader:1309:12)
knowledge-hub-backend   |     at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
knowledge-hub-backend   |     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
knowledge-hub-backend   |     at node:internal/main/run_main_module:36:49
knowledge-hub-backend   | 
knowledge-hub-backend   | Node.js v22.23.2
knowledge-hub-db        | creating configuration files ... ok
knowledge-hub-db        | running bootstrap script ... ok
knowledge-hub-db        | performing post-bootstrap initialization ... ok
knowledge-hub-db        | syncing data to disk ... ok
knowledge-hub-db        | 
knowledge-hub-db        | 
knowledge-hub-db        | Success. You can now start the database server using:
knowledge-hub-db        | 
knowledge-hub-db        |     pg_ctl -D /var/lib/postgresql/data -l logfile start
knowledge-hub-db        | 
knowledge-hub-db        | initdb: warning: enabling "trust" authentication for local connections
knowledge-hub-db        | initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.
knowledge-hub-db        | waiting for server to start....2026-08-20 18:13:28.841 UTC [49] LOG:  starting PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
knowledge-hub-db        | 2026-08-20 18:13:28.842 UTC [49] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
knowledge-hub-db        | 2026-08-20 18:13:28.844 UTC [52] LOG:  database system was shut down at 2026-08-20 18:13:28 UTC
knowledge-hub-db        | 2026-08-20 18:13:28.849 UTC [49] LOG:  database system is ready to accept connections
knowledge-hub-db        |  done
knowledge-hub-db        | server started
knowledge-hub-db        | CREATE DATABASE
knowledge-hub-db        | 
knowledge-hub-db        | 
knowledge-hub-db        | /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
knowledge-hub-db        | 
knowledge-hub-db        | waiting for server to shut down...2026-08-20 18:13:29.036 UTC [49] LOG:  received fast shutdown request
knowledge-hub-db        | .2026-08-20 18:13:29.036 UTC [49] LOG:  aborting any active transactions
knowledge-hub-db        | 2026-08-20 18:13:29.038 UTC [49] LOG:  background worker "logical replication launcher" (PID 55) exited with exit code 1
knowledge-hub-db        | 2026-08-20 18:13:29.040 UTC [50] LOG:  shutting down
knowledge-hub-db        | 2026-08-20 18:13:29.041 UTC [50] LOG:  checkpoint starting: shutdown immediate
knowledge-hub-db        | 2026-08-20 18:13:29.064 UTC [50] LOG:  checkpoint complete: wrote 926 buffers (5.7%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.016 s, sync=0.007 s, total=0.024 s; sync files=301, longest=0.001 s, average=0.001 s; distance=4273 kB, estimate=4273 kB; lsn=0/191F0F0, redo lsn=0/191F0F0
knowledge-hub-db        | 2026-08-20 18:13:29.074 UTC [49] LOG:  database system is shut down
knowledge-hub-db        |  done
knowledge-hub-db        | server stopped
knowledge-hub-db        | 
knowledge-hub-db        | PostgreSQL init process complete; ready for start up.
knowledge-hub-db        | 
knowledge-hub-db        | 2026-08-20 18:13:29.161 UTC [1] LOG:  starting PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
knowledge-hub-db        | 2026-08-20 18:13:29.161 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
knowledge-hub-db        | 2026-08-20 18:13:29.161 UTC [1] LOG:  listening on IPv6 address "::", port 5432
knowledge-hub-db        | 2026-08-20 18:13:29.163 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
knowledge-hub-db        | 2026-08-20 18:13:29.168 UTC [65] LOG:  database system was shut down at 2026-08-20 18:13:29 UTC
knowledge-hub-db        | 2026-08-20 18:13:29.173 UTC [1] LOG:  database system is ready to accept connections

