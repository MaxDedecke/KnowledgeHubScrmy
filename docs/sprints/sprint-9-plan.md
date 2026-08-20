# Sprint 9

**Ziel:** Backend-Validierung von Dateityp und -größe beim Upload einführen, damit unzulässige Dateien mit aussagekräftiger Fehlermeldung abgewiesen werden.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Dateinamen und Dateigrößen beim Upload im Backend begrenzen

- Typ: Feature
- Priorität: Hoch
- Schätzung: 2 Punkte

Im Upload-Endpunkt (backend/upload.js) die Validierung von Dateityp und -größe ergänzen: Erlaubte MIME-Typen (z.B. bild/png, bild/jpeg, application/pdf, text/plain) und eine maximale Größe von 30 MB definieren. Bei Überschreitung eine klare HTTP-400-Fehlermeldung zurückgeben, sodass das Frontend sie anzeigen kann. Die bestehenden Upload-Tests erweitern und einen Test für einen zu großen sowie einen nicht erlaubten Dateityp ergänzen.

## Akzeptanzkriterien
- Hochgeladene Datei mit nicht erlaubtem MIME-Typ wird mit HTTP 400 und einer Meldung zurückgewiesen, die den erlaubten Dateityp nennt.
- Hochgeladene Datei größer als 30 MB wird mit HTTP 400 und einer Meldung über die Größenbegrenzung zurückgewiesen.
- Dateien mit erlaubtem Typ und unter 30 MB werden weiterhin erfolgreich gespeichert.
- Die Backend-Tests behandeln die neuen Validierungen und laufen grün.

## Voraussichtliche Dateien
- backend/upload.js
- backend/test/upload.test.js
