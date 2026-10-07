# Logic Flow Index (LFI) — Master Index

```yaml
lfi:
  name: LOGIC_FLOW_INDEX
  version: 2.0
  status: active
  last_verified: 2026-10-07
  verification_scope: full
  project_root: C:\Code_Works\HTML_CSS_JS\workProjects\website\Simple-Tiptap-editor
```

**Project:** Editor Blocks (`editor-blocks` v0.3.0)
**Companion:** `.workspace/PRI/PROJECT_REFERENCE_INDEX.md` (structural map)
**Relationship:** PRI = "what exists and where"; LFI = "what happens and how"

---

## 1. System Overview

Editor Blocks is a **static, client-side** Next.js App Router application. It renders a
TipTap v3 editor configured as one of eight registered *modules* (plus a `default` fallback).
There is no backend, no data persistence, no API endpoints, no authentication, and no
collaborative server. All behaviour is local to the browser.

A module = registry entry (`constants/module-registry.ts`) → extension preset
(`constants/EditorExtension.tsx`) → toolbar menu (`constants/EditorMenuOptions.ts`) →
route (`app/examples/<id>/` for shipped modules).

### 1.1 Primary entry points

| Entry point | Trigger | Purpose |
|---|---|---|
| `app/layout.tsx` | Initial page load | Mounts `EditorProvider` **once**, fonts, metadata, app shell |
| `app/page.tsx` | Route `/` | Landing; embeds `LiveEditorDemo` (module tabs) |
| `app/examples/<id>/page.tsx` | Route `/examples/*` | Renders `ExamplePageTemplate` → `EditorPage` for one module |
| `app/modules/page.tsx` | Route `/modules` | Registry-driven catalogue |
| `app/documentation/**` | Route `/documentation/*` | Static docs; per-module pages from registry |
| `context/EditorContext.tsx` | Provider mount | Creates and owns the single TipTap `Editor` instance |

### 1.2 Data flow summary

```text
module-registry.ts ──► catalogue / examples index / docs pages / llm.txt (hand-synced)
        │
        └─(module id)─► EditorContext preset map ──► extension preset array
                                                      │
EditorPage type prop ──► setEditorType ───────────────┘
        │                        │
        │ initialContent ──► editor.commands.setContent()
        ▼
   useEditor([editorType])  ◄── re-creates editor on module change
        │
        ├── onUpdate ──► setEditorContent(html) ──► moduleContents[id] (draft preserved)
        ├── transactions ──► debounced ──► charCount
        ▼
EditorMenuBar: MENU_BY_TYPE[editorType] ──► group by `group` ──► ToolbarItem dispatch
        ▼
button/dropdown/input/model ──► editor.chain().focus().<command>().run()
```

---

## 2. Execution Paths

### PATH-001: Application bootstrap
1. `app/layout.tsx` renders `<EditorProvider>` (exactly once) around children.
2. Provider creates the TipTap editor via `useEditor` with `immediatelyRender: false`
   (SSR-safe) and the preset for the initial `editorType` (`"comment"`).
3. Route component renders; client hydration completes; toolbar renders from `MENU_BY_TYPE`.

### PATH-002: Landing page — module-switcher demo
1. `app/page.tsx` → `LiveEditorDemo`.
2. Tabs are **derived**: `EDITOR_MODULES` from the registry + `"default"`; initial tab
   `"content"`; sample HTML from `sample-content.ts` falling back to `DEFAULT_SAMPLE`.
3. Clicking a tab calls `setEditorType(id)` → PATH-004.

### PATH-003: Example route — EditorPage
1. `app/examples/<id>/page.tsx` renders `ExamplePageTemplate` (breadcrumb, header,
   capability list, install guide) around `<EditorPage type="<id>" initialContent={...}/>`.
2. `EditorPage` effect: `setEditorType(type)`; once the editor exists, applies seed HTML
   via `editor.commands.setContent()`.
3. Editor re-creates with the preset mapped for that id (PATH-004 steps 2–4).
4. Live output preview (`EditorPreview`) mirrors `editorContent`.

### PATH-004: Module switch (editor re-initialization)
1. `setEditorType(newId)` updates context.
2. Preset map resolves `newId → extension array`; **missing entries (markdown, legal, wiki,
   lexical) silently resolve to `DEFAULT_EXTENSIONS`** (known gap).
3. `useEditor([editorType])` destroys and re-creates the editor with the new preset.
4. Previous module's HTML is stored in `moduleContents[oldId]` (draft preserved);
   **undo history is lost** (new editor instance).
5. Toolbar re-renders from `MENU_BY_TYPE[newId]` (total map — compile error if absent).

### PATH-005: Toolbar rendering and command execution
1. `EditorMenuBar` reads `MENU_BY_TYPE[editorType]` → array of `MenuItem`.
2. Items grouped by `group` label; each rendered by `ToolbarItem`.
3. `ToolbarItem` dispatch: `button` → onClick chain; `dropdown` → Radix popover + options;
   `input` → inline field; `model` → Radix `DialogTrigger` (**must use `asChild`** when
   wrapping a shadcn `Button`); any other type → `null`.
4. Command executes `editor.chain().focus().<cmd>().run()`; state updates flow back through
   `onUpdate` → context.

### PATH-006: Character count update
1. Editor transactions fire; count derived from the `CharacterCount` extension (`textSize`
   mode for content/presentation/document; word/limit modes per preset).
2. Value debounced (lodash) → `charCount` in context → counter UI updates.

### PATH-007: Content synchronization to HTML
1. `onUpdate` → `editor.getHTML()` → `setEditorContent(html)`.
2. Written to `moduleContents[editorType]`, so switching modules and switching back
   restores the draft.
3. `EditorPreview` / export dialogs read `editorContent`.

### PATH-008: Modal insertion flows (model toolbar items)
1. `ToolbarItem` `model` case opens a dialog (`components/models/`: link, image, youtube,
   ImportExport).
2. User input validated in-dialog (YouTube URLs validated inline in `youtube.tsx`).
3. Confirm → chained command inserts/updates content → PATH-007.

### PATH-009: Documentation page generation
1. `/documentation/modules` and `/documentation/modules/[moduleId]` read the registry
   server-side and render per-module reference pages — including for modules whose
   `/examples/*` route does not exist yet.

---

## 3. State Management

| Store | Owner | Lifetime | Notes |
|---|---|---|---|
| TipTap `Editor` | `EditorContext` (single provider) | App lifetime; re-created on module switch | `editor` may be `null` — guard before commands |
| `editorType` | `EditorContext` | App lifetime | `ModuleId \| "default"` derived from registry |
| `moduleContents` | `EditorContext` | App lifetime (in-memory) | Per-module HTML drafts; **not persisted** |
| `editorContent` | `EditorContext` | Current module | Mirror of `editor.getHTML()` |
| `charCount` | `EditorContext` | Current module | Debounced |
| Demo tab selection | `LiveEditorDemo` local state | Page lifetime | Initial `"content"` |
| Theme (dark/light) | `ThemeToggle` | localStorage | — |

No server state, no global store library, no persistence layer.

---

## 4. External Interactions

| Interaction | Direction | Notes |
|---|---|---|
| Static assets (`public/*`) | Inbound | `llm.txt`, `llms-full.txt`, SVGs, screenshot |
| Paste/drag media | Inbound | File handler extension; images handled in-editor (base64/local) |
| External links / YouTube embeds | Outbound | Link mark + YouTube extension (no network calls by the app itself) |
| Vercel / GitHub | Build-time only | CI runs gates; Vercel Git integration deploys |
| Local memory MCP | Out of band | `.mcp-runtime.json`; storage key `simple-tiptap-editor` |

The app itself makes **no runtime network requests** (no fetch/API/DB).

---

## 5. Error Paths

| # | Failure | Behaviour | Mitigation |
|---|---|---|---|
| E-1 | `editor` is `null` when a command runs | Toolbar click silently no-ops or throws | Guard `if (!editor)` before chains |
| E-2 | Unknown module id in preset map | **Silent fallback** to `DEFAULT_EXTENSIONS` | Keep map total; see PRI gap #2 |
| E-3 | Missing `MENU_BY_TYPE` key | Compile error (total map by design) | Add the key, never reintroduce runtime fallback |
| E-4 | `MarkDownLink` + stock `Link` both registered | Two `link` extensions → TipTap warning, broken input rules | Register exactly once |
| E-5 | Second `EditorProvider` mounted | Two editors → toolbar desynchronises | Provider only in `app/layout.tsx` |
| E-6 | Registry `href` without a route | 404 on `/examples/markdown\|legal\|wiki\|lexical` | Known gap — add routes |
| E-7 | Dialog trigger without `asChild` | Nested `<button>` — invalid HTML | Use `asChild` on Radix triggers |
| E-8 | CI step `if:` referencing `secrets.*` | Whole workflow rejected → run fails at 0s with 0 jobs | Map to job `env:`, test `env.X != ''` |
| E-9 | `console.log` in shipped code | Quality-gate violation | Remove before commit |
| E-10 | SSR/SSG render of editor | Hydration mismatch | `immediatelyRender: false` in `useEditor` |

---

## 6. Cross-References

| Topic | PRI section | LFI section |
|---|---|---|
| Module wiring / gaps | §8 Modules, §16 Known Gaps | PATH-004, E-2/E-6 |
| Toolbar design | §6 EditorMenuBar/ToolbarItem | PATH-005, E-3/E-7 |
| State model | §6 `context/EditorContext.tsx` | §3 State Management |
| CI behaviour | §10 CI pipeline | E-8 |
| Routes | §7 Application Routes | PATH-002/003, E-6 |
| Diagrams | — | `DIAGRAMS.md` (001–008) |

---

## 7. Component Interactions (summary)

```text
app/layout.tsx
 └─ EditorProvider ──────────── owns Editor, preset map, moduleContents
     ├─ app/page.tsx → LiveEditorDemo ── tabs (registry) → setEditorType
     ├─ app/examples/* → ExamplePageTemplate
     │    └─ EditorPage ── setEditorType + setContent
     │         ├─ EditorMenuBar ── MENU_BY_TYPE → ToolbarItem → editor chains
     │         ├─ EditorContent (TipTap) ── onUpdate → context
     │         └─ EditorPreview ── editorContent
     └─ app/modules → ModulesCatalogue ── module-registry (SSOT)
```

---

## 8. Node ID Convention (for diagrams)

- `PATH-00n` — execution paths (§2)
- `E-n` — error paths (§5)
- `DIAGRAM-00n` — diagrams in `DIAGRAMS.md`
- `MOD-<id>` — registry module ids (`MOD-comment`, `MOD-lexical`, …)
