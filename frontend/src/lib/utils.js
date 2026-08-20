import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * fasst Klassen konditional zusammen unnd löst Tailwind-"Konflikte"
 * (z.B. "px-4 px-6") zugunsten der luten Klasse.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
