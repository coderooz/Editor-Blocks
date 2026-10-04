/**
 * @file /components/examples/ExamplePageTemplate.tsx
 * @description The single template every example route renders. Gives all example pages an
 *              identical layout: breadcrumb, module header, seeded editor, live output
 *              preview, capability list, install guide, and related links.
 * @architecture Next.js App Router (Client Component)
 * @ai-agent This template is the reason the example pages look and behave the same. An
 *            example route should be three lines: call getModule, render <ExamplePageTemplate>.
 *            Do not hand-roll a page layout — if something is missing here, add it here so
 *            every example inherits it.
 * @ai-agent All content is looked up from the registry and the sample-content module by id.
 *            A module with no registry entry is a programming error, not a runtime state to
 *            handle gracefully, so it throws with a message naming the id.
 * @ai-agent The editor is seeded with initialContent from the sample. That flows through
 *            context (setEditorContent), not into useEditor's `content` option, because the
 *            provider creates the editor before this component mounts.
 * @ai-agent Layout is a two-column grid on xl and stacks below it. The editor column keeps a
 *            minimum height so the toolbar and the first paragraph are both visible without
 *            scrolling on a laptop.
 * @dependencies Requires the module registry, sample content, <EditorPage />,
 *              <EditorPreview />, <InstallGuide />.
 */

"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  LayoutGrid,
} from "lucide-react";
import EditorPage from "@/components/EditorPage";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EditorPreview } from "./EditorPreview";
import { InstallGuide } from "./InstallGuide";
import { ENGINE_LABELS, getModule } from "@/constants/module-registry";
import { getSampleContent } from "@/constants/sample-content";

export function ExamplePageTemplate({ moduleId }: { moduleId: string }) {
  const module = getModule(moduleId);

  if (!module) {
    throw new Error(
      `ExamplePageTemplate: no module registered for id "${moduleId}". ` +
        `Add it to EDITOR_MODULES in constants/module-registry.ts.`,
    );
  }

  const sample = getSampleContent(moduleId);
  const engineLabel = ENGINE_LABELS[module.engine];

  // pt-16 clears the fixed h-16 global header. Without it, this container's own py-10 put
  // the breadcrumb at y=40 while the header spans y=0..65 — so the breadcrumb was in the DOM
  // but entirely covered, which is why it read as "missing". Same convention as app/page.tsx,
  // app/examples/page.tsx and app/documentation/layout.tsx.
  return (
    <div className="bg-gradient-to-br from-background to-muted/20 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* ------------------------------------------------------- Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/modules">Modules</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{module.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* --------------------------------------------------------- Header */}
        <header className="mb-8">
          <Link
            href="/modules"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            All modules
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {module.title}
              </h1>
              <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed">
                {module.summary}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {engineLabel} Editor
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
          </div>
        </header>

        {/* -------------------------------------------- Editor + live output */}
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="min-w-0">
            <EditorPage
              type={module.id}
              {...(sample ? { initialContent: sample.html } : {})}
            />
          </div>

          <div className="min-w-0">
            <EditorPreview />
          </div>
        </div>

        {/* -------------------------------------------------- What this shows */}
        {sample && (
          <section
            aria-labelledby="sample-heading"
            className="mt-6 rounded-xl border border-dashed bg-muted/20 p-5"
          >
            <h2 id="sample-heading" className="text-sm font-semibold">
              What this sample demonstrates
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
              {sample.demonstrates}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Edit anything above &mdash; the output panel updates as you type.
            </p>
          </section>
        )}

        {/* ---------------------------------------------------- Capabilities */}
        <section
          aria-labelledby="capabilities-heading"
          className="mt-8 rounded-xl border bg-card p-6 sm:p-8"
        >
          <h2 id="capabilities-heading" className="text-xl font-semibold">
            Capabilities
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {module.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <Check
                  className="mt-0.5 w-3.5 h-3.5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t pt-5">
            <h3 className="text-sm font-semibold">Best for</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {module.useCases.map((useCase) => (
                <li
                  key={useCase}
                  className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                >
                  {useCase}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 border-t pt-5">
            <h3 className="text-sm font-semibold">
              Extensions{" "}
              <span className="font-normal text-muted-foreground">
                ({module.extensions.length})
              </span>
            </h3>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {module.extensions.map((ext) => (
                <span
                  key={ext}
                  className="rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                >
                  {ext}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Install guide */}
        <div className="mt-8">
          <InstallGuide module={module} />
        </div>

        {/* -------------------------------------------------------- Related */}
        <nav
          aria-label="Related pages"
          className="mt-8 flex flex-wrap items-center gap-3 border-t pt-6"
        >
          <Link
            href={module.docs}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            {module.title} documentation
          </Link>
          <Link
            href="/modules"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <LayoutGrid className="w-4 h-4" aria-hidden="true" />
            Module catalogue
          </Link>
          <Link
            href="/documentation"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Documentation
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </nav>
      </div>
    </div>
  );
}
