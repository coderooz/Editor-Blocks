/**
 * @file /components/LiveEditorDemo.tsx
 * @description Landing-page demo with mode tabs that switch the live editor between modules.
 * @architecture Next.js App Router (Client Component)
 * @ai-agent Sample content is NOT defined here. It is read from the shared registry
 *            (@/constants/sample-content) so the landing page and the /examples/* pages show
 *            identical documents. This file previously carried its own SAMPLE_CONTENT copy,
 *            which drifted — it still said "Building a Production-Ready TipTap Editor" after
 *            the project was renamed to Editor Blocks, and its <h1> gave the home page a
 *            second <h1>. Both are fixed by reading from the registry.
 * @ai-agent Only `default` has a local fallback, because it is the provider's fallback preset
 *            rather than a published module and therefore has no registry entry.
 * @ai-agent The tab list is derived from the module registry, so a new module appears here
 *            automatically. `default` is appended explicitly as the escape hatch.
 * @dependencies Requires <EditorPage />, the module registry, and the sample-content registry.
 */

"use client";

import { useEffect, useState } from "react";
import EditorPage from "@/components/EditorPage";
import type { EditorType } from "@/context/EditorContext";
import { EDITOR_MODULES } from "@/constants/module-registry";
import { getSampleContent } from "@/constants/sample-content";
import { cn } from "@/lib/utils";

/**
 * Fallback for the `default` preset, which is not a published module.
 * @ai-agent Kept deliberately plain — it is a starting point, not a showcase.
 */
const DEFAULT_SAMPLE =
  "<p>Start writing here. Try the toolbar buttons above, or switch to another module.</p>";

/** Human labels for each module id shown on the tabs. */
const MODE_LABELS: Record<string, string> = {
  comment: "Comment",
  content: "Content",
  document: "Document",
  presentation: "Presentation",
  default: "Default",
};

/** One-line description shown beneath the editor. */
const MODE_DESCRIPTIONS: Record<string, string> = {
  comment: "Minimal editor for comments and replies",
  content: "Blog posts and long-form content",
  document: "Full-featured document editor",
  presentation: "Slide-shaped content (beta)",
  default: "Basic editor with core features",
};

/**
 * Module ids in tab order, read from the registry, with `default` appended.
 * @ai-agent Deriving this means a module added to EDITOR_MODULES shows up as a tab without
 *            touching this file.
 */
const MODES: EditorType[] = [
  ...EDITOR_MODULES.map((m) => m.id),
  "default",
] as EditorType[];

/** Resolves the seed HTML for a mode, falling back to the plain starter for `default`. */
function sampleFor(mode: EditorType): string {
  if (mode === "default") return DEFAULT_SAMPLE;
  return getSampleContent(mode)?.html ?? DEFAULT_SAMPLE;
}

export function LiveEditorDemo() {
  const [activeMode, setActiveMode] = useState<EditorType>("content");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto" aria-labelledby="live-demo-heading">
      <div className="mb-6">
        <h2
          id="live-demo-heading"
          className="text-2xl font-bold text-center text-foreground mb-2"
        >
          Live Editor Demo
        </h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Switch between modules to see different extension sets in action. Each one is the
          real component you would copy into your project.
        </p>
      </div>

      <div
        className="mb-4 flex flex-wrap justify-center gap-2"
        role="tablist"
        aria-label="Editor modules"
      >
        {MODES.map((mode) => (
          <button
            key={mode}
            role="tab"
            type="button"
            aria-selected={activeMode === mode}
            aria-controls={`editor-panel-${mode}`}
            id={`tab-${mode}`}
            onClick={() => setActiveMode(mode)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              activeMode === mode
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {MODE_LABELS[mode] ?? mode}
          </button>
        ))}
      </div>

      <div
        className="relative"
        role="tabpanel"
        id={`editor-panel-${activeMode}`}
        aria-labelledby={`tab-${activeMode}`}
      >
        {!isLoaded ? (
          <div className="flex items-center justify-center min-h-[300px] bg-muted/50 rounded-xl border border-border">
            <div className="flex flex-col items-center gap-3 text-muted-foreground">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">Loading editor…</p>
            </div>
          </div>
        ) : (
          <EditorPage type={activeMode} initialContent={sampleFor(activeMode)} />
        )}

        <div className="mt-3 text-center text-xs text-muted-foreground">
          <p>{MODE_DESCRIPTIONS[activeMode] ?? ""}</p>
        </div>
      </div>
    </section>
  );
}
