# Sprint 2 – Review

## Was geliefert wurde

Der Sprint hatte das Ziel, das Grundgerüst um einen einheitlichen Seitenrahmen und das Abrufen hochgeladener Dateien zu erweitern. Folgende Tickets sind laut Board abgeschlossen:

- **Einheitliche App-Shell mit Header und Inhaltsbereich ergänzen** (Frida Lang): Neue Layout-Komponente `AppShell.jsx` mit schlankem Header und zentralem, responsivem Inhaltsbereich. Die App nutzt die Shell jetzt als gemeinsamen Rahmen für Upload-, Dateilisten- und Kommentar-Ansicht. Farben und Typografie kommen ausschließlich aus der bestehenden Tailwind-/shadcn/ui-Skala. Testsuite (22 Tests) und Build sind grün.

- **Backend-Download-Endpunkt für hochgeladene Dateien** (Ben Ritter): Neuer Endpunkt `GET /files/:id/download` liefert gespeicherte Dateien mit korrektem Content-Type und `Content-Disposition: attachment` aus. Unbekannte IDs und fehlende Dateien werden mit 404 beantwortet. Die Logik ist als injizierbarer Handler umgesetzt und durch Tests für Erfolgs- und Fehlerfall abgedeckt.

- **Download-Link in der Dateiliste im Frontend** (Frida Lang): Download-Button pro Datei ergänzt, inklusive Nacharbeit aus dem Design-Review: echte shadcn/ui-Alert-Komponente für die Fehlermeldung, 44×44 px großer Button mit Spinner während des Downloads. Tests decken auch den Fehlerfall ab – alle 22 Tests laufen grün, `npm run build` erfolgreich.

Für den Sprint wurden vier Commits eingebracht (siehe Sprint-Commits).

## Was offen blieb (und warum)

**Die Integrationsprüfung (voller Stack) ist NICHT bestanden.** Der Dienst `backend` beendet sich unmittelbar nach dem Start mit Code 1. Die Ursache ist ein Import-/Initialisierungsfehler:

```
TypeError: Cannot read properties of undefined (reading 'single')
    at Object.<anonymous> (/app/server.js:12:28)
```

In `server.js` wird `upload.single('file')` aufgerufen, aber `upload` ist zum Zeitpunkt des Aufrufs nicht definiert – vermutlich fehlt der Import bzw. die Initialisierung von Multer. Die Unit-Tests des Backends haben diesen Fehler nicht gefangen, weil sie offenbar nicht den tatsächlichen Serverstart über `server.js` durchlaufen, sondern die Handler isoliert testen. Dadurch ist der Dienst im Container nicht lauffähig, obwohl die Tickets einzeln als fertig gemeldet waren.

Konkret heißt das: Die Download-Funktionalität kann im vollen Stack aktuell **nicht genutzt werden**, weil das gesamte Backend nicht startet. Die fachlichen Tickets sind zwar umgesetzt, aber der Sprint ist erst abnahmefähig, wenn der Startfehler behoben und die Integrationsprüfung grün ist.

## Wo der Auftraggeber gefragt ist

Es gibt derzeit keine offene fachliche oder inhaltliche Frage, die eine Entscheidung des Auftraggebers erfordert. Der Fehler ist technischer Natur und liegt in unserer Verantwortung zu beheben. Ich informiere hier nur transparent über den Stand: Der Sprint ist nicht vollständig abnahmefähig, bis der Backend-Startfehler behoben ist. Wir gehen davon aus, die Korrektur in einem Folge-Sprint umzusetzen.

## Empfehlung für den nächsten Sprint

**Erster Anlauf:** Den Startfehler im Backend beheben (fehlende Multer-Initialisierung in `server.js`) und die Integrationsprüfung erneut laufen lassen. Zusätzlich sollten die Backend-Tests so ergänzt werden, dass sie den Serverstart über `server.js` abdecken, damit solche Fehler künftig vor der Integrationsprüfung auffallen.

Die inhaltliche Arbeit des Sprints (App-Shell, Download-Link, Download-Endpunkt) ist im Code bereits vorhanden und muss nach erfolgreicher Fehlerbehebung nur noch im echten Stack verifiziert werden.

## Anhang: Integrationsprüfung (voller Stack)
NICHT bestanden. Voller Stack NICHT erreichbar: Dienst „backend" ist unerwartet beendet worden (Code 1). Log unten prüft die Ursache.

Log:
knowledge-hub-backend  | 
knowledge-hub-backend  | > knowledge-hub-backend@1.0.0 start
knowledge-hub-backend  | > node server.js
knowledge-hub-backend  | 
knowledge-hub-backend  | /app/server.js:12
knowledge-hub-backend  | app.post('/upload', upload.single('file'), async (req, res) => {
knowledge-hub-backend  |                            ^
knowledge-hub-backend  | 
knowledge-hub-backend  | TypeError: Cannot read properties of undefined (reading 'single')
knowledge-hub-backend  |     at Object.<anonymous> (/app/server.js:12:28)
knowledge-hub-backend  |     at Module._compile (node:internal/modules/cjs/loader:1781:14)
knowledge-hub-backend  |     at Object..js (node:internal/modules/cjs/loader:1913:10)
knowledge-hub-backend  |     at Module.load (node:internal/modules/cjs/loader:1505:32)
knowledge-hub-backend  |     at Function._load (node:internal/modules/cjs/loader:1309:12)
knowledge-hub-backend  |     at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
knowledge-hub-backend  |     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
knowledge-hub-backend  |     at node:internal/main/run_main_module:36:49
knowledge-hub-backend  | 
knowledge-hub-backend  | Node.js v22.23.2
knowledge-hub-db       | The files belonging to this database system will be owned by user "postgres".
knowledge-hub-db       | This user must also own the server process.
knowledge-hub-db       | 
knowledge-hub-db       | The database cluster will be initialized with locale "en_US.utf8".
knowledge-hub-db       | The default database encoding has accordingly been set to "UTF8".
knowledge-hub-db       | The default text search configuration will be set to "english".
knowledge-hub-db       | 
knowledge-hub-db       | Data page checksums are disabled.
knowledge-hub-db       | 
knowledge-hub-db       | fixing permissions on existing directory /var/lib/postgresql/data ... ok
knowledge-hub-db       | creating subdirectories ... ok
knowledge-hub-db       | selecting dynamic shared memory implementation ... posix
knowledge-hub-db       | selecting default max_connections ... 100
knowledge-hub-db       | selecting default shared_buffers ... 128MB
knowledge-hub-db       | selecting default time zone ... Etc/UTC
knowledge-hub-db       | creating configuration files ... ok
knowledge-hub-db       | running bootstrap script ... ok
knowledge-hub-db       | performing post-bootstrap initialization ... ok
knowledge-hub-db       | syncing data to disk ... ok
knowledge-hub-db       | 
knowledge-hub-db       | initdb: warning: enabling "trust" authentication for local connections
knowledge-hub-db       | initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.
knowledge-hub-db       | 
knowledge-hub-db       | Success. You can now start the database server using:
knowledge-hub-db       | 
knowledge-hub-db       |     pg_ctl -D /var/lib/postgresql/data -l logfile start
knowledge-hub-db       | 
knowledge-hub-db       | waiting for server to start....2026-08-20 18:24:07.045 UTC [48] LOG:  starting PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
knowledge-hub-db       | 2026-08-20 18:24:07.046 UTC [48] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
knowledge-hub-db       | 2026-08-20 18:24:07.051 UTC [51] LOG:  database system was shut down at 2026-08-20 18:24:06 UTC
knowledge-hub-db       | 2026-08-20 18:24:07.058 UTC [48] LOG:  database system is ready to accept connections
knowledge-hub-db       |  done
knowledge-hub-db       | server started
knowledge-hub-db       | CREATE DATABASE
knowledge-hub-db       | 
knowledge-hub-db       | 
knowledge-hub-db       | /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
knowledge-hub-db       | 
knowledge-hub-db       | waiting for server to shut down...2026-08-20 18:24:07.223 UTC [48] LOG:  received fast shutdown request
knowledge-hub-db       | .2026-08-20 18:24:07.225 UTC [48] LOG:  aborting any active transactions
knowledge-hub-db       | 2026-08-20 18:24:07.227 UTC [48] LOG:  background worker "logical replication launcher" (PID 54) exited with exit code 1
knowledge-hub-db       | 2026-08-20 18:24:07.229 UTC [49] LOG:  shutting down
knowledge-hub-db       | 2026-08-20 18:24:07.230 UTC [49] LOG:  checkpoint starting: shutdown immediate
knowledge-hub-db       | 2026-08-20 18:24:07.251 UTC [49] LOG:  checkpoint complete: wrote 926 buffers (5.7%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.015 s, sync=0.006 s, total=0.022 s; sync files=301, longest=0.001 s, average=0.001 s; distance=4273 kB, estimate=4273 kB; lsn=0/191F0F0, redo lsn=0/191F0F0
knowledge-hub-db       | 2026-08-20 18:24:07.259 UTC [48] LOG:  database system is shut down
knowledge-hub-db       |  done
knowledge-hub-db       | server stopped
knowledge-hub-db       | 
knowledge-hub-db       | PostgreSQL init process complete; ready for start up.
knowledge-hub-db       | 
knowledge-hub-db       | 2026-08-20 18:24:07.343 UTC [1] LOG:  starting PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
knowledge-hub-db       | 2026-08-20 18:24:07.343 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
knowledge-hub-db       | 2026-08-20 18:24:07.343 UTC [1] LOG:  listening on IPv6 address "::", port 5432
knowledge-hub-db       | 2026-08-20 18:24:07.344 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
knowledge-hub-db       | 2026-08-20 18:24:07.346 UTC [64] LOG:  database system was shut down at 2026-08-20 18:24:07 UTC
knowledge-hub-db       | 2026-08-20 18:24:07.350 UTC [1] LOG:  database system is ready to accept connections
knowledge-hub-frontend  | 
knowledge-hub-frontend  | > knowledge-hub-frontend@1.0.0 start
knowledge-hub-frontend  | > vite --host 0.0.0.0 --port 8081
knowledge-hub-frontend  | 
knowledge-hub-frontend  | 
knowledge-hub-frontend  |   VITE v6.4.3  ready in 165 ms
knowledge-hub-frontend  | 
knowledge-hub-frontend  |   ➜  Local:   http://localhost:8081/
knowledge-hub-frontend  |   ➜  Network: http://172.21.0.4:8081/

