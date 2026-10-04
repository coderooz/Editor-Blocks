/**
 * @file /components/EditorPage.tsx
 * @description Editor surface that wires the toolbar and TipTap editing area to the shared context and keeps the editor mode and initial content in sync.
 * @architecture Next.js App Router (Client Component)
 * @ai-hint Reads everything from useEditorContext rather than owning editor state. Guard the null editor before rendering EditorContent or the toolbar.
 * @ai-agent This is the public mounting surface for every module. A host app renders
 *            `<EditorPage type="<module-id>" />`; everything else is resolved internally.
 * @ai-agent INVARIANT: the `type` prop is the module id and must match a value in
 *            EditorType. It is applied in an effect, so the first render uses the provider's
 *            initial type and the toolbar re-renders once the switch lands.
 * @ai-agent INVARIANT: only one EditorPage may be mounted per page. The provider owns a single
 *            editor instance, so a second one will fight over the same state.
 * @ai-agent `initialContent` is applied with `editor.commands.setContent()`, NOT by writing
 *            to context state. BUG HISTORY: this previously called `setEditorContent()`,
 *            which only updates context state — but `useEditor` reads its `content` option
 *            exclusively at construction and its deps are `[editorType]`, so the document was
 *            never actually populated. The prop appeared to work and silently did nothing.
 *            Verified fixed by browser test on 2026-10-02.
 * @ai-agent The setContent call is intentionally left in an effect keyed on `editor`, so
 *            re-seeding happens exactly once per editor instance. A switch of `type` tears
 *            the editor down and rebuilds it, which re-runs this effect and re-seeds — the
 *            intended behaviour for a page-per-module app.
 * @ai-agent The null-editor branch is what renders during SSR and the first client pass.
 *            Do not remove it — EditorContent would throw on a null editor.
 * @ai-agent `charCount` comes from the provider and reflects plain-text length, which differs
 *            from `editorContent.length` (the HTML string). Use charCount for user-facing
 *            counters and editorContent for persistence.
 * @dependencies Requires <EditorContent />, <EditorMenuBar />, useEditorContext().
 */

"use client";

import { useEffect } from "react";
import { EditorContent } from "@tiptap/react";
import { useEditorContext } from "@/context/EditorContext";
import { EditorMenuBar } from "@/components/EditorMenuBar";
import type { EditorType } from "@/context/EditorContext";

interface EditorTypeProps {
  type: EditorType;
  initialContent?: string;
}

export default function EditorPage({ type, initialContent }: EditorTypeProps) {
  const { editor, setEditorType, charCount } = useEditorContext();

  useEffect(() => {
    setEditorType(type);
  }, [type, setEditorType]);

  useEffect(() => {
    if (editor && initialContent) {
      // Push straight into the live document. Writing to context alone is a no-op because
      // useEditor only reads `content` when the instance is constructed.
      // emitUpdate defaults to true, which fires onUpdate so charCount and editorContent
      // (and therefore the example preview pane) stay in sync.
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor)
    return (
      <div className='text-center text-muted-foreground'>Loading editor…</div>
    );

  return (
    <div className='flex flex-col w-full max-w-3xl mx-auto mt-8 rounded-lg border shadow-sm bg-background'>
      <EditorMenuBar />
      <div className='p-3'>
        <EditorContent
          editor={editor}
          className='min-h-[200px] prose max-w-none focus:outline-none'
        />
      </div>
      <div className='border-t text-right text-sm text-muted-foreground p-2'>
        {charCount.toLocaleString()} characters
      </div>
    </div>
  );
}
