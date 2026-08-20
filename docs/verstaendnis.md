# Projektverständnis

## Was der Kunde erreichen will

Der Kunde möchte ein Knowledge-Management-System, das den Erkenntnstransfer von nicht-digitalisierten Inhalten in die digitale Wissensdokumentation ermöglicht. Die Kernidee ist es, eine Verknüpfung zwischen einer digitalen Datei (z. B. einem eingescannten Dokument) und dazu gehörigen, bisher nur analogen Inhalten (z. B. Hinweise aus einem physischen Ordner oder aus Gesprächen) herzustellen. Ein zentraler Anwendungsfall: Papierdokumente werden als Datei abgelegt, und die digital erfassten Informationen werden als Kommentar an das Dokument angehängt. So entsteht ein zentraler Wissensbestand, der über die reine Dateiablage hinausgeht.

Stakeholder ist die "Warenwirtschaft und Co KG" – ein Kunde aus dem Beratungsumfeld, der sein internes Wissen über die eigentliche Dateiablage hinaus strukturiert erfassbar machen will. Ob es sich um ein rein internes Tool handelt oder Kundenkonten existieren, ist aus dem Auftrag nicht ableitbar.

## Umfang (was gehört dazu – und was ausdrücklich nicht)

**Dazu gehört:**

- **Dateiupload:** Benutzer können über die Oberfläche eine beliebige Datei auswählen und hochladen. Die Datei wird dauerhaft gespeichert und ist in der Dateiliste sichtbar.
- **Dateianzeige:** Hochgeladene Dateien werden in einer Übersicht gelistet (aus Anforderung 3 ableitbar) und können geöffnet werden.
- **Kommentarfunktion:** Zu jeder gespeicherten Datei können mehrere Kommentare als Freitext erstellt werden.
- **Kommentare anzeigen:** Beim Öffnen einer Datei werden alle zugehörigen Kommentare chronologisch angezeigt.

**Nicht enthalten:**

- Nutzerverwaltung, Logins, Rechte- und Rollenkonzept
- Bearbeiten oder Löschen von Dateien oder Kommentaren (nur Anlegen und Anzeigen im gesamten Pflichtenheft)
- Verschlagwortung, Kategorien oder Volltextsuche
- Versionierung
- Workflow-Funktionen (Freigaben, Prüfschritte)
- Dateivorschau oder Client-seitige Verarbeitung von Dateiinhalten

## Fachliche Kernbegriffe

- **Datei:** Ein Dokument, das ein Benutzer hochlädt und im System speichert.
- **Upload:** Der Vorgang des Hochladens einer Datei vom Gerät in das System.
- **Kommentar:** Einem inhaltlicher Textauszug, der zu einer Datei gespeichert wird.
- **Nicht digitalisierter Inhalt:** Informationen, die nicht im Dateiformat vorliegen (z. B. in analoger Form oder als implizites Wissen einer Person) und über den Kommentar an die Datei angebunden werden.
- **Wissensdokument**: Die zu dokumentierende Information im Zusammenspiel von Datei und ergänzenden Kommentaren.
- **Wissensbestand:** Gesamtheit aller im System abgelegten Dateien und Kommentare.

## Technischer Rahmen

Als Microservice-Setup wird der Standard-Ansatz aus den Grundregeln umgesetzt. Da das System Bewertungen (Kommentare) und Dateien dauerhaft speichert, ist die Datenbank Pflichtbestandteil.

**Dienste (Docker-Compose):**

1. **Frontend** (`frontend/`): UI-Container, erreichbar über den Browser (Port wird auf Host gemappt)
   - Technik: React/Vue–basiert mit Tailwind CSS und shadcn/ui (Matching zum Projektstandard)
   - Entwicklungs- und Build-Skript in `frontend/package.json` (dev, build, test, lint)
2. **Backend/API** (`backend/`): REST-API für den Zugriff auf Dateien und Kommentare
   - Technik: Node.js (oder Python), bspw. mit Express/Fastify
   - Zugriff von außen nicht nötig → kein Port-Mapping
3. **Datenbank:** PostgreSQL im Container als Standard-Datenhaltung
   - Speichert Datei-Metadaten, Kommentare sowie Datei-Binärdaten (je nach Größe ggf. Dateisystemablage, dann nur den Pfad in der DB – Entscheidung steht noch aus, offene Frage)

**Kommunikation:** Frontend → Backend über Service-Namen im internen Docker-Netz (`http://backend:3000`), Backend → DB über `postgres` (Service-Name).

Die docker-compose.yml liegt in der Repo-Wurzel und ist mit `docker compose up` ausführbar, ohne manuelle Anpassungen.

## Annahmen

- **Mehrbenutzerfähigkeit:** Es wird angenommen, dass es mehrere parallele Benutzer gibt, die gleichzeitig hochladen und kommentieren können. Ein Schreibschutz-Rollback ist nicht vorgesehen.
- **Persistenz:** Dateien und Kommentare sind nach einem Neustart weiterhin vorhanden (Datenbank-Volumes bzw. Dateisystem müssen gemountet werden).
- **Kein Dateityp- oder Größenspezifikationen**: Weder zulässige Dateiformate noch eine maximale Dateigröße sind vorgegeben. Es wird angenommen, dass Standard-Office-Formate unterstützt werden.
- **Keine expliziten Sonderrechte:** Es gibt keine Rollen wie z. B. "Admin" – alle Benutzer haben dieselbe Sicht (hochladen, kommentieren, ansehen).
- **Lesbarkeit der Kommentare:** Kommentare sind reine Freitexte ohne Formatierung (kein Markdown o. ä. angedacht).
- **Anzeigeformat:** Die Dateiliste ist das zentrale Navigationselement; es ist nicht näher definiert, wie die Liste intern sortiert wird (z. B. neueste zuerst), eine sinnvolle Default-Sortierung nach Datum/Name wird angenommen.

## Risiken

- **Technologien im Projekt nicht umgesetzt**: Obwohl das Backend entsprechend dem Architekturstandard geplant ist, kann das geplante Tech-Stack (z. B. konkrete Sprachen/Frameworks) nicht der Interessenlage des Kunden entsprechen – Rückfrage nötig.
- **Interpretation des Umfangs:** Aus Anforderung 2–3 geht nicht es vollständig hervor, ob die Kommentare ausschließlich nachträglich hinzugefügt werden können, aber nicht änderbar sind. Interpretation nötig bzw. Klärungsbedarf.
- **Bindung an das Dateiformat**: Wenn die Dateianzeige im Browser nicht möglich ist (z. B. bei .zip), ist die Nutzbarkeit eingeschränkt – Klärung des Anzeigeformats eingrenzbar.
- **Performance**: Wenn große Dateien hochgeladen werden, kann dies die Übersichtlichkeit verschlechtern (keine Obergrenze definiert).
- **Abgrenzung zu bestehenden Produkten**: Nicht-wertende Ausführungen zu Tools wie Sharepoint, Confluence & Co. fehlen – der Kunde hat offenbar dennoch den Bedarf, eine eigene Lösung aufzubauen.

## Offene Fragen an den Auftraggeber

1. **Dateitypen und -größen:** Gibt es Vorgaben, welche Dateitypen und welche maximale Dateigröße unterstützt werden sollen? Braucht es eine Obergrenze?
2. **Dateianzeige:** Reicht das Herunterladen/Öffnen der Datei im Browser aus, oder müssen bestimmte Dateitypen (z. B. PDF, Bilder) direkt am Bildschirm gerendert werden?
3. **Kommentarbearbeitung:** Sollen Kommentare ausschließlich erstellt und angezeigt werden können, oder ist für die Zukunft eine Bearbeitung bzw. Löschung von Kommentaren oder Dateien geplant?
4. **Benutzerverwaltung:** Sollen explizite Benutzerkonten und Rechteverwaltung eingerichtet werden, oder gibt es nur eine gemeinsame Wissensdammlung für alle? Wer ist als Teil des Applikationsumfangs einzustufen (intern/extern)?
5. **Umgebungen:** Wird ein Konzept für ein ausgewiesenes Produktions- und Entwicklungsumfeld benötigt, oder reicht der aktuelle Stand (ein gemeinsames Deployment) aus?
6. **Bestandssysteme:** Soll das System mit einer bestehenden Systemlandschaft (z. B. DMS, Netzwerklaufwerk) integriert werden, oder ist es ein eigenständiges System?
