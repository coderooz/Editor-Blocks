/**
 * @file /components/docs/CopyButton.tsx
 * @description Client-side copy-to-clipboard control for documentation code blocks.
 * @architecture Next.js App Router (Client Component)
 * @ai-agent This is the only client-side piece of the code block. Highlighting happens on the
 *            server (see lib/highlight.ts), so the highlighter never ships to the browser.
 * @ai-agent Clipboard access is feature-detected and wrapped in try/catch. The async
 *            navigator.clipboard API is unavailable on insecure origins and can reject when
 *            the document is not focused, so a thrown rejection must not surface as an
 *            unhandled promise error in the console.
 * @ai-agent Feedback is conveyed with aria-live so a screen reader announces the result, and
 *            the copied state resets on a timer. A user who copies twice quickly still sees
 *            the confirmation because the timer is cleared before it is re-armed.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type CopyState = "idle" | "copied" | "error";

export function CopyButton({
  value,
  label = "Copy code",
}: {
  value: string;
  label?: string;
}) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the pending reset on unmount so a timer cannot fire into a dead component.
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API unavailable");
      }
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("error");
    }

    timer.current = setTimeout(() => setState("idle"), 2000);
  }, [value]);

  const isCopied = state === "copied";

  return (
    <button
      type="button"
      onClick={handleCopy}
      // Announce the outcome, not the button label, when it changes.
      aria-label={label}
      title={
        state === "error" ? "Copying failed — select the code manually" : label
      }
      className={[
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
        isCopied
          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
          : state === "error"
          ? "bg-destructive/15 text-destructive"
          : "text-muted-foreground hover:bg-accent hover:text-foreground",
      ].join(" ")}
    >
      {isCopied ? (
        <Check className="w-3.5 h-3.5" aria-hidden="true" />
      ) : (
        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
      )}
      <span aria-hidden="true">
        {isCopied ? "Copied" : state === "error" ? "Failed" : "Copy"}
      </span>
      <span role="status" aria-live="polite" className="sr-only">
        {isCopied
          ? "Code copied to clipboard"
          : state === "error"
          ? "Copying failed. Select the code and copy manually."
          : ""}
      </span>
    </button>
  );
}
