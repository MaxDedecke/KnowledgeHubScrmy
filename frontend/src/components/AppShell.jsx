import { Button } from "./ui/button.jsx";

/**
 * Einheitliche App-Shell: schlanker Seitenkopf (Header) mit Toggle für die
 * mobile Navigation und darunter ein zentraler, auf Mobile/Desktop
 * responsiver Inhaltsbereich.
 *
 * Hauptnavigation ist die Sidebar (Sprint 6):
 * - Desktop (>= md): dauerhaft sichtbares <aside> links neben dem Inhalt.
 * - Mobile (< md): als Off-Canvas-Panel über die `sidebarOpen`-Prop ein-
 *   und ausklappbar (Hamburger im Header, Schließen-Button und Klick auf
 *   den Backdrop schließen das Panel). Das Panel wird nur geöffnet
 *   gerendert, damit es auf Desktop nie doppelt im DOM steht.
 *
 * `sidebarOpen`/`onToggleSidebarOpen` verwaltet App.jsx, damit Klicks auf
 * einen Dateieintrag das mobile Panel selbst schließen können.
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

export default function AppShell({
  sidebar = null,
  sidebarOpen = false,
  onToggleSidebarOpen,
  children,
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className={`flex h-14 items-center gap-3 ${CONTENT_CONTAINER}`}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onToggleSidebarOpen?.(true)}
            aria-label="Navigation öffnen"
            aria-expanded={sidebarOpen}
            aria-haspopup="true"
            className="min-h-11 min-w-11 text-muted-foreground md:hidden"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
          <h1 className="text-xl font-semibold text-foreground">
            Knowledge Hub
          </h1>
        </div>
      </header>

      {sidebar && sidebarOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-20 md:hidden"
        >
          <div
            className="absolute inset-0 bg-foreground/40"
            onClick={() => onToggleSidebarOpen?.(false)}
            aria-hidden="true"
            data-testid="sidebar-backdrop"
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-background shadow-xl">
            <div className="flex justify-end px-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onToggleSidebarOpen?.(false)}
                aria-label="Navigation schließen"
                className="min-h-11 min-w-11 text-muted-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </Button>
            </div>
            <div className="p-4">
              <aside aria-label="Seitenleiste">{sidebar}</aside>
            </div>
          </div>
        </div>
      )}

      <div className={CONTENT_CONTAINER}>
        <div className="flex flex-col items-start gap-6 py-6 md:flex-row md:py-8">
          {sidebar && (
            <aside
              aria-label="Seitenleiste"
              className="hidden w-full shrink-0 md:block md:w-72"
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
