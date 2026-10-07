# Development Notes — Editor Blocks

> Engineering context for maintaining this repository. Read together with
> [AGENTS.md](./AGENTS.md) (rules) and the
> [Project Reference Index](./.workspace/PRI/PROJECT_REFERENCE_INDEX.md) (file map).

---

## 1. What this project is (and is not)

**Is:** a catalogue of drop-in editor *modules* — pre-tuned extension sets + toolbars for
specific jobs (comment, article, document, presentation, markdown, legal, wiki) — plus the
site that documents and demos them.

**Is not:** a single configurable editor. The old identity ("TipTap-Editor — a rich-text
editor showcase") described a different product shape. The rename to **Editor Blocks**
(`editor-blocks` v0.3.0) marks the change in intent: modules you place, not an editor you
configure.

Version history (see `CHANGELOG.md`):

| When           | Package name          | Version | Shape                          |
| -------------- | --------------------- | ------- | ------------------------------ |
| 2025-10-30     | `simple-tiptap-editor` | 0.1.0  | Early showcase                 |
| 2026-09-08     | `tiptap-editor`        | 1.0.0  | "TipTap-Editor" showcase       |
| 2026-10-04 →   | `editor-blocks`        | 0.3.0  | Module catalogue (current)     |

The version went **1.0.0 → 0.3.0** deliberately at the rename: the product restarted as a
pre-1.0 library. There was never a 0.2.0.

---

## 2. Architecture at a glance

```
constants/module-registry.ts   ← single source of truth (8 modules)
        │
        ├── components/modules/ModulesCatalogue.tsx   (/modules)
        ├── components/examples/*                     (/examples/*)
        ├── app/documentation/modules/*               (docs pages)
        └── public/llm.txt                            (AI manifest, hand-synced)

constants/EditorExtension.tsx   → 9 extension presets
constants/EditorMenuOptions.ts  → 41 toolbar item definitions (data)
                │
                ▼
context/EditorContext.tsx       → one TipTap instance, preset map, per-module content
                │
                ▼
components/EditorPage.tsx       → toolbar (EditorMenuBar → ToolbarItem) + EditorContent
```

### Data flow (one request)

1. `app/layout.tsx` mounts `EditorProvider` (exactly once) and the site chrome.
2. A route renders `<EditorPage type="<module-id>" initialContent={...} />`.
3. `EditorPage` sets `editorType` in context (effect) and applies seed HTML via
   `editor.commands.setContent()`.
4. `EditorContext` resolves the preset from its module → preset map and re-creates the
   editor (`useEditor([editorType])`). Previous module content is kept in `moduleContents`.
5. `EditorMenuBar` reads `MENU_BY_TYPE[editorType]`, groups items by `group`, and renders
   each through `ToolbarItem` (`button | dropdown | input | model`).
6. Commands run through `editor.chain().focus().<command>().run()`; `onUpdate` writes HTML
   back to context; character count is debounced.

---

## 3. Module wiring — the current truth

Eight modules are registered; **four are fully shipped** (preset + toolbar + sample + route):

| Module         | Preset wired?                         | Route            |
| -------------- | ------------------------------------- | ---------------- |
| `comment`      | ✅ `COMMENT_EXTENSIONS`               | ✅               |
| `content`      | ✅ `BLOG_EXTENSIONS`                  | ✅               |
| `document`     | ✅ `DOCUMENT_EXTENSIONS`              | ✅               |
| `presentation` | ✅ `PRESENTATION_EXTENSIONS`          | ✅               |
| `markdown`     | ⚠️ preset exists, **unwired** (falls back to `DEFAULT_EXTENSIONS`) | ❌ |
| `legal`        | ⚠️ preset exists, **unwired**         | ❌               |
| `wiki`         | ⚠️ preset exists, **unwired**         | ❌               |
| `lexical`      | ⚠️ `LEXICAL_EXTENSIONS` **does not exist** | ❌           |

Consequences you can observe in the running site:

- The landing demo exposes tabs for all 8 ids (derived from the registry) + `default`;
  unshipped ids render with the default preset and default sample.
- `/modules` and `/examples` link every registry `href` → the four unwired modules link to
  404 pages.
- `/documentation/modules/*` pages exist for all 8 (generated from the registry).

This is documented rather than fixed: wiring presets and adding routes is product work, not
documentation work. If you are here to fix it, follow "Add a new module" in `AGENTS.md`
(steps 2, 3, 7 are the missing pieces).

---

## 4. Multi-engine foundation

- The registry's `engine` field (`tiptap | lexical`, extensible) lets the UI state honestly
  what powers each module; `ENGINE_LABELS` renders the label.
- `src/adapters/lexicalAdapter.ts` defines an `EditorAdapter` seam (the operations the
  toolbar needs) and a partial Lexical implementation. `lexical` ^0.52.0 is a dependency,
  but **no module runs on Lexical yet** — the `lexical` module id is `status: "planned"`.
- `EditorContext` is deliberately engine-neutral at its seam: the module → preset map is
  where a second engine would branch.
- Do not advertise engine support beyond this scaffold.

---

## 5. Toolbar design

- Menu items are **data**, not components: `MenuItem` = `button | dropdown | input | model`
  (`MenuItemType` also lists `"custom"`, but no `MenuCustom` variant exists and `ToolbarItem`
 's `default:` case returns `null` — do not emit `type: "custom"` items).
- Counts: 41 definitions total — 29 buttons, 4 dropdowns, 3 inputs, 5 dialog triggers.
- `MENU_BY_TYPE` in `EditorMenuBar.tsx` is a **total** map over `EditorType`; a missing key
  is a compile error. This exists because `presentation` once shipped with a 6-button toolbar
  after silently falling through to `MENU_BTN_ITEMS`.
- `ToolbarItem.tsx` was extracted from `EditorMenuBar` (3773ecb) so the toolbar is
  polymorphic dispatch + grouping only.
- Radix `DialogTrigger` renders its own `<button>`: use `asChild` on triggers wrapping a shadcn
  `Button` (nested buttons are invalid HTML).

---

## 6. State model

`EditorContext` exposes:

| Field             | Type                          | Notes                                   |
| ----------------- | ----------------------------- | --------------------------------------- |
| `editor`          | `Editor \| null`              | guard null before any command           |
| `editorType`      | `EditorType`                  | `ModuleId \| "default"`                 |
| `setEditorType`   | `(t) => void`                 | triggers editor re-creation             |
| `editorContent`   | `string` (HTML)               | current module's content                |
| `setEditorContent`| `(html) => void`              | `onUpdate` writes here                  |
| `charCount`       | `number`                      | debounced from editor transactions      |

- Per-module content lives in `moduleContents: Record<EditorType, string>` — switching
  modules preserves each module's draft; **undo history is not preserved** (the editor is
  re-created).
- The provider owns one instance; `immediatelyRender: false` keeps SSR safe.
- Initial `editorType` is `"comment"`; the landing demo starts on the `"content"` tab.

---

## 7. CI/CD

`.github/workflows/ci.yml` jobs: `lint-and-typecheck`, `build`, `test`, `deploy-preview`
(PR), `deploy-production` (push to `main`).

**Historical failure mode (fixed):** every run failed at 0s with 0 jobs because step-level
`if:` used the `secrets` context (`${{ secrets.VERCEL_TOKEN != '' }}`). GitHub rejects a
workflow containing that before starting any job. The fix maps secrets to job-level `env:`
and tests `env.VERCEL_TOKEN != ''` at step level — the `env` context is legal in `if:`.

Current repo state: **no GitHub secrets configured** (`VERCEL_TOKEN`/`ORG_ID`/`PROJECT_ID`
absent) → deploy steps skip cleanly; the Vercel Git integration performs actual deploys.
If CI secrets are ever added, the deploy steps activate without further edits.

---

## 8. Quality tooling

| Gate          | Command             | State now                          |
| ------------- | ------------------- | ---------------------------------- |
| Lint          | `npm run lint`      | 0 errors, 18 warnings (pre-existing) |
| Types         | `npm run typecheck` | clean                              |
| Build         | `npm run build`     | clean (all routes prerender)       |
| Tests         | `npm test --if-present` | no-op (no suite configured)    |

- ESLint 9 flat config (`eslint.config.mjs`); `consistent-type-imports` is enforced —
  type-only imports must use `import type`.
- Husky 9 + lint-staged run on commit; `prepare` prints a deprecation notice for
  `husky install` but exits 0.
- There is no `.eslintrc.json` and no `docs/` directory (older `CODEOWNERS` referenced both —
  corrected).

---

## 9. Environment & config

- `.env.local` (gitignored) currently holds a Vercel OIDC token for local `vercel` CLI use.
  **Never commit it.** No other env vars are required to run the site locally.
- `vercel.json` defines one redirect (`/presentation` → `/examples/presentation`) and one
  rewrite (`/editor/:mode` → `/:mode`, legacy).
- `metadataBase` in `app/layout.tsx` must stay pinned to the production origin or OG images
  and the `/llm.txt` link resolve against localhost.
- `opencode.jsonc`:
  - `instructions` now points at `.workspace/PRI/PROJECT_REFERENCE_INDEX.md` (the root-level
    `PROJECT_REFERENCE_INDEX.md` was deleted when the PRI moved into `.workspace/`).
  - `MCP_PROJECT` remains `simple-tiptap-editor` on purpose — it is the **storage key** for
    the local memory server. Renaming it would orphan every context stored under the old
    key. It is not a product name.

---

## 10. Documentation systems

| Artefact                  | Path                                    | Role |
| ------------------------- | --------------------------------------- | ---- |
| README                    | `README.md`                             | Product overview |
| Agent rules               | `AGENTS.md`                             | Binding rules for AI agents |
| This file                 | `DEVELOPMENT_NOTES.md`                  | Engineering context |
| Changelog                 | `CHANGELOG.md`                          | Keep-a-Changelog history |
| PRI                       | `.workspace/PRI/PROJECT_REFERENCE_INDEX.md` | File-level reference index (committed) |
| LFI                       | `.workspace/LFI/`                       | Behavioural flows + diagrams (committed) |
| AI manifests              | `public/llm.txt`, `public/llms-full.txt` | Canonical map / full reference for agents |

Governance rules (workspace, reports, naming) live in `~/.config/opencode/GOVERNANCE.md` and
`.workspace/README.md`. `.workspace/` scratch subdirectories are gitignored; **PRI and LFI are
intentionally tracked** so a fresh clone carries them.

---

## 11. Known gaps / follow-ups

1. Four registry modules lack `/examples/*` routes (their links 404).
2. `markdown`/`legal`/`wiki` presets unwired in `EditorContext`; `LEXICAL_EXTENSIONS` missing.
3. `public/llm.txt` / `llms-full.txt` describe four shipped modules; the registry lists eight
   (manifests hand-synced — update them together with the registry).
4. `package.json` description still says "the first release ships four modules" (accurate for
   *shipped* demos; the registry is the authority on total count).
5. No automated tests.
6. `plugin/` scaffold unpublished (`@coderooz/tiptap-editor`, its own `tsup` build); the
   README there documents a package that does not exist on npm yet.
7. Older `.workspace/*.md` root reports (`PROJECT_CONTEXT_REPORT.md`,
   `CHATGPT_CONTEXT_REPORT.md`, `TIPTAP_SHOWCASE_*`, `TODO_PORTFOLIO.md`) are **historical
   artefacts of the pre-rename product** — kept for traceability, superseded by the PRI.

---

## 12. Debugging checklist

1. Editor renders but toolbar dead → `editor` is null; guard before commands.
2. Wrong toolbar/buttons for a module → `MENU_BY_TYPE` entry, not the component.
3. Wrong features enabled → preset map in `EditorContext.tsx` (check for `|| DEFAULT_EXTENSIONS`
   fallback).
4. Duplicate `link` extension warning → `MarkDownLink` and stock `Link` both registered.
5. Toolbar desync after adding a page → second `EditorProvider` mounted.
6. CI fails at 0s → search the workflow for `secrets.` inside `if:`.
