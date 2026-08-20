import { Button } from "./ui/button.jsx";
import { Card, CardContent } from "./ui/card.jsx";
import { formatDate } from "./FileList.jsx";
import ListState from "./ListState.jsx";

export const SIDEBAR_STATUS = {
  loading: "loading",
  empty: "empty",
  error: "error",
  success: "success",
};

/**
 * Dokument-Icon – gleiche Form wie in der Dateiliste (FileList.jsx),
 * in Sidebar-Größe bzw. für den Leerzustand.
 */
function DocumentIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 text-muted-foreground ${className}`}
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

/**
 * Datei-Einträge der Sidebar als Navigationsliste: Ein Klick reicht die
 * Datei per `onSelect` nach oben (App.jsx setzt damit `selectedFileId` und
 * öffnet die Detailansicht). Die aktuell ausgewählte Datei wird mit der
 * accent-Fläche hervorgehoben (Design-Konzept „accent" für ausgewählte
 * Zeilen) und per aria-current markiert.
 */
function SidebarList({ files, selectedFileId, onSelect }) {
  return (
    <ul className="space-y-1">
      {files.map((file) => {
        const selected = selectedFileId === file.id;
        const datum = formatDate(file.created_at);
        return (
          <li key={file.id}>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onSelect?.(file)}
              aria-label={`Kommentare für ${file.name} anzeigen`}
              aria-current={selected ? "true" : undefined}
              className={`flex h-auto min-h-11 w-full items-center justify-start gap-2 rounded-md px-3 py-3 text-left ${
                selected
                  ? "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                  : "text-card-foreground hover:bg-secondary hover:text-card-foreground"
              }`}
            >
              <DocumentIcon />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">
                  {file.name}
                </span>
                {datum && (
                  <span className="block truncate text-xs text-muted-foreground">
                    {datum}
                  </span>
                )}
              </span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Dauerhafte Seitenleiste (Sprint 6) als Hauptnavigation: zeigt die
 * Dateienliste und reicht einen Klick per `onSelect` an App.jsx weiter
 * (dort wird selectedFileId gesetzt und die Detailansicht geöffnet).
 * Liste, Status und Auswahl kommen als Props von der App – Laden, Leer
 * und Fehler verwendet die gemeinsame ListState-Komponente im Muster der
 * Dateiliste. Auf Mobile (< md) bleibt die Sidebar ausgeblendet
 * (AppShell rendert sie erst ab md; Overlay folgt als eigenes Ticket).
 */
export default function Sidebar({
  files = [],
  status = SIDEBAR_STATUS.loading,
  selectedFileId = null,
  onSelect,
  onRetry,
}) {
  return (
    <Card className="p-4">
      <CardContent className="p-0">
        <h2 className="mb-3 px-2 text-lg font-semibold text-foreground">
          Dateien
        </h2>

        {status === SIDEBAR_STATUS.loading && (
          <ListState
            status="loading"
            loadingLabel="Dateien werden geladen …"
            headingLevel="h3"
          />
        )}

        {status === SIDEBAR_STATUS.error && (
          <ListState
            status="error"
            errorTitle="Dateien konnten nicht geladen werden"
            errorHint="Bitte versuchen Sie es erneut."
            onRetry={onRetry}
            headingLevel="h3"
          />
        )}

        {status === SIDEBAR_STATUS.empty && (
          <ListState
            status="empty"
            emptyTitle="Noch keine Dateien"
            emptyDescription="Hochgeladene Dateien erscheinen hier und lassen sich per Klick öffnen."
            emptyIcon={<DocumentIcon className="h-6 w-6" />}
            headingLevel="h3"
          />
        )}

        {status === SIDEBAR_STATUS.success && files.length > 0 && (
          <SidebarList
            files={files}
            selectedFileId={selectedFileId}
            onSelect={onSelect}
          />
        )}
      </CardContent>
    </Card>
  );
}
