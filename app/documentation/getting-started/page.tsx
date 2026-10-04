/**
 * @file /app/documentation/getting-started/page.tsx
 * @description Install, run, and add the first editor module.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent Version numbers here (Node, npm, React, Next.js, extension sets) are the ones
 *            declared in package.json and constants/EditorExtension.tsx. If you bump a
 *            dependency major, update this page in the same change — a stale version table
 *            is worse than no table.
 * @ai-agent Code samples are the canonical mounting snippets. Keep them consistent with the
 *            props documented on /documentation/api.
 * @dependencies Requires docs primitives and the cross-reference registry.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocsTitle, DocsSection } from "@/components/docs/DocsHeading";
import { DocsCallout, DocsCode, DocsTable } from "@/components/docs/DocsCode";
import { DocsReferences } from "@/components/docs/DocsReferences";
import { docsMetadata } from "@/components/docs/docs-metadata";
import { DOC_CROSS_REFS } from "@/constants/docs-references";

export const metadata = docsMetadata("/documentation/getting-started");

export default function GettingStartedPage() {
  return (
    <>
      <DocsTitle
        eyebrow="Introduction"
        title="Getting Started"
        description="Get the project running locally and mount your first editor module."
      />

      <DocsSection
        title="Requirements"
        lead="Check these before you start."
      >
        <DocsTable
          headers={["Tool", "Version"]}
          rows={[
            ["Node.js", "20.0.0 or newer"],
            ["npm", "10.0.0 or newer"],
            ["React", "19"],
            ["Next.js", "16 (App Router)"],
          ]}
        />
      </DocsSection>

      <DocsSection title="Install and run">
        <DocsCode
          title="Terminal"
          code={`git clone https://github.com/coderooz/Editor-Blocks.git
cd Editor-Blocks
npm install
npm run dev`}
        />
        <p>
          The dev server starts on{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
            http://localhost:3000
          </code>
          . If the port is busy, Next.js picks the next free one and prints it.
        </p>
      </DocsSection>

      <DocsSection title="Available scripts">
        <DocsTable
          headers={["Command", "What it does"]}
          rows={[
            [<code key="d" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">npm run dev</code>, "Start the development server with hot reload."],
            [<code key="b" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">npm run build</code>, "Create an optimized production build."],
            [<code key="s" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">npm start</code>, "Serve the production build."],
            [<code key="l" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">npm run lint</code>, "Run ESLint."],
            [<code key="t" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">npm run typecheck</code>, "Run the TypeScript compiler in no-emit mode."],
          ]}
        />
      </DocsSection>

      <DocsSection
        title="Mount a module"
        lead="Create a route and render the editor with the module type you want."
      >
        <DocsCode
          title="app/comments/page.tsx"
          language="tsx"
          code={`"use client";

import { EditorPage } from "@/components/EditorPage";

export default function CommentsPage() {
  return <EditorPage type="comment" />;
}`}
        />
        <p>Valid module types are:</p>
        <DocsTable
          headers={["Type", "Module", "Extension set"]}
          rows={[
            [<code key="c" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">"comment"</code>, "Comment Editor", "COMMENT_EXTENSIONS"],
            [<code key="co" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">"content"</code>, "Content Editor", "BLOG_EXTENSIONS"],
            [<code key="d" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">"document"</code>, "Document Editor", "DOCUMENT_EXTENSIONS"],
            [<code key="p" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">"presentation"</code>, "Presentation Editor", "PRESENTATION_EXTENSIONS"],
          ]}
        />
        <DocsCallout type="info" title="The provider is already mounted">
          <code>EditorProvider</code> lives in the root layout, so you do not need to add it
          yourself. Mounting a second provider on a page will create a second editor instance.
        </DocsCallout>
      </DocsSection>

      <DocsSection title="Read and write content">
        <p>
          The editor keeps its HTML in context. Use{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
            useEditorContext()
          </code>{" "}
          to read the current HTML, seed initial content, or react to changes:
        </p>
        <DocsCode
          title="Reading and seeding content"
          language="tsx"
          code={`"use client";

import { useEditorContext } from "@/context/EditorContext";
import { EditorPage } from "@/components/EditorPage";

export default function ArticleEditor({ saved }: { saved: string }) {
  const { editorContent, charCount } = useEditorContext();

  return (
    <>
      <EditorPage type="content" initialContent={saved} />
      <p>Live HTML length: {editorContent.length}</p>
      <p>Character count: {charCount}</p>
    </>
  );
}`}
        />
      <DocsCallout type="warning" title="Sanitise before persisting">
          The editor emits raw HTML. Anything you send to a database or render on another
          domain should go through a sanitiser such as DOMPurify or{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
            sanitize-html
          </code>{" "}
          first. The editor does not sanitise on your behalf.
        </DocsCallout>
      </DocsSection>

      <DocsSection title="Next steps">
        <div className="flex flex-wrap gap-4">
          <Link
            href="/documentation/modules"
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            Compare all modules
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/documentation/api"
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            API reference
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/documentation/custom-modules"
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            Build your own module
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </DocsSection>

      <DocsReferences groups={[DOC_CROSS_REFS]} title="Upstream references" />
    </>
  );
}
