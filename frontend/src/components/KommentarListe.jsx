import { Card, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert.jsx";
import { Skeleton } from "./ui/skeleton.jsx";
import { formatDate } from "./FileList.jsx";

export const KOMMENTAR_STATUS = {
  loading: "loading",
  empty: "empty",
  error: "error",
  success: "success",
};

const STATUS_LABELS = {
  loading: "Kommentare werden geladen …",
  empty: "Noch keine Kommentare",
  error: "Kommentare konnten nicht geladen werden",
};

/**
 * Ladezustand: Skeleton-Platzhalter in Kartenform.
 */
function LoadingList() {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <p className="sr-only">{STATUS_LABELS.loading}</p>
      {[0, 1, 2].map((key) => (
        <div key={key} className="space-y-3">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
        </div>
      ))}
    </div>
  );
}

/**
 * Leerer Zustand: dezenter Hinweis, dass noch keine Kommentare existieren.
 */
function EmptyList() {
  return (
    <Card className="p-6">
      <CardContent className="flex flex-col items-center pt-6 text-center">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-muted"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-card-foreground">
          {STATUS_LABELS.empty}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Fügen Sie den ersten Kommentar zu dieser Datei hinzu.
        </p>
      </CardContent>
    </Card>
  );
}

/**
 * Fehlerzustand: Alert im gleichen Muster wie die Download-Fehlermeldung,
 * mit verständlicher Meldung und Retry-Button.
 */
function ErrorList({ onRetry }) {
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
      <AlertTitle>{STATUS_LABELS.error}</AlertTitle>
      <AlertDescription className="flex flex-wrap items-center gap-3">
        Bitte versuchen Sie es erneut.
        <Button
          type="button"
          variant="secondary"
          onClick={onRetry}
          className="shrink-0"
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
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Erneut versuchen
        </Button>
      </AlertDescription>
    </Alert>
  );
}

/**
 * Erfolgszustand: chronologische Kommentarliste mit Text und Zeitstempel.
 */
function KommentarCards({ kommentare }) {
  return (
    <ul className="space-y-4">
      {kommentare.map((kommentar) => (
        <li key={kommentar.id}>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <p className="min-w-0 flex-1 whitespace-pre-wrap text-base leading-7 text-card-foreground">
                {kommentar.text}
              </p>
              <span
                className="mt-1 shrink-0 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                aria-label="Zeitpunkt des Kommentars"
              >
                {formatDate(kommentar.created_at)}
              </span>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Einstiegspunkt der Kommentarliste: zeigt je nach `status` den passenden
 * Zustand. `status` darf nur Werte aus Kommentar_STATUS tragen.
 */
export default function KommentarListe({ status, kommentare = [], onRetry }) {
  if (status === "loading") {
    return <LoadingList />;
  }
  if (status === "error") {
    return <ErrorList onRetry={onRetry} />;
  }
  if (status === "empty" || kommentare.length === 0) {
    return <EmptyList />;
  }
  return <KommentarCards kommentare={kommentare} />;
}
