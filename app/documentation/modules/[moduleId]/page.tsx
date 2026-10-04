/**
 * @file /app/documentation/modules/[moduleId]/page.tsx
 * @description Detail page for a single editor module, generated from the module registry.
 * @architecture Next.js App Router (Server Component, dynamic segment with static generation)
 * @ai-agent This route is data-driven. Adding an entry to EDITOR_MODULES automatically
 *            creates /documentation/modules/<id> — no new file required. If a module id
 *            is not in the registry this route calls notFound() on purpose, which keeps
 *            the registry authoritative and prevents hand-maintained pages drifting.
 * @ai-agent The sibling list at the bottom is filtered from the same registry, so it always
 *            shows every other module regardless of tier or status.
 * @ai-agent Source links use sourceLink() from @/constants/docs-references rather than raw
 *            hrefs, so the repository and branch live in one place.
 * @dependencies Requires EDITOR_MODULES/getModule from @/constants/module-registry, sourceLink
 *              from @/constants/docs-references.
 */

import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, ExternalLink } from "lucide-react";
import { DocsTitle, DocsSection } from "@/components/docs/DocsHeading";
import { DocsCallout, DocsTable } from "@/components/docs/DocsCode";
import { sourceLink } from "@/constants/docs-references";
import {
  EDITOR_MODULES,
  ENGINE_LABELS,
  getModule,
  type EditorModule,
} from "@/constants/module-registry";

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

/** Pre-renders one static page per module in the registry. */
export function generateStaticParams() {
  return EDITOR_MODULES.map((module) => ({ moduleId: module.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleId } = await params;
  const module = getModule(moduleId);

  if (!module) return { title: "Module not found" };

  return {
    title: `${module.title} — ${ENGINE_LABELS[module.engine]} Module`,
    description: module.summary,
    keywords: [module.id, module.category, ENGINE_LABELS[module.engine], "editor module"],
  };
}

export default async function ModuleDetailPage({ params }: PageProps) {
  const { moduleId } = await params;
  const module = getModule(moduleId);

  if (!module) notFound();

  const siblings = EDITOR_MODULES.filter((m) => m.id !== module.id);
  const engineLabel = ENGINE_LABELS[module.engine];

  return (
    <>
      <DocsTitle
        eyebrow={`${engineLabel} module`}
        title={module.title}
        description={module.summary}
      />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {engineLabel} {module.engineVersion}
        </span>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {module.category}
        </span>
        <span
          className={
            module.status === "stable"
              ? "rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              : "rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400"
          }
        >
          {module.status}
        </span>
      </div>

      <DocsSection title="Overview">{module.description}</DocsSection>

      <DocsSection title="When to use it">
        <ul className="space-y-1.5">
          {module.useCases.map((useCase) => (
            <li key={useCase} className="flex gap-2">
              <span className="text-primary" aria-hidden="true">
                •
              </span>
              {useCase}
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Capabilities">
        <ul className="grid gap-1.5 sm:grid-cols-2">
          {module.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="text-primary" aria-hidden="true">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection
        title="Technical details"
        lead="How this module is wired up under the hood."
      >
        <DocsTable
          headers={["Property", "Value"]}
          rows={[
            ["Module id", <code key="id" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">{module.id}</code>],
            ["Engine", `${engineLabel} ${module.engineVersion}`],
            ["Extension set", <code key="set" className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">{module.extensionSet}</code>],
            ["Feature tier", module.category],
            ["Status", module.status],
            ["Feature count", String(module.features.length)],
            ["Extension count", String(module.extensions.length)],
          ]}
        />
        <p className="text-xs text-muted-foreground">
          The extension set is exported from{" "}
          <a
            href={sourceLink("constants/EditorExtension.tsx")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            constants/EditorExtension.tsx
          </a>{" "}
          and resolved by the editor provider when this module type is active. The metadata on
          this page comes from{" "}
          <a
            href={sourceLink("constants/module-registry.ts")}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            constants/module-registry.ts
          </a>
          .
        </p>
      </DocsSection>

      <DocsSection title="Extensions included">
        <div className="flex flex-wrap gap-1.5">
          {module.extensions.map((ext) => (
            <span
              key={ext}
              className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
            >
              {ext}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Each extension is an official TipTap package unless noted. Look up any of them in the{" "}
          <a
            href="https://tiptap.dev/docs/editor/extensions"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            TipTap extension reference
          </a>
          .
        </p>
      </DocsSection>

      <DocsSection title="Usage">
        <ModuleUsage module={module} />
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            href={module.href}
            className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
          >
            Try {module.title} live
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link
            href="/documentation/api"
            className="inline-flex items-center gap-1.5 font-medium text-muted-foreground hover:text-foreground"
          >
            Full API reference
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </DocsSection>

      <DocsSection title="Other modules">
        <div className="grid gap-3 sm:grid-cols-2">
          {siblings.map((sibling) => (
            <Link
              key={sibling.id}
              href={sibling.docs}
              className="rounded-lg border p-4 transition-colors hover:border-primary/50"
            >
              <p className="font-medium text-foreground">{sibling.title}</p>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {sibling.summary}
              </p>
            </Link>
          ))}
        </div>
      </DocsSection>
    </>
  );
}

/** Renders a mount example tailored to the module's own id. */
function ModuleUsage({ module }: { module: EditorModule }) {
  return (
    <>
      <p>Mount it by passing the module id as the editor type:</p>
      <div className="overflow-hidden rounded-lg border bg-muted/40">
        <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
          <code className="font-mono">
            {`"use client";

import { EditorPage } from "@/components/EditorPage";

export default function Page() {
  return <EditorPage type="${module.id}" />;
}`}
          </code>
        </pre>
      </div>
      {module.id === "comment" && (
        <DocsCallout type="warning" title="Character limit is enforced">
          This module caps input at 2,500 characters via{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]">
            CharacterCount
          </code>
          . Pasting longer content truncates it — split long input across multiple comments
          instead of raising the limit.
        </DocsCallout>
      )}
      {module.status !== "stable" && (
        <DocsCallout type="warning" title="Experimental module">
          This module is marked <strong>{module.status}</strong>. The extension set may change
          between releases — pin the version if you depend on it in production.
        </DocsCallout>
      )}
    </>
  );
}
