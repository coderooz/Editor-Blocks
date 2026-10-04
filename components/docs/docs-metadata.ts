/**
 * @file /components/docs/docs-metadata.ts
 * @description Builds Next.js `Metadata` for documentation pages.
 * @architecture Next.js App Router (Server utility)
 * @ai-agent Every page under /documentation exports `metadata = docsMetadata(...)`. Before
 *            this existed, all eight static docs pages rendered the site-wide default <title>,
 *            so a search engine saw eight pages with an identical title. Titles and
 *            descriptions now live next to the nav tree in @/constants/docs-nav.
 * @ai-agent Keep the description short. It is a search-result snippet, not page copy.
 * @dependencies Requires DOCS_NAV from @/constants/docs-nav.
 */

import type { Metadata } from "next";
import { DOCS_PAGES } from "@/constants/docs-nav";

const SITE_NAME = "Editor Blocks";

export function docsMetadata(href: string): Metadata {
  const entry = DOCS_PAGES.find((page) => page.href === href);

  if (!entry) {
    return {
      title: "Documentation",
      description: `Documentation for ${SITE_NAME}.`,
    };
  }

  const title = entry.title === "Overview" ? "Documentation" : entry.title;

  return {
    title,
    description: entry.description,
    alternates: { canonical: href },
    openGraph: {
      title: `${title} — ${SITE_NAME}`,
      description: entry.description,
      url: href,
      type: "article",
    },
  };
}