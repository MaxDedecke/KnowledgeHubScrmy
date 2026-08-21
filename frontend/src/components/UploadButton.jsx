import { useRef } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert.jsx";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";

/**
 * Hinweistext zu den Upload-Beschränkungen: erlaubte Dateitypen und
 * Größenlimit (ALLOWED_MIME_TYPES, MAX_FILE_SIZE = 30 MB).
 */
export const ALLOWED_UPLOAD_HINT =
  "Erlaubte Dateitypen: PNG, JPEG, PDF, TXT · max. 30 MB";

/**
 * Upload-Button mit Dateiauswahl, Hinweis zu den erlaubten Dateitypen und
 * der 30-MB-Grenze sowie Alert für Fehler- und Erfolgsmeldungen.
 *
 * Props:
 * - selectedFileName: Name der zuletzt ausgewählten Datei (Anzeige im Input)
 * - isUploading: true, während der Upload läuft (Button deaktiviert, Spinner)
 * - uploadError: konkrete Fehlermeldung des Backends (oder leer)
 * - uploadSuccess: Erfolgsmeldung nach einem Upload (oder leer)
 * - onFileSelected: erhält die ausgewählte Datei über das versteckte
 *   <input type="file"> (change-Event), führt die tatsächliche Upload-Logik aus
 */
export default function UploadButton({
  selectedFileName,
  isUploading,
  uploadError,
  uploadSuccess,
  onFileSelected,
}) {
  const fileInputRef = useRef(null);

  const handleSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          value={selectedFileName}
          onChange={() => {}}
          placeholder={
            isUploading ? "Wird hochgeladen …" : "Noch keine Datei ausgewählt"
          }
          readOnly
          aria-label="Ausgewählte Datei"
          className="sm:max-w-sm"
        />
        <Button
          type="button"
          onClick={handleSelect}
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
          onChange={onFileSelected}
          className="hidden"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{ALLOWED_UPLOAD_HINT}</p>
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
    </div>
  );
}
