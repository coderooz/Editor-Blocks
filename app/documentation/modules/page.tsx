/**
 * @file /app/documentation/modules/page.tsx
 * @description Capability matrix comparing every available editor module.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent All data is read from @/constants/module-registry at render time. Do not
 *            hardcode module counts, tiers, or extension names in this file — add a
 *            module to the registry and this page updates itself.
 * @dependencies Requires EDITOR_MODULES/ENGINE_LABELS from @/constants/module-registry.
 */

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DocsTitle, DocsSection } from "@/components/docs/DocsHeading";
import { DocsCallout, DocsTable } from "@/components/docs/DocsCode";
import { DocsReferences } from "@/components/docs/DocsReferences";
import { docsMetadata } from "@/components/docs/docs-metadata";
import { DOC_CROSS_REFS } from "@/constants/docs-references";
import { EDITOR_MODULES, ENGINE_LABELS } from "@/constants/module-registry";

export const metadata = docsMetadata("/documentation/modules");

export default function ModulesCataloguePage() {
  return (
    <>
      <DocsTitle
        eyebrow="Modules"
        title="Module Catalogue"
        description="Every editor block currently available, with the engine that powers it, the tier it sits in, and what it can do."
      />

      <DocsSection
        title="Choosing a module"
        lead="Pick the smallest module that covers your use case. Each tier is a strict superset of the one before it, so you only pay for what you enable."
      >
        <DocsTable
          headers={["Module", "Engine", "Tier", "Status", "Extension set"]}
          rows={EDITOR_MODULES.map((module) => [
            <Link
              key={module.id}
              href={module.docs}
              className="font-medium text-foreground hover:text-primary"
            >
              {module.title}
            </Link>,
            `${ENGINE_LABELS[module.engine]} ${module.engineVersion}`,
            module.category,
            module.status,
            <code
              key={`ext-${module.id}`}
              className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em]"
            >
              {module.extensionSet}
            </code>,
          ])}
        />
        <DocsCallout type="info" title="Tiers are cumulative">
          Content includes everything from Comment. Document includes everything from Content
          plus tables, code blocks, images, and embeds. Presentation is a Document-tier set
          tuned for heading-led, slide-shaped content.
        </DocsCallout>
      </DocsSection>

      <DocsSection title="Feature matrix">
        <DocsTable
          headers={["Capability", ...EDITOR_MODULES.map((m) => m.title)]}
          rows={buildMatrix(EDITOR_MODULES.map((m) => m.title))}
        />
        <p className="text-xs text-muted-foreground">
          A filled circle means the capability ships in that module by default. The underlying
          extension is always available — it is simply not wired into that module&apos;s toolbar.
        </p>
      </DocsSection>

      <DocsSection title="Modules in detail">
        <div className="grid gap-6">
          {EDITOR_MODULES.map((module) => (
            <div key={module.id} className="rounded-lg border p-5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold">{module.title}</h3>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  {ENGINE_LABELS[module.engine]} Editor
                </span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {module.category}
                </span>
                {module.status !== "stable" && (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
                    {module.status}
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {module.description}
              </p>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Best for
                  </h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {module.useCases.map((useCase) => (
                      <li key={useCase}>• {useCase}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Extensions
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {module.extensions.map((ext) => (
                      <span
                        key={ext}
                        className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {ext}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-4">
                <Link
                  href={module.docs}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read module docs
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
                <Link
                  href={module.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Try it live
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </DocsSection>

      <DocsSection title="Not sure which to pick?">
        <ul className="space-y-2 text-muted-foreground">
          <li>
            <strong>Comments, replies, annotations</strong> → Comment Editor. The 2,500 character
            limit keeps threads readable.
          </li>
          <li>
            <strong>Blog posts, articles, CMS bodies</strong> → Content Editor. Full typography
            without the weight of tables and embeds.
          </li>
          <li>
            <strong>Docs, wikis, technical writing</strong> → Document Editor. Code blocks,
            tables, and image handling.
          </li>
          <li>
            <strong>Slides, walkthroughs, outlines</strong> → Presentation Editor. Heading-led
            structure with a text-size counter.
          </li>
        </ul>
        <p>
          <Link href="/modules" className="font-medium text-primary hover:underline">
            Open the interactive catalogue
          </Link>{" "}
          to search and filter modules by tier.
        </p>
      </DocsSection>

      <DocsReferences
        groups={[DOC_CROSS_REFS]}
        title="Related"
      />
    </>
  );
}

/**
 * Builds the feature matrix rows.
 *
 * @ai-agent The capability list is derived from the registry's own `features` strings so
 *            a newly added module cannot silently drop out of the matrix.
 */
function buildMatrix(titles: string[]): React.ReactNode[][] {
  const allFeatures = new Map<string, Set<string>>();
  for (const module of EDITOR_MODULES) {
    for (const feature of module.features) {
      if (!allFeatures.has(feature)) allFeatures.set(feature, new Set());
      allFeatures.get(feature)!.add(module.title);
    }
  }

  return [...allFeatures.entries()].map(([feature, owners]) => [
    feature,
    ...titles.map((title) =>
      owners.has(title) ? (
        <span key={title} className="text-primary" aria-label="included">
          ●
        </span>
      ) : (
        <span key={title} className="text-muted-foreground/40" aria-label="not included">
          ○
        </span>
      ),
    ),
  ]);
}
