import { cn } from "../../lib/utils";

/**
 * shadcn/ui-Skeleton: Lade-Platzhalter auf Basis des muted-Tokens.
 * Wird für den Ladezustand der Dateiliste (und später der Kommentarliste)
 * genutzt – siehe docs/design-konzept.md.
 */
function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
