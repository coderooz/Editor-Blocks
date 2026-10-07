# AGENTS.md — Editor Blocks

> Project-specific instructions for AI agents working on this repository.

---

## Project Identity

- **Name:** Editor Blocks (npm package: `editor-blocks`, version `0.3.0`)
- **Type:** Next.js 16 + React 19 library of drop-in editor modules, with a catalogue,
  examples site, and documentation
- **Author:** Ranit Saha (Coderooz)
- **Repository:** https://github.com/coderooz/Editor-Blocks
- **Deployment:** https://editor-blocks.vercel.app

> Naming history: the project was `simple-tiptap-editor` (v0.1.0), then `tiptap-editor`
> (v1.0.0), then renamed to `editor-blocks` (v0.3.0). Pre-1.0 again by intent: the product is a
> module catalogue, not a versioned editor core. Older docs and commits may still say
> "TipTap-Editor".

---

## Technology Stack

| Layer       | Choice                                       |
| ----------- | -------------------------------------------- |
| Framework   | Next.js 16.3.8 (App Router, Turbopack)       |
| UI          | React 19.3, TypeScript ^5.9 (strict)         |
| Styling     | Tailwind CSS 4, shadcn/ui, Radix primitives  |
| Editor core | TipTap ^3.31.4 (headless)                    |
| Engine dep  | `lexical` ^0.52.0 (scaffold only)            |
| Icons       | Lucide React ^1.49                           |
| Highlight   | Lowlight ^3.3                                |
| Tooling     | ESLint 9, Prettier, Husky 9, lint-staged     |
| Runtime     | Node ≥ 20, npm ≥ 10 (packageManager `npm@12.2.0`) |

---

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Linting / type checking
npm run lint
npm run typecheck      # tsc --noEmit
```

---

## Project Structure

```
app/                          # App Router
│   page.tsx                  # Landing page with the live module switcher demo
│   layout.tsx                # Root layout: fonts, metadata, <EditorProvider/> (mounted ONCE)
│   globals.css               # Tailwind v4 + CSS variables
│   modules/page.tsx          # Module catalogue (/modules)
│   examples/                 # /examples index + one route per shipped module
│   documentation/            # Docs section (getting-started, modules, api, architecture,
│                             #   custom-modules, references, roadmap)
├── components/
│   EditorPage.tsx            # Public mounting surface: toolbar + editing area + char count
│   EditorMenuBar.tsx         # Toolbar: groups menu items, dispatches to ToolbarItem
│   LiveEditorDemo.tsx        # Landing-page demo with module tabs
│   toolbar/ToolbarItem.tsx   # Polymorphic item renderer (button/dropdown/input/dialog)
│   examples/                 # ExamplePageTemplate, preview, install guide, metadata
│   modules/ModulesCatalogue.tsx
│   extensions/MarkDownLink.ts # Custom link mark (extends stock Link)
│   layout/ ui/ icons/ models/ docs/
├── constants/
│   module-registry.ts        # SSOT: all 8 modules (id, engine, status, href, preset)
│   EditorExtension.tsx       # 9 extension presets
│   EditorMenuOptions.ts      # 41 toolbar item definitions (4 menus + default)
│   sample-content.ts         # Seed HTML per demo module
├── context/EditorContext.tsx # Single provider + useEditorContext() hook
├── src/adapters/             # Engine adapter seam (lexicalAdapter.ts scaffold)
├── plugin/                   # Standalone npm-package scaffold (NOT published)
├── public/                   # Assets + llm.txt / llms-full.txt AI manifests
├── .workspace/PRI/           # Project Reference Index (committed)
├── .workspace/LFI/           # Logic Flow Index (committed)
├── lib/                      # utils (cn), highlight (lowlight instance)
└── .github/workflows/ci.yml  # lint+typecheck, build, test, deploy jobs
```

Directories from the older "TipTap-Editor showcase" (`editor/`, `features/`, `tests/`,
`bubble-menus/`) **no longer exist**. Do not create files referencing them.

---

## Editor Architecture

### The module system (central concept)

A **module** = one editor job, described by a registry entry and backed by an extension
preset + a toolbar menu.

1. `constants/module-registry.ts` is the **single source of truth**. It declares each module's
   `id`, `title`, `engine`, `status` (`stable | beta | planned`), `href`, `docsHref`, and
   `extensionSet` name. The catalogue, examples index, docs pages, and `llm.txt` derive from
   it — never duplicate the list in a page.
2. `constants/EditorExtension.tsx` exports the presets:
   `DEFAULT`, `COMPLEX`, `BLOG` (alias of `COMPLEX`), `DOCUMENT`, `COMMENT`, `PRESENTATION`,
   `MARKDOWN`, `LEGAL`, `WIKI`.
3. `context/EditorContext.tsx` holds `EditorType = ModuleId | "default"` and a
   **module → preset map** consumed by `useEditor([editorType])`.
4. `constants/EditorMenuOptions.ts` defines toolbar items as data;
   `components/EditorMenuBar.tsx` groups them via `MENU_BY_TYPE` (a **total** map over
   `EditorType` — a missing key is a compile error) and renders each via
   `components/toolbar/ToolbarItem.tsx`.

### Current wiring (8 registered / 4 fully shipped)

| Module id     | Preset wired in EditorContext | Toolbar menu   | `/examples/*` route |
| ------------- | ----------------------------- | -------------- | ------------------- |
| `comment`     | `COMMENT_EXTENSIONS`          | `COMMENT_MENU` | ✅ `/examples/comment` |
| `content`     | `BLOG_EXTENSIONS`             | `CONTENT_MENU` | ✅ `/examples/content` |
| `document`    | `DOCUMENT_EXTENSIONS`         | `DOCUMENT_MENU` | ✅ `/examples/docs`  |
| `presentation`| `PRESENTATION_EXTENSIONS`     | `CONTENT_MENU` | ✅ `/examples/presentation` |
| `markdown`    | ⚠️ falls back to `DEFAULT_EXTENSIONS` (preset exists, unwired) | `CONTENT_MENU` | ❌ 404 |
| `legal`       | ⚠️ falls back to `DEFAULT_EXTENSIONS` (preset exists, unwired) | `CONTENT_MENU` | ❌ 404 |
| `wiki`        | ⚠️ falls back to `DEFAULT_EXTENSIONS` (preset exists, unwired) | `CONTENT_MENU` | ❌ 404 |
| `lexical`     | ⚠️ falls back to `DEFAULT_EXTENSIONS` (`LEXICAL_EXTENSIONS` does not exist) | `CONTENT_MENU` | ❌ 404 |
| `default`     | `DEFAULT_EXTENSIONS`          | `MENU_BTN_ITEMS` | n/a (landing fallback) |

### Key invariants

1. **One provider.** `EditorProvider` is mounted once in `app/layout.tsx`. A second provider
   creates a second editor instance and desynchronises the toolbar.
2. **`EditorType` and the preset map must stay in sync.** Adding a union value without a map
   entry compiles fine but silently falls back to `DEFAULT_EXTENSIONS`.
3. **`MENU_BY_TYPE` is total over `EditorType`** — keep it that way; do not reintroduce a
   runtime fallback for known modules.
4. **Register the link mark exactly once.** `MarkDownLink` extends the stock `Link`
   extension; registering both produces two extensions named `link`.
5. **Seed content through `initialContent`, not context state.** `EditorPage` applies it with
   `editor.commands.setContent()`.
6. **`immediatelyRender: false`** in `useEditor` (SSR safety).
7. **No `console.log` in shipped code** (quality gate).

---

## Code Conventions

### TypeScript

- Strict mode; prefer `interface` over `type` for object shapes
- `const` over `let`, never `var`
- Avoid `any` — use `unknown` + type guards
- Use `import type` for type-only imports (ESLint `consistent-type-imports` is enforced)
- Optional chaining (`?.`) and nullish coalescing (`??`)

### React / Next.js

- Server Components by default; `'use client'` only when needed (context, effects, editor)
- `next/image` for images
- Colocate related helpers with their component

### Styling

- Tailwind CSS 4 with CSS variables
- shadcn/ui patterns: `cva()` variants, `cn()` from `lib/utils.ts` (`clsx` + `tailwind-merge`)

### File naming

- Components: PascalCase (`EditorPage.tsx`)
- Utilities/constants: camelCase (`utils.ts`) or PascalCase (`EditorExtension.tsx`)
- Route folders: kebab/lowercase (`app/examples/docs/`)

---

## Known Gaps (do not "discover" these again)

1. Registry `href`s for `markdown`, `legal`, `wiki`, `lexical` point to non-existent
   `/examples/*` routes (404). Add three-line routes under `app/examples/<id>/page.tsx`
   (see `app/examples/comment/page.tsx` as the pattern) when shipping them.
2. `MARKDOWN_EXTENSIONS`, `LEGAL_EXTENSIONS`, `WIKI_EXTENSIONS` exist but are not wired into
   the `EditorContext` preset map.
3. `LEXICAL_EXTENSIONS` is referenced by the registry but not implemented;
   `src/adapters/lexicalAdapter.ts` is a partial scaffold (adapter seam + in-progress impl).
4. `plugin/` is an unpublished npm-package scaffold (`@coderooz/tiptap-editor`) kept as
   reference; it is not part of the app build.
5. No automated test suite yet — CI runs `npm test --if-present` (no-op today).
6. `opencode.jsonc` `MCP_PROJECT` stays `simple-tiptap-editor`: it is a local memory-server
   storage key, not a product name. Do not rename it or existing stored contexts are orphaned.

---

## Quality Gates

Before any commit:

1. `npm run lint` — 0 errors (warnings tolerated, currently 18)
2. `npm run typecheck` — clean
3. `npm run build` — succeeds
4. No `console.log` in production code
5. No commented-out code blocks

CI (`.github/workflows/ci.yml`) runs the same gates plus deploy jobs. **Never use the
`secrets` context in an `if:` expression** — it is illegal there and GitHub rejects the whole
workflow before any job starts (this caused historical 0s failures). Map secrets to job-level
`env:` and test `env.X != ''` at step level instead.

---

## Common Tasks

### Add a new module

1. Add the registry entry in `constants/module-registry.ts`
2. Create the preset in `constants/EditorExtension.tsx`
3. Add the preset to the map in `context/EditorContext.tsx`
4. Add the id to `MENU_BY_TYPE` in `components/EditorMenuBar.tsx`
5. Add a toolbar menu in `constants/EditorMenuOptions.ts` (if it needs its own)
6. Add sample content in `constants/sample-content.ts`
7. Create `app/examples/<id>/page.tsx` (three lines around `ExamplePageTemplate`)
8. Docs pages regenerate from the registry automatically

### Add a toolbar button

1. Add a `MenuItem` in `constants/EditorMenuOptions.ts`
2. Include it in the module's menu array
3. `ToolbarItem` already handles `button | dropdown | input | model` — no component changes

### Fix a bug

1. Reproduce locally (`npm run dev`)
2. Check `EditorContext` (preset map, single provider) and `MENU_BY_TYPE` first
3. Test the four shipped example routes plus the landing demo

---

## Testing Strategy

- **Unit:** Vitest for utilities/hooks (planned — no suite configured yet)
- **Integration/E2E:** Playwright for editor flows (planned)
- **Accessibility:** keyboard navigation and ARIA on toolbar/ dialogs (manual + axe planned)

---

## Deployment

- **Platform:** Vercel (project `coderooz-projects`-owned, Git integration enabled)
- **Trigger:** push to `main`; PRs get preview URLs
- **CI secrets:** `VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` are optional — if
  absent, deploy steps skip cleanly and the Vercel Git integration handles releases

---

## Security

- No secrets in code (`.env.local` is gitignored — never commit it)
- Validate inputs; sanitise editor HTML output before rendering (DOMPurify recommended)
- CSP headers configured via `next.config.ts`
- See [SECURITY.md](./SECURITY.md)

---

## Accessibility

- Semantic HTML, ARIA labels on all interactive elements
- Toolbar supports keyboard navigation; dialogs manage focus
- Colour contrast meets WCAG 2.1 AA (dark + light themes)

---

## Performance

- `immediatelyRender: false` for TipTap under SSR
- Single editor instance (no per-page instances)
- Images via `next/image`; fonts via `next/font`
- Dynamic imports available for heavy client components

---

## References

- [README](./README.md) · [DEVELOPMENT_NOTES](./DEVELOPMENT_NOTES.md) · [CHANGELOG](./CHANGELOG.md)
- [CONTRIBUTING](./CONTRIBUTING.md) · [SECURITY](./SECURITY.md)
- [Project Reference Index](./.workspace/PRI/PROJECT_REFERENCE_INDEX.md)
- [Logic Flow Index](./.workspace/LFI/LOGIC_FLOW_INDEX.md)
- [TipTap Docs](https://tiptap.dev/) · [Next.js Docs](https://nextjs.org/docs)
