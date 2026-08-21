# Sprint 13

**Ziel:** Die restliche Aufräumarbeit abschließen: Die CardDescription in der Datei-Detailansicht auf die gemeinsame DateiName-Komponente umstellen, damit alle Dateinamen-Anzeigen einheitlich truncate und Tooltip nutzen.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### CardDescription in FileDetail auf DateiName-Komponente umstellen _(zurückgestellt, wieder aufgenommen)_

- Typ: Chore
- Priorität: Mittel
- Schätzung: 1 Punkte

In frontend/src/components/FileDetail.jsx die CardDescription „zu {file.name}“ auf die gemeinsame Komponente frontend/src/components/DateiName.jsx umstellen (mit mit mitTooltip={true}), damit alle Dateinamen-Anzeigen in der Detailansicht identisch truncate und tooltippen; vorhandene Tests für DateName und FileDetail anpassen und ausführen.
