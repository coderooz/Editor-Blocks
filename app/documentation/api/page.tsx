/**
 * @file /app/documentation/api/page.tsx
 * @description API reference for the editor components, context, and extension presets.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent This page documents the public contract. Every symbol here must match the actual
 *            export — if you rename a prop, a context field, or a preset, update this page in
 *            the same change. A stale API page is the most expensive kind of documentation bug
 *            because readers copy from it verbatim.
 * @ai-agent The EditorType table is generated from EDITOR_MODULES, so it cannot drift from the
 *            registry. The prop, context, and menu tables are hand-written and DO need manual
 *            syncing whenever a signature changes.
 * @ai-agent The YouTube section deliberately documents an inline regex rather than an
 *            exported helper, because that is what the code actually does. If you extract it
 *            into a shared utility, rewrite that section to show the real import path — a
 *            snippet that does not resolve is worse than no snippet.
 * @dependencies Requires EDITOR_MODULES for the type table, reference registries for links.
 */

import Link from "next/link";
import { DocsTitle, DocsSection } from "@/components/docs/DocsHeading";
import { DocsCallout, DocsCode, DocsTable } from "@/components/docs/DocsCode";
import { DocsReferences } from "@/components/docs/DocsReferences";
import { docsMetadata } from "@/components/docs/docs-metadata";
import {
  DOC_CROSS_REFS,
  UPSTREAM_REFS,
  SOURCE_REFS,
} from "@/constants/docs-references";
import { EDITOR_MODULES } from "@/constants/module-registry";

export const metadata = docsMetadata("/documentation/api");

export default function ApiReferencePage() {
  return (
    <>
      <DocsTitle
        eyebrow="Reference"
        title="API Reference"
        description="Component props, the editor context API, and the extension presets each module maps to."
      />

      <DocsSection title="EditorPage">
        <p>
          The shell every module is mounted through. Owns the toolbar, the editing surface, and
          the character counter.
        </p>
        <DocsCode
          title="Props"
          language="tsx"
          code={`interface EditorPageProps {
  /** Module id — selects the extension set and toolbar. */
  type: EditorType;
  /** Optional HTML seeded into the editor on first load. */
  initialContent?: string;
}`}
        />
        <DocsTable
          headers={["Prop", "Type", "Required", "Description"]}
          rows={[
            [
              <code key="t" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">type</code>,
              <code key="tt" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">EditorType</code>,
              "Yes",
              "Selects the module. Changing it recreates the editor with that module's extensions and toolbar.",
            ],
            [
              <code key="ic" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">initialContent</code>,
              <code key="ict" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">string</code>,
              "No",
              "HTML applied when the editor is ready. Used to hydrate a saved draft.",
            ],
          ]}
        />
        <p className="text-xs text-muted-foreground">
          A page can mount exactly one editor: the shared provider holds a single instance, so
          nesting a second <code>EditorPage</code> inside another will fight over state.
        </p>
      </DocsSection>

      <DocsSection title="EditorType" lead="The union of module ids the provider understands.">
        <DocsTable
          headers={["Value", "Module", "Extension set"]}
          rows={EDITOR_MODULES.map((module) => [
            <code key={module.id} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
              &quot;{module.id}&quot;
            </code>,
            module.title,
            <code
              key={`${module.id}-set`}
              className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]"
            >
              {module.extensionSet}
            </code>,
          ])}
        />
      </DocsSection>

      <DocsSection title="useEditorContext" lead="Read and drive the editor from anywhere in the tree.">
        <DocsCode
          title="Signature"
          language="tsx"
          code={`interface EditorContextValue {
  /** The live editor instance, or null before it is ready. */
  editor: Editor | null;
  /** Current module id. */
  editorType: EditorType;
  /** Switch module. Recreates the editor. */
  setEditorType: (type: EditorType) => void;
  /** Current HTML, updated on every keystroke. */
  editorContent: string;
  /** Seed or replace the HTML. */
  setEditorContent: (value: string) => void;
  /** Plain-text character count from the current document. */
  charCount: number;
}`}
        />
        <DocsTable
          headers={["Field", "Type", "Description"]}
          rows={[
            [
              <code key="e" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">editor</code>,
              <code key="et" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">Editor | null</code>,
              "Guard for null before calling any command. Null during the first render pass.",
            ],
            [
              <code key="ec" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">editorContent</code>,
              <code key="ect" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">string</code>,
              "HTML string. Sanitise before persisting or rendering elsewhere.",
            ],
            [
              <code key="cc" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">charCount</code>,
              <code key="cct" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">number</code>,
              "Length of the document's plain text. Differs from HTML length.",
            ],
            [
              <code key="st" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">setEditorType</code>,
              <code key="stt" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">(t: EditorType) =&gt; void</code>,
              "Swaps the module. Destroys the current editor, so content and undo history are lost.",
            ],
          ]}
        />
        <DocsCallout type="info" title="Guard the null editor">
          On the server and during the first client render the editor is{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">null</code>.
          Always check before calling chain commands, or the toolbar will throw on first paint.
        </DocsCallout>
      </DocsSection>

      <DocsSection title="Extension presets" lead="Exported from constants/EditorExtension.tsx.">
        <DocsCode
          title="Presets"
          language="tsx"
          code={`import {
  DEFAULT_EXTENSIONS,      // core building blocks
  COMPLEX_EXTENSIONS,      // DEFAULT + headings, tables, media, embeds
  BLOG_EXTENSIONS,         // alias of COMPLEX, for long-form content
  DOCUMENT_EXTENSIONS,     // COMPLEX + CharacterCount (textSize)
  COMMENT_EXTENSIONS,      // DEFAULT + CharacterCount (limit 2500, nodeSize)
  PRESENTATION_EXTENSIONS, // COMPLEX + CharacterCount (textSize)
} from "@/constants/EditorExtension";`}
        />
        <DocsCallout type="warning" title="Register links exactly once">
          The link mark is provided by a custom MarkdownLink extension. Registering both it and
          the stock Link extension yields two extensions with the same name, which TipTap warns
          about and which breaks link input rules.
        </DocsCallout>
      </DocsSection>

      <DocsSection title="Toolbar menu definitions">
        <p>
          Toolbar items are plain data, grouped by category. Adding a button means appending an
          object to the relevant menu array — no component changes required.
        </p>
        <DocsCode
          title="Menu item shape"
          language="tsx"
          code={`const MyButton: MenuItem = {
  title: "Strikethrough",
  group: "styling",          // controls the toolbar separator
  type: "button",
  icon: Strikethrough,
  isActive: (editor) => editor.isActive("strike"),
  action: (editor) => editor.chain().focus().toggleStrike().run(),
};`}
        />
        <DocsTable
          headers={["Type", "Renders", "Required fields"]}
          rows={[
            [<code key="b" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">button</code>, "Icon button", "title, group"],
            [<code key="d" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">dropdown</code>, "Select", "title, group, options, onSelect"],
            [<code key="i" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">input</code>, "Text or colour input", "title, group, inputType, onSelect"],
            [<code key="m" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">model</code>, "Dialog", "title, group, model"],
          ]}
        />
      </DocsSection>

      <DocsSection title="YouTube embed">
        <p>
          The Document module's YouTube button opens a dialog that validates the pasted URL,
          extracts the 11-character video ID, and inserts a sized embed. The extraction is
          currently an inline regex inside the dialog component rather than an exported
          utility:
        </p>
        <DocsCode
          title="components/models/youtube.tsx"
          language="tsx"
          code={`const videoIdMatch = src.match(
  /(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/
);
if (!videoIdMatch) {
  alert("Please enter a valid YouTube URL");
  return;
}

const videoId = videoIdMatch[1];
const embedUrl = \`https://www.youtube.com/embed/\${videoId}\`;

editor.chain().focus().setYoutubeVideo({ src: embedUrl, width, height }).run();`}
        />
        <DocsCallout type="info" title="Not exported yet">
          This is the one place where the docs describe behaviour rather than a public export.
          If you plan to validate YouTube URLs outside this dialog, extract the regex into a
          shared helper first and update this section.
        </DocsCallout>
      </DocsSection>

      <DocsSection title="Related">
        <ul className="space-y-2">
          <li>
            <Link href="/documentation/architecture" className="font-medium text-primary hover:underline">
              Architecture
            </Link>{" "}
            — how the pieces fit together at runtime.
          </li>
          <li>
            <Link href="/documentation/custom-modules" className="font-medium text-primary hover:underline">
              Custom Modules
            </Link>{" "}
            — add a module or a new engine.
          </li>
          <li>
            <Link href="/documentation/references" className="font-medium text-primary hover:underline">
              References
            </Link>{" "}
            — upstream API docs and the source files for everything on this page.
          </li>
        </ul>
      </DocsSection>

      <DocsReferences groups={[DOC_CROSS_REFS, UPSTREAM_REFS, SOURCE_REFS]} />
    </>
  );
}
