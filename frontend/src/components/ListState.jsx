import { Button } from "./ui/button.jsx";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert.jsx";
import { Card, CardContent } from "./ui/card.jsx";
import { Skeleton } from "./ui/skeleton.jsx";

/**
 * Gemeinsame Darstellung für Listen-Zustände (Laden / Leer / Fehler).
 *
 * FileList und KommentarListe haben das Erscheinungsbild für Lade-, Leer-
 * und Fehlerzustand bislang dupliziert. Diese Komponente kapselt das
 * einheitliche Muster: Lade-Platzhalter (Skeleton), zentrierter Leerzustand
 * und destructive Alert mit Retry-Button (beide auf shadcn/ui-Basis). Die
 * listen-spezifischen Angaben (Titel, Beschreibung, Icon, eigener Skeleton)
 * kommen über Props von der aufrufenden Liste.
 */

function WarningIcon() {
  return (
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
  );
}

function RetryIcon() {
  return (
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
  );
}

function DefaultLoading({ label = "Wird geladen …" }) {
  return (
    <div role="status" aria-live="polite" className="space-y-4">
      <p className="sr-only">{label}</p>
      <div className="space-y-3">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
      </div>
    </div>
  );
}

/**
 * Bündelt die drei Zustände. Welcher angezeigt wird, steuert `status`
 * (aus "loading" | "empty" | "error"). Der Lade-Platzhalter ist über
 * `loading` übersteuerbar (z. B. Karten-Skelett der Dateiliste), sonst
 * greift der schlanke Standard.
 */
export default function ListState({
  status,
  loading = null,
  loadingLabel = "Wird geladen …",
  emptyTitle,
  emptyDescription,
  emptyIcon,
  errorTitle = "Daten konnten nicht geladen werden",
  errorHint = "Bitte versuchen Sie es erneut.",
  onRetry,
  headingLevel: Heading = "h2",
}) {
  if (status === "loading") {
    return loading ?? <DefaultLoading label={loadingLabel} />;
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="bg-destructive/5">
        <WarningIcon />
        <AlertTitle>{errorTitle}</AlertTitle>
        <AlertDescription className="flex flex-wrap items-center gap-3">
          {errorHint}
          {onRetry && (
            <Button
              type="button"
              variant="secondary"
              onClick={onRetry}
              className="shrink-0"
            >
              <RetryIcon />
              Erneut versuchen
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "empty") {
    return (
      <Card className="p-6">
        <CardContent className="flex flex-col items-center pt-6 text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted"
            aria-hidden="true"
          >
            {emptyIcon}
          </div>
          <Heading className="mt-4 text-lg font-semibold text-card-foreground">
            {emptyTitle}
          </Heading>
          <p className="mt-2 text-sm text-muted-foreground">{emptyDescription}</p>
        </CardContent>
      </Card>
    );
  }

  return null;
}
