import ListState from "./ListState.jsx";
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
 * Sprechblasen-Icon für den Leerzustand – gleiches Muster wie beim
 * Datei-Leerzustand.
 */
function EmptyCommentIcon() {
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
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
      />
    </svg>
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
    return <ListState status="loading" loadingLabel={STATUS_LABELS.loading} />;
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
  if (status === "empty" || kommentare.length === 0) {
    return (
      <ListState
        status="empty"
        emptyTitle={STATUS_LABELS.empty}
        emptyDescription="Fügen Sie den ersten Kommentar zu dieser Datei hinzu."
        emptyIcon={<EmptyCommentIcon />}
        headingLevel="h3"
      />
    );
  }
  return <KommentarCards kommentare={kommentare} />;
}
