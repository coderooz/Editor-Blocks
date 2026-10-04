/**
 * @file /app/documentation/layout.tsx
 * @description Shared chrome for every /documentation page: sidebar navigation, a wide
 *              reading column, and an on-this-page table of contents.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent The nav tree lives in @/constants/docs-nav. Add documentation pages there
 *            rather than hardcoding links in this layout.
 * @ai-agent SPACING INVARIANT: the global header is `fixed` with height h-16 (4rem). This
 *            layout must reserve that space with `pt-16` on its outer wrapper, otherwise the
 *            first ~64px of the sidebar sits underneath the header and the top navigation
 *            links are unclickable. Page routes under app/ that do not use this layout must
 *            carry their own pt-16.
 * @ai-agent STICKY INVARIANT: the sidebar and TOC stick below the header at top-[5.5rem].
 *            They are also capped to the viewport height and independently scrollable —
 *            without the cap, a long nav on a short screen sticks in place and its lower half
 *            can never be reached.
 * @ai-agent Tailwind classes are written out in full rather than composed from variables.
 *            The compiler scans source text for literal class strings, so a template
 *            literal like `lg:${offset}` produces no CSS at all.
 * @ai-agent Heading anchors in pages use scroll-mt-28 so in-page links from the TOC land
 *            below the fixed header rather than behind it.
 * @dependencies Requires DOCS_NAV from @/constants/docs-nav, <DocsToc />.
 */

import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { DOCS_NAV } from "@/constants/docs-nav";
import { DocsToc } from "./DocsToc";

export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-br from-background to-muted/20">
      {/* pt-16 clears the fixed h-16 global header. */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] xl:grid-cols-[240px_minmax(0,1fr)_200px]">
          {/* Sidebar — sticks below the header and scrolls independently. */}
          <nav
            aria-label="Documentation"
            className="lg:sticky lg:top-[5.5rem] lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2"
          >
            <Link
              href="/documentation"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
              Documentation
            </Link>

            <div className="mt-6 space-y-6">
              {DOCS_NAV.map((section) => (
                <div key={section.title}>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {section.title}
                  </h2>
                  <ul className="mt-2 space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <ChevronRight
                            className="w-3 h-3 flex-shrink-0 opacity-50"
                            aria-hidden="true"
                          />
                          {item.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border bg-card p-4">
              <h2 className="text-sm font-semibold">Looking for modules?</h2>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Browse the full catalogue with search and filters.
              </p>
              <Link
                href="/modules"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Open module list
                <ChevronRight className="w-3 h-3" aria-hidden="true" />
              </Link>
            </div>
          </nav>

          {/* Content */}
          <article className="min-w-0">
            <div className="rounded-xl border bg-card p-6 sm:p-8">{children}</div>
          </article>

          {/* On-this-page TOC — same sticky offset and height cap as the sidebar. */}
          <DocsToc />
        </div>
      </div>
    </div>
  );
}
