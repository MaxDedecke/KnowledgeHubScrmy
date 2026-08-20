import { useCallback, useEffect, useRef, useState } from "react";
import { fetchFiles } from "./api.js";
import FileList from "./components/FileList.jsx";
import { Button } from "./components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card.jsx";
import { Input } from "./components/ui/input.jsx";

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
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

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

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelection = (event) => {
    const file = event.target.files?.[0];
    setSelectedFileName(file ? file.name : "");
  };

  const status = deriveListStatus(files, hasInitialLoaded, isError);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 md:px-6">
          <h1 className="text-xl font-semibold text-foreground">
            Knowledge Hub
          </h1>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 md:px-6 md:py-8">
        <Card>
          <CardHeader>
            <CardTitle>Willkommen im Knowledge Hub</CardTitle>
            <CardDescription>
              Hier können Sie Dateien hochladen und mit Kommentaren anreichern.
              Die Kommentarfunktion folgt in einem der nächsten Schritte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                value={selectedFileName}
                onChange={() => {}}
                placeholder="Noch keine Datei ausgewählt"
                readOnly
                aria-label="Ausgewählte Datei"
                className="sm:max-w-sm"
              />
              <Button type="button" onClick={handleSelectFile}>
                Datei auswählen
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelection}
                className="hidden"
                aria-hidden="true"
                tabIndex={-1}
              />
            </div>
          </CardContent>
        </Card>

        <section aria-label="Dateiliste">
          <FileList status={status} files={files} onRetry={loadFiles} />
        </section>
      </main>
    </div>
  );
}

export default App;
