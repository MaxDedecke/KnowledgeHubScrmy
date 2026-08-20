import { useState } from "react";
import { downloadFile } from "../api.js";
import { Button } from "./ui/button.jsx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert.jsx";
import {
  Card,
  CardDescription,
  CardHeader,
} from "./ui/card.jsx";
import { Skeleton } from "./ui/skeleton.jsx";
import ListState from "./ListState.jsx";

const STATUS_LABELS = {
  loading: "Wird geladen …",
  empty: "Noch keine Dateien vorhanden",
  error: "Dateiliste konnte nicht geladen werden",
  success: "Dateien geladen",
};

/**
 * Dokument-Icon für den Leerzustand der Dateiliste – gleiches Muster wie
 * beim Kommentar-Leerzustand.
 */
function EmptyFileIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-muted-foreground"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

export function formatBytes(size) {
  if (typeof size !== "number" || Number.isNaN(size) || size < 0) {
    return "Unbekannte Größe";
  }
  if (size < 1024) {
    return `${size} B`;
  }
  const formatDecimal = (value) =>
    value.toLocaleString("de-DE", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  if (size < 1024 * 1024) {
    return `${formatDecimal(size / 1024)} kB`;
  }
  return `${formatDecimal(size / (1024 * 1024))} MB`;
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "short" });
}

/**
 * Ladezustand: Skeleton-Platzhalter in Kartenform (siehe Design-Konzept).
 */
function LoadingList() {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <p className="sr-only">{STATUS_LABELS.loading}</p>
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[0, 1, 2, 3].map((key) => (
          <li key={key}>
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <Skeleton className="h-6 w-3/5" />
                  <Skeleton className="h-4 w-2/5" />
                </div>
                <Skeleton className="h-10 w-10 rounded-lg" />
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Erfolgszustand: Cards je Datei mit Name, Größe, Upload-Zeitpunkt und
 * Download-Button. Ein fehlgeschlagener Download zeigt eine Fehlermeldung;
 * während des Downloads ist der Button deaktiviert.
 */
function FileCards({ files, onSelect }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isDownloadingId, setIsDownloadingId] = useState(null);

  const handleDownload = async (file) => {
    setErrorMessage("");
    setIsDownloadingId(file.id);
    try {
      await downloadFile(file.id);
    } catch {
      setErrorMessage(
        `„${file.name}" konnte nicht heruntergeladen werden. Die Datei ist möglicherweise nicht mehr vorhanden.`
      );
    } finally {
      setIsDownloadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="bg-destructive/5">
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
          <AlertTitle>Download fehlgeschlagen</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {files.map((file) => {
          const meta = [
            formatBytes(file.size),
            formatDate(file.created_at),
          ].filter(Boolean);
          const downloading = isDownloadingId === file.id;
          return (
            <li key={file.id}>
              <Card className="h-full">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onSelect?.(file)}
                      aria-label={`Kommentare für ${file.name} anzeigen`}
                      className="h-auto rounded-md p-0 text-left font-semibold text-card-foreground hover:bg-transparent hover:text-primary"
                    >
                      <span className="truncate" title={file.name}>
                        {file.name}
                      </span>
                    </Button>
                    {meta.length > 0 && (
                      <CardDescription className="mt-1">
                        {meta.join(" · ")}
                      </CardDescription>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => handleDownload(file)}
                      disabled={downloading}
                      aria-label={`${file.name} herunterladen`}
                      title="Datei herunterladen"
                      className="h-11 w-11"
                    >
                      {downloading ? (
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
                      ) : (
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
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      )}
                    </Button>
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"
                      aria-hidden="true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Einstiegspunkt der Dateiliste: zeigt je nach `status` den passenden Zustand.
 * `status` darf nur Werte aus LIST_STATUS (loading, empty, error, success)
 * tragen; siehe App.jsx.
 */
export default function FileList({ status, files = [], onRetry, onSelect }) {
  if (status === "loading") {
    return <ListState status="loading" loading={<LoadingList />} />;
  }
  if (status === "error") {
    return (
      <ListState
        status="error"
        errorTitle={STATUS_LABELS.error}
        onRetry={onRetry}
      />
    );
  }
  if (status === "empty" || files.length === 0) {
    return (
      <ListState
        status="empty"
        emptyTitle={STATUS_LABELS.empty}
        emptyDescription="Laden Sie Ihre erste Datei hoch, um den Wissensbestand zu starten."
        emptyIcon={<EmptyFileIcon />}
      />
    );
  }
  return <FileCards files={files} onSelect={onSelect} />;
}
