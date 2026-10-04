/**
 * @file /components/models/image.tsx
 * @description Image insert dialog offering URL entry and local file upload, with width and height inputs.
 * @architecture Next.js App Router (Client Component)
 * @ai-hint Local uploads are inserted as blob: object URLs — they are visible for the current
 *          session only and are gone after a reload. The old "My Assets" tab was removed: it
 *          fetched /api/private/asset, which does not exist in this project, so it 404'd and
 *          always rendered "No assets found." Reintroduce an asset library together with a real
 *          endpoint rather than shipping a tab that cannot work.
 * @ai-agent No console output in this file — the quality gate forbids it. Failures surface as
 *            an inline `role="alert"` tied to the field through aria-describedby.
 * @ai-agent The dialog closes after a successful insert so Radix's focus trap releases and
 *            focus can return to the editor.
 * @dependencies Requires <Tabs />, <Input />, <Button />, cn(), type Editor, DialogClose.
 */

"use client";

import { useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/** Fallback box size used when the width/height inputs are cleared or invalid. */
const DEFAULT_SIZE = 300;

export default function ImageModel({ editor }: { editor: Editor }) {
  const [activeTab, setActiveTab] = useState("url");

  // From URL
  const [image, setImage] = useState("");
  const [width, setWidth] = useState<number>(DEFAULT_SIZE);
  const [height, setHeight] = useState<number>(DEFAULT_SIZE);

  // File upload
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);

  /** A cleared number input yields 0, which would render an invisible image. */
  const safeSize = (value: number) => (Number.isFinite(value) && value > 0 ? value : DEFAULT_SIZE);

  const insertImage = (src: string): boolean =>
    editor
      .chain()
      .focus()
      .setImage({ src, width: safeSize(width), height: safeSize(height) })
      .run();

  const finish = (ok: boolean, failureMessage: string) => {
    if (!ok) {
      setError(failureMessage);
      return false;
    }
    setError("");
    closeRef.current?.click();
    return true;
  };

  const handleInsertFromUrl = () => {
    const value = image.trim();
    if (!value) {
      setError("Enter an image URL to continue.");
      return;
    }

    let parsed: URL;
    try {
      parsed = new URL(value);
    } catch {
      setError("That is not a valid URL.");
      return;
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:" && parsed.protocol !== "blob:") {
      setError("Only http, https and blob image URLs are supported.");
      return;
    }

    if (!finish(insertImage(value), "The image could not be inserted.")) return;
    setImage("");
  };

  const handleUpload = () => {
    if (!file) {
      setError("Choose an image file first.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError(`"${file.name}" is not an image.`);
      setFile(null);
      return;
    }

    let localPreviewUrl: string;
    try {
      localPreviewUrl = URL.createObjectURL(file);
    } catch {
      setError("That file could not be opened as an image.");
      setFile(null);
      return;
    }

    if (!finish(insertImage(localPreviewUrl), "The image could not be inserted.")) {
      URL.revokeObjectURL(localPreviewUrl);
      return;
    }
    setFile(null);
  };

  return (
    <div className='space-y-4 py-2'>
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='grid grid-cols-2 w-full'>
          <TabsTrigger value='url'>From URL</TabsTrigger>
          <TabsTrigger value='upload'>Upload</TabsTrigger>
        </TabsList>

        {/* --- From URL --- */}
        <TabsContent value='url' className='mt-4 space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='image-url' className='text-sm font-medium'>
              Image URL
            </label>
            <Input
              id='image-url'
              type='url'
              value={image}
              onChange={(e) => {
                setImage(e.target.value);
                if (error) setError("");
              }}
              placeholder='https://example.com/image.png'
              aria-invalid={error && activeTab === "url" ? true : undefined}
              aria-describedby={error && activeTab === "url" ? "image-error" : undefined}
            />
          </div>

          <div className='flex gap-3'>
            <div className='flex flex-col'>
              <label htmlFor='image-width' className='text-xs text-muted-foreground'>
                Width
              </label>
              <Input
                id='image-width'
                type='number'
                min={1}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className='w-20'
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='image-height' className='text-xs text-muted-foreground'>
                Height
              </label>
              <Input
                id='image-height'
                type='number'
                min={1}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className='w-20'
              />
            </div>
          </div>

          <Button type='button' onClick={handleInsertFromUrl} className='w-full'>
            Insert Image
          </Button>
        </TabsContent>

        {/* --- Upload Image --- */}
        <TabsContent value='upload' className='mt-4 space-y-4'>
          <div className='space-y-2'>
            <label htmlFor='image-file' className='text-sm font-medium'>
              Select File
            </label>
            <Input
              id='image-file'
              type='file'
              accept='image/*'
              onChange={(e) => {
                setFile(e.target.files?.[0] ?? null);
                if (error) setError("");
              }}
              aria-invalid={error && activeTab === "upload" ? true : undefined}
              aria-describedby={error && activeTab === "upload" ? "image-error" : undefined}
            />
            <p className='text-xs text-muted-foreground'>
              Uploaded images are embedded for this session only.
            </p>
          </div>

          <div className='flex gap-3'>
            <div className='flex flex-col'>
              <label htmlFor='upload-width' className='text-xs text-muted-foreground'>
                Width
              </label>
              <Input
                id='upload-width'
                type='number'
                min={1}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className='w-20'
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='upload-height' className='text-xs text-muted-foreground'>
                Height
              </label>
              <Input
                id='upload-height'
                type='number'
                min={1}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className='w-20'
              />
            </div>
          </div>

          <Button type='button' onClick={handleUpload} className='w-full'>
            Upload &amp; Insert
          </Button>
        </TabsContent>
      </Tabs>

      {error ? (
        <p id='image-error' role='alert' className={cn("text-xs font-medium text-destructive")}>
          {error}
        </p>
      ) : null}

      <DialogClose ref={closeRef} className='hidden' aria-hidden='true' tabIndex={-1} />
    </div>
  );
}
