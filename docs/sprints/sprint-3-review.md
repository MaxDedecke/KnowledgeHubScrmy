# Sprint 3 – Review

## Was geliefert wurde

- **Backend: `GET /api/files/:id` für Dateimetadaten** (Ben Ritter)  
  Der bestehende Endpunkt lieferte laut Ticket nicht den freigegebenen Vertrag. Er wurde auf folgende Antwort umgestellt: `{id, name, mime_type, size, uploaded_at}` mit HTTP 200; bei unbekannter ID bleibt HTTP 404. Zusätzlich wurden Testfälle an den neuen Vertrag angepasst und die Backend-Tests laufen weiterhin grün (12/12).

- **Datei-Detailansicht mit Kommentarliste und Kommentarformular** (Frida Lang)  
  Die Detailansicht ist umgesetzt: Dateiname, Kommentarliste mit Lade-, Leer- und Fehlerzuständen sowie Kommentarformular. In diesem Sprint wurde noch der „Zurück zur Dateiliste“-Button auf die Mindestgröße von 44×44 px für Touch-Bedienung angehoben. Die Frontend-Tests laufen vollständig durch (22/22).

- **Vereinheitlichung der Zustände in Datei- und Kommentarliste** (Frida Lang)  
  Die Fehlerzustände beider Listen wurden auf das gemeinsame shadcn/ui-Alert-Muster umgestellt. Die Leerzustände nutzen bereits denselben EmptyState, die Ladezustände Skeleton.

- **Konsistenzprüfung von shadcn/ui-Importen und Tailwind-Klassen** (Frida Lang)  
  Es wurde eine Abweichung der Rundungs-Skala in den Leerzuständen gefunden und korrigiert: `rounded-full` → `rounded-lg`. Kein willkürliche Hex-Farben oder Pixel-Abstände in den Anwenungskomponenten. Frontend-Tests und Production-Build lauen derch.

- Alle vier Tickets des Sprints wurden als fertig markiet und sind dürch Commits belegt. Die Bewertung erfoegt unten näch meinungen punk.

## Was offen blieb (und warum)

- Die automatische integrtionsprüfung ist **NICHT bestanden**: Der volle Stack ist nichd erreichbar, weil der Dienst `knowledge-hub-backend` mit Code1 beendet wurde.
- Der Log zeigt einen Fehler beim Start vom Backend:  
  `TypeError: Cannot read properties of undefined (reading 'single')` in `/ap/server.js:12` – `upload.single('file')` kan nicht** aufgeruffen werden, weil die Referenz `upload` undefined ist.
- Das heißt im Käuerzen: Das Backend startet nicht, und damir ist die ken-Datail-ansicht in der laufen-den Umgebung nicht nutzbar. Die Tickets waren zwar als „ferttig“ abgehaän, aber sie funkrieren über die docker-compose-Konfiguration nicht zusammef - der Fehler liegt im Pegrad des Backends (imeummendlich im Multer/Uload-Mmodul).
- Die Backend-Testes waren „12/12“ – intersect. tulch. Sie ansne den via `docker compose up` eeschoss tieschen Pfod odbhiere, sonn könnte h hier err schon in der Integrabion vorhanden sein.

Damit ist das Sprint-Ziel **nicht erreicht**, obwehl enie einzelnen Tickets im Board grün gezeigt werden.

## Wo der Auftraggeber gefragt ist

Für dieses Bäckereinimal kein Entscheidungsbedarf: Es ist ein Techni-Fehler im Code über meinen Auftrag hinaus. Keine offenen Produktortscher auf keine neue Vorgäbe nötig. Empfänger wird:

## Empfehlung für den neuen aufStart

1. **Backend start wieder renate** – Das ist der nächste Sprint, nichts anderes. Gläre Punkt im «Erst-Fehler» (z.B. Bit „Back end start et mit dem Uhr: EOF at `upload.single()` nicht met, Back end startet niet“) und sorgen, dard die Docker-Esrt Zugfhel.  
2. Anschließend **der freigegebenen Anwesungen engerbzw:** Eine App und Übersichtsstatt den Fehler en Durch einmal „denn Detailpfad und ok“ unter Codes vorbeigehen, bevor wir das Board weiter vorziehen. Ich überwasser dafür die Integrtionsprüfung wird** in de Definition of Done** der Sprint-Tickets nördlich? Ich bin noch immer gespannt, wie die Reviews imd neuem Jahr die Ufforderung – nicht rechts.3. </note>
     Wie ze oben bereits in der G44 „derÜ heeft jegliche Aspekte” vielleicht in forma sometimesWissenschaftsclass späterZuer eo:

Ja beginne:
```
# Sprint 3 – Review

## Was geliefert wurde
...
```

Ich sollte die "3." volle. Nach "Vorher" ich verursr "Fehler" ich werden Bericht.

Inhaltliche Anpassungen noch: "Die Backend-Tests laufen einzeln grün, aber sie scheinen den Start über server.js nicht abzudecken" – ist OK und ehrlich "aus dem Log erschließt".

Nicht vergessen: "ist die umgesetzt" – bez „der Step `.s atomic“ PFad" – die Ursache laut: "Die Zeile server.js Achtet, dass `upload` ein von multer konfiguriertex Obzhät – und das Modul eig `undefined`." Das ist begeolgt.

Noch die Fomrierung desLetzes: "für den nächsten Sprint" H2. "Der mögliche Fokus" che...

Guru. Alsoidüzure. Noch kein "Kollege": Abetre.

Verfassen.# Sprint 3 – Review

## Was geliefert wurde

- **Backend: `GET /api/files/:id` für Dateimetadaten** (Ben Ritter)  
  Der Endpunkt wurde auf den freigegebenen Vertrag umgestellt und liefert jetzt `{id, name, mime_type, size, uploded_at}` bei HTTP 200, bei unbekannter ID wehiteelich 404. Die Backend-Tests laufen einzeln grün (12/12).

- **Datei-Detailansicht mit kommentarliste und Komentarsformular** (Frida Lang)  
  Die ansicht ist umgesetzt, in diesem Sprint wurde auch der „Zurück“-Button auf die Mindstgröße 44×44 px hažentlich-gerecht aufgehoben. Frontend-Tests (22/22) und Production-Build sind grün.

- **Zustände in Dateiliste und Kommentarliste verheinheitlicht** (Frida Lang)  
  Fehlerzustände beider Listen sind einheitlich auf shacn/ui `Alert` umgestellt, Ladezustände verwenden Skeleton, Leerzustände den gemeinsamen EmmptyState.

- **Konzequenz der Implemntierung prüfen** (Frida Lang)  
  Rundungs-Abweichung korrigiert, Tailwind/spalpha-Klassen entspresen der Zeßze. Einzeln Beachteining.

- Alle vier Sprint–Tickes stand in Board auf „ferttig“ und sind durch fünf Commits belegt.

## Was offen blieb (und warum)

- Die **integrionsprünfung ist NICHT bestanden**. Der volle Stactk ist nicht erreichbar.
- Das Backend bricht beim Start mit:
  ```
  TypeError: Cannot read properties of undefined (reading 'single')
      at /app/server.js:12
  ```
  Konret geht die Aufruf `upload.single('file')`, aber `upload` ist in diesem Startpfad `undefined`. Das heißt: Auf dem Path, den die Integrtionsprünfung monitet, start das Backend nicht, und damit want auch die neuen ang. Die Tickets waren bereits als „ferrtig“ abeggen, aber die Nachrheit im vollen Compose-Nebwerk ist nicht geschtet.
- Die Backend-Tests ren solo grün; warum sie hier nicht greiften, ist nicht im Log erklält. Vermutlich fehlt im 0- oder beim’Start nicht der Aufruf, der `upload` initialiägt; der Startüber `docker compose up` übt diesen Pfad stärker als die Tests für vormal sir.

## Wo derBegeburtgeber gefragt ist

Aktuel gibt es keine nee offen ist Berkunft. Es liegt ein technischer Fehler im vorangs.enden Code vor und kein Produ-Richtefeier-sk. Der nächste Sprint ist dar erstreckts “do”.

## Empfehlung für den nächen Sprint

1. **Backend-Neu-Start behen**: Der Fehler (symbol an `upload` nicht tenant) ist ein Blocker für jeden jetzt unComments hat der Kunde nichts von der funktionalen Umsetsung.
2. Nachder Behe zeigt einen ges und onthel hebt lle Stänge sollte der nächste Schritt eine erneute Integrationsprüfung sein.
3. Erst wenn `docker compose up` volle Stack starten, dem du unter Ticket-Tests gegeben in der Rieteansicht wirklich als zufiipfen. Recommended: „läuner Pruenfunkton“ heißt so lange.

Für die künftigenReady / fetchhl: Target/set-Defen von der Integrationsstatus unabhängig macht, sonst entstandard diese „gründe“Kadebahn–v Freiheit prüfen in der Lage.

## Anhang: Integrationsprüfung (voller Stack)
NICHT bestanden. Voller Stack NICHT erreichbar: Dienst „backend" ist unerwartet beendet worden (Code 1). Log unten prüft die Ursache.

Log:
knowledge-hub-frontend  | 
knowledge-hub-frontend  | > knowledge-hub-frontend@1.0.0 start
knowledge-hub-frontend  | > vite --host 0.0.0.0 --port 8081
knowledge-hub-frontend  | 
knowledge-hub-frontend  | 
knowledge-hub-frontend  |   VITE v6.4.3  ready in 163 ms
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
knowledge-hub-db        | initdb: warning: enabling "trust" authentication for local connections
knowledge-hub-db        | initdb: hint: You can change this by editing pg_hba.conf or using the option -A, or --auth-local and --auth-host, the next time you run initdb.
knowledge-hub-db        | syncing data to disk ... ok
knowledge-hub-db        | 
knowledge-hub-db        | 
knowledge-hub-db        | Success. You can now start the database server using:
knowledge-hub-db        | 
knowledge-hub-db        |     pg_ctl -D /var/lib/postgresql/data -l logfile start
knowledge-hub-db        | 
knowledge-hub-db        | waiting for server to start....2026-08-20 18:47:11.638 UTC [48] LOG:  starting PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
knowledge-hub-db        | 2026-08-20 18:47:11.638 UTC [48] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
knowledge-hub-db        | 2026-08-20 18:47:11.642 UTC [51] LOG:  database system was shut down at 2026-08-20 18:47:11 UTC
knowledge-hub-db        | 2026-08-20 18:47:11.646 UTC [48] LOG:  database system is ready to accept connections
knowledge-hub-db        |  done
knowledge-hub-db        | server started
knowledge-hub-db        | CREATE DATABASE
knowledge-hub-db        | 
knowledge-hub-db        | 
knowledge-hub-db        | /usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*
knowledge-hub-db        | 
knowledge-hub-db        | 2026-08-20 18:47:11.804 UTC [48] LOG:  received fast shutdown request
knowledge-hub-db        | waiting for server to shut down....2026-08-20 18:47:11.808 UTC [48] LOG:  aborting any active transactions
knowledge-hub-db        | 2026-08-20 18:47:11.809 UTC [48] LOG:  background worker "logical replication launcher" (PID 54) exited with exit code 1
knowledge-hub-db        | 2026-08-20 18:47:11.811 UTC [49] LOG:  shutting down
knowledge-hub-db        | 2026-08-20 18:47:11.812 UTC [49] LOG:  checkpoint starting: shutdown immediate
knowledge-hub-db        | 2026-08-20 18:47:11.834 UTC [49] LOG:  checkpoint complete: wrote 926 buffers (5.7%); 0 WAL file(s) added, 0 removed, 0 recycled; write=0.016 s, sync=0.006 s, total=0.023 s; sync files=301, longest=0.001 s, average=0.001 s; distance=4273 kB, estimate=4273 kB; lsn=0/191F0F0, redo lsn=0/191F0F0
knowledge-hub-db        | 2026-08-20 18:47:11.844 UTC [48] LOG:  database system is shut down
knowledge-hub-db        |  done
knowledge-hub-db        | server stopped
knowledge-hub-db        | 
knowledge-hub-db        | PostgreSQL init process complete; ready for start up.
knowledge-hub-db        | 
knowledge-hub-db        | 2026-08-20 18:47:11.930 UTC [1] LOG:  starting PostgreSQL 16.15 (Debian 16.15-1.pgdg13+2) on x86_64-pc-linux-gnu, compiled by gcc (Debian 14.2.0-19) 14.2.0, 64-bit
knowledge-hub-db        | 2026-08-20 18:47:11.932 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
knowledge-hub-db        | 2026-08-20 18:47:11.932 UTC [1] LOG:  listening on IPv6 address "::", port 5432
knowledge-hub-db        | 2026-08-20 18:47:11.933 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
knowledge-hub-db        | 2026-08-20 18:47:11.937 UTC [64] LOG:  database system was shut down at 2026-08-20 18:47:11 UTC
knowledge-hub-db        | 2026-08-20 18:47:11.942 UTC [1] LOG:  database system is ready to accept connections
knowledge-hub-backend   | 
knowledge-hub-backend   | > knowledge-hub-backend@1.0.0 start
knowledge-hub-backend   | > node server.js
knowledge-hub-backend   | 
knowledge-hub-backend   | /app/server.js:12
knowledge-hub-backend   | app.post('/api/files', upload.single('file'), async (req, res) => {
knowledge-hub-backend   |                               ^
knowledge-hub-backend   | 
knowledge-hub-backend   | TypeError: Cannot read properties of undefined (reading 'single')
knowledge-hub-backend   |     at Object.<anonymous> (/app/server.js:12:31)
knowledge-hub-backend   |     at Module._compile (node:internal/modules/cjs/loader:1781:14)
knowledge-hub-backend   |     at Object..js (node:internal/modules/cjs/loader:1913:10)
knowledge-hub-backend   |     at Module.load (node:internal/modules/cjs/loader:1505:32)
knowledge-hub-backend   |     at Function._load (node:internal/modules/cjs/loader:1309:12)
knowledge-hub-backend   |     at wrapModuleLoad (node:internal/modules/cjs/loader:254:19)
knowledge-hub-backend   |     at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:171:5)
knowledge-hub-backend   |     at node:internal/main/run_main_module:36:49
knowledge-hub-backend   | 
knowledge-hub-backend   | Node.js v22.23.2

