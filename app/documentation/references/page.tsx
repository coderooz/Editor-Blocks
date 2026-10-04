/**
 * @file /app/documentation/references/page.tsx
 * @description The complete reference index: upstream library documentation, this project's
 *              source files, and cross-links within the docs section.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent The content here is entirely registry-driven from @/constants/docs-references.
 *              Add a link to that file and it appears in both this page and the per-page
 *              References sections. Do not duplicate lists into this file.
 * @ai-agent This page is deliberately exhaustive. Per-page reference sections are curated
 *              subsets; this is where a reader can audit every outbound link in one place.
 */

import { DocsTitle, DocsSection } from "@/components/docs/DocsHeading";
import { DocsCallout } from "@/components/docs/DocsCode";
import { DocsReferenceGroupBlock, DocsSourceIndex } from "@/components/docs/DocsReferences";
import { docsMetadata } from "@/components/docs/docs-metadata";
import {
  UPSTREAM_REFS,
  DOC_CROSS_REFS,
  SOURCE_REPO,
  DEFAULT_BRANCH,
} from "@/constants/docs-references";

export const metadata = docsMetadata("/documentation/references");

export default function ReferencesPage() {
  return (
    <>
      <DocsTitle
        eyebrow="Reference"
        title="References"
        description="Every upstream library this project builds on, the source files that implement the documented behaviour, and the related pages in this section."
      />

      <DocsCallout type="info" title="Prefer these over scraping the HTML">
        Two machine-readable entry points cover the same ground in a form designed for
        programmatic consumption: <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">/llm.txt</code>{" "}
        is a compact manifest, and{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">/llms-full.txt</code>{" "}
        contains the entire documentation as one plain-text document.
      </DocsCallout>

      <DocsSection
        title="Source code"
        lead="The files to open when you want to verify a claim or make a change."
      >
        <p className="text-sm text-muted-foreground">
          Links resolve to the{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
            {DEFAULT_BRANCH}
          </code>{" "}
          branch of{" "}
          <a
            href={SOURCE_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            {SOURCE_REPO.replace("https://", "")}
          </a>
          .
        </p>
        <DocsSourceIndex />
      </DocsSection>

      <DocsSection
        title="Upstream documentation"
        lead="Documentation for the libraries in the dependency tree, pinned to the major versions this project uses."
      >
        <div className="space-y-4">
          {UPSTREAM_REFS.map((group) => (
            <DocsReferenceGroupBlock key={group.title} group={group} />
          ))}
        </div>
      </DocsSection>

      <DocsSection
        title="Related pages"
        lead="Everything else in this documentation section, plus the interactive pages on the site."
      >
        <div className="space-y-4">
          {DOC_CROSS_REFS.map((group) => (
            <DocsReferenceGroupBlock key={group.title} group={group} />
          ))}
        </div>
      </DocsSection>

      <DocsSection title="How to read a source link">
        <p>
          Every file in this project carries a structured header comment. The convention is:
        </p>
        <ul className="space-y-2">
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">@file</code>{" "}
            — the path, relative to the repository root.
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">@description</code>{" "}
            — what the file is responsible for, in one or two sentences.
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">@architecture</code>{" "}
            — the pattern the file follows.
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">@ai-agent</code>{" "}
            — invariants and traps. This is the part that will save you from a silent bug; read
            it before editing.
          </li>
          <li>
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">@dependencies</code>{" "}
            — what must be present for the file to work.
          </li>
        </ul>
        <p>
          The highest-value header to read first is{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
            constants/module-registry.ts
          </code>
          . Module metadata lives there and nowhere else — it drives the catalogue, this
          documentation, and the machine-readable manifests simultaneously.
        </p>
      </DocsSection>
    </>
  );
}
