# Project Reference Index (PRI)

```yaml
reference:
  name: PROJECT_REFERENCE_INDEX
  version: 3.0
  status: active
  last_verified: 2026-10-07
  verification_scope: full
  verification_method: STRUCTURAL
  project_root: C:\Code_Works\HTML_CSS_JS\workProjects\website\Simple-Tiptap-editor
```

**Project:** Editor Blocks (`editor-blocks` v0.3.0)
**Repository:** https://github.com/coderooz/Editor-Blocks
**Companion:** `.workspace/LFI/LOGIC_FLOW_INDEX.md` (behavioural flows)
**Relationship:** PRI = "what exists and where"; LFI = "what happens and how"

---

## 1. Reference Metadata

| Field             | Value                                        |
| ----------------- | -------------------------------------------- |
| Canonical path    | `.workspace/PRI/PROJECT_REFERENCE_INDEX.md`  |
| Tracked in git    | Yes (committed reference system)             |
| Rebuild source    | `git ls-files` + package.json + registry     |
| Supersedes        | Root `PROJECT_REFERENCE_INDEX.md` (deleted at rebrand, `7dff887`) |

> A stale copy may exist at `.opencode/reference/PROJECT_REFERENCE_INDEX.md` or repo root in
> older clones. This `.workspace/PRI/` copy is canonical.

---

## 2. Project Identity

| Field          | Value                                                        |
| -------------- | ------------------------------------------------------------ |
| Product name   | Editor Blocks                                                |
| npm package    | `editor-blocks` v0.3.0 (private, **not published to npm**)   |
| Shape          | Library of drop-in editor modules + catalogue/examples/docs site |
| Author         | Ranit Saha (Coderooz) <contact@coderooz.in>                  |
| License        | MIT                                                          |
| Repository     | https://github.com/coderooz/Editor-Blocks (public, `main`)   |
| Deployment     | https://editor-blocks.vercel.app (Vercel)                    |
| Local dir name | `Simple-Tiptap-editor` (historical; not the product name)    |

**Naming history:** `simple-tiptap-editor` 0.1.0 → `tiptap-editor` 1.0.0 (TipTap-Editor) →
`editor-blocks` 0.3.0. Version was deliberately reset 1.0.0 → 0.3.0 at the rename; there was
never an 0.2.0.

---

## 3. Technology Stack

| Layer       | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 16.3.8 (App Router, Turbopack)              |
| UI          | React 19.3.0 / react-dom 19.3.0                     |
| Language    | TypeScript ^5.9.2 (strict)                          |
| Styling     | Tailwind CSS ^4 (`@tailwindcss/postcss`), tw-animate-css |
| Components  | shadcn/ui patterns, Radix UI (dialog, hover-card, popover, select, slot, tabs), cmdk, cva, clsx, tailwind-merge |
| Editor core | TipTap ^3.31.4 (`@tiptap/react`, `@tiptap/pm`, `@tiptap/extensions` + 27 official extensions) |
| Engine dep  | `lexical` ^0.52.0 (scaffold only — no module runs on it) |
| Icons       | lucide-react ^1.49.0                                |
| Highlight   | lowlight ^3.3.0 (via `lib/highlight.ts`)            |
| Utility     | lodash ^4.18.1 + @types/lodash (debounce)           |
| Tooling     | ESLint ^9.39.5 (flat config), Prettier ^3.9.9, Husky ^9.1.7, lint-staged ^17.6.0 |
| Runtime     | Node ≥ 20, npm ≥ 10 (`packageManager: npm@12.2.0`)  |

### 3.1 Installed-but-not-app-wired dependencies

| Dependency | State |
| ---------- | ----- |
| `lexical` ^0.52.0 | Imported only by `src/adapters/lexicalAdapter.ts` (scaffold); no module renders it |
| `@tiptap/extension-file-handler` | Installed; part of preset extension arrays (check before removing) |

---

## 4. Root Structure

```
.editorconfig  .prettierrc  .gitignore
.eslintrc.json (ABSENT — flat config is eslint.config.mjs)
components.json  next.config.ts  postcss.config.mjs  tailwind.config.ts
package.json  package-lock.json  tsconfig.json  vercel.json
AGENTS.md  README.md  DEVELOPMENT_NOTES.md  CHANGELOG.md
CONTRIBUTING.md  CODE_OF_CONDUCT.md  SECURITY.md  LICENSE
opencode.jsonc                      # OpenCode agent config (MCP_PROJECT kept as storage key)
simple-tiptap-editor.project-mcp.json  # local memory-server identity file (storage key, NOT product name)
app/  components/  constants/  context/  lib/  src/  plugin/  public/
.github/  .vscode/  .workspace/
```

---

## 5. Directory Reference

### `app/` — App Router routes
- `page.tsx` — `/` landing with `LiveEditorDemo`
- `layout.tsx` — root layout: fonts, metadata, **`EditorProvider` mounted exactly once**
- `modules/page.tsx` — `/modules` catalogue (from registry)
- `examples/` — index + 4 shipped routes: `comment/`, `content/`, `docs/`, `presentation/`
- `documentation/` — `page.tsx`, `layout.tsx`, `DocsToc.tsx`, `not-found.tsx`, plus
  `getting-started/`, `modules/` (+ `[moduleId]/`), `api/`, `architecture/`,
  `custom-modules/`, `references/`, `roadmap/`
- `globals.css` — Tailwind v4 + CSS variables (light/dark)

### `components/`
- `EditorPage.tsx` — public mounting surface (toolbar + editing area + char count)
- `EditorMenuBar.tsx` — toolbar; `MENU_BY_TYPE` total map, grouping, dispatch
- `LiveEditorDemo.tsx` — landing demo with module tabs (registry-derived + `default`)
- `ThemeToggle.tsx` — dark/light switch
- `toolbar/ToolbarItem.tsx` — polymorphic renderer (`button | dropdown | input | model`)
- `examples/` — `ExamplePageTemplate.tsx`, `EditorPreview.tsx`, `InstallGuide.tsx`, `example-metadata.ts`
- `modules/ModulesCatalogue.tsx` — catalogue grid
- `docs/` — `CodeBlock`, `CopyButton`, `DocsCode`, `DocsHeading`, `DocsReferences`, `docs-metadata`
- `extensions/MarkDownLink.ts` — custom link mark (extends stock `Link`; register exactly once)
- `icons/brand-icons.tsx`, `models/` (`ImportExport`, `image`, `link`, `youtube`),
  `layout/` (`Header`, `Footer`), `ui/` (12 shadcn primitives)
- **Absent:** `bubbleMenu/`, `MenuButton.tsx`, `EditorButton.tsx` (pre-rename artefacts)

### `constants/`
- `module-registry.ts` — **SSOT: 8 modules** (id, title, engine, status, href, docs, extensionSet)
- `EditorExtension.tsx` — 9 presets: `DEFAULT`, `COMPLEX`, `BLOG`, `DOCUMENT`, `COMMENT`,
  `PRESENTATION`, `MARKDOWN`, `LEGAL`, `WIKI`
- `EditorMenuOptions.ts` — 41 toolbar items (29 button, 4 dropdown, 3 input, 5 model) + 4 menus
- `sample-content.ts` — seed HTML (4 keys: comment, content, document, presentation)
- `docs-nav.ts`, `docs-references.ts` — documentation navigation/links

### `context/`
- `EditorContext.tsx` — single provider; `EditorType = ModuleId | "default"`;
  module → preset map; `moduleContents` per-module content; `charCount`; `editor` (nullable)

### `lib/`
- `utils.ts` — `cn()` (clsx + tailwind-merge)
- `highlight.ts` — `highlightCode`, `resolveLanguage`, `languageLabel`, `isKnownLanguage`

### `src/`
- `adapters/lexicalAdapter.ts` — `EditorAdapter` seam + partial Lexical impl (scaffold)

### `plugin/` — unpublished npm-package scaffold (`@coderooz/tiptap-editor`, own tsup build)
- `README.md` (now marked NOT published), `package.json`, `src/` (components, constants,
  context, types, utils) — **not part of the app build**

### `public/`
- `llm.txt` (canonical AI map), `llms-full.txt` (full AI reference), `ContentImage.png`
  (README screenshot), svg assets

### `.github/`
- `workflows/ci.yml` — lint+typecheck, build, test, deploy-preview, deploy-production
- `CODEOWNERS` (corrected paths), `ISSUE_TEMPLATE/` ×2, `PULL_REQUEST_TEMPLATE/`,
  `dependabot.yml`

### `.workspace/`
- `PRI/` and `LFI/` — **committed** reference systems (durable)
- `README.md`, `CHATGPT_CONTEXT_REPORT.md`, `PROJECT_CONTEXT_REPORT.md`,
  `TIPTAP_SHOWCASE_ARCHITECTURE.md`, `TIPTAP_SHOWCASE_BASELINE.md`, `TODO_PORTFOLIO.md` —
  historical pre-rename artefacts, kept for traceability
- Scratch dirs (reports/, tmp/) are gitignored

---

## 6. Key File Reference

| File | Role | Notes |
| ---- | ---- | ----- |
| `app/layout.tsx` | Root layout | Mounts `EditorProvider` **once**; metadataBase pinned to production origin |
| `app/page.tsx` | `/` | Renders `LiveEditorDemo` |
| `context/EditorContext.tsx` | State core | Preset map with `\|\| DEFAULT_EXTENSIONS` fallback (silent-fallback risk) |
| `constants/module-registry.ts` | SSOT | 8 entries; drives catalogue/examples/docs/llm.txt |
| `constants/EditorExtension.tsx` | Presets | 9 exports; MARKDOWN/LEGAL/WIKI defined but unwired |
| `constants/EditorMenuOptions.ts` | Toolbar data | 41 items; `MenuItemType` includes unused `"custom"` |
| `components/EditorMenuBar.tsx` | Toolbar shell | `MENU_BY_TYPE` total over `EditorType` (compile-time) |
| `components/toolbar/ToolbarItem.tsx` | Dispatch | `default:` returns null; Radix triggers need `asChild` |
| `components/EditorPage.tsx` | Mount surface | Applies `initialContent` via `setContent()` |
| `components/examples/ExamplePageTemplate.tsx` | Demo shell | Breadcrumb, editor, preview, install guide |
| `src/adapters/lexicalAdapter.ts` | Engine seam | Partial scaffold; no consumer yet |
| `eslint.config.mjs` | Lint config | Flat config; `consistent-type-imports` enforced |
| `.github/workflows/ci.yml` | CI/CD | Secrets via job `env:` — never `secrets` in `if:` |

---

## 7. Application Routes

| Route | Status | Renders |
| ----- | ------ | ------- |
| `/` | ✅ | Landing + `LiveEditorDemo` (tabs from registry + `default`) |
| `/modules` | ✅ | `ModulesCatalogue` (registry-derived) |
| `/examples` | ✅ | Example index (registry-derived) |
| `/examples/comment` | ✅ | `ExamplePageTemplate` → `EditorPage type="comment"` |
| `/examples/content` | ✅ | `EditorPage type="content"` |
| `/examples/docs` | ✅ | `EditorPage type="document"` |
| `/examples/presentation` | ✅ | `EditorPage type="presentation"` |
| `/documentation` (+ 7 subroutes) | ✅ | Docs section incl. `/documentation/modules/[moduleId]` |
| `/llm.txt`, `/llms-full.txt` | ✅ | Served from `public/` |
| `/examples/markdown` | ❌ **404** | Registry `href` pending route |
| `/examples/legal` | ❌ **404** | Registry `href` pending route |
| `/examples/wiki` | ❌ **404** | Registry `href` pending route |
| `/examples/lexical` | ❌ **404** | Registry `href` pending route |
| `/presentation` | ↪️ | `vercel.json` redirect → `/examples/presentation` |
| `/editor/:mode` | ↩️ | `vercel.json` rewrite → `/:mode` (legacy) |

**API routes: none.** The app is fully client-side; no `app/api/`, no backend, no database.

---

## 8. Modules (registry SSOT — `constants/module-registry.ts`)

| id | Title | Engine | Status | Preset wired | Toolbar menu | Example route |
| -- | ----- | ------ | ------ | ------------ | ------------ | ------------- |
| `comment` | Comment Editor | tiptap | stable | `COMMENT_EXTENSIONS` | `COMMENT_MENU` | ✅ |
| `content` | Content Editor | tiptap | stable | `BLOG_EXTENSIONS` | `CONTENT_MENU` | ✅ |
| `document` | Document Editor | tiptap | stable | `DOCUMENT_EXTENSIONS` | `DOCUMENT_MENU` | ✅ `/examples/docs` |
| `markdown` | Markdown Editor | tiptap | stable | ⚠️ unwired → `DEFAULT_EXTENSIONS` | `CONTENT_MENU` | ❌ |
| `legal` | Legal Editor | tiptap | stable | ⚠️ unwired → `DEFAULT_EXTENSIONS` | `CONTENT_MENU` | ❌ |
| `wiki` | Wiki Editor | tiptap | beta | ⚠️ unwired → `DEFAULT_EXTENSIONS` | `CONTENT_MENU` | ❌ |
| `presentation` | Presentation Editor | tiptap | beta | `PRESENTATION_EXTENSIONS` | `CONTENT_MENU` | ✅ |
| `lexical` | Lexical Editor | lexical | planned | ⚠️ `LEXICAL_EXTENSIONS` **does not exist** | `CONTENT_MENU` | ❌ |
| `default` | (fallback id) | tiptap | — | `DEFAULT_EXTENSIONS` | `MENU_BTN_ITEMS` | n/a (landing) |

**Counts:** 8 registered · 4 fully shipped (preset + route) · 9 extension presets ·
41 toolbar items.

---

## 9. Configuration

| File | Purpose | Gotchas |
| ---- | ------- | ------- |
| `package.json` | Scripts, deps | Description says "first release ships four modules" (true for *shipped* demos; registry total is 8) |
| `next.config.ts` | CSP headers, image config | — |
| `tsconfig.json` | Strict TS, `@/*` paths | — |
| `eslint.config.mjs` | ESLint 9 flat config | No `.eslintrc.json` exists |
| `tailwind.config.ts` + `postcss.config.mjs` | Tailwind 4 pipeline | — |
| `components.json` | shadcn/ui config | — |
| `vercel.json` | 1 redirect + 1 rewrite | See §7 |
| `opencode.jsonc` | OpenCode agents/commands | `instructions` → `.workspace/PRI/PROJECT_REFERENCE_INDEX.md`; **`MCP_PROJECT: "simple-tiptap-editor"` is a local memory-server storage key — do not rename** |
| `.github/workflows/ci.yml` | CI | Never `secrets` context inside `if:` |
| `.prettierrc`, `.editorconfig` | Formatting | — |
| `.env.local` (gitignored) | Local Vercel OIDC token | Never commit; no env vars needed to run locally |

---

## 10. Scripts & Commands

| Script | Command | State |
| ------ | ------- | ----- |
| `npm run dev` | `next dev` | Works (Turbopack) |
| `npm run build` | `next build` | Clean |
| `npm run start` | `next start` | — |
| `npm run lint` | `eslint` | 0 errors / 18 warnings |
| `npm run typecheck` | `tsc --noEmit` | Clean |
| `npm test --if-present` | (no `test` script) | No-op — no suite configured |
| `prepare` | `husky install` | Deprecated warning, exits 0 |

### CI pipeline (`.github/workflows/ci.yml`)

Jobs: `lint-and-typecheck` → `build` → `test` → `deploy-preview` (PR) /
`deploy-production` (push to `main`). Deploy steps map `VERCEL_TOKEN` / `VERCEL_ORG_ID` /
`VERCEL_PROJECT_ID` to job-level `env:` and skip when empty. **No GitHub secrets are
configured today** → deploy steps skip; the Vercel Git integration performs actual deploys.
Historical root cause of 0s/0-job failures: `secrets` context in step-level `if:` (illegal).

---

## 11. Documentation

### Tracked project documentation
`README.md`, `AGENTS.md`, `DEVELOPMENT_NOTES.md`, `CHANGELOG.md`, `CONTRIBUTING.md`,
`CODE_OF_CONDUCT.md`, `SECURITY.md`, `LICENSE`, `plugin/README.md` (marked unpublished).

### Reference systems (committed)
- `.workspace/PRI/PROJECT_REFERENCE_INDEX.md` — this file (structural)
- `.workspace/LFI/LOGIC_FLOW_INDEX.md` + `DIAGRAMS.md` (behavioural)

### AI manifests (served at site root)
- `public/llm.txt` — canonical map; documents 4 shipped + 4 registered-not-shipped
- `public/llms-full.txt` — full API/usage/architecture reference

### Superseded / pre-rename artefacts (kept, not authoritative)
`.workspace/PROJECT_CONTEXT_REPORT.md`, `.workspace/CHATGPT_CONTEXT_REPORT.md`,
`.workspace/TIPTAP_SHOWCASE_ARCHITECTURE.md`, `.workspace/TIPTAP_SHOWCASE_BASELINE.md`,
`.workspace/TODO_PORTFOLIO.md`.

---

## 12. Integrations

| Integration | Mechanism | State |
| ----------- | --------- | ----- |
| Vercel hosting | Git integration on `coderooz/Editor-Blocks` | Active — deploys on push to `main` |
| GitHub Actions | `.github/workflows/ci.yml` | Lint/build/test run; deploy jobs skip without secrets |
| OpenCode local memory | `.mcp-runtime.json` + `simple-tiptap-editor.project-mcp.json` | Storage key `simple-tiptap-editor` retained deliberately |
| npm registry | — | **Nothing published** (package private; `plugin/` scaffold unpublished) |
| Database / auth / API | — | None — static client-only site |

---

## 13. Assets

- `public/ContentImage.png` — editor toolbar screenshot (README hero)
- `public/*.svg` — next/vercel/globe/window/file icons
- Fonts via `next/font` in `app/layout.tsx`
- OG images rely on `metadataBase` (production origin)

---

## 14. Generated / Runtime Directories (not tracked)

`.next/`, `node_modules/`, `.workspace/` scratch subdirs (`reports/`, `tmp/` — gitignored),
`.env.local`, `.mcp-runtime.json` (gitignored runtime state).

---

## 15. Architectural Relationships

1. **Registry → everything:** `module-registry.ts` drives `/modules`, `/examples` index,
   `/documentation/modules/*`, and (hand-synced) `public/llm.txt`.
2. **Context owns one editor:** `EditorProvider` (in `app/layout.tsx`) → `useEditor([editorType])`
   → preset map resolves the extension array; `moduleContents` preserves per-module drafts.
3. **Toolbar is data → dispatch:** `EditorMenuOptions.ts` (items) → `MENU_BY_TYPE` (total map)
   → `ToolbarItem` (polymorphic render) → `editor.chain().focus()...run()`.
4. **Engine seam:** registry `engine` field → `src/adapters/` (future branch point in the
   preset map). Only TipTap is live.
5. **Single-instance invariant:** a second `EditorProvider` desynchronises the toolbar.

---

## 16. Known Gaps (verified, documented — not fixed)

1. `/examples/*` routes missing for `markdown`, `legal`, `wiki`, `lexical` → their registry
   `href`s 404 (add 3-line routes modeled on `app/examples/comment/page.tsx`).
2. `MARKDOWN_EXTENSIONS`, `LEGAL_EXTENSIONS`, `WIKI_EXTENSIONS` unwired in the `EditorContext`
   preset map (silently fall back to `DEFAULT_EXTENSIONS`).
3. `LEXICAL_EXTENSIONS` referenced by the registry does not exist; `src/adapters/lexicalAdapter.ts`
   is a partial scaffold.
4. No automated test suite (`npm test --if-present` is a no-op).
5. `plugin/` scaffold unpublished; its README documents a package not on npm.
6. `package.json` description counts shipped modules (4), not registered ones (8).
7. `MenuItemType["custom"]` declared but never dispatched (`ToolbarItem` `default:` → null).
