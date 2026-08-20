# Sprint 4

**Ziel:** Offene Verbesserungen aus dem Backlog abschließen und die Datei-Detailansicht um einen direkten Download-Link erweitern, damit der Kunde beim Öffnen einer Datei sofort alle Aktionen verfügbar hat.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Interaktive Elemente in App.jsx und FileDetail.jsx auf 44x44-Px-Mindestgröße bringen _(zurückgestellt, wieder aufgenommen)_

- Typ: Bug
- Priorität: Hoch
- Schätzung: 1 Punkte

Der „Zurück“-Button in FileDetail.jsx wurde bereits auf die Mindestgröße 44×44 angepasst. Dieselbe Mindestgröße auch für den Upload-Button (App.jsx) und den Kommentar-Submit-Button (FileDetail.jsx) prüfen und nötigenfalls per min-h-11/min-w-11 herstellen, inkl. Icon- und Textausrichtung.

### Einheitliche Content-Breite und Layout-Rhythmus für Dateiliste und Detailansicht festlegen _(zurückgestellt, wieder aufgenommen)_

- Typ: Chore
- Priorität: Mittel
- Schätzung: 1 Punkte

In AppShell.jsx eine gemeinsame Container-Breite und horizontale Padding-Skala festlegen; Dateiliste (FileList.jsx) und Datei-Detailansicht (FileDetail.jsx) sollen denselben Inhaltscontainer nutzen, damit beim Wechsel zwischen den Ansichten kein deutlicher Breitensprung entsteht.

### Gemeinsame Empty-State- und Alert-Darstellung in einer kleinen Komponente zusammenfassen _(zurückgestellt, wieder aufgenommen)_

- Typ: Chore
- Priorität: Niedrig
- Schätzung: 1 Punkte

Nachdem die Zustände inhaltlich auf shadcn/ui-Alert vereinheitlicht wurden, sind die Muster in FileList.jsx und KommentarListe.jsx noch dupliziert. Als Kompaktoperation eine shared „ListState“-Komponente (Laden/Leer/Fehler) unter frontend/src/components anlegen, die beide Listen nutzen – vereiter ist später die Pflege des einheitlichen Erscheinungsbilds.

### Download-Link in der Datei-Detailansicht ergänzen

- Typ: Feature
- Priorität: Mittel
- Schätzung: 1 Punkte

In der Datei-Detailansicht (FileDetail.jsx) einen Download-Button/Link einfügen, der den bestehenden Backend-Endpunkt GET /files/:id nutzt. Nach dem Klick wird die Datei heruntergeladen. Der Link soll den Dateinamen anzeigen und sich an das bestehende Design (shadcn-Button, Mindestfläche 44×44) anlehnen.

## Akzeptanzkriterien
- Die Datei-Detailansicht zeigt einen sichtbaren Download-Link/Button mit dem Dateinamen.
- Ein Klick darauf lädt die Datei über die bestehende Download-API herunter.
- Der Button erfüllt die Mindestgröße 44×44 px und ist über Tastatur bedienbar.
- Die bestehende Backend-Route bleibt unverändert; der Link bindet sie nur ein.

## Voraussichtliche Dateien
- frontend/src/components/FileDetail.jsx
- frontend/src/api.js
- frontend/src/__tests__/api.test.js
