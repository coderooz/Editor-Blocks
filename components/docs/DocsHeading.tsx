/**
 * @file /components/docs/DocsHeading.tsx
 * @description Small presentational helpers shared by every documentation page so
 *              heading anchors stay consistent.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent Every heading rendered by these helpers receives a slugified `id`, which is
 *            what feeds the "On this page" sidebar. If you hand-write an <h2>/<h3> in a
 *            docs page, give it an id too or it will not appear in the sidebar.
 */

import type { ReactNode } from "react";

/** Converts heading text into a URL-safe anchor id. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function DocsTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
}) {
  return (
    <header className="border-b pb-6">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">
          {eyebrow}
        </p>
      )}
      <h1 className="mt-2 text-3xl font-bold tracking-tight">{title}</h1>
      {description && (
        <div className="mt-3 text-muted-foreground leading-relaxed">{description}</div>
      )}
    </header>
  );
}

export function DocsSection({
  title,
  children,
  lead,
}: {
  title: string;
  children: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-8">
      <h2 id={slugify(title)} className="text-xl font-semibold scroll-mt-24">
        {title}
      </h2>
      {lead && <p className="mt-2 text-muted-foreground leading-relaxed">{lead}</p>}
      <div className="mt-4 space-y-4 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function DocsSubsection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <h3 id={slugify(title)} className="text-base font-semibold scroll-mt-24">
        {title}
      </h3>
      <div className="mt-2 space-y-3 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
