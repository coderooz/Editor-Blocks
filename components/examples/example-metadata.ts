/**
 * @file /components/examples/example-metadata.ts
 * @description Builds Next.js `Metadata` for an example route from the module registry.
 * @architecture Next.js App Router (Server utility)
 * @ai-agent Every /examples/* route exports `metadata = exampleMetadata("<module-id>")`. Doing
 *            it this way means the title and description can never drift from the registry —
 *            15 of 21 pages previously shared one default <title> because nothing declared
 *            per-page metadata, which is an SEO problem.
 * @ai-agent Takes a MODULE ID, not a URL segment. /examples/docs serves module `document`.
 * @dependencies Requires the module registry.
 */

import type { Metadata } from "next";
import { getModule, ENGINE_LABELS } from "@/constants/module-registry";

const SITE_NAME = "Editor Blocks";

export function exampleMetadata(moduleId: string): Metadata {
  const module = getModule(moduleId);

  if (!module) {
    return {
      title: "Example not found",
      description: "That module is not registered in the Editor Blocks catalogue.",
    };
  }

  const engineLabel = ENGINE_LABELS[module.engine];

  return {
    title: `${module.title} — ${engineLabel} Editor Example`,
    description: `${module.summary} Try the ${module.title} live in your browser and copy the code into your project.`,
    keywords: [
      module.id,
      module.category,
      `${engineLabel} example`,
      "editor module",
      "rich text editor demo",
    ],
    alternates: {
      canonical: module.href,
    },
    openGraph: {
      title: `${module.title} — ${SITE_NAME}`,
      description: module.summary,
      url: module.href,
      type: "article",
    },
  };
}