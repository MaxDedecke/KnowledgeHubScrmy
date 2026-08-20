/**
 * Einheitliche App-Shell: schlanker Seitenkopf (Header) mit Projektname und
 * darunter ein zentraler, auf Mobile/Desktop responsiver Inhaltsbereich.
 *
 * Sämtliche Farben und Abstände kommen aus der Tailwind-/shadcn/ui-Skala
 * (docs/design-konzept.md) – keine Ad-hoc-Werte (Hex/Pixel).
 */
export default function AppShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center px-4 md:px-6">
          <h1 className="text-xl font-semibold text-foreground">
            Knowledge Hub
          </h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
