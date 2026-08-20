import { useCallback, useEffect, useState } from "react";
import { fetchFile, fetchKommentare } from "../api.js";
import { formatBytes, formatDate } from "./FileList.jsx";
import KommentarFormular from "./KommentarFormular.jsx";
import KommentarListe, { KOMMENTAR_STATUS } from "./KommentarListe.jsx";
import { Button } from "./ui/button.jsx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.jsx";
import { Skeleton } from "./ui/skeleton.jsx";

export const DETAIL_STATUS = {
  loading: "loading",
  error: "error",
  success: "success",
};

/**
 * Fehlerzustand der Datei-Detailansicht: shadcn/ui-Alert im gleichen Muster
 * wie die übrigen Fehlermeldungen, mit Retry-Button.
 */
function DetailError({ onRetry }) {
  return (
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
      <AlertTitle>Datei konnte nicht geladen werden</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center gap-3">
        Bitte versuchen Sie es erneut.
        <Button
          type="button"
          variant="secondary"
          onClick={onRetry}
          className="shrink-0"
        >
          Erneut versuchen
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Ladezustand der Datei-Detailansicht: Skeleton im Karten-Raster.
 */
function DetailLoading() {
  return (
    <Card>
      <CardHeader className="space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
}

/**
 * Detailansicht einer Datei: Dateiname (über GET /api/files/:id geladen),
 * Kommentarliste mit Lade-/Leer-/Fehlerzustand sowie das Formular zum
 * Anlegen neuer Kommentare. Ist responsiv und nutzt durchgehend
 * Tailwind-/shadcn/ui-Konventionen.
 */
export default function FileDetail({ fileId, onBack }) {
  const [file, setFile] = useState(null);
  const [detailStatus, setDetailStatus] = useState(DETAIL_STATUS.loading);
  const [kommentare, setKommentare] = useState([]);
  const [kommentarError, setKommentarError] = useState(false);
  const [hasKommentareLoaded, setHasKommentareLoaded] = useState(false);

  const loadFile = useCallback(async () => {
    setDetailStatus(DETAIL_STATUS.loading);
    setKommentare([]);
    setKommentarError(false);
    setHasKommentareLoaded(false);
    try {
      const data = await fetchFile(fileId);
      setFile(data);
      setDetailStatus(DETAIL_STATUS.success);
      try {
        const dataKommentare = await fetchKommentare(fileId);
        setKommentare(Array.isArray(dataKommentare) ? dataKommentare : []);
      } catch {
        setKommentare([]);
        setKommentarError(true);
      } finally {
        setHasKommentareLoaded(true);
      }
    } catch {
      setFile(null);
      setDetailStatus(DETAIL_STATUS.error);
    }
  }, [fileId]);

  useEffect(() => {
    loadFile();
  }, [loadFile]);

  const handleKommentarSaved = (kommentar) => {
    // Neuen Kommentar ohne Seiten-Reload direkt in die Liste aufnehmen
    // (Backend liefert älteste zuerst; POST hängt chronologisch an).
    setKommentare((current) => [...current, kommentar]);
  };

  const kommentarStatus = kommentarError
    ? KOMMENTAR_STATUS.error
    : !hasKommentareLoaded
      ? KOMMENTAR_STATUS.loading
      : kommentare.length === 0
        ? KOMMENTAR_STATUS.empty
        : KOMMENTAR_STATUS.success;

  const meta = file
    ? [formatBytes(file.size), formatDate(file.uploaded_at)].filter(Boolean)
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="min-h-11 min-w-11 gap-2 rounded-md px-3 text-muted-foreground hover:bg-transparent hover:text-primary"
          aria-label="Zurück zur Dateiliste"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Zurück zur Dateiliste
        </Button>
      </div>

      {detailStatus === DETAIL_STATUS.loading && <DetailLoading />}

      {detailStatus === DETAIL_STATUS.error && (
        <DetailError onRetry={loadFile} />
      )}

      {detailStatus === DETAIL_STATUS.success && file && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="truncate text-2xl" title={file.name}>
                {file.name}
              </CardTitle>
              {meta.length > 0 && <CardDescription>{meta.join(" · ")}</CardDescription>}
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Kommentare</CardTitle>
              <CardDescription className="truncate">
                zu {file.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <KommentarFormular
                fileId={file.id}
                onSaved={handleKommentarSaved}
              />
              <div aria-live="polite">
                <KommentarListe
                  status={kommentarStatus}
                  kommentare={kommentare}
                  onRetry={loadFile}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
