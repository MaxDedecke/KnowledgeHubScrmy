# Sprint 17

**Ziel:** Den Datei-Upload und die API-Kommunikation im Frontend über relative Pfade / Vite-Proxy absichern, um den ERR_NAME_NOT_RESOLVED-Fehler im Browser zu beheben.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Vite-Proxy und relative API-URLs im Frontend konfigurieren

- Typ: Bug
- Priorität: Dringend
- Schätzung: 2 Punkte

Im Frontend-Code dürfen keine Docker-Compose-Servicenamen ('http://backend:3000') fest verdrahtet sein, da der Browser diese nicht auflösen kann (ERR_NAME_NOT_RESOLVED). Die API-Aufrufe in frontend/src/api.js müssen relative Pfade (/api/...) verwenden. Der Frontend-Dev-Server (vite.config.js) bzw. Container-Proxy muss Anfragen an '/api' intern an 'http://backend:3000' weiterleiten.

## Akzeptanzkriterien
- frontend/src/api.js verwendet relative Pfade (z.B. '/api/files') oder eine über Umgebungsvariablen/Proxy konfigurierte relative Basis-URL ohne festen 'backend:3000'-Hostnamen.
- In frontend/vite.config.js leitet der Proxy Anfragen an '/api' an den internen Backend-Endpunkt 'http://backend:3000' weiter.
- Scrumys Prüfung findet keine Compose-Servicenamen von nicht veröffentlichten Diensten im Client-JavaScript.
- Vorhandene Frontend-API-Tests laufen weiterhin erfolgreich durch.

## Voraussichtliche Dateien
- frontend/src/api.js
- frontend/vite.config.js
- frontend/src/__tests__/api.test.js

### Integrationstest für Datei-Upload und API-Proxy-Verhalten absichern

- Typ: Integration
- Priorität: Hoch
- Schätzung: 1 Punkte

Sicherstellen und testen, dass Upload- und Kommentar-Aufrufe im Frontend über relative Pfade korrekt initiiert werden und Fehler- wie Erfolgsfälle sauber behandelt werden.

## Akzeptanzkriterien
- Tests in frontend/src/App.test.jsx und frontend/src/__tests__/api.test.js prüfen, dass der Upload mit relativen Pfaden arbeitet.
- Fehlgeschlagene Netzwerkaufrufe führen zu verständlichen Fehlermeldungen in der UI statt zu unbehandelten Namensauflösungsfehlern.
- Alle Frontend- und Backend-Tests laufen grün durch.

## Voraussichtliche Dateien
- frontend/src/App.test.jsx
- frontend/src/__tests__/api.test.js

## Abhängigkeiten
- Vite-Proxy und relative API-URLs im Frontend konfigurieren
