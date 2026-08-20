/**
 * Einheitliche App-Shell: schlanker Seitenkopf (Header) mit Projektname und
 * darunter ein zentraler, auf Mobile/Desktop responsiver Inhaltsbereich.
 *
 * Optional rendert `sidebar` auf Desktop-Breite (~1/4 der Inhaltsbreite)
 * eine dauerhafte Seitenleiste links neben dem Inhalt; auf Mobile
 * (< md) bleibt sie ausgeblendet, bis das Overlay-Ticket sie umsetzt.
 *
 * Sämtliche Farben und Abstände kommen aus der Tailwind-/shadcn/ui-Skala
 * (docs/design-konzept.md) – keine Ad-hoc-Werte (Hex/Pixel).
 */

/**
 * Gemeinsamer Inhaltscontainer: die zentrale, wiederverwendbare Festlegung
 * für Inhaltsbreite und horizontale Padding-Skala (max-w-5xl = 1024px,
 * mx-auto, px-4 auf Mobile, px-6 ab md – siehe docs/design-konzept.md
 * „Spacing & Layout-Raster"). Header und Main nutzen dieselbe Klasse, damit
 * Dateiliste (FileList.jsx) und Datei-Detailansicht (FileDetail.jsx) beim
 * Ansichtswechsel denselben Inhaltsrahmen behalten – kein Breitensprung.
 */
export const CONTENT_CONTAINER = "mx-auto w-full max-w-5xl px-4 md:px-6";

export default function AppShell({ sidebar = null, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className={`flex h-14 items-center ${CONTENT_CONTAINER}`}>
          <h1 className="text-xl font-semibold text-foreground">
            Knowledge Hub
          </h1>
        </div>
      </header>

      <div className={CONTENT_CONTAINER}>
        <div className="flex flex-col items-start gap-6 py-6 md:flex-row md:py-8">
          {sidebar && (
            <aside
              aria-label="Seitenleiste"
              className="hidden w-full shrink-0 md:block md:w-64"
            >
              {sidebar}
            </aside>
          )}
          <main className="flex min-w-0 flex-1 flex-col gap-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
