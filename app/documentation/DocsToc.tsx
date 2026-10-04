/**
 * @file /app/documentation/DocsToc.tsx
 * @description Sticky "On this page" navigation that derives its entries from the h2/h3
 *              headings rendered inside the documentation article.
 * @architecture Next.js App Router (Client Component)
 * @ai-agent Uses a DOM query over the sibling <article> rather than a duplicated list.
 *            Add a heading with an `id` in any documentation page and it appears here
 *            automatically — no manual registration needed.
 * @ai-agent Sticky offset and viewport cap match the sidebar in layout.tsx (top-[5.5rem],
 *            max-h-[calc(100vh-7rem)]). Keep the two in sync, otherwise one rail hides under
 *            the fixed global header while the other does not.
 * @ai-agent The observer's rootMargin top value must match the scroll-mt on documentation
 *            headings, otherwise the highlighted TOC entry is the previous heading rather
 *            than the one the reader is looking at.
 */

"use client";

import { useEffect, useState } from "react";

interface TocEntry {
  id: string;
  text: string;
  level: 2 | 3;
}

export function DocsToc() {
  const [entries, setEntries] = useState<TocEntry[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const article = document.querySelector("article");
    if (!article) return;

    const headings = Array.from(
      article.querySelectorAll<HTMLHeadingElement>("h2[id], h3[id]"),
    );

    setEntries(
      headings.map((h) => ({
        id: h.id,
        text: h.textContent ?? "",
        level: h.tagName === "H2" ? 2 : 3,
      })),
    );
  }, []);

  useEffect(() => {
    if (entries.length === 0) return;

    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      // Top margin matches the docs layout's scroll-mt so the active heading is the one
      // actually sitting just below the fixed header.
      { rootMargin: "-96px 0px -70% 0px", threshold: [0, 1] },
    );

    for (const entry of entries) {
      const el = document.getElementById(entry.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <aside
      aria-label="On this page"
      className="hidden xl:block xl:sticky xl:top-[5.5rem] xl:self-start xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto"
    >
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </h2>
      <ul className="mt-3 space-y-1.5 border-l">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={activeId === entry.id ? "location" : undefined}
              className={[
                "block border-l-2 py-0.5 text-sm transition-colors",
                entry.level === 3 ? "pl-6" : "pl-3",
                activeId === entry.id
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
