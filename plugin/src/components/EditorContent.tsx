/**
 * @file plugin/src/components/EditorContent.tsx
 * @description Editor content wrapper for the tiptap-editor package.
 */

"use client";

import { EditorContent as TiptapEditorContent } from "@tiptap/react";
import { useEditorContext } from "../context/EditorContext";

interface EditorContentProps {
  className?: string;
}

export default function EditorContent({ className }: EditorContentProps) {
  const { editor } = useEditorContext();

  if (!editor) return null;

  return (
    <TiptapEditorContent
      editor={editor}
      className={className || "min-h-[200px] prose max-w-none focus:outline-none"}
    />
  );
}
