/**
 * @file /app/documentation/architecture/page.tsx
 * @description Explains how the editor instance, extension presets, toolbar registry, and
 *              documentation data sources fit together.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent The "Known trade-offs" table is the most important section on this page — it
 *            records decisions that look like bugs to a new contributor. Update it when the
 *            underlying design changes rather than deleting a resolved row, so the reasoning
 *            survives.
 * @ai-agent File paths quoted here are load-bearing for readers trying to verify a claim. If
 *            you move a file, update both this page and SOURCE_REFS in
 *            @/constants/docs-references, which generates the source links.
 * @dependencies Requires EDITOR_MODULES for the engine table, reference registries for links.
 */

import { DocsTitle, DocsSection } from "@/components/docs/DocsHeading";
import { DocsCallout, DocsCode, DocsTable } from "@/components/docs/DocsCode";
import { DocsReferences } from "@/components/docs/DocsReferences";
import { docsMetadata } from "@/components/docs/docs-metadata";
import { DOC_CROSS_REFS, SOURCE_REFS } from "@/constants/docs-references";
import { EDITOR_MODULES, ENGINE_LABELS } from "@/constants/module-registry";

export const metadata = docsMetadata("/documentation/architecture");

export default function ArchitecturePage() {
  return (
    <>
      <DocsTitle
        eyebrow="Reference"
        title="Architecture"
        description="How a module request travels from a route to a rendered editor, and where each decision is made."
      />

      <DocsSection
        title="The layers"
        lead="Four layers, each with a single responsibility."
      >
        <DocsTable
          headers={["Layer", "Location", "Responsibility"]}
          rows={[
            [
              "Routes",
              <code key="a" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">app/</code>,
              "Mount a module by passing its id. Contains no editor logic.",
            ],
            [
              "Registry",
              <code key="b" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">constants/module-registry.ts</code>,
              "Authoritative module metadata. Drives /modules, /documentation, and llms.txt.",
            ],
            [
              "Provider",
              <code key="c" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">context/EditorContext.tsx</code>,
              "Owns the single editor instance and resolves the extension set per module.",
            ],
            [
              "Presets",
              <code key="d" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">constants/EditorExtension.tsx</code>,
              "Concrete TipTap extension arrays and toolbar menu definitions.",
            ],
          ]}
        />
      </DocsSection>

      <DocsSection title="Request flow">
        <DocsCode
          title="Route → editor"
          code={`1. Route renders <EditorPage type="comment" />
2. EditorPage effect calls setEditorType("comment")
3. Provider re-resolves extensions from its module → preset map
4. useEditor is keyed on the module id, so a change
   tears down the old editor and builds a new one
5. EditorMenuBar reads the module and picks its menu array
6. EditorContent renders the ProseMirror surface`}
        />
        <DocsCallout type="warning" title="Switching modules discards state">
          Step 4 is a full teardown, not an in-place reconfiguration. Changing the module id
          clears the document and its undo history. If you need to preserve content across a
          switch, capture editorContent before switching and pass it back as initialContent.
        </DocsCallout>
      </DocsSection>

      <DocsSection title="Single instance model">
        <p>
          <code>EditorProvider</code> is mounted once in the root layout. Everything reads the
          editor through context rather than creating its own. Two consequences follow:
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>One editor per page. A second provider would double state and desynchronise the toolbar.</li>
          <li>
            The editor is created with{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
              immediatelyRender: false
            </code>
            , so there is no server/client markup mismatch.
          </li>
        </ul>
      </DocsSection>

      <DocsSection title="Registry as the source of truth">
        <p>
          Module metadata lives in exactly one place. Everything that needs to know which
          modules exist imports it:
        </p>
        <DocsCode
          title="Consumers of the registry"
          code={`app/modules/page.tsx              → cards, search, category filter
app/documentation/modules/page.tsx  → capability matrix
app/documentation/modules/[id]/     → one static page per module
app/documentation/page.tsx         → overview table
public/llms.txt                    → machine-readable catalogue`}
        />
        <p>
          This is why adding a module is a one-file change plus one route. Nothing else needs to
          be told.
        </p>
      </DocsSection>

      <DocsSection title="Engine abstraction">
        <p>
          The registry types each module with an <code>engine</code> field. Nothing in the
          rendering path branches on it yet — every module currently runs on TipTap — but the
          contract is in place so a second engine can be introduced without changing the public
          shape of a module.
        </p>
        <DocsTable
          headers={["Module", "Engine", "Version", "Status"]}
          rows={EDITOR_MODULES.map((module) => [
            module.title,
            ENGINE_LABELS[module.engine],
            module.engineVersion,
            module.status,
          ])}
        />
        <DocsCallout type="info" title="Planned">
          Lexical, ProseMirror, Slate, Quill, and BlockNote are reserved values in the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
            EditorEngine
          </code>{" "}
          type. Adding a module on a new engine means implementing a matching preset and
          provider branch.
        </DocsCallout>
      </DocsSection>

      <DocsSection title="Extension preset composition">
        <DocsCode
          title="Preset hierarchy"
          code={`DEFAULT_EXTENSIONS        core: doc, paragraph, text, basic marks, lists
  └─ COMPLEX_EXTENSIONS    + headings, tables, media, embeds, code blocks
       ├─ BLOG_EXTENSIONS        (alias)
       ├─ DOCUMENT_EXTENSIONS    + CharacterCount (textSize)
       └─ PRESENTATION_EXTENSIONS+ CharacterCount (textSize)

COMMENT_EXTENSIONS     DEFAULT + CharacterCount (limit 2500, textSize)`}
        />
        <p>
          Higher tiers spread the ones below them, so a capability added to{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
            DEFAULT_EXTENSIONS
          </code>{" "}
          appears in every module. This is the intended way to add a widely useful extension —
          add it low in the hierarchy rather than patching each preset.
        </p>
      </DocsSection>

      <DocsSection title="Known trade-offs">
        <DocsTable
          headers={["Decision", "Consequence"]}
          rows={[
            [
              "Module switch recreates the editor",
              "Content and undo history are lost on switch. Acceptable for a page-per-module model; revisit if modules ever swap dynamically.",
            ],
            [
              "One shared provider in the root layout",
              "A page cannot host two independent editors. Would need a scoped provider refactor.",
            ],
            [
              "Presets are static arrays",
              "Extensions cannot be configured per host app without editing the constants. An options-merge layer would address this.",
            ],
            [
              "Toolbar items are data, not components",
              "Simple to extend, but a control that needs bespoke JSX cannot be expressed yet.",
            ],
          ]}
        />
      </DocsSection>

      <DocsReferences groups={[DOC_CROSS_REFS, SOURCE_REFS]} title="Source references" />
    </>
  );
}
