# Project Reference Index (PRI)

```yaml
reference:
  name: PROJECT_REFERENCE_INDEX
  version: 2.0
  status: active
  last_verified: 2026-10-01
  verification_scope: full
  verification_method: STRUCTURAL
  project_root: C:\Code_Works\HTML_CSS_JS\workProjects\website\Simple-Tiptap-editor
```

**Project:** TipTap-Editor
**Version:** 1.0.0
**Repository:** https://github.com/coderooz/TipTap-Editor
**Deployment:** https://tiptap-editor.vercel.app
**Companion:** `.workspace/LFI/LOGIC_FLOW_INDEX.md` (behavioral map)

> **Priority rule (PRI governance §26):** the actual repository filesystem is the
> source of truth. If this document conflicts with the filesystem, the filesystem
> wins and this file must be repaired.

---

## 1. Reference Metadata

| Field | Value |
|---|---|
| Created | 2026-08-28 (root-level predecessor, deprecated) |
| Migrated to `.workspace/PRI/` | 2026-10-01 |
| Last updated | 2026-10-01 |
| Verification scope | FULL (all tracked source + config) |
| Predecessor path | `./PROJECT_REFERENCE_INDEX.md` (removed) |

---

## 2. Project Identity

A Next.js 16 rich-text editor showcase and reference implementation built on TipTap v3.
Four editor modes, a menu-driven toolbar, bubble-menu components, custom extensions,
and a landing page with an embedded live demo. No backend, no database, no auth.

---

## 3. Technology Stack

Verified against `package.json` and installed `node_modules` on 2026-10-01.

| Category | Technology | Installed version |
|---|---|---|
| Framework | Next.js (App Router, Turbopack) | `16.3.8` |
| Language | TypeScript | `5.9.3` |
| Runtime | React / React DOM | `19.3.0` |
| Styling | Tailwind CSS + PostCSS | `4.1.16` |
| UI kit | shadcn/ui (Radix primitives) | components in `components/ui/` |
| Editor | TipTap v3 (`@tiptap/*`) | `3.31.4` |
| Icons | lucide-react | `1.49.0` |
| Markdown/light syntax | lowlight | `3.3.0` |
| Command palette | cmdk | `1.1.1` |
| Merge helper | class-variance-authority, clsx, tailwind-merge | `0.7.1` / `2.1.1` / `3.7.0` |
| Linter | ESLint (flat config) | `9.39.5` |
| Type-aware lint | typescript-eslint | `8.71.0` |
| Next lint config | eslint-config-next | `16.3.8` |
| Git hooks | husky + lint-staged | `9.1.7` / `17.6.0` |
| Formatter | Prettier (+ Tailwind plugin) | `3.9.9` |
| Package manager | npm | `packageManager: npm@12.2.0` |
| Runtime requirement | Node | `>=20.0.0` |
| Hosting | Vercel | via `.github/workflows/ci.yml` |

### 3.1 Installed-but-unused dependencies

Present in `package.json`, referenced by **zero** source files. Marketing copy in
`app/page.tsx:53` and `components/LiveEditorDemo.tsx:31` describes them as future work.

- `yjs`, `y-protocols`, `@tiptap/extension-collaboration`, `@tiptap/y-tiptap`
- `lucide-react` peer chain `baseline-browser-mapping` (present only as a transitive + explicit dep)

---

## 4. Root Structure

```
TipTap-Editor/
├── .github/
│   ├── CODEOWNERS
│   ├── dependabot.yml            # weekly npm + github-actions updates
│   ├── ISSUE_TEMPLATE/           # bug_report.yml, feature_request.yml
│   ├── PULL_REQUEST_TEMPLATE/    # pull_request_template.yml
│   └── workflows/ci.yml          # 5 jobs (see §14)
├── .husky/                       # git hooks
├── .vscode/                      # settings.json, extensions.json
├── .workspace/                   # dev artifacts (see §15.4)
│   ├── PRI/                      # committed structural reference
│   └── LFI/                      # committed behavioral reference
├── app/                          # Next.js App Router
├── components/
├── constants/
├── context/
├── lib/
├── public/
├── .editorconfig
├── .gitignore
├── .mcp-runtime.json             # MCP runtime state (git-ignored)
├── .prettierrc
├── AGENTS.md
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── DEVELOPMENT_NOTES.md
├── LICENSE
├── README.md
├── SECURITY.md
├── components.json               # shadcn/ui config
├── eslint.config.mjs
├── next-env.d.ts                 # generated (git-ignored)
├── next.config.ts
├── opencode.jsonc                # OpenCode agent config
├── package.json / package-lock.json
├── postcss.config.mjs
├── simple-tiptap-editor.project-mcp.json
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.tsbuildinfo          # build artifact (git-ignored)
└── vercel.json
```

---

## 5. Directory Reference

### `app/`

Type: Next.js App Router root.
Purpose: Route tree, root layout, global styles.
Contains: `layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`, plus three route folders.
Do not: place components here; shared components belong in `components/`.

### `app/comment/`, `app/content/`, `app/docs/`

Type: Leaf route folders, each containing exactly one `page.tsx`.
Purpose: Render one editor mode per route.
Related: `components/EditorPage.tsx`, `context/EditorContext.tsx`.

### `components/`

Type: Client + presentational component layer.
Purpose: Editor shell, toolbar, bubble menus, modals, shadcn primitives, brand icons.
Contains: 6 flat editor-shell components, `bubbleMenu/`, `extensions/`, `icons/`, `models/`, `ui/`.

### `components/bubbleMenu/`

Type: Floating-menu components.
Purpose: Context-sensitive formatting menus bound to TipTap editor instances.
Contains: `BaseBubbleMenu.tsx`, `TextBubbleMenu.tsx`, `ImageBubbleMenu.tsx`,
`TableBubbleMenu.tsx`, `YoutubeBubbleMenu.tsx`.
Constraint: all five are **currently not mounted** — see §18.

### `components/extensions/`

Type: Custom TipTap extensions.
Purpose: Behavior not covered by stock TipTap packages.
Contains: `FontFamily.ts`, `FontSize.ts`, `MarkDownLink.ts`, `ImageResizable.tsx`.

### `components/icons/`

Type: Local icon module.
Purpose: Brand marks removed from lucide-react v1 (GitHub, X/Twitter, YouTube).
Contains: `brand-icons.tsx`.
Related: `app/page.tsx`, `constants/EditorMenuOptions.ts`.

### `components/models/`

Type: Dialog/modal bodies.
Purpose: Modal content for insert actions (image, link, YouTube, import/export).
Contains: `image.tsx`, `link.tsx`, `youtube.tsx`, `ImportExport.tsx`.
Accessed via `MenuItemType = "model"` in `constants/EditorMenuOptions.ts`.

### `components/ui/`

Type: shadcn/ui primitives.
Purpose: Unstyled building blocks consumed by toolbar and modals.
Contains: `button.tsx`, `dialog.tsx`, `input.tsx`, `popover.tsx`, `select.tsx`,
`native-select.tsx`, `hover-card.tsx`, `command.tsx`, `tabs.tsx`.
Alias: `@/ui/*`.

### `constants/`

Type: Editor configuration + type definitions.
Purpose: Single place where extension sets and toolbar layout are declared.
Contains: `EditorExtension.tsx`, `EditorMenuOptions.ts`, `EditorStateOptions.tsx`.
Note: `EditorStateOptions.tsx` currently contains only a `/** @format */` banner — effectively empty.

### `context/`

Type: React context provider.
Purpose: Owns the single live TipTap `Editor` instance and derived state.
Contains: `EditorContext.tsx` (provider + `useEditorContext` hook).
Constraint: exactly one `EditorProvider` should mount; see `app/layout.tsx`.

### `lib/`

Type: Shared utilities.
Contains: `utils.ts` exporting `cn()` (clsx + tailwind-merge).

### `public/`

Type: Static assets served at `/`.
Contains: `ContentImage.png`, `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`.

---

## 6. File Reference

### `app/layout.tsx`

Type: Root layout.
Purpose: HTML shell, providers, SEO metadata export.
Responsibility: mounts `EditorProvider` (via `EditorContext`), ThemeToggle, global CSS.
Dependencies: `context/EditorContext.tsx`, `components/ThemeToggle.tsx`, `app/globals.css`.

### `app/page.tsx`

Type: Landing page (route `/`).
Purpose: Marketing/feature overview plus an embedded live editor demo.
Responsibility: route composition only; editor behavior comes from `LiveEditorDemo`.
Note: links to `/demo` in 5 places — see §18.

### `app/comment/page.tsx`, `app/content/page.tsx`, `app/docs/page.tsx`

Type: App Router pages.
Route: `/comment`, `/content`, `/docs`.
Purpose: mount the editor in one specific mode.
Pattern: render `EditorPage` with a `type` prop, wrapped in the provider.

### `components/EditorPage.tsx`

Type: Client component.
Purpose: The reusable editor shell used by all three mode routes.
Responsibility: sets editor type via `setEditorType`, renders `EditorMenuBar` + `EditorContent`,
displays live character count.
Dependencies: `context/EditorContext.tsx`, `components/EditorMenuBar.tsx`, `@tiptap/react`.

### `components/LiveEditorDemo.tsx`

Type: Client component.
Purpose: Editor instance embedded in the landing page hero.

### `components/EditorMenuBar.tsx`

Type: Client component (consumes context, no `"use client"` directive of its own).
Purpose: Renders the toolbar by grouping `MenuItem[]` entries.
Responsibility: selects the menu array by `editorType`, then switches on `item.type`
(`button` | `dropdown` | `input` | `model` | `custom`).
Dependencies: `constants/EditorMenuOptions.ts`, `components/ui/*`, `lib/utils.ts`.

### `components/MenuButton.tsx`, `components/EditorButton.tsx`

Type: Presentational button wrappers.
Note: neither is imported by `EditorMenuBar.tsx`; the toolbar inlines its own `Button` usage.

### `components/ThemeToggle.tsx`

Type: Client component.
Purpose: dark/light mode toggle.

### `constants/EditorExtension.tsx`

Type: Extension composition module — **the single source of extension composition**.
Purpose: composes four named extension presets plus a custom `Heading` override.
Exports: `DEFAULT_EXTENSIONS`, `COMPLEX_EXTENSIONS` (internal), `BLOG_EXTENSIONS`,
`DOCUMENT_EXTENSIONS`, `COMMENT_EXTENSIONS`.
Constraint: `Heading` extends TipTap's `Heading` and narrows `options.levels` to `Level[]`
(`1|2|3|4|5|6`) from `@tiptap/extension-heading`.

### `constants/EditorMenuOptions.ts`

Type: Toolbar/menu definition module.
Purpose: declares every toolbar entry and the three menu arrays.
Exports: `MENU_BTN_ITEMS`, `CONTENT_MENU`, `DOCUMENT_MENU`, and types
`MenuItem`, `MenuBtnGroups`, `MenuItemType`, `MenuButton`, `MenuDropdown`.
Constraint: `MenuBase.icon` is `React.ElementType`, so non-Lucide components are allowed —
this is how `Youtube` from `@/components/icons/brand-icons` is wired in.

### `context/EditorContext.tsx`

Type: React Context provider + hook.
Purpose: owns `editor`, `editorType`, `charCount`, `editorContent`.
Responsibility: maps `editorType` → extension preset, re-creates the editor when the type
changes (dependency array on `editorType`), tracks character count on `transaction`.
Exports: `EditorProvider`, `useEditorContext`, type `EditorType`.
Constraint: renders a literal `Editor Type: {editorType}` debug label in the DOM.

### `components/icons/brand-icons.tsx`

Type: Local icon module.
Purpose: supplies GitHub / X / YouTube marks that lucide-react v1 removed.
Exports: `Github`, `Twitter`, `Youtube` — each typed as `LucideIcon` via
`createLucideIcon`, so they are drop-in for any Lucide slot.

---

## 7. Application Routes

Filesystem-routed (Next.js App Router). Verified against `npm run build` output.

| Route | Filesystem | Mode | Status |
|---|---|---|---|
| `/` | `app/page.tsx` | `default` | ACTIVE |
| `/comment` | `app/comment/page.tsx` | `comment` | ACTIVE |
| `/content` | `app/content/page.tsx` | `content` | ACTIVE |
| `/docs` | `app/docs/page.tsx` | `document` | ACTIVE |
| `/_not-found` | framework-generated | — | ACTIVE |

### 7.1 Routes referenced by navigation but NOT implemented

| Route | Referenced from | Status |
|---|---|---|
| `/demo` | `app/page.tsx` lines 116, 161, 356, 388 | **MISSING → 404** |
| `/features` | documented in former root-level PRI only | **MISSING → 404** |

---

## 8. API Routes

None. The project is fully static; `npm run build` reports every page as
`(Static) prerendered as static content`. No `app/api/`, no server actions,
no external HTTP calls.

---

## 9. Modules

No domain modules or service/repository layers exist. The module equivalents are:

| Module | Location | Responsibility |
|---|---|---|
| Extension registry | `constants/EditorExtension.tsx` | composition of TipTap extensions |
| Menu registry | `constants/EditorMenuOptions.ts` | toolbar surface definition |
| Editor state | `context/EditorContext.tsx` | live editor instance + derived state |
| Brand assets | `components/icons/brand-icons.tsx` | removed brand marks |

---

## 10. Components

| Component | File | Type |
|---|---|---|
| Editor shell | `components/EditorPage.tsx` | client |
| Toolbar | `components/EditorMenuBar.tsx` | client (via context) |
| Button wrapper | `components/MenuButton.tsx`, `components/EditorButton.tsx` | client |
| Select wrapper | `components/MenuSelect.tsx` | client |
| Landing demo | `components/LiveEditorDemo.tsx` | client |
| Theme toggle | `components/ThemeToggle.tsx` | client |
| Bubble menus ×5 | `components/bubbleMenu/*.tsx` | client, **not mounted** |
| Modals ×4 | `components/models/*.tsx` | client |
| Brand icons | `components/icons/brand-icons.tsx` | pure render |
| shadcn primitives ×9 | `components/ui/*.tsx` | mixed |

---

## 11. Services

None. No service layer, no API client, no state-fetching library.

---

## 12. Data Layer

None. No database, no ORM, no schema files, no migrations, no repository layer.

---

## 13. Configuration

| File | Purpose |
|---|---|
| `package.json` | deps, scripts, engines, packageManager |
| `tsconfig.json` | strict TS; notable: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`, `noUnusedLocals`, `noImplicitOverride`; path aliases `@/*`, `@/ui/*`, `@/bubbleMenu/*`, `@/models/*`, `@/extensions/*` |
| `eslint.config.mjs` | flat config: typescript-eslint recommended, `eslint-config-next` core-web-vitals + typescript, react, react-hooks, unused-imports |
| `next.config.ts` | `optimizePackageImports` experiment |
| `postcss.config.mjs` | Tailwind v4 PostCSS plugin |
| `tailwind.config.ts` | Tailwind config |
| `components.json` | shadcn/ui component paths |
| `.prettierrc` | Prettier options |
| `.editorconfig` | whitespace/encoding |
| `vercel.json` | Vercel project config |
| `.github/workflows/ci.yml` | CI/CD |
| `.github/dependabot.yml` | dependency updates |
| `simple-tiptap-editor.project-mcp.json` | MCP project descriptor |
| `opencode.jsonc` | OpenCode agent configuration |

---

## 14. Scripts & Commands

Verified from `package.json`.

| Script | Command |
|---|---|
| `npm run dev` | `next dev` |
| `npm run build` | `next build` |
| `npm start` | `next start` |
| `npm run lint` | `eslint` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run prepare` | `husky install` |

There is **no** `test` script.

### 14.1 CI pipeline (`.github/workflows/ci.yml`)

Triggers on push/PR to `main`. Jobs:

1. `lint-and-typecheck` — `npm ci`, `eslint`, `tsc --noEmit`
2. `build` — `npm ci`, `next build`
3. `test` — `npm ci`, `npm test --if-present` (currently a no-op)
4. `deploy-preview` — PR only; gated on `VERCEL_TOKEN`/`VERCEL_ORG_ID`/`VERCEL_PROJECT_ID`
5. `deploy-production` — push to `main`; same secrets gate

---

## 15. Documentation

### 15.1 Tracked project documentation

`README.md`, `AGENTS.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`,
`CHANGELOG.md`, `DEVELOPMENT_NOTES.md`.

> `DEVELOPMENT_NOTES.md` duplicates the editor-mode table that also appears in this PRI.
> The PRI is the structural source of truth; update both if the modes change.

### 15.2 Reference systems (committed)

| System | Path | Scope |
|---|---|---|
| PRI | `.workspace/PRI/PROJECT_REFERENCE_INDEX.md` | structure — what exists and where |
| LFI | `.workspace/LFI/LOGIC_FLOW_INDEX.md` (+ 3 companions) | behavior — what happens and how |

### 15.3 Superseded / pre-migration artifacts

`.workspace/` previously held these at its top level, before the PRI/LFI split:

- `PROJECT_CONTEXT_REPORT.md`
- `CHATGPT_CONTEXT_REPORT.md`
- `TIPTAP_SHOWCASE_ARCHITECTURE.md`
- `TIPTAP_SHOWCASE_BASELINE.md`
- `TODO_PORTFOLIO.md`

Status: **STALE**. Several describe the pre-rename `Simple-Tiptap-editor` package name and
structures that no longer exist. Treat as historical only.

### 15.4 Workspace layout

See `.workspace/README.md`. Transient subdirectories (`ai/`, `sessions/`, `temp/`,
`logs/`, `generated/`, `reports/`, `research/`, `planning/`, `validation/`) are git-ignored.
`PRI/` and `LFI/` are committed.

---

## 16. Integrations

| Integration | Status |
|---|---|
| Vercel | ACTIVE — `vercel.json` + CI deploy jobs |
| GitHub | ACTIVE — CI, issue/PR templates, Dependabot, CODEOWNERS |
| shadcn/ui | ACTIVE — Radix primitives vendored into `components/ui/` |
| lucide-react | ACTIVE — brand icons supplemented by `components/icons/brand-icons.tsx` |
| Yjs / TipTap Collaboration | **NOT WIRED** — installed, unreferenced |

---

## 17. Assets

`public/ContentImage.png`, `public/file.svg`, `public/globe.svg`, `public/next.svg`,
`public/vercel.svg`, `public/window.svg`, `app/favicon.ico`.

Note: the Vite-default `file/globe/next/vercel/window.svg` set appears unused.

---

## 18. Generated / Runtime Directories

| Path | Generated by | Git |
|---|---|---|
| `node_modules/` | npm | ignored |
| `.next/` | `next build` / `next dev` | ignored |
| `next-env.d.ts` | Next.js | ignored |
| `tsconfig.tsbuildinfo` | `tsc --incremental` | ignored |
| `.mcp-runtime.json` | MCP server runtime | ignored |
| `.vercel/` | Vercel CLI | ignored |

---

## 19. Architectural Relationships

### 19.1 Editor mode selection

```
route (app/<mode>/page.tsx)
      ↓ passes <type>
EditorPage.tsx
      ↓ setEditorType(type)
EditorContext.tsx
      ↓ maps editorType → preset
constants/EditorExtension.tsx
      ↓ extension list rebuilt when editorType changes
useEditor() re-instantiates
      ↓
EditorContent renders into <EditorMenuBar/> + <EditorContent/>
```

### 19.2 Toolbar composition

```
EditorMenuBar.tsx
  ├─ picks array by editorType:
  │    content  → CONTENT_MENU
  │    document → DOCUMENT_MENU
  │    else     → MENU_BTN_ITEMS
  ├─ groups items by item.group
  └─ renders per item.type
       button   → <Button> + item.action(editor)
       dropdown → Select from item.options
       input    → controlled input
       model    → dialog rendering components/models/*.tsx
       custom   → caller-supplied render
```

### 19.3 Extension preset derivation

```
DEFAULT_EXTENSIONS          (core: text, marks, link, typography, align, undo, blockquote)
      ├─ + CharacterCount(limit 2500) → COMMENT_EXTENSIONS
      ├─ COMPLEX_EXTENSIONS            → BLOG_EXTENSIONS
      └─ COMPLEX + CharacterCount      → DOCUMENT_EXTENSIONS
```

`EditorContext.tsx:59-64` additionally appends a `Placeholder` extension to whichever
preset is selected.

---

## 20. Important Entry Points

| Purpose | Path |
|---|---|
| App shell | `app/layout.tsx` |
| Landing route | `app/page.tsx` |
| Editor shell | `components/EditorPage.tsx` |
| Editor state | `context/EditorContext.tsx` |
| Extension composition | `constants/EditorExtension.tsx` |
| Toolbar definition | `constants/EditorMenuOptions.ts` |
| Class merge helper | `lib/utils.ts` |
| MCP descriptor | `simple-tiptap-editor.project-mcp.json` |

---

## 21. Project-Specific Conventions

- `interface` preferred over `type` for object shapes.
- `const` only; `var` prohibited.
- Optional chaining and nullish coalescing expected.
- Strict TS with unusually aggressive flags — notably `noPropertyAccessFromIndexSignature`,
  which forces `obj["key"]` for index-signature access (e.g. `node.attrs["level"]`).
- Server Components by default; `"use client"` only where interactivity is required.
- Tailwind v4 with CSS variables; `cn()` for conditional classes.
- Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `style:`, `perf:`).
- Path alias `@/*` maps to project root.

---

## 22. Known Structural Constraints

1. **Single editor instance.** `EditorContext` owns one `Editor`. Mounting
   `EditorProvider` twice would create two independent instances with divergent state.
2. **Editor type forces re-init.** The `useEditor` dependency array includes `editorType`,
   so switching mode discards and rebuilds the editor (and its content state).
3. **Bubble menus are dead code.** All five components in `components/bubbleMenu/` are
   commented out in `context/EditorContext.tsx` (lines 28-31 and 117-120). The project
   markets "context-aware floating menus" on the landing page.
4. **`/demo` is a 404.** Linked 4× from `app/page.tsx`; the route does not exist.
5. **`MenuButton.tsx` / `EditorButton.tsx` are unused**; `EditorMenuBar` inlines its buttons.
6. **`EditorStateOptions.tsx` is empty** (formatting banner only) despite being listed as
   the type-definition module.
7. **No tests.** No test runner installed, no `test` script, no test files — and the previous
   `.gitignore` actively excluded `*.test.*` / `*.spec.*`. That exclusion has been removed.
8. **Debug output in production markup.** `EditorContext.tsx:121` renders
   `Editor Type: {editorType}` into the DOM on every editor page.
9. **Commented-out code blocks remain** in `context/EditorContext.tsx` (lines 28-31,
   117-120, 134-209), which the project's own quality gate forbids.

---

## 23. Reference Maintenance Log

### 2026-10-01 — Full rebuild from filesystem

Change: Created the canonical PRI at `.workspace/PRI/`, removing the deprecated
root-level `PROJECT_REFERENCE_INDEX.md`.

Classification: `ADDED` + `REMOVED` + `VERIFICATION_REFRESH`

Corrections applied versus the predecessor document:

| Predecessor claim | Corrected to |
|---|---|
| `components/editor/` | `components/` (flat) + `bubbleMenu/`, `extensions/`, `icons/`, `models/`, `ui/` |
| `components/toolbar/` | `components/EditorMenuBar.tsx` |
| `components/bubble-menus/BubbleMenuRegistry.tsx` | `components/bubbleMenu/BaseBubbleMenu.tsx` (registry does not exist) |
| `components/dialogs/` | `components/models/` |
| `components/commands/` | `components/MenuButton.tsx`, `MenuSelect.tsx`, `EditorButton.tsx` |
| `components/showcase/` | removed — never existed |
| `editor/` (core, extensions, commands, state, serializers, types) | removed — never existed |
| `constants/tiptap-feature-registry.ts` | `constants/EditorExtension.tsx` |
| `constants/EditorStateOptions.ts` | `constants/EditorStateOptions.tsx` (and it is empty) |
| `app/demo/page.tsx` | does not exist |
| `app/features/` | does not exist |
| `examples/`, `docs/`, `tests/` | do not exist |
| Next.js 16.0.1 | 16.3.8 |
| React 19.2.0 | 19.3.0 |
| TipTap 3.10.1 | 3.31.4 |
| lucide-react 0.548.0 | 1.49.0 |
| CI/CD "planned" | ACTIVE — `.github/workflows/ci.yml` |
| Dependabot "planned" | ACTIVE — `.github/dependabot.yml` |
| Vitest + Playwright "in progress" | NOT STARTED |

Updated: technology stack, directory reference, file reference, routes, modules,
configuration, scripts, documentation, integrations, assets, generated dirs,
relationships, entry points, constraints.

Verification: FULL — every path asserted with `Test-Path`; routes confirmed against
`npm run build` output; dependency versions read from installed `node_modules`.

### 2026-08-28 — Predecessor created (root level)

Change: Initial PRI authored at `./PROJECT_REFERENCE_INDEX.md`.
Classification: `ADDED`
Verification: MANUAL — authored from intended architecture; not filesystem-verified.
Superseded by the 2026-10-01 entry.