# Sprint 11

**Ziel:** Datei-Upload zuverlässig und benutzbar machen: Der Kunde sieht, welche Dateien erlaubt sind, und bekommt bei einem fehlgeschlagenen Upload eine klare, verständliche Fehlermeldung – damit seine Uploads nicht mehr mittendrin scheitern.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Frontend: Upload-Beschränkungen und Fehlermeldungen klar anzeigen

- Typ: Feature
- Priorität: Hoch
- Schätzung: 2 Punkte

Unter dem Upload-Button einen Hinweistext anzeigen, der die erlaubten Dateitypen (PNG, JPEG, PDF, TXT) und die 30-MB-Größenbeschränkung nennt. Die bisherige generische Fehlermeldung beim Upload durch die konkrete, vom Backend gelieferte Meldung ersetzen (z.B. "Datei zu groß" oder "Dateityp nicht erlaubt"). Ergänze einen Test, der das Anzeigen des Hinweises und der spezifischen Fehlermeldung prüft.

## Akzeptanzkriterien
- Der Upload-Button besitzt einen sichtbaren Hinweis mit den erlaubten Dateitypen (PNG, JPEG, PDF, TXT) und der 30-MB-Grenze.
- Bei einem Upload-Fehler (MIME-Typ nicht erlaubt, Datei zu klein) erscheint die exakte vom Backend zurückgegebene Fehlermeldung im Alert.
- Ein Test prüft den Hinweis und die Formulierung der Fehlermeldung aus dem Backend.

## Voraussichtliche Dateien
- frontend/src/App.jsx
- frontend/src/App.test.jsx
- frontend/src/components/UploadButton.jsx

### Integrationstest für Upload ↔ Dateiliste inkl. Validierungsfehlern

- Typ: Integration
- Priorität: Hoch
- Schätzung: 3 Punkte

Nach der Serverkorrektur aus Sprint 10 muss im Backend ein Test den kompletten Upload-Nachweis ergänzen: Gültige Datei (z.B. text/plain) wird über die API hochgeladen, erscheint in der Dateiliste und kann über den Download-Endpunkt wieder abgerufen werden; eine ungültige (nicht erlaubter MIME-Typ) bzw. zu große Datei wird mit der konkreten Fehlermeldung abgewiesen. Ziel ist, einen Rückfall im Upload- oder Routing zu verhindern.

## Akzeptanzkriterien
- Ein Test uploadet erfolgreich eine small text/x„text/plain“-Datei und prüft GET /api/files, dass die Datei enthalten ist.
- Der Test prüft, dass eine Datei mit nicht erlaubtem MIME-Typ eine HTTP-400-Antwort mit dem (beschreibenden) Fehlertext liefert.
- Der Test prüft, dass eine Datei größe als 30 MB mit HTTP-400 abgelehnt wird.
- Alle Tests laufen grün (Benchmark ≥17 Backend-Tests).

## Voraussichtliche Dateien
- backend/test/upload.test.js
- backend/server.js

## Abhängigkeiten
- Frontend: Upload-Beschränkungen und Fehlermeldungen klar anzeigen
