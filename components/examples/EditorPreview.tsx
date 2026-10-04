/**
 * @file /components/examples/EditorPreview.tsx
 * @description Live output panel shown next to the editor on example pages. Mirrors the
 *              editor's current HTML in two forms: rendered, and as source.
 * @architecture Next.js App Router (Client Component)
 * @ai-agent This is the whole reason the example pages are useful: a reader can type in the
 *            editor and watch the exact HTML a host app would receive. Keep both panes bound
 *            to the same `editorContent` from context — if they drift, the page is lying.
 * @ai-agent SECURITY: the rendered pane uses dangerouslySetInnerHTML. That is acceptable here
 *            because the input is this project's own sample content and the render is
 *            same-origin, and it is the only way to honestly show the editor's output. It is
 *            NOT a pattern to copy when rendering user-submitted HTML — sanitise there.
 * @ai-agent `charCount` (plain-text length) and `editorContent.length` (HTML length) are
 *            deliberately both displayed. The gap between them is the point: it explains why
 *            a 4,000-character article can be 11,000 characters of HTML.
 * @dependencies Requires useEditorContext, shadcn Tabs.
 */

"use client";

import { useState } from "react";
import { Eye, Code2, FileCode2, TriangleAlert } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorContext } from "@/context/EditorContext";

export function EditorPreview() {
  const { editorContent, charCount } = useEditorContext();
  const [tab, setTab] = useState("preview");

  const htmlLength = editorContent.length;

  return (
    <section
      aria-labelledby="preview-heading"
      className="flex flex-col rounded-xl border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-2.5">
        <h2 id="preview-heading" className="text-sm font-semibold">
          Output
        </h2>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">{charCount.toLocaleString()}</span>{" "}
            characters of text
          </span>
          <span aria-hidden="true" className="text-border">
            |
          </span>
          <span>
            <span className="font-medium text-foreground">
              {htmlLength.toLocaleString()}
            </span>{" "}
            characters of HTML
          </span>
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={setTab}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <TabsList className="m-3 w-fit">
          <TabsTrigger value="preview">
            <Eye className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" />
            Rendered
          </TabsTrigger>
          <TabsTrigger value="html">
            <Code2 className="mr-1.5 w-3.5 h-3.5" aria-hidden="true" />
            HTML
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="preview"
          className="mt-0 flex-1 data-[state=inactive]:hidden"
        >
          {/*
            Intentionally raw HTML: this pane exists to show exactly what a host app would
            receive from the editor. Do not reuse this pattern for user-submitted content.
          */}
          <div
            className="min-h-[260px] border-t px-5 py-4 prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: editorContent }}
          />
        </TabsContent>

        <TabsContent
          value="html"
          className="mt-0 flex-1 data-[state=inactive]:hidden"
        >
          <div className="border-t">
            {editorContent ? (
              <pre className="max-h-[340px] overflow-auto p-4 text-xs leading-relaxed">
                <code className="font-mono text-foreground">{editorContent}</code>
              </pre>
            ) : (
              <EmptyState />
            )}
          </div>
        </TabsContent>
      </Tabs>

      <p className="flex items-start gap-2 border-t px-4 py-2.5 text-xs text-muted-foreground">
        <TriangleAlert className="mt-0.5 w-3.5 h-3.5 shrink-0 text-amber-500" aria-hidden="true" />
        <span>
          The editor emits raw HTML. Sanitise it with DOMPurify or{" "}
          <code className="font-mono">sanitize-html</code> before persisting it or rendering
          it on another domain.
        </span>
      </p>
    </section>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center gap-2 px-6 text-center">
      <FileCode2 className="w-8 h-8 text-muted-foreground/40" aria-hidden="true" />
      <p className="text-sm font-medium">Nothing to preview yet</p>
      <p className="max-w-xs text-xs text-muted-foreground">
        Type in the editor and the HTML your app would receive appears here.
      </p>
    </div>
  );
}
