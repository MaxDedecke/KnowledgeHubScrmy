# Sprint 17 – Review

## Was geliefert wurde
- **Behebung des Verbindungsfehlers (`ERR_NAME_NOT_RESOLVED` / `Failed to fetch`)**: Die API-Kommunikation im Frontend wurde vollständig auf relative Pfade (`/api/...`) umgestellt. Browser-Anfragen sprechen nun nicht mehr direkt interne Docker-Servicenamen an, sondern laufen über den Reverse-Proxy im Frontend-Container.
- **Konfigurierbarer Vite-Proxy**: Die Weiterleitung an das Backend wurde über Umgebungsvariablen (`API_TARGET_URL`) abgesichert und fest verdrahtete Hostnamen wurden aus dem Client-Code bereinigt.
- **Testabdeckung und Absicherung**: Unit- und Integrationstests für den Upload-Flow, die relative Pfadadressierung und Fehlermeldungen wurden aktualisiert und erfolgreich ausgeführt.
- **Sprint-Integrationsprüfung**: Der komplette Stack (Frontend, Backend, Postgres) wurde automatisch gestartet und erfolgreich geprüft.

## Was offen blieb (und warum)
- Aus diesem Sprint ist nichts offen geblieben. Alle geplanten Tickets wurden fertiggestellt und die Integrationsprüfung war erfolgreich.

## Wo der Auftraggeber gefragt ist
- **Funktionstest im Browser**: Bitte prüfen Sie den Datei-Upload und die Anzeige der hochgeladenen Dokumente in Ihrer Umgebung gegen, um zu bestätigen, dass der Upload-Fehler behoben ist.
- **Abnahme**: Bitte prüfen Sie, ob die Anwendung aus Ihrer Sicht alle Anforderungen aus dem Konzept und den Beschlüssen vollständig erfüllt.

## Empfehlung für den nächsten Sprint
- Bei erfolgreicher Verifikation des Uploads und Freigabe durch Sie kann die finale Abnahme und der Projektabschluss erfolgen.
- Sollten bei Ihrer Prüfung noch funktionale oder optische Anpassungswünsche auffallen, können wir diese im nächsten Sprint gezielt angehen.

## Anhang: Integrationsprüfung (voller Stack)
Bestanden. Voller Stack erreichbar (Dienst „frontend", Port 32833).
