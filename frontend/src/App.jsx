import { useCallback, useEffect, useRef, useState } from "react";
import { getFiles, uploadFile } from "./api.js";
import AppShell from "./components/AppShell.jsx";
import FileDetail from "./components/FileDetail.jsx";
import FileList from "./components/FileList.jsx";
import { Alert, AlertDescription, AlertTitle } from "./components/ui/alert.jsx";
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [selectedFileId, setSelectedFileId] = useState(null);
  const fileInputRef = useRef(null);

  const loadFiles = useCallback(async () => {
    setIsError(false);
    setHasInitialLoaded(false);
    try {
      const data = await getFiles();
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

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileClick = (file) => {
    setSelectedFileId(file.id);
  };

  const handleFileSelection = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedFileName(file.name);
    setUploadError("");
    setUploadSuccess("");
    setIsUploading(true);
    try {
      const uploaded = await uploadFile(file);
      // Neue Datei ohne Seitenneuladen unmittelbar in die Liste aufnehmen
      // (Backend sortiert neueste zuerst; der Upload antwortet mit dem
      // frisch gespeicherten Metadatensatz).
      setFiles((current) =>
        current.some((entry) => entry.id === uploaded.id)
          ? current
          : [uploaded, ...current]
      );
      setSelectedFileName("");
      setHasInitialLoaded(true);
      setUploadSuccess("Datei erfolgreich hochgeladen.");
    } catch {
      setUploadError(
        "Datei konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const status = deriveListStatus(files, hasInitialLoaded, isError);

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Willkommen im Knowledge Hub</CardTitle>
          <CardDescription>
            Hier können Sie Dateien hochladen und mit Kommentaren anreichern.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              value={selectedFileName}
              onChange={() => {}}
              placeholder={isUploading ? "Wird hochgeladen …" : "Noch keine Datei ausgewählt"}
              readOnly
              aria-label="Ausgewählte Datei"
              className="sm:max-w-sm"
            />
            <Button
              type="button"
              onClick={handleSelectFile}
              disabled={isUploading}
              aria-busy={isUploading}
              className="relative min-h-11 min-w-11"
            >
              {isUploading && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-6.219-8.56"
                  />
                </svg>
              )}
              <span className="truncate">
                {isUploading ? "Wird hochgeladen …" : "Datei auswählen"}
              </span>
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
          {uploadSuccess && (
            <Alert className="mt-3 bg-primary/5">
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
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <AlertTitle>Upload erfolgreich</AlertTitle>
              <AlertDescription>{uploadSuccess}</AlertDescription>
            </Alert>
          )}
          {uploadError && (
            <Alert variant="destructive" className="mt-3 bg-destructive/5">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <AlertTitle>Upload fehlgeschlagen</AlertTitle>
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {selectedFileId === null && (
        <section aria-label="Dateiliste">
          <FileList
            status={status}
            files={files}
            onRetry={loadFiles}
            onSelect={handleFileClick}
          />
        </section>
      )}

      {selectedFileId !== null && (
        <FileDetail
          key={selectedFileId}
          fileId={selectedFileId}
          onBack={() => setSelectedFileId(null)}
        />
      )}
    </AppShell>
  );
}

export default App;
