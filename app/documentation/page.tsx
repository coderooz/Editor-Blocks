/**
 * @file /app/documentation/page.tsx
 * @description Documentation landing page — what Editor Blocks is and how modules are structured.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent This is the canonical explanation of the project. Module facts come from
 *            @/constants/module-registry, not from prose, so keep numbers in sync by
 *            reading the registry rather than restating counts by hand.
 * @dependencies Requires EDITOR_MODULES/getActiveEngines from @/constants/module-registry.
 */

import Link from "next/link";
import { ArrowRight, Layers, Package, Wrench, Boxes } from "lucide-react";
import { DocsTitle, DocsSection } from "@/components/docs/DocsHeading";
import { DocsCallout, DocsCode, DocsTable } from "@/components/docs/DocsCode";
import { DocsReferences } from "@/components/docs/DocsReferences";
import { docsMetadata } from "@/components/docs/docs-metadata";
import { DOC_CROSS_REFS, SOURCE_REFS } from "@/constants/docs-references";
import { EDITOR_MODULES, ENGINE_LABELS, getActiveEngines } from "@/constants/module-registry";

const PRINCIPLES = [
  {
    icon: Boxes,
    title: "Modules, not frameworks",
    body: "You install a module that solves one job — a comment box, an article body, a document — not an entire editor framework you then have to configure.",
  },
  {
    icon: Layers,
    title: "Engine-agnostic on purpose",
    body: "Each module declares which editor core powers it. Today that is TipTap. Lexical, ProseMirror, and others are on the roadmap, so swapping engines later is a catalogue change, not a rewrite.",
  },
  {
    icon: Wrench,
    title: "Copy the code",
    body: "Every module is readable source you can vendor into your own repo. No runtime lock-in, no black box, no waiting on a maintainer to add the one option you need.",
  },
  {
    icon: Package,
    title: "One contract",
    body: "All modules accept the same props and expose the same context API, so moving from a comment box to a full document editor is a one-word change.",
  },
];

export const metadata = docsMetadata("/documentation");

export default function DocumentationPage() {
  const engines = getActiveEngines();

  return (
    <>
      <DocsTitle
        eyebrow="Documentation"
        title="Editor Blocks"
        description="A library of ready-to-use, drop-in editor modules for React and Next.js. Pick the module that matches your use case, copy it in, and ship — without hand-assembling a rich-text editor from scratch."
      />

      <DocsSection
        title="What this is"
        lead="Editor Blocks packages a rich-text editor the way shadcn/ui packages components: a small, opinionated, readable implementation you own once you copy it."
      >
        <p>
          Most projects end up building the same editor twice — once for a comment field, once
          for a blog body — and the two implementations drift apart. This project exists to stop
          that. Each <strong>module</strong> is a pre-tuned editor configuration for one specific
          job, with its extension set, toolbar, and constraints already decided.
        </p>
        <p>
          The name is deliberate: these are <em>blocks</em> you place, not a single editor you
          configure. The first release ships four blocks, all backed by{" "}
          {engines.map((engine) => ENGINE_LABELS[engine]).join(", ")}. The architecture is
          engine-agnostic so the catalogue can grow to cover other editors without breaking the
          contract.
        </p>
      </DocsSection>

      <DocsSection
        title="Available modules"
        lead={`${EDITOR_MODULES.length} modules are available today, all currently powered by TipTap.`}
      >
        <DocsTable
          headers={["Module", "Engine", "Tier", "Status", "Best for"]}
          rows={EDITOR_MODULES.map((module) => [
            <Link
              key={module.id}
              href={module.docs}
              className="font-medium text-foreground hover:text-primary"
            >
              {module.title}
            </Link>,
            ENGINE_LABELS[module.engine],
            module.category,
            module.status,
            module.useCases[0],
          ])}
        />
        <p>
          <Link
            href="/modules"
            className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
          >
            Browse the full catalogue
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </p>
      </DocsSection>

      <DocsSection title="How it works">
        <DocsSubsectionList items={PRINCIPLES} />
      </DocsSection>

      <DocsSection title="Quick start">
        <p>Clone the repository and start the dev server:</p>
        <DocsCode
          title="Terminal"
          code={`git clone https://github.com/coderooz/Editor-Blocks.git
cd Editor-Blocks
npm install
npm run dev`}
        />
        <p>
          Then open{" "}
          <a
            href="http://localhost:3000/modules"
            className="font-medium text-primary hover:underline"
          >
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">/modules</code>
          </a>{" "}
          to browse every block, or jump straight to{" "}
          <Link href="/documentation/getting-started" className="font-medium text-primary hover:underline">
            Getting Started
          </Link>
          .
        </p>
      </DocsSection>

      <DocsSection title="Using a module">
        <p>
          Every module is mounted the same way. Pick the type, optionally seed it with content,
          and render it:
        </p>
        <DocsCode
          title="app/comments/page.tsx"
          language="tsx"
          code={`"use client";

import { EditorPage } from "@/components/EditorPage";

export default function CommentsPage() {
  return <EditorPage type="comment" />;
}`}
        />
        <DocsCallout type="info" title="One shared editor instance">
          The root layout wraps every route in a single <code>EditorProvider</code>. That provider
          owns the editor instance and swaps its extension set when the module type changes, so
          the toolbar, extensions, and character counter always agree with each other.
        </DocsCallout>
      </DocsSection>

      <DocsSection title="Project layout">
        <DocsCode
          title="Repository structure"
          code={`app/
  documentation/     # this section
  examples/          # live demo per module
  modules/           # searchable catalogue
constants/
  module-registry.ts # SSOT: every module's metadata
  docs-nav.ts        # SSOT: documentation structure
  EditorExtension.tsx# extension presets
context/
  EditorContext.tsx  # editor instance + module state
components/
  editor/            # toolbar, page shell
  docs/              # documentation primitives
plugin/              # distributable package scaffold`}
        />
      </DocsSection>

      <DocsSection title="Where to go next">
        <ul className="space-y-2">
          <li>
            <Link href="/documentation/getting-started" className="font-medium text-primary hover:underline">
              Getting Started
            </Link>{" "}
            — install, run, and add your first block.
          </li>
          <li>
            <Link href="/documentation/modules" className="font-medium text-primary hover:underline">
              Module Catalogue
            </Link>{" "}
            — capability matrix for every block.
          </li>
          <li>
            <Link href="/documentation/api" className="font-medium text-primary hover:underline">
              API Reference
            </Link>{" "}
            — props, context, and extension presets.
          </li>
          <li>
            <Link href="/documentation/custom-modules" className="font-medium text-primary hover:underline">
              Custom Modules
            </Link>{" "}
            — register a new block or a new engine.
          </li>
          <li>
            <Link href="/documentation/references" className="font-medium text-primary hover:underline">
              References
            </Link>{" "}
            — upstream docs and the source behind every claim on this page.
          </li>
        </ul>
      </DocsSection>

      <DocsReferences groups={[DOC_CROSS_REFS, SOURCE_REFS]} />
    </>
  );
}

function DocsSubsectionList({
  items,
}: {
  items: { icon: typeof Layers; title: string; body: string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.title} className="rounded-lg border bg-muted/20 p-4">
          <div className="flex items-center gap-2">
            <item.icon className="w-4 h-4 text-primary" aria-hidden="true" />
            <h3 className="font-semibold">{item.title}</h3>
          </div>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
