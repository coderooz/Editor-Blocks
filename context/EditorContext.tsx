/**
 * @file /context/EditorContext.tsx
 * @description Global editor state provider. Owns the single TipTap instance, resolves the
 *              extension preset for the active module, and exposes the hook every component
 *              consumes.
 * @architecture Custom React Hook + Context Provider
 * @project Editor Blocks — the product is a catalogue of editor modules, not a TipTap
 *          showcase. Do not let engine-specific assumptions leak in here; the module → preset
 *          map is the seam where a second engine would branch.
 * @ai-agent Single source of truth for the active module and the editor instance.
 * @ai-agent INVARIANT: `EditorType` and the `map` below must stay in sync. Adding a value to the
 *            union without a map entry compiles fine but silently falls back to
 *            DEFAULT_EXTENSIONS via `|| DEFAULT_EXTENSIONS` further down. If you add a module
 *            id, add its preset here in the same change.
 * @ai-agent INVARIANT: only one provider may exist. It is mounted once in app/layout.tsx. A
 *            second provider creates a second editor instance and the toolbar desynchronises
 *            from the document.
 * @ai-agent `useEditor` is keyed on `[editorType]`, so switching modules tears the editor down
 *            and rebuilds it. Content and undo history are lost. Capture `editorContent` before
 *            switching if it must survive.
 * @ai-agent The editor is created with `immediatelyRender: false`. This is what prevents a
 *            server/client hydration mismatch. Do not remove it.
 * @ai-agent `onUpdate` writes raw HTML into context. Consumers must sanitise before persisting
 *            or rendering on another domain — this layer does not sanitise.
 * @ai-agent The debug label that rendered `Editor Type: {editorType}` into the DOM has been
 *            removed. Do not reintroduce it.
 * @dependencies Requires useEditor from @tiptap/react, Placeholder, and the module presets
 *              from @/constants/EditorExtension.
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Editor } from "@tiptap/react";
import { useEditor } from "@tiptap/react";
import { Placeholder } from "@tiptap/extension-placeholder";
import {
  BLOG_EXTENSIONS,
  DOCUMENT_EXTENSIONS,
  COMMENT_EXTENSIONS,
  DEFAULT_EXTENSIONS,
  PRESENTATION_EXTENSIONS,
} from "@/constants/EditorExtension";
import type { ModuleId } from "@/constants/module-registry";

/**
 * The set of editor types the provider understands.
 *
 * @ai-agent DERIVED FROM THE REGISTRY, not hand-written. Every module id in
 *            EDITOR_MODULES is automatically a valid editor type, so adding a module to the
 *            registry widens this union without touching this file. `default` is the only
 *            non-module value: it is the fallback preset used when no module is selected.
 * @ai-agent INVARIANT: the `map` below must have an entry for every value in this union. A
 *            missing entry compiles fine but silently falls back to DEFAULT_EXTENSIONS via
 *            `|| DEFAULT_EXTENSIONS`. If you widen this union, add the preset in the same edit.
 */
export type EditorType = ModuleId | "default";

interface EditorContextType {
  charCount: number;
  editorType: EditorType;
  setEditorType: (type: EditorType) => void;
  editor: Editor | null;
  editorContent: string;
  setEditorContent: (value: string) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [charCount, setCharCount] = useState(0);
  const [editorType, setEditorType] = useState<EditorType>("comment");
  const [editorContent, setEditorContent] = useState("");

  const extensions = useMemo(() => {
    const map = {
      content: BLOG_EXTENSIONS,
      document: DOCUMENT_EXTENSIONS,
      comment: COMMENT_EXTENSIONS,
      default: DEFAULT_EXTENSIONS,
      presentation: PRESENTATION_EXTENSIONS,
    } as const;

    return [
      ...(map[editorType] || DEFAULT_EXTENSIONS),
      Placeholder.configure({
        placeholder: "Write something…",
        includeChildren: true,
        showOnlyWhenEditable: true,
      }),
    ];
  }, [editorType]);

  // 🧩 The critical fix: give `useEditor` a unique key to force recreation
  const editor = useEditor(
    {
      extensions,
      immediatelyRender: false,
      content: editorContent || "<p>Start writing...</p>",
      autofocus: "end",
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[150px]",
        },
      },
      onUpdate: ({ editor }) => {
        setCharCount(editor.state.doc.textContent.length);
        setEditorContent(editor.getHTML());
      },
    },
    [editorType] // 🔥 ensures full editor reinit when switching type
  );

  const updateCharCount = useCallback(() => {
    setCharCount(editor?.state.doc.textContent.length ?? 0);
  }, [editor]);

  useEffect(() => {
    if (!editor) return undefined;

    const handler = updateCharCount;
    editor.on("transaction", handler);

    return () => {
      editor.off("transaction", handler);
    };
  }, [editor, updateCharCount]);

  const value = useMemo(
    () => ({
      charCount,
      editorType,
      setEditorType,
      editor,
      editorContent,
      setEditorContent,
    }),
    [charCount, editorType, editor, editorContent]
  );

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditorContext() {
  const ctx = useContext(EditorContext);
  if (!ctx)
    throw new Error("useEditorContext must be used within an EditorProvider");
  return ctx;
}
