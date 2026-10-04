/**
 * @file /app/modules/page.tsx
 * @description Route entry for the module catalogue. Server component so it can export
 *              page-level `metadata`; all interactivity lives in <ModulesCatalogue />.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent This file is deliberately a Server Component. It previously carried the search and
 *            filter state directly, which forced `"use client"` and made it illegal to export
 *            `metadata` from it — 15 of 21 pages were therefore stuck on the site-wide default
 *            <title>. Splitting the interactive part into <ModulesCatalogue /> keeps the route
 *            a server component so metadata works AND the catalogue stays interactive.
 * @ai-agent Counts in the description are derived from the registry at build time, so they can
 *            never drift from the real catalogue.
 * @dependencies Requires <ModulesCatalogue /> from @/components/modules/ModulesCatalogue.
 */

import type { Metadata } from "next";
import { ModulesCatalogue } from "@/components/modules/ModulesCatalogue";
import { EDITOR_MODULES } from "@/constants/module-registry";

export const metadata: Metadata = {
  title: "Module Catalogue",
  description: `Browse all ${EDITOR_MODULES.length} Editor Blocks modules — comment, content, document, and presentation editors. Filter by feature tier or search across features and extensions.`,
  alternates: { canonical: "/modules" },
  openGraph: {
    title: "Module Catalogue — Editor Blocks",
    description: `All ${EDITOR_MODULES.length} ready-to-use editor modules, with engine, tier, and capabilities.`,
    url: "/modules",
  },
};

export default function ModulesPage() {
  return <ModulesCatalogue />;
}