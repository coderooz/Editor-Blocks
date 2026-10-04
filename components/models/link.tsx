/**
 * @file /components/models/link.tsx
 * @description Link dialog that reads the current link mark and applies href, label, and open-in-new-tab settings.
 * @architecture Next.js App Router (Client Component)
 * @ai-hint Bracket access (existing['href']) is required — tsconfig sets noPropertyAccessFromIndexSignature. Extend the mark range before setting so partial selections link correctly.
 * @ai-agent TipTap's Link rejects disallowed protocols (javascript:, data:) inside the
 *            `setLink` command and again in `renderHTML`, so a rejected href is a normal
 *            outcome rather than a bug — but it fails SILENTLY. Report it inline with
 *            role="alert" so the user is not left wondering why nothing happened.
 * @ai-agent The dialog closes after a successful apply so Radix's focus trap releases.
 * @dependencies Requires type Editor, React hooks, DialogClose from @/ui/dialog.
 */

"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import { DialogClose } from "@/components/ui/dialog";

export default function Link({ editor }: { editor: Editor }) {
  const existing = editor.getAttributes("link") as Record<string, unknown>;
  const initialText = editor.state.doc.textBetween(
    editor.state.selection.from,
    editor.state.selection.to,
    " "
  );
  const [url, setUrl] = React.useState((existing["href"] as string) || "");
  const [text, setText] = React.useState(initialText);
  const [newTab, setNewTab] = React.useState(existing["target"] === "_blank" || false);
  const [error, setError] = React.useState("");
  const closeRef = React.useRef<HTMLButtonElement>(null);

  const applyLink = () => {
    const href = url.trim();
    const { from, to } = editor.state.selection;
    const label = text;
    // Only rewrite the range when the user actually edited the label, so opening the
    // dialog and clicking Apply on a normal selection never disturbs the document.
    const relabel = label !== initialText;

    // Empty href means "remove the link", which is always valid.
    if (!href) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setError("");
      closeRef.current?.click();
      return;
    }

    // Rewrite the range first when the label changed, then select exactly what was
    // written so extendMarkRange covers the new text rather than the old selection.
    const base = editor.chain().focus();
    const chain = relabel
      ? base
          .insertContentAt({ from, to }, label)
          .setTextSelection({ from, to: from + label.length })
      : base;

    const applied = chain.extendMarkRange("link").setLink({ href, target: newTab ? "_blank" : "_self" }).run();

    if (!applied) {
      setError("That URL was rejected. Use an http, https or mailto link.");
      return;
    }

    setError("");
    closeRef.current?.click();
  };

  return (
    <div className='flex flex-col gap-3 mt-2'>
      <label htmlFor='link-url' className='text-sm font-medium'>
        URL
      </label>
      <input
        id='link-url'
        type='url'
        placeholder='https://example.com'
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          if (error) setError("");
        }}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "link-error" : undefined}
        className='border rounded-md px-2 py-1 text-sm'
      />

      {error ? (
        <p id='link-error' role='alert' className='text-xs font-medium text-destructive'>
          {error}
        </p>
      ) : null}

      <label htmlFor='link-text' className='text-sm font-medium'>
        Text (optional)
      </label>
      <input
        id='link-text'
        type='text'
        placeholder='Display text (optional)'
        value={text}
        onChange={(e) => setText(e.target.value)}
        className='border rounded-md px-2 py-1 text-sm'
      />

      <label htmlFor='link-newtab' className='flex items-center gap-2 text-sm mt-2'>
        <input
          id='link-newtab'
          type='checkbox'
          checked={newTab}
          onChange={(e) => setNewTab(e.target.checked)}
        />
        Open in new tab
      </label>

      <button
        type='button'
        onClick={applyLink}
        className='bg-primary text-white rounded-md py-1 mt-3 text-sm hover:opacity-90'
      >
        Apply Link
      </button>

      <DialogClose ref={closeRef} className='hidden' aria-hidden='true' tabIndex={-1} />
    </div>
  );
}
