/**
 * @file /components/examples/InstallGuide.tsx
 * @description "Use this module in your project" panel shown on every example page. Two tabs:
 *              a default copy-paste tab that gets a developer to a working editor by pasting
 *              two files, and a step-by-step guide for readers who want to vendor this
 *              project's real architecture instead.
 * @architecture Next.js App Router (Client Component — Radix Tabs is interactive, so the
 *               panel must cross a client boundary; CodeBlock still renders its highlight
 *               tree the same way it does under the server docs pages).
 * @ai-agent Tab order and `defaultValue` are deliberate: "code" is both first and default,
 *           because this section exists to get a developer to working code in one copy. Do
 *           not reorder to put the guide first — that reverts the panel to a wall of prose.
 * @ai-agent NOTHING in the copy-paste tab requires cloning, downloading or installing this
 *           project. A developer pastes two files into their own repo. Do not reintroduce a
 *           `git clone` requirement here — it defeats the purpose of the product.
 * @ai-agent The two tabs ship DIFFERENT install commands and that is intentional. The
 *           copy-paste tab installs only the packages its own snippet imports; the
 *           step-by-step tab installs this repo's real dependency set. Each is accurate for
 *           its own path. Neither may mention @tiptap/starter-kit (audit EB-AUDIT-018) —
 *           this project uses individual @tiptap/extension-* packages instead.
 * @ai-agent SNIPPET_* below are compile-verified, not hand-written prose. They were checked
 *           with `npx tsc --noEmit` and the rules below are load-bearing — see
 *           .workspace/sessions/SESSIONS_VERIFIED_SNIPPETS_20261004.md for the archive.
 *             • No `@/` alias imports, no EditorContext, no menu registry → drops into any
 *               Next.js app without alias fixes.
 *             • No `@tiptap/core` import — it is an undeclared transitive dep and would
 *               break a consumer's install.
 *             • No `@tiptap/starter-kit` — not installed here, contents unverified, and
 *               re-registering Link beside a separate link extension is a duplicate-name error.
 *             • BulletList/ListItem/OrderedList come from @tiptap/extension-list (there is no
 *               @tiptap/extension-bullet-list package); CharacterCount from
 *               @tiptap/extensions; Placeholder and Heading are NAMED exports.
 *             • The tools array is built after `if (!editor) return null` so TypeScript can
 *               infer the editor type without importing @tiptap/core.
 *           The component/interface names are the only substituted tokens (__COMPONENT__,
 *           __PROPS__) — keep it that way so a rename cannot silently desync the snippet
 *           from the component it is supposed to define.
 * @ai-agent The snippet is generated from the module id rather than hardcoded per page, so a
 *           new example page gets a correct snippet for free. Keep in sync with
 *           constants/module-registry.ts — a new module needs a registry entry, a
 *           getSampleContent() entry, and a three-line route under app/examples/. The
 *           /documentation/modules/<id> page is generated automatically.
 * @dependencies Requires Tabs primitives from components/ui/tabs, <CodeBlock />, module
 *               metadata from the registry.
 */

import Link from "next/link";
import { ArrowRight, BookOpen, Copy, FileCode2, Info, Terminal } from "lucide-react";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ENGINE_LABELS, type EditorModule } from "@/constants/module-registry";
import { getSampleContent } from "@/constants/sample-content";

/* -------------------------------------------------------------------------- */
/* Per-module derivations                                                      */
/* -------------------------------------------------------------------------- */

/** `comment` → `Comment`, so the snippet component is always `<Name>Editor`. */
function pascalCase(value: string): string {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/** The component name the developer creates, e.g. `CommentEditor`. */
function componentName(module: EditorModule): string {
  return `${pascalCase(module.id)}Editor`;
}

/**
 * Where the developer puts the component in THEIR repo.
 *
 * @ai-agent Keyed off `module.id`, not `module.href`. `href` is this project's own demo
 *           route (`/examples/docs`) and would tell a consumer to create
 *           `app/examples/docs/page.tsx`, which is wrong for them.
 */
function consumerComponentPath(module: EditorModule): string {
  return `components/${componentName(module)}.tsx`;
}

/** Where the developer puts the route in THEIR repo, e.g. `app/comment/page.tsx`. */
function consumerRoutePath(module: EditorModule): string {
  return `app/${module.id}/page.tsx`;
}

/**
 * The comment module is the only one with a hard character ceiling and the only one that
 * omits headings/links. Everything else gets the extended snippet.
 */
function isMinimalVariant(module: EditorModule): boolean {
  return module.id === "comment";
}

/* -------------------------------------------------------------------------- */
/* Copy-paste tab: install commands                                            */
/* -------------------------------------------------------------------------- */

/**
 * Install command for the copy-paste snippet.
 *
 * @ai-agent Deliberately minimal: it is exactly the import list of the snippet below.
 *           No `\` line continuations — these must paste cleanly into PowerShell.
 */
function snippetInstallCommand(minimal: boolean): string {
  const base = `# 1. Editor core + ProseMirror (a peer dependency of @tiptap/react)
npm install @tiptap/react @tiptap/pm

# 2. The formatting extensions the component below imports
npm install @tiptap/extension-bold @tiptap/extension-document @tiptap/extension-paragraph @tiptap/extension-text @tiptap/extension-italic @tiptap/extension-strike @tiptap/extension-underline @tiptap/extension-code @tiptap/extension-list @tiptap/extension-placeholder @tiptap/extensions`;

  if (!minimal) {
    return `${base}

# 3. Headings, quotes, links and highlighting (extended variant only)
npm install @tiptap/extension-heading @tiptap/extension-blockquote @tiptap/extension-link @tiptap/extension-highlight`;
  }

  return base;
}

/**
 * Install command for the full vendoring path — this repo's real dependency set.
 *
 * @ai-agent Derived from package.json, not hand-typed. Intentionally excludes
 *           @tiptap/starter-kit: this project does not use it (EB-AUDIT-018).
 */
const fullInstallCommand = `# 1. Editor engine + ProseMirror
npm install @tiptap/react @tiptap/pm @tiptap/extensions lowlight

# 2. Extension presets imported by constants/EditorExtension.tsx
npm install @tiptap/extension-blockquote @tiptap/extension-bold @tiptap/extension-code @tiptap/extension-code-block-lowlight @tiptap/extension-details @tiptap/extension-document @tiptap/extension-file-handler @tiptap/extension-heading @tiptap/extension-highlight @tiptap/extension-horizontal-rule @tiptap/extension-image @tiptap/extension-italic @tiptap/extension-link @tiptap/extension-list @tiptap/extension-paragraph @tiptap/extension-placeholder @tiptap/extension-strike @tiptap/extension-subscript @tiptap/extension-superscript @tiptap/extension-table @tiptap/extension-text @tiptap/extension-text-align @tiptap/extension-text-style @tiptap/extension-typography @tiptap/extension-underline @tiptap/extension-youtube

# 3. Radix primitives used by the toolbar and dialogs
npm install @radix-ui/react-dialog @radix-ui/react-hover-card @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-slot @radix-ui/react-tabs`;

/* -------------------------------------------------------------------------- */
/* Copy-paste tab: the component snippet (compile-verified)                    */
/* -------------------------------------------------------------------------- */

/**
 * Minimal variant — the comment module. No headings or links, hard 2,500-char limit.
 *
 * @ai-agent VERIFIED with `tsc --noEmit`. See the header note before editing.
 */
const MINIMAL_SNIPPET = `"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import Placeholder from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extensions";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";

interface __PROPS__Props {
  onChange?: (html: string) => void;
  initialHTML?: string;
}

export function __COMPONENT__({ onChange, initialHTML = "" }: __PROPS__Props) {
  // TipTap owns its document outside React. Bumping a counter on update is what makes the
  // toolbar's active states and the character counter re-render.
  const [, setRevision] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Strike,
      Code,
      BulletList,
      OrderedList,
      ListItem,
      Placeholder.configure({ placeholder: "Add a comment…" }),
      CharacterCount.configure({ limit: 2500, mode: "textSize" }),
    ],
    content: initialHTML,
    onUpdate: ({ editor: next }) => {
      setRevision((r) => r + 1);
      onChange?.(next.getHTML());
    },
  });

  if (!editor) return null;

  const chars = editor.state.doc.textContent.length;

  const tools = [
    {
      label: "Bold",
      pressed: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      pressed: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      pressed: editor.isActive("underline"),
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Strike",
      pressed: editor.isActive("strike"),
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "Bulleted list",
      pressed: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      pressed: editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Inline code",
      pressed: editor.isActive("code"),
      run: () => editor.chain().focus().toggleCode().run(),
    },
  ];

  return (
    <div className="rounded-xl border">
      <div
        role="toolbar"
        aria-label="Formatting"
        aria-orientation="horizontal"
        className="flex flex-wrap gap-1 border-b p-2"
      >
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={tool.pressed}
            onClick={tool.run}
            className="rounded px-2 py-1 text-sm hover:bg-muted aria-pressed:bg-accent"
          >
            {tool.label}
          </button>
        ))}
      </div>

      <EditorContent editor={editor} className="min-h-32 p-3" />

      <p className="border-t px-3 py-1.5 text-xs text-muted-foreground">
        {chars.toLocaleString()} / 2,500 characters
      </p>
    </div>
  );
}`;

/**
 * Extended variant — content, document and presentation modules.
 *
 * @ai-agent VERIFIED with `tsc --noEmit`. See the header note before editing.
 */
const EXTENDED_SNIPPET = `"use client";

import { useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import Placeholder from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extensions";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import { Heading } from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";

interface __PROPS__Props {
  onChange?: (html: string) => void;
  initialHTML?: string;
}

export function __COMPONENT__({ onChange, initialHTML = "" }: __PROPS__Props) {
  const [, setRevision] = useState(0);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Document,
      Paragraph,
      Text,
      Bold,
      Italic,
      Underline,
      Strike,
      Code,
      BulletList,
      OrderedList,
      ListItem,
      Heading.configure({ levels: [1, 2, 3] }),
      Blockquote,
      Link.configure({ openOnClick: true, autolink: true }),
      Highlight,
      CharacterCount,
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content: initialHTML,
    onUpdate: ({ editor: next }) => {
      setRevision((r) => r + 1);
      onChange?.(next.getHTML());
    },
  });

  if (!editor) return null;

  const chars = editor.state.doc.textContent.length;

  const tools = [
    {
      label: "Bold",
      pressed: editor.isActive("bold"),
      run: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: "Italic",
      pressed: editor.isActive("italic"),
      run: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: "Underline",
      pressed: editor.isActive("underline"),
      run: () => editor.chain().focus().toggleUnderline().run(),
    },
    {
      label: "Strike",
      pressed: editor.isActive("strike"),
      run: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: "Heading",
      pressed: editor.isActive("heading", { level: 2 }),
      run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      label: "Quote",
      pressed: editor.isActive("blockquote"),
      run: () => editor.chain().focus().toggleBlockquote().run(),
    },
    {
      label: "Bulleted list",
      pressed: editor.isActive("bulletList"),
      run: () => editor.chain().focus().toggleBulletList().run(),
    },
    {
      label: "Numbered list",
      pressed: editor.isActive("orderedList"),
      run: () => editor.chain().focus().toggleOrderedList().run(),
    },
    {
      label: "Inline code",
      pressed: editor.isActive("code"),
      run: () => editor.chain().focus().toggleCode().run(),
    },
    {
      label: "Highlight",
      pressed: editor.isActive("highlight"),
      run: () => editor.chain().focus().toggleHighlight().run(),
    },
    {
      label: "Link",
      pressed: editor.isActive("link"),
      run: () => {
        if (editor.isActive("link")) {
          editor.chain().focus().unsetLink().run();
          return;
        }
        const href = window.prompt("Link URL", "https://");
        if (href) editor.chain().focus().setLink({ href }).run();
      },
    },
  ];

  return (
    <div className="rounded-xl border">
      <div
        role="toolbar"
        aria-label="Formatting"
        aria-orientation="horizontal"
        className="flex flex-wrap gap-1 border-b p-2"
      >
        {tools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={tool.pressed}
            onClick={tool.run}
            className="rounded px-2 py-1 text-sm hover:bg-muted aria-pressed:bg-accent"
          >
            {tool.label}
          </button>
        ))}
      </div>

      <EditorContent editor={editor} className="min-h-40 p-3" />

      <p className="border-t px-3 py-1.5 text-xs text-muted-foreground">
        {chars.toLocaleString()} characters
      </p>
    </div>
  );
}`;

/** Substitutes the component and props-interface names into a verified snippet. */
function renderSnippet(template: string, name: string): string {
  return template.replaceAll("__COMPONENT__", name).replaceAll("__PROPS__", name);
}

/* -------------------------------------------------------------------------- */
/* Copy-paste tab: route + persistence snippets                                */
/* -------------------------------------------------------------------------- */

function routeSnippet(name: string): string {
  return `"use client";

import { ${name} } from "@/components/${name}";

export default function Page() {
  return (
    <${name}
      onChange={(html) => {
        // html is raw HTML — sanitise it before persisting (see step 4).
        console.log(html);
      }}
    />
  );
}`;
}

function hydrateSnippet(name: string): string {
  return `import { ${name} } from "@/components/${name}";

// Passing initialHTML hydrates the editor with a saved document.
export default function Page() {
  return <${name} initialHTML={savedHtml} onChange={(html) => save(html)} />;
}`;
}

const SANITISE_SNIPPET = `import DOMPurify from "dompurify";

export async function saveComment(html: string) {
  // The editor emits raw HTML by design, which is also an injection vector.
  // Sanitise on the server before the value reaches a database.
  const safe = DOMPurify.sanitize(html);

  await fetch("/api/comments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body: safe }),
  });
}`;

/* -------------------------------------------------------------------------- */
/* Step-by-step tab: the full vendoring file inventory                         */
/* -------------------------------------------------------------------------- */

interface VendoredFile {
  path: string;
  purpose: string;
}

/**
 * The files this repo's real architecture needs, and why each one exists.
 *
 * @ai-agent Copying individual files is the RECOMMENDED path; cloning is offered further
 *           down as an optional shortcut. Keep `path` values real — a developer will paste
 *           them straight into a file manager.
 */
const VENDORED_FILES: VendoredFile[] = [
  {
    path: "constants/EditorExtension.tsx",
    purpose:
      "The extension presets. Every module type (comment, content, document) resolves to one of the exported arrays here, so the editor configuration lives in exactly one place.",
  },
  {
    path: "constants/EditorMenuOptions.ts",
    purpose:
      "Toolbar definitions. Keeping the button list separate from the extension list is what lets the same editor expose a different toolbar per module without duplicating the editor itself.",
  },
  {
    path: "context/EditorContext.tsx",
    purpose:
      "Creates the editor instance once and shares it, plus the current HTML and character count, with the toolbar and any save button. This is the only file that needs a provider.",
  },
  {
    path: "components/EditorPage.tsx",
    purpose:
      "The shell that composes toolbar, editing surface and counter. This is the component a route renders.",
  },
  {
    path: "components/EditorMenuBar.tsx",
    purpose:
      "Renders the toolbar from EditorMenuOptions and keeps each button's active state in sync with the cursor.",
  },
  {
    path: "components/models/",
    purpose:
      "The link, image and YouTube dialogs. Only needed if you want those nodes; a plain text module can skip this directory entirely.",
  },
];

/** Route snippet for the full vendoring path — renders the shared EditorPage shell. */
function mountSnippet(id: string): string {
  return `"use client";

import { EditorPage } from "@/components/EditorPage";

export default function Page() {
  return <EditorPage type="${id}" />;
}`;
}

const READ_BACK_SNIPPET = `"use client";

import { useEditorContext } from "@/context/EditorContext";

export function SaveButton() {
  const { editorContent, charCount } = useEditorContext();

  return (
    <button onClick={() => save({ html: editorContent, chars: charCount })}>
      Save draft
    </button>
  );
}`;

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

export function InstallGuide({ module }: { module: EditorModule }) {
  const hasSample = Boolean(getSampleContent(module.id));
  const engineLabel = ENGINE_LABELS[module.engine];

  const name = componentName(module);
  const minimal = isMinimalVariant(module);
  const componentPath = consumerComponentPath(module);
  const routePath = consumerRoutePath(module);

  const installCode = snippetInstallCommand(minimal);
  const snippet = renderSnippet(minimal ? MINIMAL_SNIPPET : EXTENDED_SNIPPET, name);
  const mountCode = mountSnippet(module.id);
  const hydrateCode = hydrateSnippet(name);

  return (
    <section
      aria-labelledby="install-guide-heading"
      className="rounded-xl border bg-card p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-center gap-2">
        <Terminal className="w-5 h-5 text-primary" aria-hidden="true" />
        <h2
          id="install-guide-heading"
          className="text-xl font-semibold scroll-mt-28"
        >
          Use this module in your project
        </h2>
      </div>

      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        You do not need to clone or download anything. Copy two files into your own repo and
        the {module.title} is yours &mdash; there is no runtime dependency on this project.
      </p>

      <Tabs defaultValue="code" className="mt-5">
        <TabsList>
          <TabsTrigger value="code">Copy-paste code</TabsTrigger>
          <TabsTrigger value="guide">Step-by-step guide</TabsTrigger>
        </TabsList>

        {/* ---------------------------------------------- Default: copy the code */}
        <TabsContent value="code" className="mt-5">
          <ol className="space-y-6">
            <Step
              number={1}
              title="Install the editor packages"
              description={`TipTap ships as individually-imported packages, so your app only pays for what it actually registers. This command lists exactly what the component in step 2 imports — nothing missing, and nothing unused.`}
            >
              <CodeBlock title="Terminal" language="bash" code={installCode} />
            </Step>

            <Step
              number={2}
              title={`Create ${componentPath}`}
              description={`The whole module in one file. It owns its editor instance, toolbar and character counter, and deliberately imports no EditorContext and no menu registry, so it drops into any Next.js app without fixing path aliases. The extensions and tools arrays are what make this a ${module.title} rather than a plain textarea.`}
            >
              <CodeBlock title={componentPath} language="tsx" code={snippet} />
            </Step>

            <Step
              number={3}
              title={`Create ${routePath}`}
              description={`The App Router needs one page.tsx per URL, so this is the only file that connects the component to a route. Its onChange handler is where you persist — the editor hands you HTML on every keystroke.`}
            >
              <CodeBlock title={routePath} language="tsx" code={routeSnippet(name)} />
              {hasSample && (
                <>
                  <p className="text-sm text-muted-foreground">
                    To reopen a document you saved earlier, pass it back as{" "}
                    <Code>initialHTML</Code>:
                  </p>
                  <CodeBlock
                    title={`${routePath} — hydrating a saved document`}
                    language="tsx"
                    code={hydrateCode}
                  />
                </>
              )}
            </Step>

            <Step
              number={4}
              title="Sanitise before you save"
              description={`The editor emits raw HTML by design, which is also an injection vector: anyone who can post a comment can post a script tag. Run the value through a sanitiser on the server before it reaches a database. DOMPurify is the usual choice.`}
            >
              <CodeBlock title="app/api/comments/route.ts" language="tsx" code={SANITISE_SNIPPET} />
            </Step>
          </ol>

          <p className="mt-6 flex gap-3 rounded-lg border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
            <Info className="mt-0.5 w-4 h-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <strong className="text-foreground">What you just copied.</strong> This is a
              deliberately minimal, self-contained reproduction of the {module.title} — not the
              byte-for-byte source of the module running on this page. It gives you the same
              editing behaviour in one pasteable file. If you want this project&apos;s real
              architecture instead, including every extension, dialog and toolbar option, use
              the <strong className="text-foreground">Step-by-step guide</strong> tab.
            </span>
          </p>
        </TabsContent>

        {/* ------------------------------------------- Explanation / step-by-step */}
        <TabsContent value="guide" className="mt-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            This tab is for vendoring the <strong className="text-foreground">real</strong>{" "}
            architecture behind the {module.title} &mdash; the shared editor context, the
            per-module toolbar definitions and the dialogs. It is more files than the
            copy-paste tab, and it is the path to take if you plan to run several of these
            modules in one app.
          </p>

          <ol className="mt-5 space-y-6">
            <Step
              number={1}
              title="Decide how much you need"
              description={`Two options, and picking the wrong one is the usual reason this feels heavy. If you only need one editor, the copy-paste tab is smaller and has no shared context to maintain. Vendor the full architecture when you want several modules to share one editor instance, one toolbar definition set and one set of dialogs — otherwise you are copying context plumbing you will never read.`}
            />

            <Step
              number={2}
              title="Install the dependencies"
              description={`This module is backed by ${engineLabel}. The command below matches this project's real package.json, which is why it is longer than the one on the copy-paste tab — it covers every extension in the catalogue, not just this module.`}
            >
              <CodeBlock title="Terminal" language="bash" code={fullInstallCommand} />
              <p className="text-xs text-muted-foreground">
                There is no published <Code>editor-blocks</Code> package yet. The intent is a
                copy-the-source workflow first, npm second.
              </p>
            </Step>

            <Step
              number={3}
              title="Copy the files this module needs"
              description="Six files carry the whole architecture. Copy only the ones you need — the dialogs in the last row are optional, and a text-only module never touches them."
            >
              <ul className="divide-y rounded-lg border">
                {VENDORED_FILES.map((file) => (
                  <li key={file.path} className="grid gap-1 p-3 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] sm:gap-4">
                    <code className="flex items-start gap-2 font-mono text-xs font-medium text-foreground">
                      <FileCode2
                        className="mt-0.5 w-3.5 h-3.5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      {file.path}
                    </code>
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {file.purpose}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground">
                Cloning is an optional shortcut if you would rather not copy file by file
                &mdash; but nothing here requires it:
              </p>
              <CodeBlock
                title="Optional — clone and copy from here"
                language="bash"
                code={`git clone https://github.com/coderooz/Editor-Blocks.git`}
              />
            </Step>

            <Step
              number={4}
              title="Mount the route"
              description="One page per URL is all the App Router needs. The EditorProvider already wraps the app in app/layout.tsx, so the page itself is three lines."
            >
              <CodeBlock title={routePath} language="tsx" code={mountCode} />
            </Step>

            <Step
              number={5}
              title="Read the value back and save it"
              description="The editor keeps its HTML in context, so a save button anywhere in the tree can read it without prop-drilling. Sanitise on the server before the value reaches a database."
            >
              <CodeBlock title="components/SaveButton.tsx" language="tsx" code={READ_BACK_SNIPPET} />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Sanitise before you persist.</strong> Run
                the HTML through DOMPurify or{" "}
                <Code>sanitize-html</Code> before it reaches a database or another domain.
              </p>
            </Step>
          </ol>
        </TabsContent>
      </Tabs>

      <div className="mt-8 flex flex-wrap gap-3 border-t pt-6">
        <Link
          href="/documentation/getting-started"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          Full getting started guide
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <Link
          href={module.docs}
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          <Copy className="w-4 h-4" aria-hidden="true" />
          {module.title} reference
        </Link>
        <Link
          href="/documentation/api"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          API reference
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

/** Inline monospace styling for identifiers mentioned inside prose. */
function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">{children}</code>
  );
}

/**
 * One labelled step: number, name, description (which states *why* the step exists), and
 * an optional code block or supporting content.
 *
 * @ai-agent `description` is not optional on purpose. An earlier version of this panel
 *           told developers what to do without saying why, which was the reported problem.
 *           Every step must justify itself.
 */
function Step({
  number,
  title,
  description,
  children,
}: {
  number: number;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="grid gap-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-4">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
      >
        {number}
      </span>
      <div className="min-w-0 [&>*+*]:mt-3">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
        {children}
      </div>
    </li>
  );
}