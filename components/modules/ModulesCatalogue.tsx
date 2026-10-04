/**
 * @file /components/modules/ModulesCatalogue.tsx
 * @description Interactive module catalogue: search box, category dropdown, result count,
 *              and one card per module with engine/tier/status badges.
 * @architecture Next.js App Router (Client Component)
 * @ai-agent Split out of app/modules/page.tsx so that route can stay a Server Component and
 *            export `metadata`. A `"use client"` page cannot export metadata, which is why
 *            15 of 21 pages previously shared one <title>.
 * @ai-agent Module data is NOT defined here. Everything comes from EDITOR_MODULES in
 *            @/constants/module-registry — the single source of truth shared with
 *            /documentation, the landing page, and llms.txt. To add a module, edit the
 *            registry, not this file.
 * @ai-agent The search predicate intentionally matches against the engine label and the
 *            extension list too, not just the title. Searching "table" or "lowlight" should
 *            surface Document, because those are the words a developer actually searches on.
 * @ai-agent The result count is announced via aria-live so a screen reader reports the
 *            outcome of filtering, which is otherwise a silent visual change.
 * @dependencies Requires the module registry and shadcn Card + Select + Input.
 */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  FileText,
  BookOpen,
  PenTool,
  ArrowRight,
  Check,
  Search,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EDITOR_MODULES,
  MODULE_CATEGORIES,
  ENGINE_LABELS,
  type EditorModule,
  type ModuleCategory,
} from "@/constants/module-registry";

/** Maps a module id to its card icon. */
const MODULE_ICONS: Record<string, LucideIcon> = {
  comment: MessageSquare,
  content: PenTool,
  document: FileText,
  presentation: BookOpen,
};

export function ModulesCatalogue() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ModuleCategory>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EDITOR_MODULES.filter((module) => {
      const matchesCategory = category === "All" || module.category === category;
      if (!matchesCategory) return false;
      if (!q) return true;
      return [
        module.title,
        module.summary,
        module.description,
        module.engine,
        ENGINE_LABELS[module.engine],
        module.category,
        module.useCases.join(" "),
        module.features.join(" "),
        module.extensions.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [query, category]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* A plain <div>, not a second <main>: app/layout.tsx already renders the single
          <main> landmark. Nesting another produced a duplicate that screen readers announce
          twice. pt-16 clears the fixed h-16 header. */}
      <div className="pt-16">
        <div className="bg-gradient-to-br from-background to-muted/20 py-12 px-4">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Editor Modules</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pre-built, ready-to-use editor components for different use cases.
                Each module is a curated set of extensions from an underlying editor core,
                packaged so you can drop it in and ship.
              </p>
            </div>

            {/* Search and Category Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search modules, features, extensions…"
                  className="pl-10"
                  aria-label="Search modules"
                />
              </div>

              <Select
                value={category}
                onValueChange={(value) => setCategory(value as ModuleCategory)}
              >
                <SelectTrigger
                  className="w-full sm:w-56"
                  aria-label="Filter modules by category"
                >
                  <LayoutGrid
                    className="w-4 h-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  {MODULE_CATEGORIES.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Result count — announced so filtering is not a silent visual change. */}
            <p
              className="text-sm text-muted-foreground text-center"
              aria-live="polite"
            >
              Showing {filtered.length} of {EDITOR_MODULES.length} modules
            </p>

            {/* Module Cards Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <p className="text-lg font-medium">No modules match your search.</p>
                <p className="text-sm text-muted-foreground">
                  Try a different term, or reset the category filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setCategory("All");
                  }}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {filtered.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </div>
            )}

            {/* Documentation CTA */}
            <div className="text-center pt-8 border-t border-border">
              <p className="text-muted-foreground mb-4">
                Want to use these modules in your own project?
              </p>
              <Link
                href="/documentation"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                Read Documentation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * A single module card.
 *
 * @ai-agent The engine badge is deliberate: visitors must be able to tell at a glance which
 *            editor core powers a module, since the catalogue will eventually mix TipTap with
 *            Lexical, ProseMirror, and others.
 */
function ModuleCard({ module }: { module: EditorModule }) {
  const Icon = MODULE_ICONS[module.id] ?? LayoutGrid;

  return (
    <Card className="flex flex-col hover:shadow-md hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
              <Icon size={24} aria-hidden="true" />
            </div>
            <div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {module.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {ENGINE_LABELS[module.engine]} Editor
                </span>
                {module.status !== "stable" && (
                  <span className="text-xs font-medium bg-amber-500/15 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                    {module.status}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <CardDescription className="mt-3">
          {module.summary}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {module.description}
        </p>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-foreground">Best For</h3>
          <ul className="grid grid-cols-1 gap-1">
            {module.useCases.map((useCase) => (
              <li
                key={useCase}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check
                  className="w-3.5 h-3.5 text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                {useCase}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-foreground">
            Features
            <span className="ml-2 font-normal text-muted-foreground">
              ({module.features.length})
            </span>
          </h3>
          <ul className="grid grid-cols-1 gap-1">
            {module.features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Check
                  className="w-3.5 h-3.5 text-primary flex-shrink-0"
                  aria-hidden="true"
                />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-2 text-foreground">
            Built On
            <span className="ml-2 font-normal text-muted-foreground">
              {ENGINE_LABELS[module.engine]} {module.engineVersion}
            </span>
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {module.extensions.map((ext) => (
              <span
                key={ext}
                className="text-xs font-medium bg-muted text-muted-foreground px-2 py-1 rounded"
              >
                {ext}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Link
          href={module.href}
          className="inline-flex items-center gap-2 w-full justify-center py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          Try {module.title}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
        <Link
          href={module.docs}
          className="inline-flex items-center gap-2 w-full justify-center py-2 px-4 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          Module Docs
        </Link>
      </CardFooter>
    </Card>
  );
}