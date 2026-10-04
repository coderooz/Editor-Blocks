/**
 * @file /app/documentation/custom-modules/page.tsx
 * @description Step-by-step guide for adding a module or introducing a new editor engine.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent The four steps in "Add a module on TipTap" are load-bearing and are verified by
 *            reading the source. Keep the file paths and symbol names in the snippets
 *            accurate: constants/EditorExtension.tsx for presets, context/EditorContext.tsx for
 *            the type union and the map, constants/module-registry.ts for the catalogue entry.
 * @ai-agent Step 3's warning about the silent DEFAULT_EXTENSIONS fallback is the single most
 *            common failure mode when adding a module. Do not remove it while simplifying.
 * @dependencies Requires EDITOR_MODULES for the live registry table, reference registries.
 */

import Link from "next/link";
import { DocsTitle, DocsSection } from "@/components/docs/DocsHeading";
import { DocsCallout, DocsCode, DocsTable } from "@/components/docs/DocsCode";
import { DocsReferences } from "@/components/docs/DocsReferences";
import { docsMetadata } from "@/components/docs/docs-metadata";
import { DOC_CROSS_REFS, SOURCE_REFS } from "@/constants/docs-references";
import { EDITOR_MODULES } from "@/constants/module-registry";

export const metadata = docsMetadata("/documentation/custom-modules");

export default function CustomModulesPage() {
  return (
    <>
      <DocsTitle
        eyebrow="Reference"
        title="Custom Modules"
        description="Add a new editor block to the catalogue, or bring a different editor core into the same contract."
      />

      <DocsSection
        title="Add a module on TipTap"
        lead="Four steps. Most of the work is declarative."
      >
        <DocsCode
          title="1. Define the extension preset"
          code={`// constants/EditorExtension.tsx
import { CharacterCount } from "@tiptap/extensions";

export const TICKET_EXTENSIONS = [
  ...DEFAULT_EXTENSIONS,
  CharacterCount.configure({ limit: 8000, mode: "textSize" }),
];`}
        />

        <DocsCode
          title="2. Add the id to EditorType"
          code={`// context/EditorContext.tsx
export type EditorType = "comment" | "content" | "document" | "presentation" | "ticket";`}
        />

        <DocsCode
          title="3. Map the id to the preset"
          code={`// context/EditorContext.tsx — inside the provider
const map = {
  comment: COMMENT_EXTENSIONS,
  content: BLOG_EXTENSIONS,
  document: DOCUMENT_EXTENSIONS,
  presentation: PRESENTATION_EXTENSIONS,
  ticket: TICKET_EXTENSIONS,   // ← new
} as const;`}
        />

        <DocsCode
          title="4. Register it in the catalogue"
          code={`// constants/module-registry.ts
export const EDITOR_MODULES: EditorModule[] = [
  // …existing modules
  {
    id: "ticket",
    title: "Ticket Editor",
    summary: "Structured editor for support tickets with an 8,000 character budget.",
    description: "A TipTap editor sized for issue descriptions and support threads.",
    engine: "tiptap",
    engineVersion: "^3.31.4",
    category: "Rich Content",
    status: "beta",
    href: "/examples/ticket",
    docs: "/documentation/modules/ticket",
    extensionSet: "TICKET_EXTENSIONS",
    useCases: ["Support tickets", "Issue descriptions"],
    features: ["Everything in Comment Editor", "8,000 character budget"],
    extensions: ["All default extensions", "CharacterCount"],
  },
];`}
        />
        <p>Add a route at <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">app/examples/ticket/page.tsx</code>:</p>
        <DocsCode
          title="Route"
          language="tsx"
          code={`"use client";

import { EditorPage } from "@/components/EditorPage";

export default function TicketExamplePage() {
  return <EditorPage type="ticket" />;
}`}
        />
        <DocsCallout type="success" title="Everything else updates automatically">
          The card, documentation page, search index, and{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">llms.txt</code>{" "}
          all read from the registry, so the new module appears across the site with no
          additional edits.
        </DocsCallout>
      </DocsSection>

      <DocsSection
        title="Add a toolbar button"
        lead="Toolbar items are data, so this is an append rather than a new component."
      >
        <DocsCode
          title="Append to the right menu array"
          language="tsx"
          code={`import { Highlight } from "lucide-react";

export const CONTENT_MENU: MenuItem[] = [
  // …existing items
  {
    title: "Highlight",
    group: "styling",
    type: "button",
    icon: Highlighter,
    isActive: (editor) => editor.isActive("highlight"),
    action: (editor) => editor.chain().focus().toggleHighlight().run(),
  },
];`}
        />
        <p>
          The <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">group</code>{" "}
          value controls which separator the button sits behind. Keep group names consistent
          across presets so the toolbar rhythm matches between modules.
        </p>
        <DocsCallout type="warning" title="The extension must exist">
          A toolbar button calls a command. If the matching extension is not in the module&apos;s
          preset, the command does not exist and the click throws. Add the extension first, then
          expose the button.
        </DocsCallout>
      </DocsSection>

      <DocsSection
        title="Add a new engine"
        lead="The registry already reserves engine names. Wiring one up is a larger change because the provider assumes a TipTap instance."
      >
        <DocsCode
          title="1. Reserve the engine in the type"
          code={`// constants/module-registry.ts
export type EditorEngine =
  | "tiptap"      // active
  | "lexical"     // reserved
  | "prosemirror" // reserved
  | "slate"       // reserved
  | "quill"       // reserved
  | "blocknote"   // reserved
  | "custom";`}
        />
        <DocsCode
          title="2. Add a label"
          code={`export const ENGINE_LABELS: Record<EditorEngine, string> = {
  // …
  lexical: "Lexical",
};`}
        />
        <DocsCode
          title="3. Build an adapter"
          code={`// engines/lexical/adapter.ts
export interface EditorAdapter {
  getHTML(): string;
  setHTML(html: string): void;
  focus(): void;
  isEmpty(): boolean;
  destroy(): void;
}`}
        />
        <p>
          The provider needs a branch that builds the adapter instead of calling{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">useEditor</code>.
          Keep the adapter surface small so the context, toolbar, and counter stay
          engine-agnostic.
        </p>
        <DocsCallout type="warning" title="Do not fake engine parity">
          Mapping a non-Tiptap engine onto the TipTap command surface will break in subtle ways.
          If an engine cannot support a toolbar item, omit the item rather than stubbing the
          command.
        </DocsCallout>
      </DocsSection>

      <DocsSection title="Current catalogue">
        <DocsTable
          headers={["Id", "Title", "Engine", "Tier", "Status"]}
          rows={EDITOR_MODULES.map((module) => [
            <code key={module.id} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
              {module.id}
            </code>,
            module.title,
            module.engine,
            module.category,
            module.status,
          ])}
        />
        <p>
          <Link href="/documentation/roadmap" className="font-medium text-primary hover:underline">
            Roadmap
          </Link>{" "}
          lists what is planned next.
        </p>
      </DocsSection>

      <DocsReferences groups={[DOC_CROSS_REFS, SOURCE_REFS]} title="Source references" />
    </>
  );
}
