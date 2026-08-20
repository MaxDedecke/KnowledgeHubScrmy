# Sprint 9 – Review

## Was geliefert wurde
- **Ticket „Dateinamen und Dateigrößen beim Upload im Backend begrenzen" (Ben Ritter):** Der Upload-Endpunkt validiert jetzt Dateityp und -größe. Erlaubte MIME-Typen sind `image/png`, `image/jpeg`, `application/pdf` und `text/plain`; die maximale Dateigröße liegt bei 30 MB (gesetzt über Multer-`fileFilter` und `fileSize`). Eine neue Fehler-Middleware übersetzt Upload-Verstöße in verständliche HTTP-400-Meldungen. Die Backend-Tests wurden um Fälle für nicht erlaubten Typ, zu große Datei und erfolgreichen Upload ergänzt – lokal laufen alle 17 Tests grün.
- Kommitter `ec4bff55` (Ben Ritter) setzt diese Validierung um; `7e6678d0` (Pia Ostermann) beinhaltet die Sprint-Planung.

## Was offen blieb (und warum)
- **Integrationsprüfung (voller Stack) NICHT bestanden:** Der Dienst `backend` startet nicht. Der Log zeigt in `server.js` (Zeile 24, `registerFile(pool, infos)` mit `await`) einen `SyntaxError: await is only valid in async functions`. Die Validierungsänderung führt dort offenbar `await` in einem nicht-asynchronen Kontext ein – ein echter Regressionsfehler, der den gesamten Stack blockiert. Die lokalen Unitac-Tests haben das nicht gefangen, weil sie den tatsächlichen Serverstart nicht abdecken.
- Das Backend bleibt damit derzeit unerreichbar; die Upload-Validierung ist zwar als Ticket abgeschlossen, aber nicht lauffähig integriert. Bis zur Behebung ist die Live-Anwendung nicht nutzbar.

## Wo der Auftraggeber gefragt ist
- Die gewählten Grenzen entstammen dem Entwicklungsvorschlag (30 MB, MIME-Typen siehe oben). Der Beschluss sprach von „eigenen Grenzen z.B. 30 MB“ – ein OK des Auftraggebers dafür erhält uns bis zum nächsten Sprint-Rhythmus. Falls andere Werte oder weitere Typen gewünscht sind (z. B. Office-Dokumente), sollten wir sie kurzfristig bestätigen, dann passe ich die Validierung direkt mit an.

## Empfehlung für den nächsten Sprint
- **Fehler im Backend-Start beheben** (SyntaxError am Upload-Handler) und die Integrationsprüfung wieder grün bekommen – das ist Priorität 1.
- Danach oder parallel: Die Backend-Validierungsgrenzen gemäß Auftraggeber-Bestätigung gegenfinieren lassen, falls von oberster Stelle eine abweichende Vorgabe kommt.
- Falls die Fehlerbehebung stabil steht, wäre das Sprintreise damit abgeschlossen und wir könnten den nächsten Schritt aus dem laufenden Backlog angehen (z. B. Detailfeinheiten am Frontend oder weitere Feinschliff-Tickets).

Wir sollten die Integrationsprüfung in den nächsten Sprint fest einplanen – der abgeschlossene Zustand des Tickets ist erst glaubwürdig, wenn der volle Stack wieder hochläuft.

## Anhang: Integrationsprüfung (voller Stack)
NICHT bestanden. Voller Stack NICHT erreichbar: Dienst „backend" ist unerwartet beendet worden (Code 1). Log unten prüft die Ursache.

Log:
knowledge-hub-backend  | 
knowledge-hub-backend  | > knowledge-hub-backend@1.0.0 start
knowledge-hub-backend  | > node server.js
knowledge-hub-backend  | 
knowledge-hub-backend  | /app/server.js:24
knowledge-hub-backend  |     const record = await registerFile(pool, infos);
knowledge-hub-backend  |                    ^^^^^
knowledge-hub-backend  | 
knowledge-hub-backend  | SyntaxError: await is only valid in async functions and the top level bodies of modules
knowledge-hub-backend  |     at wrapSafe (node:internal/modules/cjs/loader:1713:18)
knowledge-hub-backend  |     at Module._compile (node:internal/modules/cjs/loader:1755:20)
knowledge-hub-backend  |     at Object..js (node:internal/modules/cjs/loader:1913:10)
knowledge-hub-backend  |     at Module.load (node:internal/modules/cjs/loader:1505:32)
knowledge-hub-backend  |     at Function._load (node:internal/modules/cjs/loader:1309:12)
knowledge-hub-backend  |     at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
knowledge-hub-backend  |     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
knowledge-hub-backend  |     at node:internal/main/run_main_module:36:49
knowledge-hub-backend  | 
knowledge-hub-backend  | Node.js v22.23.2
knowledge-hub-frontend  | 
knowledge-hub-frontend  | > knowledge-hub-frontend@1.0.0 start
knowledge-hub-frontend  | > vite --host 0.0.0.0 --port 8081
knowledge-hub-frontend  | 
knowledge-hub-frontend  | 
knowledge-hub-frontend  |   VITE v6.4.3  ready in 143 ms
knowledge-hub-frontend  | 
knowledge-hub-frontend  |   ➜  Local:   http://localhost:8081/
knowledge-hub-frontend  |   ➜  Network: http://172.21.0.4:8081/
knowledge-hub-db        | The files belonging to this database system will be owned by user "postgres".
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
knowledge-hub-db        | creating configuration files ... ok
knowledge-hub-db        | running bootstrap script ... ok
knowledge-hub-db        | performing post-bootstrap initialization ... ok
knowledge-hub-db        | syncing data to disk ... ok
knowledge-hub-db        | initdb: warning: enabling "trust" authentication for local connections
knowledge-hub-db        | initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.
knowledge-hub-db        | 
knowledge-hub-db        | 
knowledge-hub-db        | Success. You can now start the database server using:
knowledge-hub-db        | 
knowledge-hub-db        |     pg_ctl -D /var/lib/postgresql/data -l logfile start
knowledge-hub-db        | 
knowledge-hub-db        | waiting for server to start....2026-08-20 20:32:24.555 UTC [48] LOG:  starting PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
knowledge-hub-db        | 2026-08-20 20:32:24.555 UTC [48] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
knowledge-hub-db        | 2026-08-20 20:32:24.558 UTC [51] LOG:  database system was shut down at 2026-08-20 20:32:24 UTC
knowledge-hub-db        | 2026-08-20 20:32:24.561 UTC [48] LOG:  database system is ready to accept connections
knowledge-hub-db        |  done
knowledge-hub-db        | server started
knowledge-hub-db        | CREATE DATABASE
knowledge-hub-db        | 
knowledge-hub-db        | 
knowledge-hub-db        | /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
knowledge-hub-db        | 
knowledge-hub-db        | waiting for server to shut down...2026-08-20 20:32:24.736 UTC [48] LOG:  received fast shutdown request
knowledge-hub-db        | .2026-08-20 20:32:24.737 UTC [48] LOG:  aborting any active transactions
knowledge-hub-db        | 2026-08-20 20:32:24.738 UTC [48] LOG:  background worker "logical replication launcher" (PID 54) exited with exit code 1
knowledge-hub-db        | 2026-08-20 20:32:24.738 UTC [49] LOG:  shutting down
knowledge-hub-db        | 2026-08-20 20:32:24.739 UTC [49] LOG:  checkpoint starting: shutdown immediate
knowledge-hub-db        | 2026-08-20 20:32:24.761 UTC [49] LOG:  checkpoint complete: wrote 926 buffers (5.7%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.015 s, sync=0.006 s, total=0.023 s; sync files=301, longest=0.001 s, average=0.001 s; distance=4273 kB, estimate=4273 kB; lsn=0/191F0F0, redo lsn=0/191F0F0
knowledge-hub-db        | 2026-08-20 20:32:24.770 UTC [48] LOG:  database system is shut down
knowledge-hub-db        |  done
knowledge-hub-db        | server stopped
knowledge-hub-db        | 
knowledge-hub-db        | PostgreSQL init process complete; ready for start up.
knowledge-hub-db        | 
knowledge-hub-db        | 2026-08-20 20:32:24.861 UTC [1] LOG:  starting PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
knowledge-hub-db        | 2026-08-20 20:32:24.862 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
knowledge-hub-db        | 2026-08-20 20:32:24.862 UTC [1] LOG:  listening on IPv6 address "::", port 5432
knowledge-hub-db        | 2026-08-20 20:32:24.863 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
knowledge-hub-db        | 2026-08-20 20:32:24.866 UTC [64] LOG:  database system was shut down at 2026-08-20 20:32:24 UTC
knowledge-hub-db        | 2026-08-20 20:32:24.870 UTC [1] LOG:  database system is ready to accept connections
knowledge-hub-db        | 2026-08-20 20:32:29.019 UTC [75] FATAL:  role "postgres" does not exist
knowledge-hub-db        | 2026-08-20 20:32:34.087 UTC [83] FATAL:  role "postgres" does not exist

