/**
 * @file /app/documentation/roadmap/page.tsx
 * @description Planned editor cores, packaging, and catalogue work.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent PLANNED_ENGINES and PLANNED_WORK are aspirational design notes, not commitments.
 *            Keep the "Plans, not commitments" callout in place so nobody reads this page as a
 *            shipping date.
 * @ai-agent The planned engine names must stay valid values of the EditorEngine union in
 *            @/constants/module-registry. If you add an engine here that is not in the type,
 *            the catalogue cannot represent it and the plan is fiction.
 * @dependencies Requires EDITOR_MODULES for current-state accuracy, reference registries.
 */

import Link from "next/link";
import { DocsTitle, DocsSection } from "@/components/docs/DocsHeading";
import { DocsCallout, DocsTable } from "@/components/docs/DocsCode";
import { DocsReferences } from "@/components/docs/DocsReferences";
import { docsMetadata } from "@/components/docs/docs-metadata";
import { DOC_CROSS_REFS, SOURCE_REFS } from "@/constants/docs-references";
import { EDITOR_MODULES } from "@/constants/module-registry";

const PLANNED_ENGINES = [
  {
    engine: "Lexical",
    why: "Meta's editor, first-class React model, strong a11y story.",
    tradeoff: "Different command API — needs the adapter layer before any module ships.",
  },
  {
    engine: "ProseMirror",
    why: "The layer TipTap itself sits on. Maximum control, maximum surface area.",
    tradeoff: "Verbose. Best reserved for modules that need schema-level control.",
  },
  {
    engine: "BlockNote",
    why: "Block-based model closest to a document editor out of the box.",
    tradeoff: "Its own styling system; needs a theme bridge to match this project.",
  },
  {
    engine: "Slate",
    why: "Flexible value model, strong for highly custom inline behaviour.",
    tradeoff: "Most work per module. Manual serialisation and normalisation.",
  },
  {
    engine: "Quill",
    why: "Mature Delta format, small runtime, easy to embed.",
    tradeoff: "Smaller extension ecosystem than TipTap.",
  },
];

const PLANNED_WORK = [
  {
    title: "Publish the distributable package",
    detail:
      "The plugin/ scaffold holds the extracted module sources. Publishing turns the copy-paste workflow into an npm install while keeping source access.",
  },
  {
    title: "Per-host configuration",
    detail:
      "Presets are static arrays today. An options-merge layer would let a host app adjust limits, allowed MIME types, and toolbar items without editing constants.",
  },
  {
    title: "Multiple editors per page",
    detail:
      "The shared provider holds one instance. A scoped-provider refactor would allow a comment box and a document editor on the same route.",
  },
  {
    title: "Accessibility audit",
    detail:
      "Toolbar semantics, focus restoration after dialogs, and contrast verification across the full extension set.",
  },
  {
    title: "Test coverage",
    detail:
      "Unit tests for the registry and the YouTube URL parser, plus end-to-end coverage of toolbar commands per module.",
  },
];

export const metadata = docsMetadata("/documentation/roadmap");

export default function RoadmapPage() {
  return (
    <>
      <DocsTitle
        eyebrow="Reference"
        title="Roadmap"
        description="Where Editor Blocks is headed. Every module currently ships on TipTap; the catalogue is being widened from there."
      />

      <DocsSection
        title="Where things stand"
        lead={`${EDITOR_MODULES.length} modules are live, all on TipTap.`}
      >
        <DocsTable
          headers={["Module", "Engine", "Status"]}
          rows={EDITOR_MODULES.map((module) => [module.title, module.engine, module.status])}
        />
        <DocsCallout type="info" title="Plans, not commitments">
          Engine entries below are reserved type values and design notes, not shipped work.
          Nothing on this page is implemented yet.
        </DocsCallout>
      </DocsSection>

      <DocsSection
        title="Planned editor cores"
        lead="Each of these is already a valid value in the EditorEngine type."
      >
        <DocsTable
          headers={["Engine", "Why it fits", "Trade-off"]}
          rows={PLANNED_ENGINES.map((entry) => [
            entry.engine,
            entry.why,
            entry.tradeoff,
          ])}
        />
      </DocsSection>

      <DocsSection title="Platform work" lead="Not engine-specific — these apply to the catalogue as a whole.">
        <div className="grid gap-4">
          {PLANNED_WORK.map((item) => (
            <div key={item.title} className="rounded-lg border p-4">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Contributing a module">
        <p>
          A module that others can use is worth more than a narrowly tailored one. Before
          opening a proposal, check the{" "}
          <Link href="/documentation/custom-modules" className="font-medium text-primary hover:underline">
            Custom Modules
          </Link>{" "}
          guide — the registry is the contract, and a module that cannot be described through it
          will not fit the catalogue cleanly.
        </p>
      </DocsSection>

      <DocsReferences
        groups={[DOC_CROSS_REFS, SOURCE_REFS]}
        title="Source references"
      />
    </>
  );
}
