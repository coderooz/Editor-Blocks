/**
 * @file /components/models/youtube.tsx
 * @description YouTube embed dialog that validates a pasted URL, extracts the video ID, and inserts a sized embed.
 * @architecture Next.js App Router (Client Component)
 * @ai-hint Video IDs are matched with an 11-character pattern; keep it in sync with the Youtube extension. No console output in this file — the quality gate forbids it.
 * @ai-agent Validation feedback is an inline `role="alert"` node, never `window.alert()`.
 *            `alert()` blocks the keyboard, is not announced consistently by screen readers,
 *            and cannot be styled. Keep the message wired to the input through
 *            `aria-describedby`/`aria-invalid` so assistive tech reads it with the field.
 * @ai-agent The dialog closes after a successful insert. Leaving it open keeps Radix's focus
 *            trap active, so the `focus()` call on the editor is fought by the dialog and the
 *            user lands back in the modal instead of their document.
 * @dependencies Requires type Editor, react (useState), DialogClose from @/ui/dialog.
 */

"use client";

import { useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { DialogClose } from "@/ui/dialog";

export interface YoutubeModelProps {
  editor: Editor;
}

/** Fallback embed size used when the width/height inputs are cleared or invalid. */
const DEFAULT_WIDTH = 640;
const DEFAULT_HEIGHT = 480;

export default function YoutubeModel({ editor }: YoutubeModelProps) {
  const [src, setSrc] = useState("");
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [error, setError] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleInsert = () => {
    const value = src.trim();

    if (!value) {
      setError("Enter a YouTube URL to continue.");
      return;
    }

    // Validate & extract the YouTube video ID
    const videoIdMatch = value.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (!videoIdMatch) {
      setError("That does not look like a YouTube URL. Try a full watch or youtu.be link.");
      return;
    }

    const videoId = videoIdMatch[1];
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    // A cleared number input yields 0, which would render a zero-size embed.
    const safeWidth = Number.isFinite(width) && width > 0 ? width : DEFAULT_WIDTH;
    const safeHeight = Number.isFinite(height) && height > 0 ? height : DEFAULT_HEIGHT;

    const inserted = editor
      .chain()
      .focus()
      .setYoutubeVideo({ src: embedUrl, width: safeWidth, height: safeHeight })
      .run();

    if (!inserted) {
      setError("The video could not be inserted. Check your selection and try again.");
      return;
    }

    setSrc("");
    setError("");
    closeRef.current?.click();
  };

  return (
    <div className='space-y-4 py-4'>
      <div className='space-y-2'>
        <label htmlFor='yt-url' className='text-sm font-medium'>
          YouTube URL
        </label>
        <input
          id='yt-url'
          type='url'
          value={src}
          onChange={(e) => {
            setSrc(e.target.value);
            if (error) setError("");
          }}
          placeholder='https://www.youtube.com/watch?v=dQw4w9WgXcQ'
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "yt-url-error" : undefined}
          className='w-full h-8 text-sm px-2 border rounded-md'
        />
        {error ? (
          <p id='yt-url-error' role='alert' className='text-xs font-medium text-destructive'>
            {error}
          </p>
        ) : null}
      </div>

      <div className='flex gap-3'>
        <div className='flex flex-col'>
          <label htmlFor='yt-width' className='text-xs text-muted-foreground'>
            Width
          </label>
          <input
            id='yt-width'
            type='number'
            min={1}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className='w-20 h-8 text-sm px-2 border rounded-md'
          />
        </div>

        <div className='flex flex-col'>
          <label htmlFor='yt-height' className='text-xs text-muted-foreground'>
            Height
          </label>
          <input
            id='yt-height'
            type='number'
            min={1}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className='w-20 h-8 text-sm px-2 border rounded-md'
          />
        </div>
      </div>

      <button
        type='button'
        onClick={handleInsert}
        className='w-full bg-primary text-white text-sm py-2 rounded-md hover:bg-primary/90 transition'
      >
        Insert Video
      </button>

      {/* Programmatic close target: see the header note about the focus trap. */}
      <DialogClose ref={closeRef} className='hidden' aria-hidden='true' tabIndex={-1} />
    </div>
  );
}
