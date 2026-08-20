# Design-Konzept

## Look & Feel

Die Anwendung wirkt wie ein ruhiges, professionelles Werkzeug für den internen Wissensaufbau: klar, sachlich und aufgeräumt, ohne spielerische Effekte. Sie richtet sich an Mitarbeitende, die Dokumente ablegen und mit ergänzenden Hinweisen anreichern – die Oberfläche soll Vertrauen schaffen und den Inhalt in den Mittelpunkt stellen.

## Farbpalette

Als Tailwind-Tokens festgelegt:

| Token | Wert | Verwendung |
|---|---|---|
| `primary` | `#2563EB` (Blue 600) | Buttons, aktive Navigation, Links, Fokus-Ringe |
| `primary-foreground` | `#FFFFFF` | Text auf Primärflächen |
| `secondary` | `#F1F5F9` (Slate 100) | Sekundäre Buttons, Badges, Hover-Hintergründe |
| `secondary-foreground` | `#0F172A` (Slate 900) | Text auf Sekundärflächen |
| `accent` | `#E0E7FF` (Indigo 100) | Markierungen, ausgewählte Zeilen, Hinweisflächen |
| `accent-foreground` | `#1E293B` (Slate 800) | Text auf Akzentflächen |
| `background` | `#F8FAFC` (Slate 50) | Seitenhintergrund |
| `foreground` | `#0F172A` (Slate 900) | Standard-Text |
| `card` | `#FFFFFF` | Karten, Dialoge, Tabellen |
| `card-foreground` | `#0F172A` (Slate 900) | Text auf Karten |
| `muted` | `#F1F5F9` (Slate 100) | Deaktivierte Flächen, Platzhalter |
| `muted-foreground` | `#64748B` (Slate 500) | Sekundärtext, Metadaten |
| `border` | `#E2E8F0` (Slate 200) | Rahmen und Trennlinien |
| Erfolg (`success`) | `#16A34A` (Green 600) | Upload-Erfolg, positive Rückmeldungen |
| Fehler (`destructive`) | `#DC2626` (Red 600) | Fehlermeldungen, fehlgeschlagene Uploads |
| Warnung (`warning`) | `#D97706` (Amber 600) | Hinweise auf Einschränkungen |

Hex-Werte werden ausschließlich über diese Tokens verwendet; im Code gibt es keine verstreuten Farbangaben.

## Typografie

Schriftfamilie: `Inter` als Standard-Schrift für Fließtext, Headlines und UI-Elemente. System-Fallbacks: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.

Größen- und Gewichts-Skala als Tailwind-Tokens:

| Token | Größe | Gewicht | Verwendung |
|---|---|---|---|
| `text-xs` | 12px | 400 / 500 | Metadaten, Zeitstempel |
| `text-sm` | 14px | 400 / 500 | Sekundärtext, Tabellenzellen |
| `text-base` | 16px | 400 | Fließtext, Kommentartext |
| `text-lg` | 18px | 500 | Komponenten-Überschriften |
| `text-xl` | 20px | 600 | Dialog-Titel, Abschnittsüberschriften |
| `text-2xl` | 24px | 700 | Seitenüberschrift (Dateiliste) |

Zeilenabstand: `leading-6` für Fließtext, `leading-7` für längere Kommentare, `leading-tight` für Headlines.

## Spacing & Layout-Raster

- Basis-Spacing: Tailwind-Standardskala (`4px`-Schritte: `p-2`, `p-4`, `p-6`, `p-8`). Keine willkürlichen Pixelwerte.
- Seitenlayout: zentrierter Inhaltsbereich mit `max-w-5xl` und `mx-auto`; horizontaler Abstand `px-4` auf Mobile, `px-6` auf Desktop.
- Karten: `rounded-lg border bg-card p-6`.
- Abstände zwischen Listeneinträgen: `gap-4` bei Karten, `divide-y` bei Tabellenzeilen.
- Buttons: `h-10 px-4 py-2`, kompakte Variante `h-9 px-3`.
- Dialoge: `max-w-lg` für Kommentar- und Upload-Dialoge.

## Kernkomponenten

Durchgängig genutzte shadcn/ui-Komponenten:

- **Button** – primär für Upload und Kommentar speichern, sekundär für Abbrechen
- **Card** – Darstellung der Dateiliste, je Datei eine Karte mit Metadaten
- **Dialog** – Upload-Dialog zur Dateiauswahl, Dialog zur Kommentar-Erfassung
- **Input / Label** – Formularfeld für die Kommentar-Eingabe
- **Textarea** – mehrzeilige Kommentar-Erfassung
- **Table** – alternative kompakte Listenansicht der Dateien (bei vielen Einträgen)
- **Badge** – Kennzeichnung von Dateityp oder Upload-Status
- **Alert** – Fehler- und Hinweismeldungen bei Upload oder Laden
- **Skeleton** – Ladezustand für Dateiliste und Kommentarliste
- **EmptyState** (als Komposition aus Card, Icon und Text) – leerer Zustand ohne Dateien bzw. ohne Kommentare

## Zustände

- **Leer:** In der Dateiliste erscheint eine zentrierte leere Ansicht mit Icon, kurzer Erklärung ("Noch keine Dateien vorhanden") und direktem Upload-Button. Die Kommentarliste einer Datei zeigt bei null Kommentaren einen dezenten Hinweis ("Noch keine Kommentare – fügen Sie den ersten hinzu").
- **Lädt:** Beim initialen Laden der Dateiliste und der Kommentare erscheinen Skeleton-Platzhalter in Kartenform. Upload- und Speichern-Buttons zeigen während der Aktion einen Spinner und sind deaktiviert, um Doppelklicks zu verhindern.
- **Fehler:** Fehler beim Laden oder Speichern erscheinen als Alert mit Fehlersymbol und verständlicher Meldung (z. B. "Datei konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut."). Ein Retry-Button ist bei Ladefehlern vorhanden.

## Responsive-Verhalten

- **Mobile (< 768px):** Dateiliste wird als einspaltige Kartenliste dargestellt; die Kopfzeile reduziert sich auf einen Titel und einen durchgängig sichtbaren Upload-Button. Dialoge belegen fast die volle Breite (`max-w-full` mit `p-4`).
- **Desktop (≥ 768px):** Dateiliste erscheint als mehrspaltige Kartenliste (`md:grid-cols-2` bzw. `lg:grid-cols-3`) oder als Tabelle; Kommentarbereich wird als eigene Spalte neben der Dateiliste angezeigt, bei schmalen Fenstern darunter.
- Alle interaktiven Elemente haben eine Mindestgröße von 44×44 Pixeln für Touch-Bedienung.
- Am oberen Rand bleibt eine fixierte schmale Kopfzeile (`h-14`) mit optionalem Firmenlogo und Upload-Button, damit die zentrale Aktion immer erreichbar ist.
