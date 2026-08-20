/**
 * Einheitliche App-Shell: schlanker Seitenkopf (Header) mit Projektname und
 * darunter ein zentraler, auf Mobile/Desktop responsiver Inhaltsbereich.
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

export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className={`flex h-14 items-center ${CONTENT_CONTAINER}`}>
          <h1 className="text-xl font-semibold text-foreground">
            Knowledge Hub
          </h1>
        </div>
      </header>

      <main className={`flex flex-col gap-6 py-6 md:py-8 ${CONTENT_CONTAINER}`}>
        {children}
      </main>
    </div>
  );
}
