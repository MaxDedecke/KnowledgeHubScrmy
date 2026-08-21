# Sprint 16

**Ziel:** Design-Tokens und Interaktions-Feedback frontendweit vereinheitlichen, um das visuelle Erscheinungsbild und die Barrierefreiheit abzurunden.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Design-Tokens in tailwind.config zentralisieren und verbleibende Hex-Werte/Font-Größen-Ausnahmen ersetzen _(zurückgestellt, wieder aufgenommen)_

- Typ: Chore
- Priorität: Mittel
- Schätzung: 1 Punkte

Quere Suche über alle JSX-/CSS-Dateien im Frontend: npm run go durch jede Komponente (Dateiliste, Detailansicht, Sidebar, Formulare) und ersetze verbliebene Hex-Farben, Pixel-pt. Ansichtsvarianten durch die in tailwind.config angelegten Theme-Variablen (colors, spacing, fontSizes). Wo kein fertiges Token passt, in tailwind.config ergänzen und wiederverwenden – nicht facholing ausweichen.

### Interaktions-Feedback für alle klickbaren Elemente prüfen und vereinheitlichen (hover, focus-visible, disabled, loading) _(zurückgestellt, wieder aufgenommen)_

- Typ: Chore
- Priorität: Mittel
- Schätzung: 1 Punkte

Klickbare Elemente durchgehen und nachstandardisieren: UploadButton (bereits mit Ladezustand), Button zum Kommentar, Download-Link, Datei-Einträge in Sidebar und Dateiliste sowie Icon-Buttons. Sicherstellen, dass alle gleichen sichtbaren Zustandson hover/focus-visible (Ring in einer akzentfarben) und im disabled/loading-Zustand auf dieselbe Art verblasst sind – sie sollten den Tailwind/Shadcn-Varianten folgen, nicht individuellen Klassenvarianten. Dazu Interaktions-Zustand in Code kompakt gegenprüfen und bei Abweichung auf einheitliche Klassen ziehen.
