/**
 * @file /app/examples/page.tsx
 * @description Index of every live editor demo, derived from the module registry.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent Cards come from EDITOR_MODULES, so a new module appears here automatically. Do not
 *            maintain a separate list. This is a demo index — real documentation lives under
 *            /documentation.
 * @dependencies Requires EDITOR_MODULES/ENGINE_LABELS from @/constants/module-registry.
 */

import type { Metadata } from "next";
import Link from "next/link";
import {
  MessageSquare,
  PenTool,
  FileText,
  BookOpen,
  LayoutGrid,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { EDITOR_MODULES, ENGINE_LABELS } from "@/constants/module-registry";

const MODULE_ICONS: Record<string, LucideIcon> = {
  comment: MessageSquare,
  content: PenTool,
  document: FileText,
  presentation: BookOpen,
};

/**
 * @ai-agent Counts derived from the registry at build time so they cannot drift.
 */
export const metadata: Metadata = {
  title: "Live Examples",
  description: `Try all ${EDITOR_MODULES.length} Editor Blocks modules running in your browser — the real components, not mockups, with the exact code to add each one to your project.`,
  alternates: { canonical: "/examples" },
  openGraph: {
    title: "Live Examples — Editor Blocks",
    description: "Every editor module running live, with copy-ready integration code.",
    url: "/examples",
  },
};

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* A plain <div>, not a second <main>: app/layout.tsx already renders the single
          <main> landmark. Nesting another produced a duplicate that screen readers announce
          twice. pt-16 clears the fixed h-16 header. */}
      <div className="pt-16">
        <div className="bg-gradient-to-br from-background to-muted/20 py-12 px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Live Examples</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every module running live in your browser. Each one is the real component — not
                a mockup — so what you see is what you copy.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {EDITOR_MODULES.map((module) => {
                const Icon = MODULE_ICONS[module.id] ?? LayoutGrid;
                return (
                  <Link
                    key={module.id}
                    href={module.href}
                    className="group rounded-lg border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="rounded-md bg-primary/10 p-2 text-primary">
                        <Icon size={20} aria-hidden="true" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">
                          {module.title}
                        </h2>
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {ENGINE_LABELS[module.engine]} Editor
                          </span>
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {module.category}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{module.summary}</p>
                  </Link>
                );
              })}
            </div>

            {/* Cross-link into the docs so a visitor who finds an example can keep going. */}
            <div className="flex justify-center pt-4">
              <Link
                href="/documentation/getting-started"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                How to add these to your project
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
