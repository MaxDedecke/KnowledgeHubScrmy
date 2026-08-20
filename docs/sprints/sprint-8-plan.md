# Sprint 8

**Ziel:** Die restliche Aufräumarbeit abschließen – lange Dateinamen in der Detailansicht einheitlich mit Ellipsis und Tooltip versehen, sodass alle Listen den gleichen Umgang mit überlangen Namen zeigen.

**Geplant von:** Pia Ostermann (Product Owner)

## Tickets

### Dateinamen in der Detailansicht mit Ellipsis und Tooltip versehen _(zurückgestellt, wieder aufgenommen)_

- Typ: Chore
- Priorität: Niedrig
- Schätzung: 1 Punkte

In der Datei-Detailansicht (vermutlich in `FileDetail.jsx` oder einer zugehörigen Headline-Komponente) wird der Dateiname als Heading angezeigt. Fehlt dort die `truncate`-Klasse und das `title`-Attribut, um das Muster aus Sidebar und Dateiliste einheitlich zu übernehmen: Überlange Namen sollen aus laufen auf einer Zeile gehalten werden und per Tooltip vollständig lesbar sein. Dazu passende Tailwind-Klassen (`truncate`, gegebenenfalls `max-w-…`) ergänzen und das `title`-Attribut hinzufügen.
