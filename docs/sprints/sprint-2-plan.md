# Sprint 2

**Ziel:** Das Grundgerüst um einen einheitlichen Seitenrahmen und das Abrufen hochgeladener Dateien erweitern, damit der Kunde gespeicherte Dateien nicht nur sieht, sondern auch öffnen kann.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Einheitliche App-Shell mit Header und Inhaltsbereich ergänzen _(zurückgestellt, wieder aufgenommen)_

- Typ: Feature
- Priorität: Mittel
- Schätzung: 1 Punkte

In frontend/src eine Layout-Komponente (z.B. AppShell.jsx) anlegen, die einen Seitenkopf und einen zentralen, auf Mobile/Desktop responsive Inhaltsbereich (max-width, Tailwind-Spacing) definiert. Diese Shell in App.jsx um die bestehende FileList/Datei-Ansicht legen, sodass alle Seiten denselben visuellen Rahmen haben. Header schlank halten (z.B. Projektname links), Konsistenz mit der shadcn/ui-Farb- und Typografie-Skala aus docs/design-konzept.md wahren.

### Backend-Download-Endpunkt für hochgeladene Dateien

- Typ: Feature
- Priorität: Hoch
- Schätzung: 2 Punkte

In backend/upload.js eine Route GET /api/files/:id/download ergänzen, die die gespeicherte Datei mit korrektem Content-Type und Content-Disposition (attachment bzw. inline) ausliefert. Unbekannte oder nicht vorhandene IDs mit 404 beantworten. Funktionalität durch mindestens einen Test im bestehenden backend/test/upload.test.js absichern.

## Akzeptanzkriterien
- GET /api/files/:id/download liefert die Datei mit korrektem Content-Type und als Download
- Unbekannte Datei-ID ergibt eine 404-Antwort mit verständlicher Fehlermeldung
- Der neue Endpunkt ist im bestehenden Unit-Test (backend/test/upload.test.js) abgedeckt

## Voraussichtliche Dateien
- backend/upload.js
- backend/server.js
- backend/test/upload.test.js

### Download-Link in der Dateiliste im Frontend

- Typ: Feature
- Priorität: Hoch
- Schätzung: 1 Punkte

Die bestehende Dateiliste (frontend/src/components/FileList.jsx) so erweitern, dass für jede Datei ein sichtbarer Download-Button/Link angezeigt wird. Der Link ruft den neuen Backend-Endpunkt auf (z.B. über window.open mit der URL aus frontend/src/api.js) und lädt so die Datei im Browser herunter. Fehlerzustand (404/Serverfehler) dabei sichtbar machen, z.B. über eine kurze Meldung.

## Akzeptanzkriterien
- In der Dateiliste gibt es pro Datei einen Klick-Download, der den Backend-Download-Endpunkt aufruft
- Ein fehlgeschlagener Download (z. B. gelöschte Datei) wird dem Nutzer als Fehler angezeigt
- Die Änderung nutzt Tailwind/shadcn/ui-Komponenten und fügt sich in das bestehende Layout ein

## Voraussichtliche Dateien
- frontend/src/components/FileList.jsx
- frontend/src/api.js

## Abhängigkeiten
- Backend-Download-Endpunkt für hochgeladene Dateien
