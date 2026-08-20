# Sprint 3

**Ziel:** Datei-Detailansicht mit Kommentaren und Kommentarformular umsetzen, damit der Kunde eine Datei öffnen und ihre Kommentare verwalten kann.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Lade-, Leer- und Fehlerzustände in Dateiliste und Kommentarliste auf shadcn/ui-Alert vereinheitlichen _(zurückgestellt, wieder aufgenommen)_

- Typ: Chore
- Priorität: Mittel
- Schätzung: 1 Punkte

Prüfen, ob die Dateiliste (frontend/src/components/FileList.jsx) und die Kommentarliste (frontend/src/components/CommentList.jsx) für leer/lädt/Fehler dieselbe Darstellung nutzen wie die neue Download-Fehlermeldung (shadcn/ui-Alert). Falls nicht, die Zustände dort auf die Alert-Komponente (oder ein einheitliches Skeleton-Muster) umstellen, damit alle Ansichten die gleiche visuelle Sprache sprechen.

### Konsistenz der Shadcn/ui-Importe und Tailwind-Klassen prüfen _(zurückgestellt, wieder aufgenommen)_

- Typ: Chore
- Priorität: Niedrig
- Schätzung: 1 Punkte

In den Komponenten (AppShell, FileList, CommentList, Upload) die Verwendung von Tailwind-Klassen und Spacing-Werten gegeneinander prüfen: Es dürfen keine willkürlichen Hex-Farben, abweichende Rundungen (nur rounded-md/lg) oder Pixel-Abstände (nur Spacing-Multiplikatoren) vorkommen. Gegebenenfalls Abweichungen korrigieren, damit alle Muster exakt aus der Design-Skala in docs/design-konzept.md kommen.

### Backend: GET /files/:id für Dateimetadaten

- Typ: Feature
- Priorität: Mittel
- Schätzung: 2 Punkte

Endpunkt ergänzen, der eine einzelne Datei anhand ihrer ID liefert. Für die Detailansicht des Frontends wird benötigt, die aktuellen Metadaten (Name, Typ, Größe, Upload-Zeitpunkt) abzurufen. Bei unbekannter ID soll 404 zurückkommen.

## Akzeptanzkriterien
- GET /files/:id liefert die Datei mit den Feldern id, name, mime_type, size, uploaded_at als JSON.
- Bei unbekannter ID wird HTTP 404 mit einer Fehlermeldung zurückgegeben.
- Der Endpunkt ist im Backend getestet (mindestens ein Test für Erfolgs- und Fehlerfall).

## Voraussichtliche Dateien
- backend/server.js
- backend/upload.js
- backend/test/upload.test.js

### Datei-Detailansicht mit Kommentarliste und Kommentarformular

- Typ: Feature
- Priorität: Hoch
- Schätzung: 3 Punkte

Im Frontend eine Detailansicht ergänzen: Klick auf eine Datei in der Dateiliste öffnet eine Ansicht, die den Dateinamen, die zugehörigen Kommentare und ein Formular zum Anlegen neuer Kommentare anzeigt. Die Ansicht nutzt GET /files/:id und die bestehenden Kommentar-Endpunkte. Lade-, Leer- und Fehlerzustände sind mit shadcn/ui-Komponenten aufzubereiten.

## Akzeptanzkriterien
- Ein Klick auf eine Datei öffnet eine Detailansicht mit dem Dateinamen und allen zugehörigen Kommentaren.
- Das Formular erlaubt das Erfassen eines neuen Kommentars; nach dem Speichern erscheint dieser sofort in der Kommentarliste.
- Die Detailansicht zeigt Lade-, Leer- und Fehlerzustände (z. B. mit Alert) für die Kommentarliste.
- Die Ansicht ist responsiv und nutzt durchgehend Tailwind-/shadcn/ui-Konventionen.

## Voraussichtliche Dateien
- frontend/src/components/FileDetail.jsx
- frontend/src/App.jsx
- frontend/src/api.js
- frontend/src/components/KommentarListe.jsx

## Abhängigkeiten
- Backend: GET /files/:id für Dateimetadaten
