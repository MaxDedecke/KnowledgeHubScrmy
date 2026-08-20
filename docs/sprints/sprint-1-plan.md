# Sprint 1

**Ziel:** Grundgerüst des Knowledge Hubs aufsetzen, damit der Kunde eine Datei hochladen und kommentieren kann.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Docker-Compose-Grundgerüst mit Frontend, Backend und Postgres aufsetzen

- Typ: Integration
- Priorität: Hoch
- Schätzung: 3 Punkte

Repository-Struktur anlegen: frontend/, backend/, docker-compose.yml. Docker-Compose mit je einem Container für Frontend, Backend und Postgres. Frontend-Container auf Port 8081, Backend spricht Datenbank über Servicenamen an. Keine weiteren Ports freigeben.

## Akzeptanzkriterien
- docker-compose.yml liegt in der Repo-Wurzel und startet die Container 'frontend', 'backend' und 'db'
- Nur der Frontend-Container ist öffentlich über Port 8081 erreichbar
- Backend und Datenbank kommunizieren ausschließlich über Servicenamen im internen Netz

## Voraussichtliche Dateien
- docker-compose.yml
- frontend/Dockerfile
- backend/Dockerfile
- frontend/package.json

### Backend-Grundgerüst mit Upload-API und Postgres-Anbindung

- Typ: Feature
- Priorität: Dringend
- Schätzung: 3 Punkte

Minimales Backend (z.B. Node/Express oder fastapi) mit POST /upload und GET /files. Datenbankverbindung zur Postgres-Datenbank über den Compose-Servicenamen 'database'. Dazu ein test-Skript, das die Upload-Logik prüft.

## Akzeptanzkriterien
- POST /upload nimmt eine Datei an und speichert sie auf dem Dateisystem des Backend-Containers
- GET /files liefert die Liste aller gespeicherten Dateien
- Das Backend hat ein test-Skript in backend/package.json, das die Upload-Logik abdeckt

## Voraussichtliche Dateien
- backend/package.json
- backend/server.js
- backend/upload.js
- backend/test/upload.test.js

### Frontend-Upload-Ansicht mit Tailwind und Dateiauswahl

- Typ: Feature
- Priorität: Dringend
- Schätzung: 3 Punkte

Frontend-Startseite mit Upload-Button, über den der Benutzer eine Datei auswählen und an dashochladen kann. Tailwind und shadcn/ui einrichten, Grundlayout responsive. Das 'start'-Skript in frontend/package.json startet den Frontend-Server.

## Akzeptanzkriterien
- Frontend zeigt eine Seite mit Upload-Button und lädt die gewählte Datei per POST an das Backend hoch
- Nach erfolgreichem Upload erscheint eine Bestätigung und die hochgeladene Datei wird in der Dateiliste angezeigt
- Das 'start'-Skript in frontend/package.json startet den Entwicklungsserver

## Voraussichtliche Dateien
- frontend/package.json
- frontend/src/App.jsx
- frontend/src/components/UploadForm.jsx
- frontend/src/index.jsx

## Abhängigkeiten
- Backend-Grundgerüstützung mit Postgres-Anbindung

### Backend-API für Kommentare zu einer Datei

- Typ: Feature
- Priorität: Hoch
- Schätzung: 2 Punkte

Backend stellt Routen bereit: POST /files/:id/kommentare (Kommentar anlegen), GET /files/:id/kommentare (Kommentare zur Datei abrufen). Kommentare in der Postgres-Datenbank speichern. Test-Skript für beide Funktionen ergänzen.

## Akzeptanzkriterien
- POST /files/:id/kommentare legt einen Kommentar zur Datei an
- GET /files/:id/kommentare liefert alle Kommentare der Datei, inklusive neu hinzugefügter
- Kommentare bleiben dauerhaft gespeichert und sind pro Datei abrufbar

## Voraussichtliche Dateien
- backend/kommentare.js
- backend/server.js
- backend/test/kommentare.test.js

## Abhängigkeiten
- Backend-Grundgerüstützung mit Postgres-Anbindung

### Kommentare im Frontend anzeigen und erfassen

- Typ: Feature
- Priorität: Hoch
- Schätzung: 2 Punkte

Beim Öffnen einer Datei werden ihre Kommentare angezeigt. Erweiterung der Frontend-Ansicht um ein Kommentar-Formular und eine Kommentarliste, die die Kommentare über das Backend lädt und direkt nach dem Speichern anzeigt.

## Akzeptanzkriterien
- Beim Klick auf eine Datei werden alle zugehörigen Kommentare aus der Datenbank angezeigt
- Ein neuer Kommentar lässt sich eingeben und speichern und erscheint sofort in der Liste
- Kommentare sind eindeutig der jeweiligen Datei zugeordnet und auf Mobil- wie Desktop-Breite nutzbar

## Voraussichtliche Dateien
- frontend/src/App.jsx
- frontend/src/components/KommentarListe.jsx
- frontend/src/components/KommentarFormular.jsx

## Abhängigkeiten
- Backend-API für Kommentar und Datei
- Frontend-Upload-Ansicht mit Dateiauswahl
