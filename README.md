# Editor Blocks

**A library of ready-to-use, drop-in editor modules for React and Next.js.**

Each module is a pre-tuned editor configuration for one job — a comment box, an article body,
a document, a presentation — with its extension set, toolbar, and constraints already decided.
The name is deliberate: these are blocks you place, not a single editor you configure.

Editor Blocks exists because most projects build the same rich-text editor twice — once for a
comment field, once for a blog body — and the two implementations drift apart. It packages
editors the way shadcn/ui packages components: a small, opinionated, readable implementation
you own once you copy it.

**Status:** active, pre-1.0 (`v0.3.0`). All shipped modules are powered by
[TipTap v3](https://tiptap.dev/). The architecture is engine-agnostic by design so the
catalogue can later include Lexical, ProseMirror, BlockNote, Slate, and Quill without changing
the module contract.

![Editor Blocks editor with toolbar](./public/ContentImage.png)

---

## Features

### Module catalogue

- **8 registered modules** in a single source of truth
  (`constants/module-registry.ts`) — the `/modules` page, the example pages, the documentation
  pages, and `public/llm.txt` all derive from it
- **4 live example routes** today: comment, content, document, presentation — each rendered
  through one shared `ExamplePageTemplate`
- **Per-module extension presets** — 9 presets in `constants/EditorExtension.tsx`
  (`DEFAULT`, `COMPLEX`, `BLOG`, `DOCUMENT`, `COMMENT`, `PRESENTATION`, `MARKDOWN`, `LEGAL`,
  `WIKI`)
- **Per-module toolbar** — 41 declarative menu items across
  `constants/EditorMenuOptions.ts`, dispatched by a polymorphic `ToolbarItem`
  (buttons, dropdowns, inputs, dialog triggers)

### Architecture

- **Single provider** — `EditorContext` owns the one TipTap instance and swaps the extension
  preset when the module changes; content is preserved per module
- **Engine-agnostic contract** — every module declares its `engine`; an adapter seam
  (`src/adapters/`) is in place for non-TipTap engines
- **Single instance invariant** — the provider is mounted once in `app/layout.tsx`; a second
  provider would desynchronise the toolbar

### Platform

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript 5** (strict)
- **Tailwind CSS 4** + **shadcn/ui** / Radix primitives
- **TipTap v3.31** headless editor core
- Dark/light theme, keyboard-accessible toolbar, WCAG-minded semantics

---

## Modules

| Module           | Status    | Engine   | Live demo                |
| ---------------- | --------- | -------- | ------------------------ |
| Comment Editor   | `stable`  | TipTap   | `/examples/comment`      |
| Content Editor   | `stable`  | TipTap   | `/examples/content`      |
| Document Editor  | `stable`  | TipTap   | `/examples/docs`         |
| Presentation     | `beta`    | TipTap   | `/examples/presentation` |
| Markdown Editor  | `stable`  | TipTap   | — (route pending)        |
| Legal Editor     | `stable`  | TipTap   | — (route pending)        |
| Wiki Editor      | `beta`    | TipTap   | — (route pending)        |
| Lexical Editor   | `planned` | Lexical  | — (scaffold only)        |

> **Known gap:** the Markdown, Legal, Wiki, and Lexical modules are registered and documented,
> but their `/examples/*` routes are not implemented yet — their registry `href`s currently
> 404. The Markdown/Legal/Wiki presets exist in `EditorExtension.tsx` but are not yet wired
> into the `EditorContext` preset map (those ids fall back to `DEFAULT_EXTENSIONS`). The
> Lexical module is a scaffold: `src/adapters/lexicalAdapter.ts` defines the adapter seam and
> a partial implementation, and `LEXICAL_EXTENSIONS` does not exist yet.

---

## Quick start

Requirements: **Node.js ≥ 20**, **npm ≥ 10**.

```bash
git clone https://github.com/coderooz/Editor-Blocks.git
cd Editor-Blocks
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

```bash
npm run dev        # development server (Turbopack)
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint
npm run typecheck  # tsc --noEmit
```

---

## Routes

| Route                          | What it is                                              |
| ------------------------------ | ------------------------------------------------------- |
| `/`                            | Landing page with the live module switcher demo         |
| `/modules`                     | Module catalogue, generated from the registry           |
| `/examples`                    | Index of live demos                                     |
| `/examples/{comment,content,docs,presentation}` | One demo per shipped module            |
| `/documentation`               | Docs home (getting started, modules, API, architecture) |
| `/llm.txt`, `/llms-full.txt`   | Machine-readable manifests for AI agents                |

---

## Project structure

```
app/                    # App Router pages (/, /modules, /examples/*, /documentation/*)
components/
  EditorPage.tsx        # Public mounting surface: toolbar + editing area
  EditorMenuBar.tsx     # Toolbar: groups menu definitions, dispatches by item type
  toolbar/ToolbarItem.tsx  # Polymorphic renderer (button/dropdown/input/dialog)
  examples/             # ExamplePageTemplate + preview/install helpers
  modules/              # ModulesCatalogue
  layout/, ui/, ...     # Header/Footer and shadcn/ui primitives
constants/
  module-registry.ts    # SSOT: every module's id, engine, status, href, preset
  EditorExtension.tsx   # 9 extension presets
  EditorMenuOptions.ts  # 41 toolbar item definitions
  sample-content.ts     # Seed HTML for each demo
context/EditorContext.tsx  # Single provider, preset map, per-module content
src/adapters/           # Engine adapter seam (Lexical scaffold)
plugin/                 # Standalone npm-package scaffold (not published)
public/                 # Static assets + llm.txt / llms-full.txt manifests
.workspace/PRI/         # Project Reference Index (committed reference system)
.workspace/LFI/         # Logic Flow Index (committed reference system)
```

---

## Using a module

```tsx
// app/layout.tsx — mount the provider exactly once
import { EditorProvider } from "@/context/EditorContext";

// any page — pick the module by id
import EditorPage from "@/components/EditorPage";

export default function CommentsPage() {
  return <EditorPage type="comment" initialContent="<p>Hello</p>" />;
}
```

`EditorPage` resolves the extension preset and toolbar for the id internally. Read the full
API in the [documentation](https://editor-blocks.vercel.app/documentation).

---

## AI agents

This repository is machine-readable by intent:

- [`public/llm.txt`](./public/llm.txt) — canonical project map (start here)
- [`public/llms-full.txt`](./public/llms-full.txt) — full API/usage reference
- `.workspace/PRI/PROJECT_REFERENCE_INDEX.md` — file-level reference index
- `.workspace/LFI/LOGIC_FLOW_INDEX.md` — behavioural flows and invariants

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Quality gates before any commit:

```bash
npm run lint && npm run typecheck && npm run build
```

## License

[MIT](./LICENSE) © Ranit Saha (Coderooz)

- Repository: https://github.com/coderooz/Editor-Blocks
- Site: https://editor-blocks.vercel.app
- Issues: https://github.com/coderooz/Editor-Blocks/issues
