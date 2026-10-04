/**
 * @file /components/models/ImportExport.tsx
 * @description File picker that loads a JSON document into the editor.
 * @architecture Next.js App Router (Client Component)
 * @ai-hint editor.commands.setContent expects the second argument for emitUpdate; parsed JSON is untrusted, so validate before it reaches the schema.
 * @ai-agent Every failure path reports inline through `role="alert"` instead of `window.alert()`,
 *            which the quality gate and WCAG both forbid here. `setContent` returns false when a
 *            transaction is rejected (for example a module's character ceiling), so a successful
 *            `JSON.parse` is NOT evidence that the import landed — check the return value or the
 *            user gets silence on both success and failure.
 * @ai-agent The file input clears its own `value` after each attempt so re-selecting the same
 *            file fires `change` again; without that the second attempt looks like a no-op.
 * @dependencies Requires type Editor, React FileReader, DialogClose from @/ui/dialog.
 */

"use client";

import { useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { DialogClose } from "@/ui/dialog";

/** Largest import we accept, so a stray file cannot lock the main thread parsing it. */
const MAX_IMPORT_BYTES = 1_000_000;

type Feedback = { kind: "error" | "success"; message: string } | null;

export function Import({ editor }: { editor: Editor }) {
  const [feedback, setFeedback] = useState<Feedback>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const file = input.files?.[0];
    // Always allow re-picking the same file.
    input.value = "";
    setFeedback(null);

    if (!file) return;

    if (file.size > MAX_IMPORT_BYTES) {
      setFeedback({
        kind: "error",
        message: `"${file.name}" is larger than 1 MB. Export a smaller document first.`,
      });
      return;
    }

    const reader = new FileReader();

    reader.onerror = () => {
      setFeedback({
        kind: "error",
        message: "The file could not be read. It may be locked or unavailable.",
      });
    };

    reader.onload = (event) => {
      const raw = event.target?.result;
      if (typeof raw !== "string") {
        setFeedback({ kind: "error", message: "The file did not contain readable text." });
        return;
      }

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        const detail = err instanceof Error ? err.message : "unknown parse error";
        setFeedback({
          kind: "error",
          message: `That is not valid JSON (${detail}). Choose a file exported from this editor.`,
        });
        return;
      }

      const isDocObject =
        typeof parsed === "object" && parsed !== null && (parsed as { type?: unknown }).type === "doc";
      const isContentArray = Array.isArray(parsed);

      if (!isDocObject && !isContentArray) {
        setFeedback({
          kind: "error",
          message: "The JSON is valid but is not an editor document.",
        });
        return;
      }

      let applied = false;
      try {
        applied = editor.commands.setContent(
          parsed as Parameters<typeof editor.commands.setContent>[0]
        );
      } catch (err) {
        const detail = err instanceof Error ? err.message : "unknown error";
        setFeedback({ kind: "error", message: `The document could not be loaded (${detail}).` });
        return;
      }

      if (!applied) {
        setFeedback({
          kind: "error",
          message:
            "The document was rejected — it may exceed this module's character limit.",
        });
        return;
      }

      setFeedback({ kind: "success", message: `Loaded "${file.name}".` });
      // Close only on success: an open dialog keeps the error visible for correction.
      closeRef.current?.click();
    };

    reader.readAsText(file);
  };

  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor='import-json' className='text-sm font-medium'>
        JSON document
      </label>
      <input
        id='import-json'
        type='file'
        accept='.json,application/json'
        onChange={handleFileChange}
        aria-describedby={feedback ? "import-feedback" : undefined}
        className='text-sm text-muted-foreground'
      />

      {feedback ? (
        <p
          id='import-feedback'
          role='alert'
          className={
            feedback.kind === "error"
              ? "text-xs font-medium text-destructive"
              : "text-xs font-medium text-emerald-600 dark:text-emerald-400"
          }
        >
          {feedback.message}
        </p>
      ) : null}

      <DialogClose ref={closeRef} className='hidden' aria-hidden='true' tabIndex={-1} />
    </div>
  );
}
