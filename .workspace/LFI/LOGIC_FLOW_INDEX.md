# Logic Flow Index (LFI) — Master Index

```yaml
lfi:
  name: LOGIC_FLOW_INDEX
  version: 1.0
  status: active
  last_verified: 2026-10-01
  verification_scope: full
  project_root: C:\Code_Works\HTML_CSS_JS\workProjects\website\Simple-Tiptap-editor
```

**Project:** TipTap-Editor
**Companion:** `.workspace/PRI/PROJECT_REFERENCE_INDEX.md` (structural map)
**Relationship:** PRI = "what exists and where"; LFI = "what happens and how"

---

## 1. System Overview

TipTap-Editor is a **static, client-only** Next.js App Router application. It renders a
TipTap v3 rich-text editor in one of four modes (`default`, `comment`, `content`, `document`).
There is no backend, no data persistence, no API endpoints, no authentication, and no
collaborative server. All behavior is local to the browser.

### 1.1 Primary entry points

| Entry point | Trigger | Purpose |
|---|---|---|
| `app/layout.tsx` | Initial page load | Mounts root providers, injects global CSS, renders app shell |
| `app/page.tsx` | Route `/` | Landing page; embeds a live editor demo |
| `app/comment/page.tsx` | Route `/comment` | Renders the editor in `comment` mode |
| `app/content/page.tsx` | Route `/content` | Renders the editor in `content` mode |
| `app/docs/page.tsx` | Route `/docs` | Renders the editor in `document` mode |
| `components/LiveEditorDemo.tsx` | Hero section | Initializes an independent editor instance for the demo |
| `context/EditorContext.tsx` | Provider mount | Creates and owns the live TipTap `Editor` instance |

### 1.2 Data flow summary

```text
URL → Next.js App Router (static prerender)
  → layout.tsx mounts EditorProvider (context)
  → route page.tsx renders EditorPage(type)
  → EditorPage sets editorType in context
  → EditorContext selects extension preset + Placeholder
  → useEditor() instantiates Editor (re-initialized on editorType change)
  → EditorContent renders editable area
  → EditorMenuBar reads editorType → renders menu subset
  → User actions call editor.chain().focus().<command>().run()
  → onUpdate updates charCount + editorContent (HTML)
```

---

## 2. Execution Paths

### PATH-001: Application bootstrap

1. **Entry:** `app/layout.tsx:11-39` — root layout renders `<html>`, `<body>`, wraps
   children with `<EditorProvider>`, renders `<ThemeToggle>`.
2. **Provider init:** `context/EditorContext.tsx:44-125` — initializes `editorType="comment"`,
   `charCount=0`, `editorContent=""`. Builds `extensions` memo by mapping type → preset +
   `Placeholder.configure({...})`.
3. **Editor instantiation:** `useEditor({...}, [editorType])` (lines 68-86) creates the TipTap
   editor. `immediatelyRender: false`, `autofocus: "end"`, initial HTML `<p>Start writing...</p>`.
4. **Listeners:** `useEffect` (92-101) registers `transaction` listener to refresh `charCount`.
5. **Exit:** Children rendered inside provider.

### PATH-002: Landing page → embedded demo

1. **Entry:** `app/page.tsx:1-410` — static route `/`.
2. **Render:** Hero section (lines 139-218) includes `<LiveEditorDemo/>` (line 212).
3. **Demo init:** `components/LiveEditorDemo.tsx:8-41` — renders `EditorProvider` wrapper and
   an `EditorPage` with `type="default"`.
4. **EditorPage:** PATH-003 applies for `default` type.
5. **Exit:** Static HTML; editor hydrates on client.

### PATH-003: Mode route → EditorPage

1. **Entry:** `app/<mode>/page.tsx` (e.g. `docs/page.tsx:3-7`) returns
   `<EditorPage type="document" />` wrapped by provider (inherited from layout).
2. **Mount:** `components/EditorPage.tsx:17-49` calls `setEditorType(type)` on mount
   (useEffect, 20-23) — this triggers editor re-initialization because `editorType` is in
   `useEditor` deps (PATH-004).
3. **Content init (optional):** If `initialContent` provided, `setEditorContent` called
   after editor exists (25-28). This overwrites the default HTML.
4. **Render:** Renders `EditorMenuBar` (line 37), `EditorContent` (39-43), character count (44-46).
5. **Exit:** Editable area mounted.

### PATH-004: Editor type switch (re-initialization)

1. **Trigger:** `setEditorType(newType)` called (PATH-003 mount, or future UI control).
2. **State change:** `editorType` updates in context (46).
3. **Extensions recompute:** `extensions` memo (49-65) rebuilds list for new preset +
   Placeholder.
4. **Editor re-created:** `useEditor` dependency array `[editorType]` (86) forces TipTap to
   destroy and recreate the editor instance with new extensions.
5. **Content restored:** `content` prop uses `editorContent` (72). On type switch, the last
   HTML stored in context is preserved.
6. **Exit:** New editor ready; menu and bubble behavior reflect new extension set.

### PATH-005: Toolbar rendering and command execution

1. **Entry:** `components/EditorMenuBar.tsx:33-239` — reads `{ editor, editorType }`.
2. **Guard:** returns `null` if no editor (37).
3. **Menu selection:** maps `editorType` → `CONTENT_MENU` | `DOCUMENT_MENU` | `MENU_BTN_ITEMS`
   (39-44). Source: `constants/EditorMenuOptions.ts`.
4. **Grouping:** builds unique groups from `item.group` (47).
5. **Render loop:** per item, switch on `item.type`:
   - `button` (58-77): shows icon if present, `active = item.isActive?.(editor)`, calls
     `item.action?.(editor)` on click.
   - `dropdown` (80-144): renders Select; `defaultValue = getValue?.(editor)`; on change
     calls `action(editor, value)`.
   - `input` (147-172): controlled input bound to `getValue(editor)`; debounced/explicit
     `action(editor, e.target.value)`.
   - `model` (175-208): DialogTrigger shows button; DialogContent renders
     `item.model.content(editor)` (components/models/*.tsx).
   - `custom` (211-237): calls `item.render(editor)`.
6. **Command execution:** menu item `action(editor, ...)` typically calls
   `editor.chain().focus().toggleBold().run()` (or equivalent TipTap chain). These are
   synchronous, mutate the ProseMirror document, emit `transaction` events.
7. **Exit:** Toolbar reflects active states via `isActive` checks.

### PATH-006: Character count update

1. **Trigger:** Any document mutation (keystroke, paste, toolbar command, cut/copy/delete).
2. **Event:** TipTap emits `transaction` on the editor instance (ProseMirror).
3. **Listener:** `EditorContext` registers `editor.on("transaction", handler)` (96) where
   `handler = updateCharCount` (88-91).
4. **Computation:** `setCharCount(editor?.state.doc.textContent.length ?? 0)` (89).
5. **State:** `charCount` updated in context; `EditorPage` reads and renders it (44-46).
6. **Exit:** UI reflects new count.

### PATH-007: Content synchronization to HTML

1. **Trigger:** `onUpdate` callback from `useEditor` config (80-84).
2. **Callback:** receives `{ editor }`, calls `setCharCount(editor.state.doc.textContent.length)`
   and `setEditorContent(editor.getHTML())` (81-82).
3. **State:** `editorContent` (HTML string) stored in context. This HTML becomes the
   `content` prop on next editor re-initialization (PATH-004), preserving content across
   mode switches.
4. **Exit:** Context state synchronized with current document HTML.

### PATH-008: Modal insertion flows (model items)

1. **Entry:** User clicks a toolbar item of `type="model"` (e.g. Image, Link, YouTube,
   Import/Export). `EditorMenuBar` renders Dialog (175-208).
2. **Dialog open:** `<DialogTrigger>` shows the button; clicking opens modal.
3. **Content render:** `item.model.content(editor)` returns a React element from
   `components/models/*.tsx` (e.g. `ImageModel`, `LinkModel`, `YoutubeModel`,
   `Import as ImportFileModel`).
4. **User action inside modal:** Form submission calls TipTap commands:
   - `ImageModel` (image.tsx): reads file input, uses `FileReader.readAsDataURL`, inserts
     image via `editor.chain().focus().setImage({ src: ... }).run()`.
   - `LinkModel` (link.tsx): validates URL, calls `editor.chain().focus().setLink({ href }).run()`.
   - `YoutubeModel` (youtube.tsx): extracts video ID from YouTube URL, calls
     `editor.commands.setYoutubeVideo({ src, width, height })`.
   - `ImportExport` (ImportExport.tsx): import reads JSON/HTML from file and calls
     `editor.commands.setContent(...)`; export serializes via `editor.getHTML()`/`getJSON()`
     and triggers download.
5. **Dialog close:** After successful insertion, modal closes (component-specific).
6. **Exit:** Document updated; PATH-006 and PATH-007 fire.

---

## 3. State Management

| State | Owner | Type | Initial | Updated by | Consumed by |
|---|---|---|---|---|---|
| `charCount` | `EditorContext` | `number` | `0` | `onUpdate` (80-84) and `transaction` listener (92-101) | `EditorPage` (44-46) |
| `editorType` | `EditorContext` | `"comment" \| "document" \| "content" \| "default"` | `"comment"` | `setEditorType` (PATH-003) | `EditorContext` (extensions map), `EditorMenuBar` (menu selection) |
| `editor` | `EditorContext` | `Editor \| null` | `null` | `useEditor` (recreated on `editorType` change) | `EditorPage`, `EditorMenuBar`, all toolbar actions/modals |
| `editorContent` | `EditorContext` | `string` (HTML) | `""` | `onUpdate` (82) | `useEditor` `content` prop (72); preserved across type switches |

Notes:

- `editorContent` is initialized to `""` but `useEditor.content` falls back to
  `"<p>Start writing...</p>"` (72). That default is not written back into context until
  the first `onUpdate`.
- The `EditorProvider` currently renders a debug label `Editor Type: {editorType}` (121).
  This is present in the rendered DOM on every editor page.

---

## 4. External Interactions

None. The application has **no outbound network calls**, no inbound webhooks, no database
access, no third-party service integrations (beyond static asset loading). The Yjs/
collaboration packages (`yjs`, `y-protocols`, `@tiptap/extension-collaboration`, `@tiptap/y-tiptap`)
are installed but **never imported or referenced** in source code.

---

## 5. Cross-References

| Topic | PRI | LFI (this file) | Source files |
|---|---|---|---|
| Structural layout | §5 Directory Reference | §1 System Overview | `app/`, `components/`, `constants/`, `context/` |
| Routes | §7 Application Routes | PATH-002, PATH-003 | `app/*.tsx` |
| Extension presets | §9 Modules | PATH-001, PATH-004 | `constants/EditorExtension.tsx`, `context/EditorContext.tsx` |
| Toolbar | §10 Components | PATH-005 | `components/EditorMenuBar.tsx`, `constants/EditorMenuOptions.ts` |
| State | §19 Architectural Relationships | §3 State Management | `context/EditorContext.tsx` |
| Bubble menus | §22 Known Constraints (dead code) | — | `components/bubbleMenu/*.tsx` (not mounted) |
| Brand icons | §6 File Reference | PATH-005 (Youtube model) | `components/icons/brand-icons.tsx` |

---

## 6. Component Interactions (summary)

| Component | Inputs | Outputs | Calls | Called by |
|---|---|---|---|---|
| `EditorProvider` | children | context value | `useEditor`, `useMemo`, `useEffect` | `app/layout.tsx`, `LiveEditorDemo.tsx` |
| `EditorPage` | `{ type, initialContent? }` | rendered editor shell | `setEditorType`, `setEditorContent` | `app/*/page.tsx`, `LiveEditorDemo.tsx` |
| `EditorMenuBar` | reads context | toolbar UI | editor command chains | `EditorPage` |
| `EditorContent` | `{ editor }` | editable DOM | TipTap renderer | `EditorPage` |
| Models (`image/link/youtube/ImportExport`) | `{ editor }` | modal UI | editor commands (`setImage`, `setLink`, `setYoutubeVideo`, `setContent`, `getHTML`, `getJSON`) | `EditorMenuBar` (model items) |
| `LiveEditorDemo` | — | `<EditorProvider><EditorPage type="default"/></>` | — | `app/page.tsx` |

---

## 7. Error Paths

| Scenario | Trigger | Handling | Recovery | Notes |
|---|---|---|---|---|
| No editor in toolbar | `EditorMenuBar` renders before editor ready | Returns `null` (line 37) | Toolbar appears once `useEditor` completes | Safe guard; prevents null derefs |
| No editor in page | `EditorPage` checks `!editor` | Renders loading placeholder (30-33) | Re-renders when editor becomes non-null | Prevents flash of broken UI |
| Invalid YouTube URL | User submits malformed URL in `YoutubeModel` | `alert("Please enter a valid YouTube URL")` (youtube.tsx:25) | User fixes input and retries | Synchronous browser alert |
| File read failure (image import) | `FileReader` error | `onerror` handler logs/ignores (image.tsx sets reader but no explicit onerror shown) | No user feedback | Untreated edge case |
| File read for import | Invalid JSON/HTML | Try/catch around `JSON.parse`/content set (ImportExport.tsx) | `alert(err)` on catch (line 15 defines `err` but unused in the shown code) | Logging incomplete |
| Context used outside provider | `useEditorContext()` called without provider | Throws `Error("useEditorContext must be used within an EditorProvider")` (130) | Mount provider above consumer | Fail-fast guard |

---

## 8. Node ID Convention (for future diagrams)

If Mermaid diagrams are added later, use this stable convention:

```text
[AREA][NN]:[Type][Name]
```

| Area | Meaning |
|---|---|
| BOOT | Bootstrap/layout |
| ROUTE | Route/page mount |
| CTX | EditorContext/useEditor |
| MENU | Toolbar/menu |
| MOD | Modal/model flows |
| DOC | Document mutations |

Types: `Entry`, `Process`, `Decision`, `Output`, `Error`, `External`.

Examples:
- `BOOT01:Entry[RootLayoutMount]`
- `ROUTE01:Process[SetEditorType]`
- `CTX01:Process[RecreateEditorOnTypeChange]`
- `MENU01:Process[ExecuteCommandChain]`
- `DOC01:Output[UpdateCharCount]`

All node IDs must be traceable to file paths + line ranges in this LFI.