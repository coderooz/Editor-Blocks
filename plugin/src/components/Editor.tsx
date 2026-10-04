/**
 * @file plugin/src/components/Editor.tsx
 * @description Main editor component for the tiptap-editor package.
 */

"use client";

import { useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import { useEditorContext } from "../context/EditorContext";
import { EditorMenuBar } from "./EditorMenuBar";
import type { EditorType } from "../types/editor";

interface EditorProps {
  type: EditorType;
  initialContent?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export default function Editor({
  type,
  initialContent,
  onChange: _onChange,
  placeholder: _placeholder,
  className,
}: EditorProps) {
  const { editor, setEditorType, charCount, setEditorContent } = useEditorContext();

  useEffect(() => {
    setEditorType(type);
  }, [type, setEditorType]);

  useEffect(() => {
    if (editor && initialContent) {
      setEditorContent(initialContent);
    }
  }, [editor, initialContent, setEditorContent]);

  if (!editor) {
    return (
      <div className="text-center text-muted-foreground">Loading editor…</div>
    );
  }

  return (
    <div className={`flex flex-col w-full max-w-3xl mx-auto mt-8 rounded-lg border shadow-sm bg-background ${className || ""}`}>
      <EditorMenuBar />
      <div className="p-3">
        <EditorContent
          editor={editor}
          className="min-h-[200px] prose max-w-none focus:outline-none"
        />
      </div>
      <div className="border-t text-right text-sm text-muted-foreground p-2">
        {charCount.toLocaleString()} characters
      </div>
    </div>
  );
}
