# Logic Flow Index (LFI) — DIAGRAMS

Companion to `LOGIC_FLOW_INDEX.md`. All node IDs follow the convention documented in
§8 of the master index and are traceable to source line ranges.

---

## Legend

```text
Node ID format: [AREA][NN]:[Type][Name]

Areas:
  BOOT  — bootstrap/layout
  ROUTE — route/page mount
  CTX   — editor context/useEditor
  MENU  — toolbar/menu
  MOD   — modal/model flows
  DOC   — document mutation

Types:
  Entry    — starting point
  Process  — processing step
  Decision — branching point
  Output   — result/return
  Error    — error handling
  External — external call (none exist in this project)
```

---

## DIAGRAM-001: Application Bootstrap

Traces PATH-001 and PATH-002 from the master LFI.

```mermaid
flowchart TD
    BOOT01:Entry["RootLayoutMount<br/>app/layout.tsx:11-39"] --> BOOT02:Process["MountEditorProvider<br/>context/EditorContext.tsx:44"]
    BOOT02 --> CTX01:Process["InitState<br/>editorType='comment', charCount=0, editorContent=''"]
    CTX01 --> CTX02:Process["BuildExtensionsMemo<br/>EditorContext.tsx:49-65"]
    CTX02 --> CTX03:Decision{"editorType<br/>maps to preset?"}
    CTX03 -->|comment| CTX04a:Process["COMMENT_EXTENSIONS<br/>+CharacterCount 2500"]
    CTX03 -->|document| CTX04b:Process["DOCUMENT_EXTENSIONS<br/>COMPLEX+CharacterCount"]
    CTX03 -->|content| CTX04c:Process["BLOG_EXTENSIONS<br/>COMPLEX"]
    CTX03 -->|default| CTX04d:Process["DEFAULT_EXTENSIONS<br/>core"]
    CTX04a --> CTX05:Process["AppendPlaceholder<br/>EditorContext.tsx:59-64"]
    CTX04b --> CTX05
    CTX04c --> CTX05
    CTX04d --> CTX05
    CTX05 --> CTX06:Process["useEditor Init<br/>EditorContext.tsx:68-86<br/>immediatelyRender:false"]
    CTX06 --> CTX07:Process["RegisterTransactionListener<br/>EditorContext.tsx:92-101"]
    CTX07 --> CTX08:Output["ContextValueProvided<br/>EditorContext.tsx:103-124"]
    CTX08 --> BOOT03:Output["ChildrenRendered"]
```

---

## DIAGRAM-002: Mode Route → Editor Shell

Traces PATH-003 and PATH-004.

```mermaid
flowchart TD
    ROUTE01:Entry["URL Request<br/>/comment | /content | /docs"] --> ROUTE02:Process["Next.js Static Prerender<br/>app/<mode>/page.tsx"]
    ROUTE02 --> ROUTE03:Entry["Mount EditorPage type='<mode>'<br/>components/EditorPage.tsx:17"]
    ROUTE03 --> ROUTE04:Process["setEditorType(type)<br/>EditorPage.tsx:20-23"]
    ROUTE04 --> CTX10:Process["editorType State Changes<br/>EditorContext.tsx:46"]
    CTX10 --> CTX11:Process["extensions Memo Rebuilds<br/>EditorContext.tsx:49-65"]
    CTX11 --> CTX12:Process["useEditor deps [editorType]<br/>forces re-creation<br/>EditorContext.tsx:86"]
    CTX12 --> CTX13:Output["New Editor with Preset Extensions"]
    ROUTE03 --> ROUTE05:Decision{"initialContent<br/>provided?"}
    ROUTE05 -->|yes| ROUTE06:Process["setEditorContent(initial)<br/>EditorPage.tsx:25-28"]
    ROUTE05 -->|no| ROUTE07:Output["Use default HTML"]
    ROUTE06 --> ROUTE08:Process["Render EditorMenuBar<br/>EditorPage.tsx:37"]
    ROUTE07 --> ROUTE08
    ROUTE13:Decision{"editor ready?"} -->|no| ROUTE09:Output["Loading placeholder<br/>EditorPage.tsx:30-33"]
    ROUTE08 --> ROUTE13
    ROUTE13 -->|yes| ROUTE10:Output["Render EditorContent + charCount<br/>EditorPage.tsx:39-46"]
```

---

## DIAGRAM-003: Toolbar Rendering & Command Execution

Traces PATH-005.

```mermaid
flowchart TD
    MENU01:Entry["EditorMenuBar Renders<br/>components/EditorMenuBar.tsx:33"] --> MENU02:Decision{"editor<br/>exists?"}
    MENU02 -->|no| MENU03:Output["return null<br/>EditorMenuBar.tsx:37"]
    MENU02 -->|yes| MENU04:Decision{"editorType?"}
    MENU04 -->|content| MENU05a:Process["CONTENT_MENU"]
    MENU04 -->|document| MENU05b:Process["DOCUMENT_MENU"]
    MENU04 -->|other| MENU05c:Process["MENU_BTN_ITEMS"]
    MENU05a --> MENU06:Process["Group items by item.group<br/>EditorMenuBar.tsx:47"]
    MENU05b --> MENU06
    MENU05c --> MENU06
    MENU06 --> MENU07:Decision{"item.type"}
    MENU07 -->|button| MENU08a:Process["Render Button<br/>isActive? → variant<br/>EditorMenuBar.tsx:58-77"]
    MENU07 -->|dropdown| MENU08b:Process["Render Select<br/>options list<br/>EditorMenuBar.tsx:80-144"]
    MENU07 -->|input| MENU08c:Process["Render controlled Input<br/>EditorMenuBar.tsx:147-172"]
    MENU07 -->|model| MENU08d:Process["Render Dialog + modal<br/>components/models/*.tsx<br/>EditorMenuBar.tsx:175-208"]
    MENU07 -->|custom| MENU08e:Process["item.render(editor)<br/>EditorMenuBar.tsx:211-237"]
    MENU08a --> MENU09:Process["User clicks → action(editor)<br/>e.g. toggleBold().run()"]
    MENU08b --> MENU09
    MENU08c --> MENU09
    MENU08e --> MENU09
    MENU09 --> DOC01:Output["Document mutated<br/>→ DIAGRAM-004"]
```

---

## DIAGRAM-004: Document Mutation Feedback Loop

Traces PATH-006 and PATH-007.

```mermaid
flowchart TD
    DOC01:Entry["ProseMirror Document Changed"] --> DOC02:Process["transaction Event<br/>fires on editor"]
    DOC02 --> DOC03:Process["Listener: updateCharCount<br/>EditorContext.tsx:88-91, 96"]
    DOC03 --> DOC04:Output["charCount = doc.textContent.length"]
    DOC02 --> DOC05:Process["onUpdate callback<br/>EditorContext.tsx:80-84"]
    DOC05 --> DOC06:Output["setCharCount(doc.textContent.length)"]
    DOC05 --> DOC07:Output["setEditorContent(editor.getHTML())"]
    DOC04 --> DOC08:Output["EditorPage re-renders count<br/>EditorPage.tsx:44-46"]
    DOC06 --> DOC08
    DOC07 --> DOC09:Process["HTML stored in context<br/>preserved on type switch<br/>→ DIAGRAM-002 CTX12"]
```

---

## DIAGRAM-005: Modal Insertion Flows

Traces PATH-008.

```mermaid
flowchart TD
    MOD01:Entry["Toolbar model item clicked<br/>EditorMenuBar.tsx:175-208"] --> MOD02:Process["Dialog opens<br/>content = model.content(editor)"]
    MOD02 --> MOD03:Decision{"Which<br/>model?"}
    MOD03 -->|Image| MOD04a:Process["FileReader.readAsDataURL<br/>components/models/image.tsx"]
    MOD03 -->|Link| MOD04b:Process["Validate URL<br/>components/models/link.tsx"]
    MOD03 -->|YouTube| MOD04c:Process["Extract video ID<br/>components/models/youtube.tsx"]
    MOD03 -->|Import/Export| MOD04d:Process["Read/write file<br/>components/models/ImportExport.tsx"]
    MOD04a --> MOD05a:Process["chain().focus().setImage({src}).run()"]
    MOD04b --> MOD05b:Process["chain().focus().setLink({href}).run()"]
    MOD04c --> MOD05c:Process["commands.setYoutubeVideo({src,w,h})"]
    MOD04d --> MOD05d:Process["commands.setContent(...) / getHTML() / getJSON()"]
    MOD04c --> MOD06:Error["Invalid URL → alert<br/>youtube.tsx:25"]
    MOD04d --> MOD07:Error["Parse failure → catch/alert<br/>ImportExport.tsx"]
    MOD05a --> MOD08:Output["Document updated<br/>→ DIAGRAM-004"]
    MOD05b --> MOD08
    MOD05c --> MOD08
    MOD05d --> MOD08
    MOD06 --> MOD09:Output["User fixes input and retries"]
    MOD07 --> MOD09
    MOD09 --> MOD02
```

---

## DIAGRAM-006: State Transitions — EditorContext

```mermaid
stateDiagram-v2
    [*] --> Bootstrapping: EditorProvider mounts
    Bootstrapping --> CommentMode: editorType='comment' (default)
    Bootstrapping --> DocumentMode: setEditorType('document')
    Bootstrapping --> ContentMode: setEditorType('content')
    Bootstrapping --> DefaultMode: setEditorType('default')
    CommentMode --> DocumentMode: setEditorType + re-init
    CommentMode --> ContentMode: setEditorType + re-init
    CommentMode --> DefaultMode: setEditorType + re-init
    DocumentMode --> CommentMode: setEditorType + re-init
    DocumentMode --> ContentMode: setEditorType + re-init
    DocumentMode --> DefaultMode: setEditorType + re-init
    ContentMode --> CommentMode: setEditorType + re-init
    ContentMode --> DocumentMode: setEditorType + re-init
    ContentMode --> DefaultMode: setEditorType + re-init
    DefaultMode --> CommentMode: setEditorType + re-init
    DefaultMode --> DocumentMode: setEditorType + re-init
    DefaultMode --> ContentMode: setEditorType + re-init
    DefaultMode --> Editing: user types
    CommentMode --> Editing: user types
    DocumentMode --> Editing: user types
    ContentMode --> Editing: user types
    Editing --> CommentMode: transaction / onUpdate
    Editing --> DocumentMode: transaction / onUpdate
    Editing --> ContentMode: transaction / onUpdate
    Editing --> DefaultMode: transaction / onUpdate
    Editing --> [*]: navigate away (unmount)
```

Note: `Editing` is a conceptual overlay; the context does not store an explicit
"editing" boolean — `charCount`/`editorContent` updates implicitly indicate activity.

---

## DIAGRAM-007: Editor Extension Preset Derivation

```mermaid
flowchart TD
    BASE01:Entry["DEFAULT_EXTENSIONS<br/>constants/EditorExtension.tsx:104"] --> BASE02:Process["Core set: Document, Paragraph, Text,<br/>Bold, Italic, Underline, Link, MarkDownLink,<br/>TextAlign, UndoRedo, Typography, Blockquote"]
    BASE02 --> BASE03:Process["+ CharacterCount(limit 2500)<br/>→ COMMENT_EXTENSIONS<br/>EditorExtension.tsx:307-308"]
    BASE02 --> CPLX01:Process["COMPLEX_EXTENSIONS<br/>EditorExtension.tsx:143"]
    CPLX01 --> BLOG01:Output["BLOG_EXTENSIONS<br/>EditorExtension.tsx:298"]
    CPLX01 --> DOCEXT01:Output["+ CharacterCount → DOCUMENT_EXTENSIONS<br/>EditorExtension.tsx:300-306"]
    BASE03 --> CTX20:Process["Append Placeholder<br/>EditorContext.tsx:59-64"]
    BLOG01 --> CTX20
    DOCEXT01 --> CTX20
    BASE01 --> CTX20
    CTX20 --> OUT01:Output["Final extension list → useEditor"]
```

Note: `Heading` in `constants/EditorExtension.tsx:73-101` is a custom extension extending
TipTap's `Heading`, adding per-level Tailwind classes via `levelClassMap`. It is applied
across presets that include headings.

---

## Coverage

| Path(s) from `LOGIC_FLOW_INDEX.md` | Diagram |
|---|---|
| PATH-001 Bootstrap | DIAGRAM-001 |
| PATH-002 Landing demo | DIAGRAM-001 (shares bootstrap) |
| PATH-003 Mode route | DIAGRAM-002 |
| PATH-004 Type switch | DIAGRAM-002 |
| PATH-005 Toolbar | DIAGRAM-003 |
| PATH-006/007 Feedback | DIAGRAM-004 |
| PATH-008 Modals | DIAGRAM-005 |
| §3 State | DIAGRAM-006 |
| §7 Error paths | DIAGRAM-005 (error nodes) |
| Preset derivation | DIAGRAM-007 |

All execution paths defined in the master LFI are represented.