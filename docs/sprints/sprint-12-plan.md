# Sprint 12

**Ziel:** Die Aufräumarbeit abschließen: Dateinamen-Ellipsis und Tooltip in eine gemeinsame Komponente überführen, damit alle Anzeigen einheitlich bleiben.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Datei-Namen-Ellipsis und Tooltip in gemeinsame Komponente überführen _(zurückgestellt, wieder aufgenommen)_

- Typ: Chore
- Priorität: Mittel
- Schätzung: 1 Punkte

In src/components eine kleine Komponente DateiName/FileName anlegen, den einen langen Dateinamen per Tailwind-Truncate kürzt und optional mit dem shadcn/ui-Tooltip versehen. Sidebar, Dateiliste und Detailansicht (FileDetail.jsx, Sidebar.jsx, Dateiliste im Hauptbereich) auf diese Komponente umstellen, damit Ellipsis- und Tooltip-Verhalten überall identisch ist.

### Common DateiNamen-Komponente für Ellipsis and Tooltip (Ausgehend vom zurückgestellten Ticket)

- Typ: Chore
- Priorität: Mittel
- Schätzung: 2 Punkte

Übertrage das bestehende Muster (truncate + title/Tooltip) für überlange Dateinamen in eine wiederverwendbare Komponente und stelle Sidebar, Dateiliste und Detailansicht darauf um.

## Akzeptanzkriterien
- Die neue Komponente DateiName/FileName verkürzt lange Dateinamen per Tailwind-Truncate und zeigt bei Bedarf den vollständigen Namen per Tooltip/Alternativtext.
- Sidebar.jsx, DateListe.jsx (Hauptbereich) und FileDetail.jsx nutzen ausschließlich diese Komponente.
- Die Frontend-Tests bleiben grün und erfassen den neuen Baustein (falls notwendig).

## Voraussichtliche Dateien
- frontend/src/components/DateiName.jsx
- frontend/src/components/Sidebar.jsx
- frontend/src/components/FileDetail.jsx
- frontend/src/components/FileList.jsx
