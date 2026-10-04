/**
 * @file /constants/docs-references.ts
 * @description Central registry of reference links used across the /documentation section:
 *              official upstream documentation, this project's own source files, and the
 *              machine-readable manifests.
 * @architecture Static Configuration Module (no React imports, fully serialisable)
 * @ai-agent Single source of truth for every outbound reference in the docs. When you cite an
 *            external library, add it here rather than inlining a URL in a page — that keeps
 *            links consistent and makes this file a complete index of what the project
 *            depends on.
 * @ai-agent SOURCE_REPO must stay in sync with package.json's repository.url. Deep links are
 *            built from it plus DEFAULT_BRANCH, so renaming the branch breaks every source
 *            link at once.
 * @ai-agent Grouped refs render in the order declared here. Keep the most relevant group first
 *            for the page you are citing from.
 */

export interface DocsReference {
  /** Link text. Should describe the target, not the action. */
  title: string;
  /** Absolute URL. */
  href: string;
  /** One-line explanation of why this reference matters. */
  note: string;
}

export interface DocsReferenceGroup {
  title: string;
  description: string;
  refs: DocsReference[];
}

/** Repository used to build deep links into source files. */
export const SOURCE_REPO = "https://github.com/coderooz/Editor-Blocks";

/** Branch the source links point at. */
export const DEFAULT_BRANCH = "main";

/**
 * Builds a deep link to a file in the repository.
 * @ai-agent Paths are repo-root-relative without a leading slash.
 */
export function sourceLink(path: string, line?: number): string {
  const base = `${SOURCE_REPO}/blob/${DEFAULT_BRANCH}/${path.replace(/^\//, "")}`;
  return line ? `${base}#L${line}` : base;
}

/** Live site origin, used to resolve doc-relative references into absolute URLs. */
export const SITE_ORIGIN = "https://editor-blocks.vercel.app";

/**
 * Upstream documentation for the libraries the project builds on.
 * @ai-agent Pinned to the major version the project actually depends on. Bump these when the
 *            dependency moves to a new major.
 */
export const UPSTREAM_REFS: DocsReferenceGroup[] = [
  {
    title: "Editor core",
    description:
      "TipTap is the engine backing every module that ships today. These are the pages that matter most when extending a module.",
    refs: [
      {
        title: "TipTap — Official Documentation",
        href: "https://tiptap.dev/docs",
        note: "Entry point for the editor core. Guides, recipes, and the extension API.",
      },
      {
        title: "TipTap — Custom Extensions",
        href: "https://tiptap.dev/docs/editor/extensions/custom-extensions/create-new",
        note: "How to write a Node, Mark, or Extension. Required reading before adding one to a preset.",
      },
      {
        title: "TipTap — Extension Marketplace",
        href: "https://tiptap.dev/docs/editor/extensions",
        note: "Catalogue of official and community extensions, including the ones used in the Document module.",
      },
      {
        title: "ProseMirror — Reference Manual",
        href: "https://prosemirror.net/docs/ref/",
        note: "The schema and transformation layer underneath TipTap. Needed for low-level debugging.",
      },
      {
        title: "ProseMirror — Schema Guide",
        href: "https://prosemirror.net/docs/guide/#schema",
        note: "Explains nodes, marks, and content expressions — the vocabulary extension authors use.",
      },
    ],
  },
  {
    title: "Framework and runtime",
    description:
      "The Next.js and React behaviour that constrains how an editor can be mounted in this project.",
    refs: [
      {
        title: "Next.js — App Router: Layouts and Pages",
        href: "https://nextjs.org/docs/app/building-your-application/routing/layouts-and-pages",
        note: "How app/layout.tsx owns shared chrome, which is where the editor provider is mounted.",
      },
      {
        title: "Next.js — Server and Client Components",
        href: "https://nextjs.org/docs/app/getting-started/server-and-client-components",
        note: "Explains the 'use client' boundary every editor component sits behind.",
      },
      {
        title: "Next.js — generateStaticParams",
        href: "https://nextjs.org/docs/app/api-reference/functions/generate-static-params",
        note: "How /documentation/modules/[moduleId] pre-renders one page per registered module.",
      },
      {
        title: "React — useMemo and useCallback",
        href: "https://react.dev/reference/react/useMemo",
        note: "Reference for the memoisation that keeps the extension array and toolbar stable.",
      },
      {
        title: "React — Rules of Hooks",
        href: "https://react.dev/reference/rules/rules-of-hooks",
        note: "Why the editor instance is keyed on the module id rather than reconfigured in place.",
      },
    ],
  },
  {
    title: "UI and styling",
    description:
      "The component and styling layers the module shell is built from.",
    refs: [
      {
        title: "shadcn/ui",
        href: "https://ui.shadcn.com/docs",
        note: "Source of the Card, Select, Input, and Dialog primitives used in the catalogue and docs.",
      },
      {
        title: "Radix UI — Select",
        href: "https://www.radix-ui.com/primitives/docs/components/select",
        note: "Behaviour behind the shadcn Select. Explains why item values must be non-empty strings.",
      },
      {
        title: "Radix UI — Dialog",
        href: "https://www.radix-ui.com/primitives/docs/components/dialog",
        note: "Documents DialogTrigger and the asChild requirement that prevents nested buttons.",
      },
      {
        title: "Tailwind CSS v4",
        href: "https://tailwindcss.com/docs",
        note: "Utility reference for the class-based styling used throughout the module shell.",
      },
    ],
  },
  {
    title: "Syntax highlighting",
    description:
      "lowlight powers the code blocks in the Document module. Bundle size is the main trade-off here.",
    refs: [
      {
        title: "lowlight — Documentation",
        href: "https://github.com/wooorm/lowlight",
        note: "The highlighter wired into CodeBlockLowlight in the Document module.",
      },
      {
        title: "highlight.js — Language Support",
        href: "https://highlightjs.org/support/language-features/",
        note: "Language identifiers accepted by createLowlight. The project currently registers all of them.",
      },
    ],
  },
  {
    title: "Content safety",
    description:
      "The editor emits raw HTML. Sanitise before persisting or rendering on another domain.",
    refs: [
      {
        title: "DOMPurify",
        href: "https://github.com/cure53/DOMPurify",
        note: "The recommended sanitiser for the HTML the editor produces.",
      },
      {
        title: "OWASP — Cross Site Scripting Prevention",
        href: "https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html",
        note: "Background on why unsanitised rich-text HTML is a stored-XSS risk.",
      },
    ],
  },
  {
    title: "Standards and accessibility",
    description: "The specifications the module shell is expected to conform to.",
    refs: [
      {
        title: "WAI-ARIA Authoring Practices",
        href: "https://www.w3.org/WAI/ARIA/apg/patterns/",
        note: "Pattern reference for toolbar and dialog keyboard behaviour.",
      },
      {
        title: "WCAG 2.2 Quick Reference",
        href: "https://www.w3.org/WAI/WCAG22/quickref/",
        note: "The checklist the project claims conformance against.",
      },
    ],
  },
  {
    title: "Machine-readable",
    description:
      "Structured entry points for AI agents and crawlers. Prefer these over scraping HTML.",
    refs: [
      {
        title: "llm.txt",
        href: "/llm.txt",
        note: "Compact manifest: project summary, module catalogue, and repository conventions.",
      },
      {
        title: "llms-full.txt",
        href: "/llms-full.txt",
        note: "The entire documentation in one retrievable plain-text document.",
      },
    ],
  },
];

/**
 * Source files that implement the documented behaviour.
 * @ai-agent These are the files a reader should open to verify a claim or make a change.
 *            Line numbers are a convenience only and will drift — prefer linking the file.
 */
export const SOURCE_REFS: DocsReferenceGroup[] = [
  {
    title: "Module catalogue and configuration",
    description:
      "Where module metadata and navigation are declared. Editing these changes every page that lists modules.",
    refs: [
      {
        title: "constants/module-registry.ts",
        href: sourceLink("constants/module-registry.ts"),
        note: "The single source of truth for every module: engine, tier, features, extensions, routes.",
      },
      {
        title: "constants/docs-nav.ts",
        href: sourceLink("constants/docs-nav.ts"),
        note: "Navigation tree for this documentation section.",
      },
      {
        title: "constants/EditorExtension.tsx",
        href: sourceLink("constants/EditorExtension.tsx"),
        note: "Extension presets. The tiers spread upward: DEFAULT ⊂ COMPLEX ⊂ BLOG/DOCUMENT/PRESENTATION.",
      },
      {
        title: "constants/EditorMenuOptions.ts",
        href: sourceLink("constants/EditorMenuOptions.ts"),
        note: "Toolbar menu arrays and the MenuItem type definitions.",
      },
    ],
  },
  {
    title: "Runtime",
    description: "The code that runs when a module is mounted.",
    refs: [
      {
        title: "context/EditorContext.tsx",
        href: sourceLink("context/EditorContext.tsx"),
        note: "Owns the single editor instance and resolves the module → preset map.",
      },
      {
        title: "components/EditorPage.tsx",
        href: sourceLink("components/EditorPage.tsx"),
        note: "The public mounting surface: toolbar, editing area, and character counter.",
      },
      {
        title: "components/EditorMenuBar.tsx",
        href: sourceLink("components/EditorMenuBar.tsx"),
        note: "Groups menu items by category and dispatches each item type.",
      },
      {
        title: "app/layout.tsx",
        href: sourceLink("app/layout.tsx"),
        note: "Root layout: editor provider, global chrome, metadata, JSON-LD, and AI-agent tags.",
      },
    ],
  },
  {
    title: "Site chrome and catalogue UI",
    description: "Presentational components shared across routes.",
    refs: [
      {
        title: "components/layout/Header.tsx",
        href: sourceLink("components/layout/Header.tsx"),
        note: "Global header. Exports SITE_NAME, the product name source of truth.",
      },
      {
        title: "components/layout/Footer.tsx",
        href: sourceLink("components/layout/Footer.tsx"),
        note: "Global footer. Reads SITE_NAME and reports live module and engine counts.",
      },
      {
        title: "app/modules/page.tsx",
        href: sourceLink("app/modules/page.tsx"),
        note: "Searchable, filterable module catalogue built on the registry.",
      },
      {
        title: "components/ui/card.tsx",
        href: sourceLink("components/ui/card.tsx"),
        note: "shadcn Card primitives. CardContent is flex-1 so footers align across cards of unequal height.",
      },
    ],
  },
  {
    title: "Documentation system",
    description: "The machinery that renders this section.",
    refs: [
      {
        title: "constants/docs-references.ts",
        href: sourceLink("constants/docs-references.ts"),
        note: "This file: every external and source reference used across the docs.",
      },
      {
        title: "app/documentation/layout.tsx",
        href: sourceLink("app/documentation/layout.tsx"),
        note: "Sidebar, reading column, and table of contents for the docs section.",
      },
      {
        title: "app/documentation/DocsToc.tsx",
        href: sourceLink("app/documentation/DocsToc.tsx"),
        note: "Derives the on-this-page list from heading ids at runtime.",
      },
      {
        title: "app/documentation/modules/[moduleId]/page.tsx",
        href: sourceLink("app/documentation/modules/[moduleId]/page.tsx"),
        note: "Data-driven module detail pages, one static page per registry entry.",
      },
    ],
  },
];

/**
 * Cross-links between documentation pages.
 * @ai-agent Use these for "see also" blocks. They keep readers inside the section instead of
 *            bouncing them to a search index.
 */
export const DOC_CROSS_REFS: DocsReferenceGroup[] = [
  {
    title: "Within this documentation",
    description: "The pages most often needed alongside the one you are reading.",
    refs: [
      {
        title: "Overview",
        href: "/documentation",
        note: "What Editor Blocks is, the design principles, and how modules are packaged.",
      },
      {
        title: "Getting Started",
        href: "/documentation/getting-started",
        note: "Requirements, install steps, and mounting your first module.",
      },
      {
        title: "Module Catalogue",
        href: "/documentation/modules",
        note: "Every module with a capability matrix comparing them side by side.",
      },
      {
        title: "Architecture",
        href: "/documentation/architecture",
        note: "How a module request flows from route to rendered editor, and the trade-offs involved.",
      },
      {
        title: "API Reference",
        href: "/documentation/api",
        note: "EditorPage props, the context API, extension presets, and menu item shapes.",
      },
      {
        title: "Custom Modules",
        href: "/documentation/custom-modules",
        note: "Step-by-step guide to adding a module or introducing a new engine.",
      },
      {
        title: "Roadmap",
        href: "/documentation/roadmap",
        note: "Planned editor cores and platform work, including the known trade-offs.",
      },
    ],
  },
  {
    title: "On this site",
    description: "Interactive pages rather than reference text.",
    refs: [
      {
        title: "Module catalogue with search and filters",
        href: "/modules",
        note: "Filter by feature tier or search across titles, features, and extensions.",
      },
      {
        title: "Live examples index",
        href: "/examples",
        note: "Every module running in the browser — the real component, not a mockup.",
      },
      {
        title: "Comment Editor demo",
        href: "/examples/comment",
        note: "Minimal module with a 2,500 character cap.",
      },
      {
        title: "Content Editor demo",
        href: "/examples/content",
        note: "Long-form publishing configuration with full typography.",
      },
      {
        title: "Document Editor demo",
        href: "/examples/docs",
        note: "Tables, code blocks, images, YouTube embeds, and JSON import/export.",
      },
      {
        title: "Presentation Editor demo",
        href: "/examples/presentation",
        note: "Heading-led module for slide-shaped content. Currently beta.",
      },
    ],
  },
];

/** Flattens a group into a lookup keyed by href, for resolving a page's own reference set. */
export function findReference(groups: DocsReferenceGroup[], href: string): DocsReference | undefined {
  for (const group of groups) {
    const match = group.refs.find((ref) => ref.href === href);
    if (match) return match;
  }
  return undefined;
}
