# Sprint 6

**Ziel:** Frontend durch eine responsive Sidebar mit Dateiliste aufwerten, die die Navigation zur Detailansicht verbessert.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Sidebar-Grundgerüst in AppShell integrieren

- Typ: Feature
- Priorität: Mittel
- Schätzung: 1 Punkte

Erweitere die AppShell um eine Sidebar-Komponente, die auf Desktop-Breite links angezeigt wird und auf Mobile (unterhalb md) ausgeblendet wird. Die Sidebar enthält zunächst einen leeren Container mit Überschrift 'Dateien'. Verwende Tailwind-Klassen aus der bestehenden Skala.

## Akzeptanzkriterien
- AppShell rendert eine Sidebar neben dem Inhaltsbereich.
- Auf Bildschirmen < 768px ist die Sidebar nicht sichtbar.
- Die Sidebar hat eine feste Breite und nimmt auf größeren Screens etwa 1/4 der Breite ein.
- Der vorhandene Header bleibt unverändert.

## Voraussichtliche Dateien
- frontend/src/components/AppShell.jsx
- frontend/src/components/Sidebar.jsx

### Dateiliste in Sidebar mit Lade-, Leer- und Fehlerzuständen anzeigen

- Typ: Feature
- Priorität: Hoch
- Schätzung: 2 Punkte

Die Sidebar lädt über die bestehende API (GET /files) die Liste aller hochgeladenen Dateien und zeigt Name und Upload-Datum an. Für den Lade-, Leer- und Fehlerzustand werden die vorhandenen ListState-Komponenten verwendet. Ergänze Tests für den erfolgreichen Ladevorgang und die Darstellung der Zustände.

## Akzeptanzkriterien
- Die Sidebar zeigt nach erfolgreichem Laden alle Dateien mit Name und Upload-Datum.
- Während des Ladens wird der Ladezustand der ListState-Komponente angezeigt.
- Bei leerer Liste wird der Leerzustand, bei API-Fehler der Fehlerzustand dargestellt.
- Tests für den Erfolgsfall (Dateien werden angezeigt) sind ergänzt.

## Voraussichtliche Dateien
- frontend/src/components/Sidebar.jsx
- frontend/src/api.js
- frontend/src/App.test.jsx

### Dateiauswahl in Sidebar: Detailansicht öffnen, Hervorhebung und Zurück zur Startansicht

- Typ: Feature
- Priorität: Hoch
- Schätzung: 2 Punkte

In App.jsx wird ein State für die ausgewählte Datei (selectedFileId) eingeführt. Ein Klick auf eine Datei in der Sidebar setzt diesen State und die Hauptansicht wechselt zur Detailansicht der Datei. Die ausgewählte Datei wird in der Sidebar farblich hervorgehoben. Ein erneuter Klick auf die bereits ausgewählte Datei setzt den State zurück und zeigt wieder die Startansicht. Ergänze Tests für das Klick-Verhalten (Auswahl und Zurücksetzen).

## Akzeptanzkriterien
- Beim Klick auf eine Datei öffnet die Hauptansicht die Detailansicht dieser Datei.
- Die ausgewählte Datei ist in der Sidebar farblich hervorgehoben.
- Ein erneuter Klick auf die ausgewählte Datei führt zur Startansicht zurück.
- Tests für das Klick-Verhalten (Auswahl und Zurücksetzen) sind ergänzt.

## Voraussichtliche Dateien
- frontend/src/App.jsx
- frontend/src/components/Sidebar.jsx
- frontend/src/App.test.jsx

### Mobile Sidebar als Overlay mit Hamburger-Button umsetzen

- Typ: Feature
- Priorität: Mittel
- Schätzung: 2 Punkte

Auf Bildschirmen unter 768px wird die Sidebar als Overlay dargestellt. Im Header erscheint ein Hamburger-Button, der die Sidebar öffnet. Ein Klick auf den halbtransparenten Hintergrund oder einen Schließen-Button schließt sie wieder. Auf Desktop bleibt die Sidebar statisch sichtbar und der Hamburger-Button ist versteckt. Ergänze Tests für das Öffnen und Schließen des Overlays.

## Akzeptanzkriterien
- Auf Mobile ist ein Hamburger-Button im Header sichtbar.
- Beim Klick auf den Button öffnet sich die Sidebar als Overlay; Klick auf Hintergrund oder Schließen-Button schließt sie.
- Auf Desktop ist die Sidebar statisch sichtbar und der Hamburger-Button versteckt.
- Tests für das Umschalten des Overlays sind ergänzt.

## Voraussichtliche Dateien
- frontend/src/components/AppShell.jsx
- frontend/src/components/Sidebar.jsx

### Barrierefreiheit für mobile Sidebar ergänzen

- Typ: Feature
- Priorität: Mittel
- Schätzung: 1 Punkte

Die mobile Sidebar wird barrierefrei gestaltet: Der Hamburger-Button erhält ein aussagekräftiges aria-label, der Fokus wird beim Öffnen in die Sidebar verschoben und beim Schließen zurück zum Button geführt. Zusätzlich wird der Overlay-Hintergrund mit aria-hidden markiert und die Sidebar als Dialog oder entsprechendes ARIA-Rollenelement ausgezeichnet.

## Akzeptanzkriterien
- Der Hamburger-Button hat ein aussagekräftiges aria-label.
- Beim Öffnen wird der Fokus in die Sidebar verschoben, beim Schließen zurück zum Button.
- Der Overlay-Hintergrund ist mit aria-hidden markiert und die Sidebar hat eine passende ARIA-Rolle.
- Die Bedienung ist per Tastatur möglich (Escape schließt die Sidebar).

## Voraussichtliche Dateien
- frontend/src/components/AppShell.jsx
- frontend/src/components/Sidebar.jsx
