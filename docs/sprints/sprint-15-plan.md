# Sprint 15

**Ziel:** Den Upload-Ablauf weiter verfeinern: Ladezustand und Deaktivierung des Upload-Buttons während der Übertragung sowie das Zurücksetzen des Erfolgs-Alerts nach dem automatischen Öffnen der neuen Datei, inklusive eines Integrationstests.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Upload-Button mit Ladezustand und Deaktivierung während der Übertragung ergänzen _(zurückgestellt, wieder aufgenommen)_

- Typ: Feature
- Priorität: Mittel
- Schätzung: 1 Punkte

In der Dateiliste (App.jsx, Upload-Formular) einen isLoading-Zustand führen, der beim Abschicken des Uploads gesetzt wird. Der Upload-Button zeigt dann einen kleinen Spinner (z.B. shadcn/ui-LoadingIcon) und ist deaktiviert, bis die Backend-Antwort (Erfolg oder Fehler) vorliegt – analog zu den bereits in früheren Sprints eingeführten Feedbackzuständen.

### Erfolgs-Alert nach automatischem Öffnen der neuen Datei zurücksetzen _(zurückgestellt, wieder aufgenommen)_

- Typ: Chore
- Priorität: Niedrig
- Schätzung: 1 Punkte

In App.jsx wird nach dem erfolgreichen Upload die neue Datei direkt geöffnet (setSelectedFileId). Gleichzeitig bleibt der Erfolgs-Alert im Seiteninhalt sichtbar und erschwert den Beginn der Detailansicht zweigleisig. Ausblenden des Alerts einmal direkt nach dem Öffnen (zeitgesteuert oder beim Auswählen der Datei) – z.B. classische Zeitsteuerung nicht nötig; dauerhaftes Ausblenden nach dem ersten Öffnen statt Nur so bleibt die Aufmerksamkeit auf der neuen Datei.

### Integrationstest für Upload-Ladezustand und Alert-Zurücksetzung ergänzen

- Typ: Integration
- Priorität: Hoch
- Schätzung: 1 Punkte

Die drei zurückgestellten/zuvor geplanten Frontend-Änderungen (Upload-Button-Ladezustand in App.jsx, Alert-Zurücksetzung nach erfolgreichem Upload) in einem Integrationstest abdecken. Der Test soll den Ablauf durchspielen: Nutzer wählt Datei aus, klickt Upload, Button ist deaktiviert und zeigt Spinner, nach erfolgreicher Antwort wird die Datei automatisch ausgewählt/geöffnet und der Erfolgs-Alert wird ausgeblendet. Einen Testfall für den Fehlerfall ergänzen, in dem der Ladezustand wieder freigegeben wird und der Alert einen Fehler zeigt.

## Akzeptanzkriterien
- Test prüft, dass der Upload-Button beim Absenden deaktiviert ist und einen Spinner anzeigt.
- Test prüft, dass nach erfolgreichem Upload die neue Datei ausgewählt und geöffnet wird und der Erfolgs-Alert nicht mehr sichtbar ist.
- Test prüft, dass nach einem Upload-Fehler der Button wieder aktiv ist und ein Fehler-Alert erscheint.
- Alle Frontend-Tests laufen weiterhin grün (npm test).

## Voraussichtliche Dateien
- frontend/src/App.test.jsx
- frontend/src/__tests__/api.test.js
- frontend/src/App.jsx

## Abhängigkeiten
- null
