/**
 * @file /constants/docs-nav.ts
 * @description Navigation tree for the /documentation section.
 * @architecture Static Configuration Module (no React imports)
 * @ai-agent Single source of truth for documentation structure. The sidebar, the page
 *            index, the footer links, and llms.txt all derive from DOCS_NAV. Adding a
 *            documentation page means adding an entry here.
 * @ai-agent Every href listed here must correspond to a real route under app/documentation/.
 *            A mismatch surfaces as a 404 from the sidebar, which is the most visible place
 *            a broken link can hide. Verify against the build output route list.
 * @ai-agent Reference targets (upstream docs, source files) are deliberately NOT listed here
 *            — they live in @/constants/docs-references so page bodies can reuse them.
 */

export interface DocsNavItem {
  title: string;
  href: string;
  description: string;
}

export interface DocsNavSection {
  title: string;
  items: DocsNavItem[];
}

export const DOCS_NAV: DocsNavSection[] = [
  {
    title: "Introduction",
    items: [
      {
        title: "Overview",
        href: "/documentation",
        description: "What Editor Blocks is, what problem it solves, and how modules are packaged.",
      },
      {
        title: "Getting Started",
        href: "/documentation/getting-started",
        description: "Install, run locally, and add your first editor module.",
      },
    ],
  },
  {
    title: "Modules",
    items: [
      {
        title: "Module Catalogue",
        href: "/documentation/modules",
        description: "Every available module, its engine, tier, and capability matrix.",
      },
      {
        title: "Comment Editor",
        href: "/documentation/modules/comment",
        description: "Minimal TipTap module for comments and short-form input.",
      },
      {
        title: "Content Editor",
        href: "/documentation/modules/content",
        description: "Rich TipTap module for articles and long-form publishing.",
      },
      {
        title: "Document Editor",
        href: "/documentation/modules/document",
        description: "Full TipTap module with tables, code blocks, and media.",
      },
      {
        title: "Presentation Editor",
        href: "/documentation/modules/presentation",
        description: "Slide-shaped TipTap module, currently in beta.",
      },
    ],
  },
  {
    title: "Reference",
    items: [
      {
        title: "Architecture",
        href: "/documentation/architecture",
        description: "How the editor instance, extension presets, and toolbar registry fit together.",
      },
      {
        title: "API Reference",
        href: "/documentation/api",
        description: "Component props, context API, extension presets, and exported types.",
      },
      {
        title: "Custom Modules",
        href: "/documentation/custom-modules",
        description: "Register a new module or add a new editor engine.",
      },
      {
        title: "Roadmap",
        href: "/documentation/roadmap",
        description: "Planned editor cores and packaging work.",
      },
      {
        title: "References",
        href: "/documentation/references",
        description:
          "Upstream library docs, source files behind each claim, and the full outbound-link index.",
      },
    ],
  },
];

/** Flat list of every documentation page, useful for sitemap and llms.txt generation. */
export const DOCS_PAGES: DocsNavItem[] = DOCS_NAV.flatMap((section) => section.items);
