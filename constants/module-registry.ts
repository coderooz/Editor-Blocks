/**
 * @file /constants/module-registry.ts
 * @description Single source of truth for every editor module exposed by Editor Blocks.
 * @architecture Static Configuration Module (framework-agnostic, no React imports)
 * @ai-agent This is the canonical module catalogue. The /modules page, the /documentation
 *            pages, and llm.txt all derive from this array. To add a module: add an entry
 *            here, add the matching route, and register the extension set in
 *            constants/EditorExtension.tsx. Never duplicate this list in a page.
 * @ai-agent `engine` names the underlying editor core so the UI can be honest about what
 *            powers each module. Today every module is Tiptap; other engines (Lexical,
 *            ProseMirror, Slate, Quill) are planned and must be added as new values.
 * @ai-agent `href` is where the live demo lives. Every example route renders
 *            <ExamplePageTemplate />, so a new module needs: a registry entry, a
 *            getSampleContent() entry, and a three-line route under app/examples/. The
 *            documentation page under /documentation/modules/ is generated automatically.
 * @dependencies None. Pure data — keep it serialisable so it can be embedded in llms.txt.
 */

export type EditorEngine =
  | "tiptap"
  | "lexical"
  | "prosemirror"
  | "slate"
  | "quill"
  | "blocknote"
  | "custom";

export type ModuleStatus = "stable" | "beta" | "planned";

export interface EditorModule {
  /** Stable kebab-case identifier. Used in URLs, llms.txt anchors, and registry keys. */
  id: string;
  /** Human-readable module name. */
  title: string;
  /** Short one-line summary shown on cards. */
  summary: string;
  /** Longer explanation used on the module detail and documentation pages. */
  description: string;
  /** The editor core that powers this module. */
  engine: EditorEngine;
  /** Version of the engine used. */
  engineVersion: string;
  /** Feature tier, used by the /modules filter dropdown. */
  category: "Minimal" | "Rich Content" | "Full Featured" | "Experimental";
  /** Maturity of the module itself. */
  status: ModuleStatus;
  /** Internal route where the module can be tried. */
  href: string;
  /** Documentation anchor for this module. */
  docs: string;
  /** Extension set constant in constants/EditorExtension.tsx that powers this module. */
  extensionSet: string;
  /** Typical use cases. */
  useCases: string[];
  /** User-visible capabilities. */
  features: string[];
  /** Notable extensions included in the set. */
  extensions: string[];
}

/**
 * Every module shipped by Editor Blocks.
 *
 * @ai-agent Order matters — the first three entries are surfaced on the landing page,
 *            all entries are listed on /modules and in llms.txt.
 * @ai-agent The `as const satisfies` combination is deliberate and load-bearing. `as const`
 *            preserves literal types so `ModuleId` below becomes a real union of the ids
 *            rather than `string`; `satisfies` still checks each entry against EditorModule.
 *            Together they mean a typo in an id, engine, or category is a compile error, and
 *            `<EditorPage type={module.id} />` type-checks without a cast. Do not drop either
 *            half — `as const` alone loses the interface check, and `satisfies` alone
 *            widens the ids back to `string`.
 */
export const EDITOR_MODULES = [
  {
    id: "comment",
    title: "Comment Editor",
    summary: "Minimal rich-text editor for comments, replies, and short-form input.",
    description:
      "A deliberately small TipTap editor for UGC surfaces: threaded comments, replies, review notes, and feedback forms. It ships only the formatting a commenter realistically needs and enforces a 2,500 character ceiling so a comment can never blow out a thread view.",
    engine: "tiptap",
    engineVersion: "^3.31.4",
    category: "Minimal",
    status: "stable",
    href: "/examples/comment",
    docs: "/documentation/modules/comment",
    extensionSet: "COMMENT_EXTENSIONS",
    useCases: [
      "Threaded comments and replies",
      "Review and approval notes",
      "Inline feedback widgets",
      "Quick-capture input",
    ],
    features: [
      "Bold, italic, underline, strike",
      "Links with autolink",
      "Bullet and ordered lists",
      "Blockquotes",
      "Inline code",
      "Live character count",
      "2,500 character hard limit",
    ],
    extensions: [
      "Document",
      "Paragraph",
      "Text",
      "Bold",
      "Italic",
      "Underline",
      "Strike",
      "Code",
      "MarkdownLink",
      "BulletList",
      "OrderedList",
      "ListItem",
      "Blockquote",
      "CharacterCount",
    ],
  },
  {
    id: "content",
    title: "Content Editor",
    summary: "Rich article and blog editor with typography, headings, and media embeds.",
    description:
      "A TipTap editor tuned for long-form publishing. It layers the comment baseline with the full typography set — six heading levels, alignment, subscript and superscript, highlighting, horizontal rules, and smart punctuation — which makes it the right default for blogs, articles, and CMS fields.",
    engine: "tiptap",
    engineVersion: "^3.31.4",
    category: "Rich Content",
    status: "stable",
    href: "/examples/content",
    docs: "/documentation/modules/content",
    extensionSet: "BLOG_EXTENSIONS",
    useCases: [
      "Blog posts and articles",
      "News and editorial content",
      "CMS long-text fields",
      "Content marketing pages",
    ],
    features: [
      "Everything in Comment Editor",
      "Headings H1–H6 with Tailwind sizing",
      "Text alignment (left, center, right, justify)",
      "Subscript and superscript",
      "Multi-colour highlight",
      "Horizontal rules",
      "Smart typography (smart quotes, dashes)",
      "Font family, size, and line height",
      "Text and background colour",
    ],
    extensions: [
      "Heading (custom per-level classes)",
      "TextAlign",
      "Subscript",
      "Superscript",
      "Highlight",
      "HorizontalRule",
      "Typography",
      "TextStyle",
      "Color",
      "BackgroundColor",
      "FontFamily",
      "FontSize",
      "LineHeight",
    ],
  },
  {
    id: "document",
    title: "Document Editor",
    summary: "Full-featured document editor with tables, code blocks, images, and import/export.",
    description:
      "The heaviest TipTap configuration in the catalogue. Adds syntax-highlighted code blocks, resizable tables, collapsible details blocks, image drop-and-paste handling, YouTube embeds, and JSON import/export, plus a character counter in textSize mode. Intended for documentation, wikis, and technical writing.",
    engine: "tiptap",
    engineVersion: "^3.31.4",
    category: "Full Featured",
    status: "stable",
    href: "/examples/docs",
    docs: "/documentation/modules/document",
    extensionSet: "DOCUMENT_EXTENSIONS",
    useCases: [
      "Documentation and wikis",
      "Knowledge bases",
      "Technical and legal writing",
      "Report authoring",
    ],
    features: [
      "Everything in Content Editor",
      "Syntax-highlighted code blocks (lowlight)",
      "Resizable tables with header rows",
      "Collapsible details blocks",
      "Image insert, drop, and paste",
      "Base64 image support",
      "YouTube embed dialog",
      "JSON import and export",
      "Character count (textSize mode)",
    ],
    extensions: [
      "CodeBlockLowlight",
      "TableKit",
      "Details",
      "DetailsSummary",
      "DetailsContent",
      "Image",
      "FileHandler",
      "Youtube",
      "CharacterCount (textSize)",
    ],
  },
  {
    id: "presentation",
    title: "Presentation Editor",
    summary: "Slide-style document editor for decks, outlines, and structured walkthroughs.",
    description:
      "A TipTap editor configured for presentation-shaped content. It reuses the full complex extension set with a textSize character counter, which suits slide copy, speaker notes, and structured walkthroughs where heading hierarchy carries most of the meaning.",
    engine: "tiptap",
    engineVersion: "^3.31.4",
    category: "Experimental",
    status: "beta",
    href: "/examples/presentation",
    docs: "/documentation/modules/presentation",
    extensionSet: "PRESENTATION_EXTENSIONS",
    useCases: [
      "Slide decks and speaker notes",
      "Product walkthroughs",
      "Structured onboarding guides",
      "Course outlines",
    ],
    features: [
      "Everything in Content Editor",
      "All complex block extensions",
      "Character count (textSize mode)",
      "Heading-led structure",
    ],
    extensions: [
      "All complex extensions",
      "CharacterCount (textSize)",
    ],
  },
] as const satisfies readonly EditorModule[];

/**
 * The union of module ids, derived from the registry.
 *
 * @ai-agent This is what makes `<EditorPage type={module.id} />` type-check without a cast.
 *            EditorContext derives its EditorType union from this, so adding a module here
 *            automatically widens the accepted editor types.
 */
export type ModuleId = (typeof EDITOR_MODULES)[number]["id"];

/** Feature tiers available in the /modules filter dropdown. */
export const MODULE_CATEGORIES = [
  "All",
  "Minimal",
  "Rich Content",
  "Full Featured",
  "Experimental",
] as const;

export type ModuleCategory = (typeof MODULE_CATEGORIES)[number];

/** Human labels for the underlying editor cores, used for the engine badge on cards. */
export const ENGINE_LABELS: Record<EditorEngine, string> = {
  tiptap: "TipTap",
  lexical: "Lexical",
  prosemirror: "ProseMirror",
  slate: "Slate",
  quill: "Quill",
  blocknote: "BlockNote",
  custom: "Custom",
};

/**
 * Look up one module by id.
 *
 * @ai-agent Returns undefined for an unknown id rather than throwing, so callers can decide
 *            how to handle a bad id. ExamplePageTemplate treats it as a programming error and
 *            throws with the id in the message; the docs route calls notFound().
 */
export function getModule(id: string): (typeof EDITOR_MODULES)[number] | undefined {
  return EDITOR_MODULES.find((m) => m.id === id);
}

/** All distinct engines currently in use across the catalogue. */
export function getActiveEngines(): EditorEngine[] {
  return [...new Set(EDITOR_MODULES.map((m) => m.engine))];
}
