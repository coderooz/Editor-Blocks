/**
 * @file /components/docs/DocsReferences.tsx
 * @description Renders a grouped reference list. Used for the "References" section on
 *              documentation pages, the standalone /documentation/references index, and
 *              inline "see also" blocks.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent Reference data comes from @/constants/docs-references. To cite something new,
 *            add it to that registry rather than passing ad-hoc props here — that keeps the
 *            outbound-link inventory in one auditable place.
 * @ai-agent Internal links (starting with /) render as next/link; absolute URLs render as
 *            external anchors with rel="noreferrer". Do not add target="_blank" to internal
 *            links — it breaks the client-side transition.
 */

import Link from "next/link";
import { ArrowUpRight, BookOpen, FileCode2 } from "lucide-react";
import {
  UPSTREAM_REFS,
  SOURCE_REFS,
  DOC_CROSS_REFS,
  type DocsReferenceGroup,
} from "@/constants/docs-references";

/** Renders a single reference, choosing the right element for internal vs external targets. */
function ReferenceItem({
  title,
  href,
  note,
}: {
  title: string;
  href: string;
  note: string;
}) {
  const isInternal = href.startsWith("/");

  if (isInternal) {
    return (
      <li className="group">
        <Link
          href={href}
          className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
        >
          {title}
          <ArrowUpRight
            className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 transition-opacity"
            aria-hidden="true"
          />
        </Link>
        <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{note}</p>
      </li>
    );
  }

  return (
    <li className="group">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 font-medium text-foreground hover:text-primary transition-colors"
      >
        {title}
        <ArrowUpRight
          className="w-3.5 h-3.5 opacity-0 group-hover:opacity-70 transition-opacity"
          aria-hidden="true"
        />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
      <p className="mt-0.5 text-sm text-muted-foreground leading-relaxed">{note}</p>
    </li>
  );
}

/** Renders one titled group of references. */
export function DocsReferenceGroupBlock({
  group,
  columns = 2,
}: {
  group: DocsReferenceGroup;
  columns?: 1 | 2;
}) {
  return (
    <div className="rounded-lg border p-5">
      <h3 className="font-semibold">{group.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        {group.description}
      </p>
      <ul
        className={`mt-4 grid gap-4 ${
          columns === 2 ? "sm:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {group.refs.map((ref) => (
          <ReferenceItem key={ref.href} {...ref} />
        ))}
      </ul>
    </div>
  );
}

/**
 * Full reference section for a documentation page.
 *
 * @ai-agent Render this as the last section of a page. It gives readers somewhere to verify a
 *            claim, which matters more here than on a typical marketing page because the
 *            project invites people to vendor the source.
 */
export function DocsReferences({
  groups = [DOC_CROSS_REFS, UPSTREAM_REFS, SOURCE_REFS],
  title = "References",
  id = "references",
}: {
  groups?: DocsReferenceGroup[][] | DocsReferenceGroup[];
  title?: string;
  id?: string;
}) {
  const normalised = groups.flat();

  return (
    <section className="mt-10">
      <h2
        id={id}
        className="text-xl font-semibold scroll-mt-28 flex items-center gap-2"
      >
        <BookOpen className="w-4 h-4 text-primary" aria-hidden="true" />
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        Upstream documentation, the source files that implement this behaviour, and related
        pages in this section.
      </p>
      <div className="mt-5 space-y-4">
        {normalised.map((group) => (
          <DocsReferenceGroupBlock key={group.title} group={group} />
        ))}
      </div>
    </section>
  );
}

/**
 * Compact "see also" strip for the top of a page.
 *
 * @ai-agent Use sparingly — two or three links at most. A long list here competes with the
 *            page heading for attention.
 */
export function DocsSeeAlso({ items }: { items: { title: string; href: string }[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Related pages" className="mt-6 rounded-lg border bg-muted/20 p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        See also
      </h2>
      <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Reference index for the source files a reader would open to verify a claim.
 * @ai-agent Kept separate from DocsReferences so /documentation/references can show the full
 *            inventory without the upstream links crowding it.
 */
export function DocsSourceIndex() {
  return (
    <div className="space-y-4">
      {SOURCE_REFS.map((group) => (
        <DocsReferenceGroupBlock key={group.title} group={group} />
      ))}
      <p className="flex items-start gap-2 rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 text-sm text-blue-900 dark:text-blue-200">
        <FileCode2 className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
        <span>
          Source links point at the <code className="font-mono">main</code> branch. Line numbers
          are omitted deliberately — they drift. Open the file and search for the symbol named in
          the note.
        </span>
      </p>
    </div>
  );
}
