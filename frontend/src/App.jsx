function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="h-14 border-b border-border bg-card">
        <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4 md:px-6">
          <h1 className="text-xl font-semibold text-foreground">
            Knowledge Hub
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-8">
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-2xl font-bold text-card-foreground">
            Willkommen im Knowledge Hub
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Hier können Sie künftig Dateien hochladen und mit Kommentaren
            anreichern. Die Upload- und Kommentarfunktionen folgen in einem der
            nächsten Schritte.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
