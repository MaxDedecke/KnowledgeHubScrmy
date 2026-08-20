import { useCallback, useEffect, useState } from "react";
import { fetchFiles } from "./api.js";
import FileList from "./components/FileList.jsx";

export const LIST_STATUS = {
  idle: "idle",
  loading: "loading",
  empty: "empty",
  error: "error",
  success: "success",
};

function deriveListStatus(files, hasInitialLoaded, isError) {
  if (!hasInitialLoaded) return LIST_STATUS.loading;
  if (isError) return LIST_STATUS.error;
  if (files.length === 0) return LIST_STATUS.empty;
  return LIST_STATUS.success;
}

function App() {
  const [files, setFiles] = useState([]);
  const [isError, setIsError] = useState(false);
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);

  const loadFiles = useCallback(async () => {
    setIsError(false);
    setHasInitialLoaded(false);
    try {
      const data = await fetchFiles();
      setFiles(Array.isArray(data) ? data : []);
    } catch {
      setFiles([]);
      setIsError(true);
    } finally {
      setHasInitialLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Für die kommende Upload-Komponente: Neue Dateien ohne Seitenneuladen
  // direkt an den Anfang der Liste aufnehmen (passend zur Backend-Sortierung,
  // neueste zuerst).
  const addFiles = useCallback((newFiles) => {
    setFiles((current) => [...newFiles, ...current]);
  }, []);

  const status = deriveListStatus(files, hasInitialLoaded, isError);

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
            Hier können Sie Dateien hochladen und mit Kommentaren anreichern.
            Die Kommentarfunktion folgt in einem der nächsten Schritte.
          </p>
        </section>

        <section className="mt-8" aria-label="Dateiliste">
          <FileList status={status} files={files} onRetry={loadFiles} />
        </section>
      </main>
    </div>
  );
}

export default App;
