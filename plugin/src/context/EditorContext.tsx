/**
 * @file plugin/src/context/EditorContext.tsx
 * @description Global editor state provider for the tiptap-editor package.
 */

"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extension-placeholder";
import {
  COMMENT_EXTENSIONS,
  CONTENT_EXTENSIONS,
  DOCUMENT_EXTENSIONS,
} from "../constants/extensions";
import type { EditorType } from "../types/editor";

interface EditorContextType {
  editor: any;
  editorType: EditorType;
  setEditorType: (type: EditorType) => void;
  editorContent: string;
  setEditorContent: (content: string) => void;
  charCount: number;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [editorType, setEditorType] = useState<EditorType>("comment");
  const [editorContent, setEditorContent] = useState("");
  const [charCount, setCharCount] = useState(0);

  const extensions = useMemo(() => {
    const map = {
      comment: COMMENT_EXTENSIONS,
      content: CONTENT_EXTENSIONS,
      document: DOCUMENT_EXTENSIONS,
    } as const;

    return [
      ...(map[editorType] || COMMENT_EXTENSIONS),
      Placeholder.configure({
        placeholder: "Write something…",
        includeChildren: true,
        showOnlyWhenEditable: true,
      }),
    ];
  }, [editorType]);

  const editor = useEditor(
    {
      extensions,
      immediatelyRender: false,
      content: editorContent || "<p>Start writing...</p>",
      autofocus: "end",
      editorProps: {
        attributes: {
          class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px]",
        },
      },
      onUpdate: ({ editor }) => {
        setCharCount(editor.state.doc.textContent.length);
        setEditorContent(editor.getHTML());
      },
    },
    [editorType]
  );

  const value = useMemo(
    () => ({
      editor,
      editorType,
      setEditorType,
      editorContent,
      setEditorContent,
      charCount,
    }),
    [editor, editorType, editorContent, charCount]
  );

  return (
    <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
  );
}

export function useEditorContext() {
  const ctx = useContext(EditorContext);
  if (!ctx) {
    throw new Error("useEditorContext must be used within an EditorProvider");
  }
  return ctx;
}
