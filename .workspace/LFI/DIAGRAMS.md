# Logic Flow Index (LFI) — DIAGRAMS

```yaml
lfi:
  name: DIAGRAMS
  version: 2.0
  status: active
  last_verified: 2026-10-07
```

**Project:** Editor Blocks (`editor-blocks` v0.3.0)
**Companion:** `LOGIC_FLOW_INDEX.md` (paths, state, error paths)

## Legend

```text
[ rect ]  component / module        ( rect )   data store / state
  > arrow   control / render flow    ~ arrow   data flow (HTML, values)
  X  failure / fallback point        #  numbered node (DIAGRAM-nnn)
```

---

## DIAGRAM-001: Application Bootstrap

```text
#1  Browser request
      >
#2  app/layout.tsx  ── fonts, metadataBase, globals.css, ThemeToggle/Header/Footer
      >
#3  EditorProvider  (context/EditorContext.tsx)   *** mounted EXACTLY ONCE ***
      >
#4  useEditor( [ editorType = "comment" ] , immediatelyRender: false )
      >
      +--> preset map: "comment" --> COMMENT_EXTENSIONS
      >
#5  ( editor = Editor | null )  ── X --> null until ready (guard all commands)
      >
#6  Route renders ( / | /modules | /examples/* | /documentation/* )
      >
#7  EditorMenuBar: MENU_BY_TYPE[ editorType ] --> ToolbarItem
```

---

## DIAGRAM-002: Example Route → Editor Shell

```text
#1  /examples/<id>   (app/examples/<id>/page.tsx)
      >
#2  ExamplePageTemplate  ── breadcrumb, header, capabilities, InstallGuide
      >
#3  <EditorPage type="<id>" initialContent={seed} />
      >
#4  effect: setEditorType("<id>")  ── ~ moduleContents[<id>] restored if revisited
      >
#5  editor ready?  --no--> wait (editor === null)
      |  yes
#6  editor.commands.setContent( seed )     # initialContent applied via command
      >
#7  user edits --> onUpdate --> setEditorContent( html ) --> EditorPreview
```

Shipped ids: `comment`, `content`, `document` (route `/examples/docs`), `presentation`.
Unshipped ids (`markdown`, `legal`, `wiki`, `lexical`): **route does not exist → 404** (E-6).

---

## DIAGRAM-003: Toolbar Rendering & Command Execution

```text
#1  EditorMenuBar
      >
#2  MENU_BY_TYPE[ editorType ]   *** total map over EditorType (compile error if key missing)
      |        comment --> COMMENT_MENU     content --> CONTENT_MENU
      |        document --> DOCUMENT_MENU   presentation|markdown|legal|wiki|lexical --> CONTENT_MENU
      |        default --> MENU_BTN_ITEMS   (41 items total: 29 btn / 4 dd / 3 input / 5 model)
#3  group items by `group`
      >
#4  ToolbarItem dispatch
      +--> button   --> onClick
      +--> dropdown --> Radix popover options
      +--> input    --> inline field
      +--> model    --> DialogTrigger  *** must asChild (E-7) ***
      +--> default  --> null   ( "custom" declared in type union but never rendered )
      >
#5  editor.chain().focus().<command>().run()
      >
#6  transaction --> onUpdate / selectionUpdate --> back to context (#4 of DIAGRAM-004)
```

---

## DIAGRAM-004: Document Mutation Feedback Loop

```text
#1  user input (keystroke, toolbar command, modal insert)
      >
#2  TipTap transaction
      |
      +--> #3a  onUpdate --> editor.getHTML() --> setEditorContent( html )
      |                 ~ moduleContents[ editorType ] = html      (draft preserved)
      |                 ~ EditorPreview re-renders
      |
      +--> #3b  character count --> debounce ( lodash ) --> charCount --> counter UI
      |
      +--> #3c  undo/redo stack  (lives in THIS editor instance only --
                                     lost when the module switches, see DIAGRAM-005)
```

---

## DIAGRAM-005: Module Switch (Editor Re-creation)

```text
#1  setEditorType( newId )            # tab click, or EditorPage effect
      >
#2  preset map lookup: newId --> extensions
      |
      +--> X FALLBACK: markdown | legal | wiki | lexical --> DEFAULT_EXTENSIONS   (E-2, gap #2)
      |        lexical: LEXICAL_EXTENSIONS does not exist (gap #3)
      v
#3  moduleContents[ oldId ] = current html     ~ draft saved
      >
#4  useEditor([ newId ]) --> destroy old Editor --> create new Editor
      >
      +--> undo history: LOST (new instance)
      +--> content: PRESERVED (per-module in moduleContents)
      >
#5  MENU_BY_TYPE[ newId ] --> toolbar re-renders
      >
#6  EditorPage re-applies initialContent for the new module
```

---

## DIAGRAM-006: State Model — EditorContext

```text
                    ( EditorProvider )   *** singleton ***
     ┌───────────────────────────────────────────────────────────┐
     │ editor: Editor | null          # guards every command     │
     │ editorType: ModuleId | "default"  <--- setEditorType      │
     │ editorContent: string (HTML)   <--- onUpdate              │
     │ moduleContents: Record<EditorType, string>  (in-memory)   │
     │ charCount: number              <--- debounced transactions│
     └───────────────────────────────────────────────────────────┘
        ^                    ^                        ^
        |                    |                        |
   EditorPage          EditorMenuBar /           EditorPreview
   (type prop,         ToolbarItem               (read-only HTML)
    setContent)        (reads editorType,
                        runs chains)
```

Transitions: only `setEditorType` (re-creates editor) and `setEditorContent` (mirror).
No persistence — all state is lost on page reload.

---

## DIAGRAM-007: Preset Derivation (module → extension array)

```text
constants/module-registry.ts  (SSOT, 8 entries)
      |
      |  extensionSet name
      v
constants/EditorExtension.tsx
      DEFAULT ─┬─ COMPLEX ─┬─ BLOG (alias)
      |        |           ├─ DOCUMENT  (+ CharacterCount textSize)
      |        |           ├─ PRESENTATION (+ CharacterCount textSize)
      |        |           ├─ MARKDOWN   *** defined, UNWIRED ***
      |        |           ├─ LEGAL      *** defined, UNWIRED ***
      |        |           └─ WIKI       *** defined, UNWIRED ***
      |        └─ COMMENT (+ CharacterCount limit/nodeSize)
      |
      v
EditorContext preset map (keyed by EditorType)
      comment-->COMMENT   content-->BLOG   document-->DOCUMENT
      presentation-->PRESENTATION   default-->DEFAULT
      markdown|legal|wiki|lexical --> X DEFAULT_EXTENSIONS  (silent fallback)
```

---

## DIAGRAM-008: Registry → Surfaces (SSOT derivation)

```text
constants/module-registry.ts
      |
      +--> components/modules/ModulesCatalogue.tsx   --> /modules
      +--> components/examples/example-metadata.ts   --> /examples index
      +--> app/documentation/modules/[moduleId]      --> /documentation/modules/*
      +--> LiveEditorDemo tab list (+ "default")    --> landing demo
      +--> public/llm.txt                           --> AI manifest (HAND-SYNCED)
      |
      +--> href field --> /examples/<href>  ---- X 404 for markdown, legal, wiki, lexical
                                                  (route not implemented — gap #1)
```

---

## Coverage

| Diagram | Covers | LFI cross-ref |
|---|---|---|
| 001 | Bootstrap, provider singleton | PATH-001, E-5/E-10 |
| 002 | Example route lifecycle | PATH-003, E-6 |
| 003 | Toolbar data → dispatch → command | PATH-005, E-3/E-7 |
| 004 | Mutation feedback loop | PATH-006/007 |
| 005 | Module switch / re-creation | PATH-004, E-2 |
| 006 | Context state model | §3 State Management |
| 007 | Preset derivation + unwired presets | PRI §8, gap #2/#3 |
| 008 | Registry SSOT derivation | PRI §5/§7, gap #1 |

Uncovered by diagram (documented in text only): PATH-008 modal flows, PATH-009 docs
generation, CI workflow (PRI §10, LFI E-8).
