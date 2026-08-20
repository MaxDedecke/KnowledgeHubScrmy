import { useState } from "react";
import { createKommentar } from "../api.js";
import { Button } from "./ui/button.jsx";
import { Textarea } from "./ui/textarea.jsx";

/**
 * Formular zum Erfassen eines neuen Kommentars zu einer Datei.
 * Speichert über das Backend und meldet den gespeicherten Kommentar
 * über `onSaved` nach oben, damit die Liste ohne Seiten-Reload
 * aktualisiert werden kann.
 */
export default function KommentarFormular({ fileId, onSaved, onError }) {
  const [text, setText] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const trimmedText = text.trim();
  const canSubmit = trimmedText.length > 0 && !isPending;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!canSubmit || !fileId) {
      return;
    }
    setIsPending(true);
    setError("");
    try {
      const kommentar = await createKommentar(fileId, trimmedText);
      setText("");
      onSaved?.(kommentar);
    } catch {
      const message =
        "Kommentar konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.";
      setError(message);
      onError?.(message);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <label className="sr-only" htmlFor="kommentar-text">
        Neuer Kommentar
      </label>
      <Textarea
        id="kommentar-text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Kommentar zu dieser Datei eingeben …"
        disabled={isPending}
        aria-label="Kommentartext"
        rows={4}
      />
      <Button
        type="submit"
        disabled={!canSubmit}
        className="min-h-11 min-w-11 w-full sm:w-auto"
      >
        {isPending ? "Wird gespeichert …" : "Kommentar speichern"}
      </Button>
    </form>
  );
}
