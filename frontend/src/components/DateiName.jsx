import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip.jsx";

/**
 * Einheitliche Anzeige eines Dateinamens: kürzt lange Namen per
 * Tailwind-Truncate und zeigt – falls `withTooltip` gesetzt ist – den
 * vollständigen Namen in einem shadcn/ui-Tooltip beim Überfahren an.
 * `className` wird auf das sichtbare Name-Element angewendet (Standard
 * "truncate"); `title` kann das title-/aria-label-Attribut überschreiben.
 */
export default function DateiName({
  name,
  withTooltip = false,
  className = "truncate",
  title,
}) {
  const text = (
    <span className={className} title={title ?? name} aria-label={title ?? name}>
      {name}
    </span>
  );

  if (!withTooltip) {
    return text;
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>{text}</TooltipTrigger>
        <TooltipContent side="bottom">{name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
