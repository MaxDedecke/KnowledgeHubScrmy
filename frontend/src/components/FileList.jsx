// Dateiliste als Card-Layout mit eindeutig sichtbaren Zuständen für
// Laden, leere Liste und Fehler. "idle" dient als neutraler Vorzustand,
// bevor der erste Ladevorgang startet.
const STATUS = {
  loading: "loading",
  empty: "empty",
  error: "error",
  success: "success",
};

const STATUS_LABELS = {
  loading: "Wird geladen …",
  empty: "Noch keine Dateien vorhanden",
  error: "Dateiliste konnte nicht geladen werden",
  success: "Dateien geladen",
};

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
          <li
            key={key}
            className="animate-pulse rounded-lg border border-border bg-card p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="h-6 w-3/5 rounded bg-muted" />
              <div className="h-10 w-10 rounded-lg bg-muted" />
            </div>
            <div className="mt-6 h-4 w-2/5 rounded bg-muted" />
            <div className="mt-3 h-4 w-1/3 rounded bg-muted" />
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Leerer Zustand: zentrierter Hinweis, dass noch keine Dateien existieren.
 */
function EmptyList() {
  return (
    <section className="rounded-lg border border-dashed border-border bg-card p-6 text-center">
      <div
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted"
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 className="mt-4 text-lg font-semibold text-card-foreground">
        {STATUS_LABELS.empty}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Laden Sie Ihre erste Datei hoch, um den Wissensbestand zu starten.
      </p>
    </section>
  );
}

/**
 * Fehlerzustand: Alert mit verständlicher Meldung und Retry-Button.
 */
function ErrorList({ onRetry }) {
  return (
    <section
      role="alert"
      className="rounded-lg border border-destructive bg-card p-6"
    >
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
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
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">
              {STATUS_LABELS.error}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Bitte versuchen Sie es erneut.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
        </button>
      </div>
    </section>
  );
}

/**
 * Erfolgszustand: Cards je Datei mit Name, Größe und Upload-Zeitpunkt.
 */
function FileCards({ files }) {
  return (
    <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {files.map((file) => {
        const meta = [
          formatBytes(file.size),
          formatDate(file.created_at),
        ].filter(Boolean);
        return (
          <li key={file.id}>
            <article className="flex h-full items-start justify-between gap-4 rounded-lg border border-border bg-card p-6">
              <div className="min-w-0">
                <h3
                  className="truncate text-lg font-semibold text-card-foreground"
                  title={file.name}
                >
                  {file.name}
                </h3>
                {meta.length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {meta.join(" · ")}
                  </p>
                )}
              </div>
              <div
                className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground"
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
            </article>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Einstiegspunkt der Dateiliste: zeigt je nach `status` den passenden Zustand.
 * `status` darf nur Werte aus STATUS (loading, empty, error, success) tragen.
 */
export default function FileList({ status, files = [], onRetry }) {
  if (status === STATUS.loading) {
    return <LoadingList />;
  }
  if (status === STATUS.error) {
    return <ErrorList onRetry={onRetry} />;
  }
  if (status === STATUS.empty || files.length === 0) {
    return <EmptyList />;
  }
  return <FileCards files={files} />;
}
