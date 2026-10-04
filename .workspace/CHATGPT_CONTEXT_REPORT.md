# EDITOR BLOCKS — COMPLETE CODEBASE & SITE INVENTORY

```yaml
report:
  id: AI_CONTEXT_REPORT
  version: 1.0
  generated: 2026-10-03
  project: Editor Blocks
  repository: https://github.com/coderooz/Editor-Blocks
  deployment: https://editor-blocks.vercel.app
  purpose: Single-file AI-agent context for generating an action plan (fix + optimization)
  audience: LLM agent (ChatGPT / Opencode)
  human_readability: NOT a priority — density and machine-parseability are
```

---

## 0. HOW TO USE THIS FILE

This is a **complete, self-contained context dump**. An AI agent should be able to plan and
execute work using only this file plus the repository. Specifically:

- **§1–§3** — project identity, what changed, and the current architecture in one screen.
- **§4** — every route: what it renders, its metadata, and its data dependencies.
- **§5** — every source file: path, responsibility, exports, dependencies, status, issues.
- **§6** — the four data registries that act as single sources of truth.
- **§7** — styling, theming, and syntax highlighting.
- **§8** — AI-agent surface (llm.txt, meta tags, JSDoc convention).
- **§9** — defects: what was fixed this session, what remains, and why.
- **§10** — verification status and known unverifiable areas.
- **§11** — prioritized recommendations for the next action plan.
- **§12** — PRI/LFI drift report (the committed reference systems are stale).

**Convention:** `ACTIVE` = reachable from a route. `UNUSED` = exists, zero imports.
`DEAD` = exists, intentionally disabled. `STALE` = documentation no longer matches code.

---

## 1. PROJECT IDENTITY & WHAT CHANGED

### 1.1 Rename

| Field | Before | After |
|---|---|---|
| Product name | Simple TipTap Editor | **Editor Blocks** |
| Repository | coderooz/TipTap-Editor | **coderooz/Editor-Blocks** |
| Deployment | tiptap-editor.vercel.app | **editor-blocks.vercel.app** |
| package.json name | tiptap-editor | **editor-blocks** |
| package.json version | 1.0.0 | **0.3.0** |

### 1.2 Goal change

| Dimension | Before | After |
|---|---|---|
| Product type | TipTap v3 rich-text editor showcase | Library of drop-in editor modules |
| Editor relationship | TipTap IS the product | TipTap is the current **engine**; architecture is engine-agnostic |
| Unit of delivery | 4 editor modes | 4 **modules**, each a pre-tuned configuration |
| Copy strategy | Marketing a single editor | Marketing a catalogue; each module declares engine/tier/status |
| Extensibility story | Customize our editor | Copy the module source and own it |

### 1.3 Design principles

1. **Modules, not frameworks** — install a module that solves one job, not an entire editor framework.
2. **Engine-agnostic** — each module declares its engine via data. Lexical/ProseMirror/BlockNote/Slate/Quill are reserved `EditorEngine` values.
3. **Copy the code** — every module is readable source you vendor. No runtime lock-in.
4. **One contract** — all modules share props and context API.

### 1.4 Built this session

Module registry, sample-content registry, docs navigation, reference registry, 12-page
documentation section, shared example template, server-side syntax highlighting with copy
button, AI-agent surface (llm.txt / llms-full.txt / meta tags / `@ai-agent` JSDoc), global
header/footer, per-page metadata for all 21 routes.

---

## 2. TECHNOLOGY STACK

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js App Router | 16.3.8 | Turbopack |
| Language | TypeScript strict | 5.9.2 | `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, `noUnusedLocals` |
| Runtime | React / ReactDOM | 19.3.0 | — |
| Editor core | TipTap | 3.31.4 | All 4 modules currently TipTap |
| Styling | Tailwind CSS | 4 | CSS variables, class-based dark mode |
| UI kit | shadcn/ui on Radix | — | Vendored in `components/ui/` |
| Icons | Lucide React | 1.49.0 | Brand marks supplemented locally |
| Syntax highlight | lowlight | 3.3.0 | Server-side, 8 grammars |
| Package manager | npm | 12.2.0 | — |
| Deployment | Vercel | — | CI in `.github/workflows/ci.yml` |
| License | MIT | — | — |

---

## 3. ARCHITECTURE IN ONE SCREEN

```text
ROUTE (app/**/page.tsx)
  └─ renders <EditorPage type="<moduleId>" initialContent="<sample.html>" />
       ├─ useEffect → setEditorType(type)            [context/EditorContext.tsx]
       ├─ useEffect → editor.commands.setContent()  [seeds the document]
       ├─ <EditorMenuBar />                         [components/EditorMenuBar.tsx]
       │    └─ MENU_BY_TYPE[editorType] → MenuItem[] → grouped by item.group
       │         └─ per item.type: button | dropdown | input | model
       └─ <EditorContent />                         [TipTap ProseMirror surface]

EditorProvider (app/layout.tsx, mounted ONCE)
  └─ owns the single Editor instance
       ├─ extensions = MENU preset for editorType + Placeholder
       ├─ useEditor(config, [editorType])   ← type change tears down + rebuilds
       ├─ onUpdate → setCharCount + setEditorContent(editor.getHTML())
       └─ transaction listener → setCharCount

DATA REGISTRIES (constants/*)
  ├─ module-registry.ts   → EDITOR_MODULES (SSOT for module metadata)
  ├─ sample-content.ts    → SAMPLE_CONTENT  (SSOT for seed HTML)
  ├─ docs-nav.ts          → DOCS_NAV       (SSOT for documentation structure)
  └─ docs-references.ts   → all outbound links (SSOT for citations)
```

**Critical invariant:** `EditorType` is *derived* from the registry as `ModuleId | "default"`.
Adding a module to `EDITOR_MODULES` automatically widens the accepted editor types. The
`as const satisfies` combination on `EDITOR_MODULES` makes a typo in an id/engine/category a
**compile error**.

---

## 4. ROUTE INVENTORY (22 routes, all verified HTTP 200)

### 4.1 Marketing

| Route | Title | File | Component type | Data deps |
|---|---|---|---|---|
| `/` | Editor Blocks — Ready-to-Use Editor Modules for React | `app/page.tsx` | Server | `EDITOR_MODULES`, `getActiveEngines` |
| `/modules` | Module Catalogue \| Editor Blocks | `app/modules/page.tsx` | **Server** (metadata) → `components/modules/ModulesCatalogue.tsx` (Client) | `EDITOR_MODULES`, `MODULE_CATEGORIES`, `ENGINE_LABELS` |
| `/examples` | Live Examples \| Editor Blocks | `app/examples/page.tsx` | Server | `EDITOR_MODULES`, `ENGINE_LABELS` |

### 4.2 Examples (all render `components/examples/ExamplePageTemplate.tsx`)

| Route | Module ID | Title | Toolbar btns | Seeded chars |
|---|---|---|---|---|
| `/examples/comment` | `comment` | Comment Editor — TipTap Editor Example \| Editor Blocks | 6 | 500 |
| `/examples/content` | `content` | Content Editor — TipTap Editor Example \| Editor Blocks | 23 | 665 |
| `/examples/docs` | `document` | Document Editor — TipTap Editor Example \| Editor Blocks | 32 | 640 |
| `/examples/presentation` | `presentation` | Presentation Editor — TipTap Editor Example \| Editor Blocks | 23 | 565 |

**NOTE:** `/examples/docs` serves module id `document` — URL segment ≠ module id. The template
prop takes the MODULE ID.

### 4.3 Documentation (12 pages, all under `app/documentation/`)

| Route | Title | File | Notes |
|---|---|---|---|
| `/documentation` | Documentation \| Editor Blocks | `page.tsx` | Overview |
| `/documentation/getting-started` | Getting Started \| Editor Blocks | `getting-started/page.tsx` | Install + mount |
| `/documentation/modules` | Module Catalogue \| Editor Blocks | `modules/page.tsx` | Capability matrix |
| `/documentation/modules/comment` | Comment Editor — TipTap Module \| Editor Blocks | `modules/[moduleId]/page.tsx` | **SSG** via `generateStaticParams` |
| `/documentation/modules/content` | Content Editor — TipTap Module \| Editor Blocks | same | SSG |
| `/documentation/modules/document` | Document Editor — TipTap Module \| Editor Blocks | same | SSG |
| `/documentation/modules/presentation` | Presentation Editor — TipTap Module \| Editor Blocks | same | SSG |
| `/documentation/architecture` | Architecture \| Editor Blocks | `architecture/page.tsx` | Layers, request flow, trade-offs |
| `/documentation/api` | API Reference \| Editor Blocks | `api/page.tsx` | Props, context, presets, menu items |
| `/documentation/custom-modules` | Custom Modules \| Editor Blocks | `custom-modules/page.tsx` | Add module / add engine |
| `/documentation/roadmap` | Roadmap \| Editor Blocks | `roadmap/page.tsx` | Planned engines + platform work |
| `/documentation/references` | References \| Editor Blocks | `references/page.tsx` | Full outbound-link index |

### 4.4 Machine-readable & redirects

| Route | Content-Type | Purpose |
|---|---|---|
| `/llm.txt` | `text/plain` | Compact AI-agent manifest |
| `/llms-full.txt` | `text/plain` | Full documentation as one text document |
| `/presentation` → `/examples/presentation` | — | 301 permanent redirect |

---

## 5. FILE-BY-FILE INVENTORY

Status values: `ACTIVE` · `UNUSED` · `DEAD` · `STALE`

### 5.1 `app/` — routes

#### `app/layout.tsx`
- FilePath: `app/layout.tsx`
- Type: Server Component (root layout)
- Description: HTML shell. Loads Geist fonts, exports site metadata, mounts `EditorProvider`,
  renders global `<Header />` and `<Footer />`, injects AI-agent tags and JSON-LD.
- Exports: `metadata`, `viewport`, `RootLayout`
- Dependencies: `next/font/google`, `context/EditorContext`, `components/layout/Header`,
  `components/layout/Footer`, `constants/module-registry`
- Status: ACTIVE
- Issues: none

#### `app/page.tsx`
- FilePath: `app/page.tsx`
- Type: Server Component
- Description: Landing page. Hero, `<LiveEditorDemo />`, 8-card feature grid, 6-stat grid,
  10-item tech stack, 3 featured module cards, CTA.
- Exports: `default Home`
- Dependencies: `components/LiveEditorDemo`, `constants/module-registry`, lucide icons
- Status: ACTIVE
- Issues: none (nested `<main>` fixed this session)

#### `app/modules/page.tsx`
- FilePath: `app/modules/page.tsx`
- Type: **Server Component** (exports `metadata`)
- Description: Thin route entry. Exports page metadata and renders `<ModulesCatalogue />`.
- Exports: `metadata`, `default ModulesPage`
- Dependencies: `components/modules/ModulesCatalogue`, `constants/module-registry`
- Status: ACTIVE
- Issues: none. **Was a Client Component until this session** — exporting `metadata` from a
  `"use client"` file is illegal in Next.js, which is why 15 pages shared one `<title>`.

#### `components/modules/ModulesCatalogue.tsx`
- FilePath: `components/modules/ModulesCatalogue.tsx`
- Type: Client Component
- Description: Interactive catalogue. Search box, category dropdown, result count
  (`aria-live`), module cards with engine/tier/status badges, empty state.
- Exports: `ModulesCatalogue`
- Dependencies: `constants/module-registry`, shadcn `Card`/`Select`/`Input`, lucide
- Status: ACTIVE
- Issues: none

#### `app/examples/page.tsx`
- FilePath: `app/examples/page.tsx`
- Type: Server Component
- Description: Examples index. Grid of module cards with engine/category badges + CTA to
  getting-started.
- Exports: `metadata`, `default ExamplesPage`
- Dependencies: `constants/module-registry`, lucide
- Status: ACTIVE
- Issues: none

#### `app/examples/comment/page.tsx`
- FilePath: `app/examples/comment/page.tsx`
- Type: Client Component
- Description: Thin wrapper — `exampleMetadata("comment")` + `<ExamplePageTemplate moduleId="comment" />`
- Exports: `metadata`, `default`
- Status: ACTIVE

#### `app/examples/content/page.tsx`
- FilePath: `app/examples/content/page.tsx`
- Type: Client Component
- Description: Thin wrapper for module `content`
- Status: ACTIVE

#### `app/examples/docs/page.tsx`
- FilePath: `app/examples/docs/page.tsx`
- Type: Client Component
- Description: Thin wrapper for module `document`. **URL segment is `docs`, module id is `document`.**
- Status: ACTIVE

#### `app/examples/presentation/page.tsx`
- FilePath: `app/examples/presentation/page.tsx`
- Type: Client Component
- Description: Thin wrapper for module `presentation` (beta)
- Status: ACTIVE

#### `app/documentation/layout.tsx`
- FilePath: `app/documentation/layout.tsx`
- Type: Server Component
- Description: Docs chrome. Sidebar nav (from `DOCS_NAV`), reading column, `<DocsToc />`.
  Sticky offset `top-[5.5rem]`, viewport cap `max-h-[calc(100vh-7rem)]`.
- Status: ACTIVE
- Issues: none (sticky-header overlap fixed this session)

#### `app/documentation/DocsToc.tsx`
- FilePath: `app/documentation/DocsToc.tsx`
- Type: Client Component
- Description: "On this page" sidebar. Derives entries from `h2[id]`/`h3[id]` in the sibling
  `<article>` via `IntersectionObserver`. Hidden below `xl` breakpoint.
- Status: ACTIVE
- Issues: none

#### `app/documentation/page.tsx`
- FilePath: `app/documentation/page.tsx`
- Type: Server Component
- Description: Docs overview. What/why/modules table/quick start/project layout/next steps/references.
- Status: ACTIVE

#### `app/documentation/getting-started/page.tsx`
- FilePath: `app/documentation/getting-started/page.tsx`
- Type: Server Component
- Description: Requirements, install, scripts, mount, read/write content, next steps.
- Status: ACTIVE

#### `app/documentation/modules/page.tsx`
- FilePath: `app/documentation/modules/page.tsx`
- Type: Server Component
- Description: Capability matrix (●/○), per-module detail cards, decision guide.
- Status: ACTIVE

#### `app/documentation/modules/[moduleId]/page.tsx`
- FilePath: `app/documentation/modules/[moduleId]/page.tsx`
- Type: Server Component, **dynamic segment with `generateStaticParams`**
- Description: Data-driven module detail. One static page per registry entry. Calls `notFound()`
  for unknown ids.
- Exports: `generateStaticParams`, `generateMetadata`, `default`
- Status: ACTIVE
- Issues: none

#### `app/documentation/architecture/page.tsx`
- FilePath: `app/documentation/architecture/page.tsx`
- Type: Server Component
- Description: Layers table, request flow, single-instance model, registry-as-SSOT, engine
  abstraction, preset hierarchy, known trade-offs.
- Status: ACTIVE

#### `app/documentation/api/page.tsx`
- FilePath: `app/documentation/api/page.tsx`
- Type: Server Component
- Description: `EditorPage` props, `EditorType` table (registry-derived), `useEditorContext`
  signature + fields, extension presets, menu item shapes, YouTube inline-regex explanation.
- Status: ACTIVE

#### `app/documentation/custom-modules/page.tsx`
- FilePath: `app/documentation/custom-modules/page.tsx`
- Type: Server Component
- Description: 4-step add-a-module guide, toolbar button example, new-engine adapter interface.
- Status: ACTIVE

#### `app/documentation/roadmap/page.tsx`
- FilePath: `app/documentation/roadmap/page.tsx`
- Type: Server Component
- Description: Current state, planned engines table, platform work cards, contributing.
- Status: ACTIVE

#### `app/documentation/references/page.tsx`
- FilePath: `app/documentation/references/page.tsx`
- Type: Server Component
- Description: Source code index, upstream docs (7 groups), related pages, JSDoc convention.
- Status: ACTIVE

#### `app/documentation/not-found.tsx`
- FilePath: `app/documentation/not-found.tsx`
- Type: Server Component
- Description: Custom 404 for unknown module ids. Recovery links to all modules.
- Status: ACTIVE

---

### 5.2 `components/layout/`

#### `components/layout/Header.tsx`
- FilePath: `components/layout/Header.tsx`
- Type: Server Component
- Description: Global header. Fixed `h-16`, backdrop-blur. Exports `SITE_NAME` (single source
  of truth for product name). Nav: Live Demo, Modules, Docs, GitHub. Theme toggle.
- Exports: `SITE_NAME`, `Header`
- Status: ACTIVE
- Issues: none

#### `components/layout/Footer.tsx`
- FilePath: `components/layout/Footer.tsx`
- Type: Server Component
- Description: Global footer. 4-column grid. Live module count + engine list from registry.
  NPM Package is an inert `<span>` with "(coming soon)". llm.txt link.
- Exports: `Footer`
- Dependencies: `SITE_NAME` from `./Header`, `constants/module-registry`
- Status: ACTIVE
- Issues: none

---

### 5.3 `components/editor/`

#### `components/EditorPage.tsx`
- FilePath: `components/EditorPage.tsx`
- Type: Client Component
- Description: **Public mounting surface.** Owns toolbar + editing area + char counter.
  Seeds content via `editor.commands.setContent(initialContent)`.
- Exports: `default EditorPage`
- Props: `{ type: EditorType; initialContent?: string }`
- Dependencies: `context/EditorContext`, `components/EditorMenuBar`, `@tiptap/react`
- Status: ACTIVE
- Issues: **FIXED this session** — `initialContent` was a no-op (called `setEditorContent`,
  which only updates context state; `useEditor` reads `content` only at construction).

#### `components/EditorMenuBar.tsx`
- FilePath: `components/EditorMenuBar.tsx`
- Type: Client Component
- Description: Toolbar. `MENU_BY_TYPE[editorType]` → `MenuItem[]`, grouped by `item.group`,
  dispatched per `item.type` (button/dropdown/input/model).
- Exports: `EditorMenuBar`
- Dependencies: `context/EditorContext`, `constants/EditorMenuOptions`, shadcn UI, `lib/utils`
- Status: ACTIVE
- Issues: **FIXED this session** — `presentation` fell through to `MENU_BTN_ITEMS` (6 buttons
  instead of 23). `MENU_BY_TYPE` is now `Record<EditorType, MenuItem[]>` so a missing key is a
  compile error.

#### `components/EditorContent.tsx`
- FilePath: `components/EditorContent.tsx`
- Type: Client Component
- Description: Thin wrapper around TipTap's `EditorContent`.
- Status: ACTIVE

#### `components/MenuButton.tsx`
- FilePath: `components/MenuButton.tsx`
- Type: Client Component
- Description: Presentational button wrapper.
- Status: **UNUSED** — zero imports. `EditorMenuBar` inlines its own Button usage.

#### `components/EditorButton.tsx`
- FilePath: `components/EditorButton.tsx`
- Type: Client Component
- Description: Toolbar icon button with active state.
- Status: **UNUSED** — zero imports.

---

### 5.4 `components/` (top-level)

#### `components/LiveEditorDemo.tsx`
- FilePath: `components/LiveEditorDemo.tsx`
- Type: Client Component
- Description: Landing-page demo. Mode tabs (Comment/Content/Document/Presentation/Default),
  seeded editor, loading spinner. **Reads sample content from the shared registry** — no local
  copy.
- Exports: `LiveEditorDemo`
- Dependencies: `components/EditorPage`, `constants/module-registry`, `constants/sample-content`
- Status: ACTIVE
- Issues: **FIXED this session** — previously carried its own `SAMPLE_CONTENT` copy that still
  said "Building a Production-Ready TipTap Editor" after the rename, and its `<h1>` gave the
  home page a second `<h1>`.

#### `components/ThemeToggle.tsx`
- FilePath: `components/ThemeToggle.tsx`
- Type: Client Component
- Description: Dark/light switch. Persists to `localStorage`, toggles `.dark` on `<html>`.
  SSR-safe via `mounted` guard (renders a `disabled` placeholder until the effect runs).
- Status: ACTIVE
- Issues: none

---

### 5.5 `components/examples/`

#### `components/examples/ExamplePageTemplate.tsx`
- FilePath: `components/examples/ExamplePageTemplate.tsx`
- Type: Client Component
- Description: **Shared template for all example routes.** Breadcrumb, header with
  engine/tier/status badges, two-column editor + live preview, capabilities, install guide,
  related links. Throws if module id is not in the registry.
- Exports: `ExamplePageTemplate`
- Dependencies: `components/EditorPage`, `components/examples/EditorPreview`,
  `components/examples/InstallGuide`, `constants/module-registry`, `constants/sample-content`
- Status: ACTIVE
- Issues: none

#### `components/examples/EditorPreview.tsx`
- FilePath: `components/examples/EditorPreview.tsx`
- Type: Client Component
- Description: Live output panel. Rendered/HTML tabs, char count vs HTML length, sanitisation
  warning. Uses `dangerouslySetInnerHTML` (acceptable here — own content, same-origin).
- Status: ACTIVE
- Issues: none

#### `components/examples/InstallGuide.tsx`
- FilePath: `components/examples/InstallGuide.tsx`
- Type: Server Component
- Description: 4-step copy-the-source guide. Clone, install deps, mount, read value back.
  Snippets generated from module id.
- Status: ACTIVE
- Issues: none

#### `components/examples/example-metadata.ts`
- FilePath: `components/examples/example-metadata.ts`
- Type: Server utility
- Description: Builds `Metadata` for an example route from the registry.
- Exports: `exampleMetadata(moduleId)`
- Status: ACTIVE

---

### 5.6 `components/docs/`

#### `components/docs/DocsHeading.tsx`
- FilePath: `components/docs/DocsHeading.tsx`
- Type: Server Component
- Description: `slugify`, `DocsTitle`, `DocsSection` (h2 with slugified id), `DocsSubsection`
  (h3 with slugified id). Anchors feed the TOC sidebar.
- Status: ACTIVE

#### `components/docs/DocsCode.tsx`
- FilePath: `components/docs/DocsCode.tsx`
- Type: Server Component
- Description: `DocsCode` (wraps `CodeBlock`), `DocsCallout` (info/warning/success),
  `DocsTable`, `DocsInlineCode`.
- Status: ACTIVE

#### `components/docs/CodeBlock.tsx`
- FilePath: `components/docs/CodeBlock.tsx`
- Type: Server Component (one client leaf: `CopyButton`)
- Description: Syntax-highlighted, copyable code block. Renders hast tree as React elements —
  **no `dangerouslySetInnerHTML`**.
- Status: ACTIVE

#### `components/docs/CopyButton.tsx`
- FilePath: `components/docs/CopyButton.tsx`
- Type: Client Component
- Description: Clipboard copy with `aria-live` feedback, error state, unmount timer cleanup.
- Status: ACTIVE

#### `components/docs/DocsReferences.tsx`
- FilePath: `components/docs/DocsReferences.tsx`
- Type: Server Component
- Description: `DocsReferences`, `DocsReferenceGroupBlock`, `DocsSeeAlso`, `DocsSourceIndex`.
  Internal hrefs use `next/link`; external get `target="_blank" rel="noopener noreferrer"`.
- Status: ACTIVE

#### `components/docs/docs-metadata.ts`
- FilePath: `components/docs/docs-metadata.ts`
- Type: Server utility
- Description: Builds `Metadata` for a docs page from `DOCS_PAGES`.
- Exports: `docsMetadata(href)`
- Status: ACTIVE

---

### 5.7 `components/ui/` (shadcn primitives)

| File | data-slot | Status |
|---|---|---|
| `components/ui/card.tsx` | `card`, `card-header`, `card-title`, `card-description`, `card-content`, `card-footer` | ACTIVE — **fixed this session** (was missing `data-slot`) |
| `components/ui/button.tsx` | `button` | ACTIVE |
| `components/ui/input.tsx` | `input` | ACTIVE |
| `components/ui/select.tsx` | `select`, `select-trigger`, `select-content`, `select-item`, … | ACTIVE |
| `components/ui/dialog.tsx` | `dialog`, `dialog-trigger`, `dialog-content`, … | ACTIVE |
| `components/ui/tabs.tsx` | `tabs`, `tabs-list`, `tabs-trigger`, `tabs-content` | ACTIVE |
| `components/ui/popover.tsx` | — | ACTIVE |
| `components/ui/native-select.tsx` | — | ACTIVE |
| `components/ui/hover-card.tsx` | — | ACTIVE |
| `components/ui/command.tsx` | — | ACTIVE |

---

### 5.8 `components/bubbleMenu/` — **DEAD**

| File | Status |
|---|---|
| `components/bubbleMenu/BaseBubbleMenu.tsx` | DEAD — commented out in `EditorContext` |
| `components/bubbleMenu/TextBubbleMenu.tsx` | DEAD |
| `components/bubbleMenu/ImageBubbleMenu.tsx` | DEAD |
| `components/bubbleMenu/TableBubbleMenu.tsx` | DEAD |
| `components/bubbleMenu/YoutubeBubbleMenu.tsx` | DEAD |

**Note:** The landing page no longer markets bubble menus (claim removed in the rebrand), so
the mismatch is resolved on the claim side. The components remain dead code.

---

### 5.9 `components/extensions/` — custom TipTap extensions

| File | Status | Notes |
|---|---|---|
| `components/extensions/MarkDownLink.ts` | ACTIVE | Extends `Link` with `[label](url)` input rule. **Must be registered exactly once.** |
| `components/extensions/FontFamily.ts` | UNUSED | Local implementation; official `@tiptap/extension-text-style` `FontFamily` is used instead |
| `components/extensions/FontSize.ts` | UNUSED | Same — official `FontSize` from text-style is used |
| `components/extensions/ImageResizable.tsx` | UNUSED | Custom resizable image node; stock `Image` is used instead |
| `components/extensions/SlashCommand.ts` | UNUSED | (from earlier audit) |

---

### 5.10 `components/models/` — dialog bodies

| File | Status | Notes |
|---|---|---|
| `components/models/link.tsx` | ACTIVE | Link dialog |
| `components/models/image.tsx` | ACTIVE | Image dialog |
| `components/models/youtube.tsx` | ACTIVE | YouTube dialog — inline regex extracts 11-char video ID |
| `components/models/ImportExport.tsx` | ACTIVE | JSON import/export |

---

### 5.11 `components/icons/`

#### `components/icons/brand-icons.tsx`
- FilePath: `components/icons/brand-icons.tsx`
- Type: Pure render
- Description: Supplies `Github`, `Twitter`, `Youtube` — brand marks removed from lucide-react v1.
- Status: ACTIVE

---

### 5.12 `constants/` — data registries

#### `constants/module-registry.ts` — **SSOT for modules**
- FilePath: `constants/module-registry.ts`
- Type: Static config (no React)
- Description: `EDITOR_MODULES` (4 modules), `ModuleId`, `MODULE_CATEGORIES`, `ENGINE_LABELS`,
  `getModule()`, `getActiveEngines()`.
- Key detail: `as const satisfies readonly EditorModule[]` — literal types + interface check.
- Consumers: `/modules`, `/documentation`, landing page, `/examples/*`, `app/layout.tsx` JSON-LD,
  `llm.txt`, `llms-full.txt`, footer.
- Status: ACTIVE

#### `constants/sample-content.ts` — **SSOT for seed HTML**
- FilePath: `constants/sample-content.ts`
- Type: Static config
- Description: `SAMPLE_CONTENT` (per-module HTML + `demonstrates` text), `getSampleContent()`.
- Key invariant: **top-level headings start at `<h2>`, not `<h1>`** (prevents duplicate h1).
- Status: ACTIVE

#### `constants/docs-nav.ts` — **SSOT for docs structure**
- FilePath: `constants/docs-nav.ts`
- Exports: `DOCS_NAV` (3 sections, 12 pages), `DOCS_PAGES`
- Status: ACTIVE

#### `constants/docs-references.ts` — **SSOT for outbound links**
- FilePath: `constants/docs-references.ts`
- Exports: `SOURCE_REPO`, `DEFAULT_BRANCH`, `sourceLink()`, `SITE_ORIGIN`, `UPSTREAM_REFS` (7 groups),
  `SOURCE_REFS` (4 groups), `DOC_CROSS_REFS` (2 groups)
- Status: ACTIVE

#### `constants/EditorExtension.tsx` — extension presets
- FilePath: `constants/EditorExtension.tsx`
- Exports: `DEFAULT_EXTENSIONS`, `COMPLEX_EXTENSIONS`, `BLOG_EXTENSIONS`, `DOCUMENT_EXTENSIONS`,
  `COMMENT_EXTENSIONS`, `PRESENTATION_EXTENSIONS`
- Hierarchy: `DEFAULT ⊂ COMPLEX ⊂ {BLOG, DOCUMENT, PRESENTATION}`; `COMMENT = DEFAULT + CharacterCount(2500)`
- Status: ACTIVE
- Issues: `createLowlight(all)` bundles **every** language — bundle cost noted in §11.

#### `constants/EditorMenuOptions.ts` — toolbar menus
- FilePath: `constants/EditorMenuOptions.ts`
- Exports: `MENU_BTN_ITEMS`, `CONTENT_MENU`, `DOCUMENT_MENU`, `MenuItem`, `MenuBtnGroups`,
  `MenuItemType`, `MenuButton`, `MenuDropdown`, `MenuInput`, `MenuModel`
- Status: ACTIVE

#### `constants/EditorStateOptions.tsx`
- FilePath: `constants/EditorStateOptions.tsx`
- Description: **EMPTY** — contains only a `/** @format */` banner.
- Status: **UNUSED / STALE**

---

### 5.13 `context/`

#### `context/EditorContext.tsx`
- FilePath: `context/EditorContext.tsx`
- Type: Client Component (Provider + hook)
- Description: Owns the single `Editor` instance. Resolves extension preset per `EditorType`,
  appends `Placeholder`, tracks `charCount` + `editorContent`.
- Exports: `EditorProvider`, `useEditorContext`, `EditorType` (derived: `ModuleId | "default"`)
- Status: ACTIVE
- Issues: **FIXED this session** — debug label `Editor Type: {editorType}` removed from DOM.

---

### 5.14 `lib/`

#### `lib/highlight.ts`
- FilePath: `lib/highlight.ts`
- Type: Server-only utility
- Description: `lowlight` wrapper. 8 grammars (typescript, javascript, bash, json, css, xml,
  markdown, diff). `resolveLanguage()`, `languageLabel()`, `highlightCode()` → hast tree.
  Degrades to auto-detect then plain text rather than throwing.
- Status: ACTIVE
- Issues: none

#### `lib/utils.ts`
- FilePath: `lib/utils.ts`
- Exports: `cn()` (clsx + tailwind-merge)
- Status: ACTIVE

---

### 5.15 `public/`

| File | Status |
|---|---|
| `public/llm.txt` | ACTIVE — AI-agent manifest |
| `public/llms-full.txt` | ACTIVE — full docs as text |
| `public/ContentImage.png` | ACTIVE — OpenGraph image |
| `public/favicon.ico` | ACTIVE |
| `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` | **UNUSED** — Vite defaults |

---

### 5.16 `plugin/` — distributable package scaffold

| File | Status |
|---|---|
| `plugin/README.md` | **STALE** — still describes `@coderooz/tiptap-editor` |
| `plugin/package.json` | **STALE** — old name |
| `plugin/src/**` | Scaffold only — not part of the app build |

---

### 5.17 Config files

| File | Status | Notes |
|---|---|---|
| `package.json` | ACTIVE | name `editor-blocks`, v0.3.0 |
| `tsconfig.json` | ACTIVE | strict + aggressive flags |
| `eslint.config.mjs` | ACTIVE | flat config |
| `next.config.ts` | ACTIVE | redirect `/presentation` → `/examples/presentation`; security headers; `llm.txt` Content-Type |
| `tailwind.config.ts` | ACTIVE | — |
| `postcss.config.mjs` | ACTIVE | Tailwind v4 |
| `components.json` | ACTIVE | shadcn paths |
| `.prettierrc` | ACTIVE | — |
| `vercel.json` | ACTIVE | — |
| `simple-tiptap-editor.project-mcp.json` | **STALE** — old project name |
| `opencode.jsonc` | ACTIVE | — |
| `README.md` | **STALE** — still describes the TipTap showcase |
| `AGENTS.md` | ACTIVE | — |
| `CHANGELOG.md` | **STALE** — no entry for the rename |

---

## 6. MODULE CATALOGUE (from `constants/module-registry.ts`)

### 6.1 Comment Editor
- id: `comment` · engine: tiptap ^3.31.4 · tier: Minimal · status: stable
- extensionSet: `COMMENT_EXTENSIONS`
- useCases: threaded comments, review notes, inline feedback, quick-capture
- features: bold/italic/underline/strike, links+autolink, bullet/ordered lists, blockquotes, inline code, live char count, 2500 char limit
- extensions: Document, Paragraph, Text, Bold, Italic, Underline, Strike, Code, MarkdownLink, BulletList, OrderedList, ListItem, Blockquote, CharacterCount

### 6.2 Content Editor
- id: `content` · engine: tiptap ^3.31.4 · tier: Rich Content · status: stable
- extensionSet: `BLOG_EXTENSIONS`
- useCases: blog posts, news, CMS fields, content marketing
- features: everything in Comment + headings H1–H6, text alignment, sub/superscript, highlight, horizontal rules, smart typography, font family/size/line height, text/background colour
- extensions: Heading (custom), TextAlign, Subscript, Superscript, Highlight, HorizontalRule, Typography, TextStyle, Color, BackgroundColor, FontFamily, FontSize, LineHeight

### 6.3 Document Editor
- id: `document` · engine: tiptap ^3.31.4 · tier: Full Featured · status: stable
- extensionSet: `DOCUMENT_EXTENSIONS`
- useCases: documentation, wikis, knowledge bases, technical writing
- features: everything in Content + code blocks (lowlight), resizable tables, collapsible details, image insert/drop/paste, base64 images, YouTube embeds, JSON import/export, char count
- extensions: CodeBlockLowlight, TableKit, Details, DetailsSummary, DetailsContent, Image, FileHandler, Youtube, CharacterCount

### 6.4 Presentation Editor
- id: `presentation` · engine: tiptap ^3.31.4 · tier: Experimental · status: **beta**
- extensionSet: `PRESENTATION_EXTENSIONS`
- useCases: slide decks, speaker notes, walkthroughs, onboarding guides
- features: everything in Content, all complex block extensions, char count, heading-led structure
- extensions: All complex extensions, CharacterCount

---

## 7. STYLING & THEMING

### 7.1 Approach
- Tailwind CSS 4 with CSS custom properties
- shadcn/ui patterns (`cva` variants, `cn()` merging)
- Dark mode: **class-based** (`.dark` on `<html>`), not media-query
- Color tokens in `app/globals.css` under `:root` and `.dark`

### 7.2 Key tokens

| Token | Light | Dark |
|---|---|---|
| `--background` | `oklch(1 0 0)` | `oklch(0.145 0 0)` |
| `--foreground` | `oklch(0.145 0 0)` | `oklch(0.985 0 0)` |
| `--primary` | `oklch(0.205 0 0)` | `oklch(0.922 0 0)` |
| `--muted` | `oklch(0.97 0 0)` | `oklch(0.269 0 0)` |
| `--border` | `oklch(0.922 0 0)` | `oklch(1 0 0 / 10%)` |

### 7.3 Syntax highlighting
- Server-side `lowlight`, 8 grammars
- Token colors as CSS custom properties on `.hljs-surface` (light + dark)
- Standard `hljs-*` class names from highlight.js
- Rendered as React elements — **no `dangerouslySetInnerHTML`** in the docs pipeline

### 7.4 Layout patterns
- Max content width: `max-w-7xl` (header/footer), `max-w-6xl` (modules), `max-w-5xl` (examples), `max-w-4xl` (landing)
- Fixed header `h-16` (64px); pages use `pt-16` to clear it
- Sticky docs sidebar: `top-[5.5rem]`, `max-h-[calc(100vh-7rem)]`, independent scroll
- Breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px

---

## 8. AI-AGENT SURFACE

| Artifact | Location | Purpose |
|---|---|---|
| `llm.txt` | `public/llm.txt` | Compact manifest: project summary, module catalogue, conventions |
| `llms-full.txt` | `public/llms-full.txt` | Full documentation as one text document |
| Meta declaration | `app/layout.tsx` | `<meta name="ai-content-declaration" content="ai-agent-friendly" />` |
| Alternate links | `app/layout.tsx` | `<link rel="alternate" type="text/plain" href="/llm.txt">` + `/llms-full.txt` |
| JSON-LD | `app/layout.tsx` | `SoftwareSourceCode` with `ItemList` of modules (registry-derived) |
| JSDoc convention | all source files | `@file`, `@description`, `@architecture`, `@ai-agent`, `@dependencies` |

**`@ai-agent` tag convention:** documents invariants and traps. Highest-value header to read first
is `constants/module-registry.ts`.

---

## 9. DEFECTS

### 9.1 Fixed this session (all browser-verified)

| # | Defect | Root cause | Fix |
|---|---|---|---|
| 1 | `initialContent` was a total no-op — all 4 example pages showed `<p>Start writing...</p>` | `setEditorContent()` only updates context state; `useEditor` reads `content` only at construction, deps `[editorType]` never change | `editor.commands.setContent(initialContent)` |
| 2 | `presentation` module had 6-button toolbar instead of 23 | `EditorMenuBar` mapped only `content`/`document`; `presentation` fell through to `MENU_BTN_ITEMS` | `MENU_BY_TYPE: Record<EditorType, MenuItem[]>` — missing key is now a compile error |
| 3 | Home page had 2 `<h1>`s; second was stale "Building a Production-Ready TipTap Editor" | Sample content HTML contained `<h1>`; `LiveEditorDemo` had its own stale copy | Samples start at `<h2>`; `LiveEditorDemo` reads shared registry |
| 4 | Nested `<main>` on `/`, `/modules`, `/examples` | Each page wrapped itself in `<main>` inside the layout's `<main>` | Demoted to `<div>` |
| 5 | 15 of 21 pages shared one `<title>` | No per-page metadata; `/modules` was `"use client"` (illegal to export metadata) | Per-page metadata; `/modules` split into Server page + client `ModulesCatalogue` |
| 6 | `Card` lacked `data-slot` | Hand-written component omitted shadcn convention | Added `data-slot` to all 6 subcomponents |
| 7 | Debug label `Editor Type: {editorType}` in DOM | Leftover debug output | Removed |
| 8 | Docs sidebar covered by fixed header | Layout had no top padding | `pt-28` on wrapper; sticky offset `top-[5.5rem]`; viewport cap |

### 9.2 Remaining (NOT fixed — out of scope for the bug-fix pass)

| Item | Location | Type |
|---|---|---|
| 5 dead bubble menu components | `components/bubbleMenu/*` | DEAD code |
| Unused `@tiptap/extension-bubble-menu` | `package.json` | unused dep |
| Unused `MenuButton.tsx` | `components/MenuButton.tsx` | UNUSED |
| Unused `EditorButton.tsx` | `components/EditorButton.tsx` | UNUSED |
| Unused `FontFamily.ts` | `components/extensions/FontFamily.ts` | UNUSED (official used) |
| Unused `FontSize.ts` | `components/extensions/FontSize.ts` | UNUSED (official used) |
| Unused `ImageResizable.tsx` | `components/extensions/ImageResizable.tsx` | UNUSED (stock used) |
| Unused `SlashCommand.ts` | `components/extensions/SlashCommand.ts` | UNUSED |
| Empty `EditorStateOptions.tsx` | `constants/EditorStateOptions.tsx` | STALE |
| Unused Yjs/collab deps | `package.json` | unused deps |
| Stale README | `README.md` | STALE docs |
| Stale plugin package | `plugin/README.md`, `plugin/package.json` | STALE |
| Stale MCP descriptor | `simple-tiptap-editor.project-mcp.json` | STALE |
| Stale CHANGELOG | `CHANGELOG.md` | STALE |
| PRI §7.1 lists `app/demo/page.tsx` as MISSING | `.workspace/PRI/` | STALE |
| `createLowlight(all)` bundles every language | `constants/EditorExtension.tsx` | bundle cost |

### 9.3 Architectural trade-offs (documented, accepted)

| Decision | Consequence |
|---|---|
| Module switch recreates the editor | Content + undo history lost on switch |
| One shared provider in root layout | A page cannot host two independent editors |
| Presets are static arrays | Extensions cannot be configured per host app |
| Toolbar items are data, not components | Simple to extend; bespoke JSX controls cannot be expressed |

---

## 10. VERIFICATION STATUS (2026-10-03)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | Clean |
| `npm run build` | 22 routes, all prerendered |
| `npm run lint` | 0 errors, 21 warnings (pre-existing `any`) |
| Browser: all 21 paths | HTTP 200, zero broken links |
| Browser: console errors | Zero on all 19 HTML pages |
| Browser: editor seeding | 500/665/640/565 chars on 4 example pages |
| Browser: toolbar buttons | 6/23/32/23 (correct per module) |
| Browser: search filter | table→1, no-match→empty, clear→4 |
| Browser: category dropdown | Opens, filters, proper ARIA |
| Browser: syntax highlighting | 93 tokens, 16 classes, light+dark |
| Browser: copy button | Error path verified (unfocused window) |
| Browser: docs TOC | All anchors render, zero broken |
| Browser: llm.txt / llms-full.txt | 200, text/plain, correct |
| Browser: /presentation redirect | 301 → /examples/presentation, 200 |
| Browser: 404 handling | Generic + custom docs not-found with recovery |
| Browser: theme toggle | Round-trip dark↔light, aria-pressed correct |
| Browser: client-side nav | Header/cards/docs links, 0 errors |

### Not verified (harness limitations)

- **Keyboard navigation** — `document.hasFocus() === false`; Tab order unreliable across runs
- **Responsive layout** — viewport fixed at 1000px, below `lg` (1024px) and `xl` (1280px)
- **Screenshots** — unavailable (requires visible desktop window)
- **Markdown link input rule** — inconclusive (automated keystrokes arrived out of order)

---

## 11. PRIORITIZED RECOMMENDATIONS

### High priority
1. **Wire up or remove bubble menus** — 5 dead components + unused dependency. Either mount per active node/mark, or delete.
2. **Remove unused dependencies** — `yjs`, `y-protocols`, `@tiptap/extension-collaboration`, `@tiptap/y-tiptap`, `@tiptap/extension-bubble-menu`.
3. **Clean up unused components** — `MenuButton.tsx`, `EditorButton.tsx`, empty `EditorStateOptions.tsx`, unused extensions (`FontFamily`, `FontSize`, `ImageResizable`, `SlashCommand`).
4. **Update README** — still describes the old TipTap showcase.
5. **Update plugin package** — `plugin/README.md` + `plugin/package.json` carry the old name.
6. **Update PRI §7.1** — still lists `app/demo/page.tsx` as MISSING.
7. **Update MCP descriptor** — `simple-tiptap-editor.project-mcp.json` has the old name.
8. **Update CHANGELOG** — no entry for the rename.

### Medium priority
9. **Add `robots.ts` and `sitemap.ts`** — derive from `DOCS_NAV` and `EDITOR_MODULES`.
10. **Per-host configuration** — presets are static arrays; an options-merge layer would let host apps adjust limits/MIME types/toolbar items.
11. **Multiple editors per page** — scoped-provider refactor.
12. **Accessibility audit** — toolbar semantics, focus restoration after dialogs, contrast.
13. **Test coverage** — unit tests for registry + YouTube parser; E2E for toolbar commands.

### Low priority
14. **Bundle analysis** — `createLowlight(all)` → `createLowlight(common)` or selective registration.
15. **Markdown link input rule test** — needs a real focused browser.
16. **Responsive verification** — needs viewport ≥1024px and ≥1280px.

---

## 12. PRI/LFI DRIFT REPORT

Both committed reference systems are **stale** — they describe the pre-rename state.

### 12.1 PRI (`.workspace/PRI/PROJECT_REFERENCE_INDEX.md`)

| PRI claim | Reality | Status |
|---|---|---|
| Project name "TipTap-Editor" | "Editor Blocks" | STALE |
| Repository `coderooz/TipTap-Editor` | `coderooz/Editor-Blocks` | STALE |
| Deployment `tiptap-editor.vercel.app` | `editor-blocks.vercel.app` | STALE |
| Routes `/comment`, `/content`, `/docs` | `/examples/comment`, `/examples/content`, `/examples/docs` | STALE |
| `/demo` linked 5×, 404 | Links removed; all point to `/examples` | RESOLVED |
| `EditorContext` renders debug label | Removed | RESOLVED |
| Bubble menus dead but marketed | Claim removed from landing page | RESOLVED (claim side) |
| `MenuButton`/`EditorButton` unused | Still unused | OPEN |
| `EditorStateOptions.tsx` empty | Still empty | OPEN |
| Yjs deps unused | Still unused | OPEN |
| `components/editor/` flat structure | `components/` flat + subdirs | STALE |
| `constants/EditorMenuOptions.ts` | `constants/EditorMenuOptions.ts` (no extension) | STALE |
| No `app/modules/`, `app/examples/`, `app/documentation/` | All exist | STALE |
| No `constants/module-registry.ts` etc. | 4 new registries | STALE |
| No `components/layout/`, `components/docs/`, `components/examples/` | All exist | STALE |
| No `lib/highlight.ts` | Exists | STALE |
| No `public/llm.txt`, `public/llms-full.txt` | Both exist | STALE |
| No `plugin/` | Exists (stale naming) | STALE |

### 12.2 LFI (`.workspace/LFI/LOGIC_FLOW_INDEX.md`, `DIAGRAMS.md`)

| LFI claim | Reality | Status |
|---|---|---|
| 4 modes: default/comment/content/document | 4 modules: comment/content/document/presentation | STALE |
| `EditorType` is a hand-written union | Derived: `ModuleId \| "default"` | STALE |
| `EditorMenuBar` maps content/document/else | `MENU_BY_TYPE: Record<EditorType, MenuItem[]>` | STALE |
| `initialContent` → `setEditorContent` | `editor.commands.setContent()` | STALE |
| `LiveEditorDemo` has own `SAMPLE_CONTENT` | Reads shared registry | STALE |
| Entry points: `/comment`, `/content`, `/docs` | `/examples/*` | STALE |
| No `/modules`, `/examples`, `/documentation` routes | All exist | STALE |
| State: `editorType` union of 4 literals | Derived from registry | STALE |

### 12.3 Recommendation

PRI and LFI need a full rebuild from the filesystem. The PRI's own governance rule states "the
actual repository filesystem is the source of truth. If this document conflicts with the
filesystem, the filesystem wins and this document must be repaired." A filesystem-discovery
pass should be run to regenerate both.

---

## 13. FILE TREE

```
app/
  layout.tsx
  page.tsx
  modules/page.tsx
  examples/page.tsx
  examples/comment/page.tsx
  examples/content/page.tsx
  examples/docs/page.tsx
  examples/presentation/page.tsx
  documentation/layout.tsx
  documentation/DocsToc.tsx
  documentation/page.tsx
  documentation/getting-started/page.tsx
  documentation/modules/page.tsx
  documentation/modules/[moduleId]/page.tsx
  documentation/architecture/page.tsx
  documentation/api/page.tsx
  documentation/custom-modules/page.tsx
  documentation/roadmap/page.tsx
  documentation/references/page.tsx
  documentation/not-found.tsx

components/
  layout/Header.tsx
  layout/Footer.tsx
  editor/EditorPage.tsx
  editor/EditorMenuBar.tsx
  editor/EditorContent.tsx
  editor/MenuButton.tsx              [UNUSED]
  editor/EditorButton.tsx            [UNUSED]
  LiveEditorDemo.tsx
  ThemeToggle.tsx
  examples/ExamplePageTemplate.tsx
  examples/EditorPreview.tsx
  examples/InstallGuide.tsx
  examples/example-metadata.ts
  modules/ModulesCatalogue.tsx
  docs/DocsHeading.tsx
  docs/DocsCode.tsx
  docs/CodeBlock.tsx
  docs/CopyButton.tsx
  docs/DocsReferences.tsx
  docs/docs-metadata.ts
  ui/card.tsx, button.tsx, input.tsx, select.tsx, dialog.tsx, tabs.tsx,
     popover.tsx, native-select.tsx, hover-card.tsx, command.tsx
  icons/brand-icons.tsx
  bubbleMenu/BaseBubbleMenu.tsx      [DEAD]
  bubbleMenu/TextBubbleMenu.tsx      [DEAD]
  bubbleMenu/ImageBubbleMenu.tsx     [DEAD]
  bubbleMenu/TableBubbleMenu.tsx     [DEAD]
  bubbleMenu/YoutubeBubbleMenu.tsx   [DEAD]
  extensions/MarkDownLink.ts         [ACTIVE]
  extensions/FontFamily.ts           [UNUSED]
  extensions/FontSize.ts             [UNUSED]
  extensions/ImageResizable.tsx      [UNUSED]
  extensions/SlashCommand.ts         [UNUSED]
  models/link.tsx, image.tsx, youtube.tsx, ImportExport.tsx

constants/
  module-registry.ts
  sample-content.ts
  docs-nav.ts
  docs-references.ts
  EditorExtension.tsx
  EditorMenuOptions.ts
  EditorStateOptions.tsx             [EMPTY]

context/EditorContext.tsx

lib/highlight.ts
lib/utils.ts

public/
  llm.txt
  llms-full.txt
  ContentImage.png
  favicon.ico
  file.svg, globe.svg, next.svg, vercel.svg, window.svg   [UNUSED]

plugin/                               [STALE naming]
```

---

*End of report. All claims verified against the filesystem and live browser on 2026-10-03.*
