# Sprint 14

**Ziel:** Den Upload-Ablauf abrunden: Nach einem erfolgreichen Upload wird die neue Datei sofort geöffnet und ausgewählt, damit der Kunde direkt weiterarbeiten kann.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Nach erfolgreichem Upload die neue Datei automatisch auswählen und öffnen

- Typ: Feature
- Priorität: Mittel
- Schätzung: 2 Punkte

Beim Datei-Upload wird im Frontend nach erfolgreichem Abschluss die frisch hochgeladene Datei automatisch als aktive Auswahl im State gesetzt. Dadurch öffnet sich direkt die Detailansicht mit dem Dateinamen und der Kommentarliste; die Sidebar markiert die Datei sichtbar als aktiv. Der bisherige Erfolgs-Alert kann erhalten bleiben, sollte aber die direkte Auswahl nicht blockieren. Die Lösung nutzt die bereits vorhandenen Upload-Rückgabewerte und ändert nur den abgeschlossenen Erfolgszustand in App.jsx.

## Akzeptanzkriterien
- Nach einem erfolgreichen Upload wird die hochgeladene Datei automatisch in der Detailansicht geöffnet.
- Die Sidebar markiert die frisch hochgeladene Datei als ausgewählt.
- Der bestehende Fehlerpfad des Uploads bleibt unverändert mit Warnmelder erhalten.

## Voraussichtliche Dateien
- frontend/src/App.jsx
- frontend/src/components/UploadButton.jsx
- frontend/src/components/FileDetail.jsx
