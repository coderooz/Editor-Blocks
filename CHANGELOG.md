# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-10-07

The Editor Blocks release cycle: 2026-10-04 (rename) through 2026-10-07 (stabilisation).
Version 0.3.0 was set at the rename commit (`7dff887`); there was never an 0.2.0.

### Added
- **Module registry (SSOT)** at `constants/module-registry.ts` — 8 modules declaring id,
  title, engine, status, href, docs, and extension-set name; the catalogue, examples index,
  documentation pages, and `llm.txt` all derive from it
- **`/modules` catalogue page** generated from the registry
- **`/examples` index + 4 example routes** (comment, content, docs, presentation), all
  rendered through one shared `ExamplePageTemplate` with seed content, live output preview,
  and copy-paste install guide
- **Documentation section** (`/documentation`): getting started, module reference
  (per-module pages generated from the registry), API, architecture, custom modules,
  references, roadmap
- **AI manifests**: `public/llm.txt` (canonical map) and `public/llms-full.txt` (full
  reference) served from the site root
- **Multi-engine foundation** (`3773ecb`): `engine` field + `ENGINE_LABELS` in the registry,
  engine-neutral seam in `EditorContext`, `src/adapters/` directory with the
  `EditorAdapter` interface, and a `lexical` ^0.52.0 dependency
- **Lexical adapter scaffold** (`e77328c`, `1b9e525`): partial implementation in
  `src/adapters/lexicalAdapter.ts`; `lexical` module registered as `status: "planned"`
- **Toolbar refactor** (`3773ecb`): polymorphic `components/toolbar/ToolbarItem.tsx`
  extracted from `EditorMenuBar`; `MENU_BY_TYPE` is now a total map over `EditorType`
  (a `presentation` toolbar regression previously fell through to the default menu at runtime)
- **Per-module content preservation** in `EditorContext` (`moduleContents`) — switching
  modules keeps each module's draft (undo history is not preserved)
- **Sample-content registry** (`constants/sample-content.ts`) with per-module seed HTML
- **New presets**: `MARKDOWN_EXTENSIONS`, `LEGAL_EXTENSIONS`, `WIKI_EXTENSIONS` (defined;
  not yet wired — see Known gaps)
- Custom cross-browser scrollbar styling (`136dd8e`)
- Committed reference systems: `.workspace/PRI/` (Project Reference Index) and
  `.workspace/LFI/` (Logic Flow Index + diagrams)

### Changed
- **Project renamed** from `tiptap-editor` (TipTap-Editor) to `editor-blocks` (Editor Blocks)
  (`7dff887`)
- **Version**: 1.0.0 → 0.3.0 — a deliberate reset to pre-1.0 for the new product identity
  (a module catalogue, not a versioned editor core)
- **Repository**: `coderooz/TipTap-Editor` → `coderooz/Editor-Blocks`
- **Deployment URL**: `tiptap-editor.vercel.app` → `editor-blocks.vercel.app`
- `EditorType` is now `ModuleId | "default"` — derived from the registry instead of a
  hand-maintained string union
- Documentation rewritten to match the shipped architecture: README, AGENTS.md,
  DEVELOPMENT_NOTES.md, CONTRIBUTING.md, SECURITY.md, PRI, LFI, `opencode.jsonc`
  descriptions, and CODEOWNERS paths

### Fixed
- **GitHub Actions failing at 0s (all runs, 0 jobs)**: step-level `if:` used the `secrets`
  context, which is illegal there — GitHub rejected the entire workflow before starting any
  job. Secrets are now mapped to job-level `env:` and tested with `env.X != ''` at step level;
  deploy steps skip cleanly while no secrets are configured
- **Lint errors**: type-only imports (`Editor`, `MenuItem`, `LexicalEditor`) now use
  `import type`; `npm run lint` passes with 0 errors
- TypeScript build errors and the Lexical adapter type issues (`1b9e525`)
- `CODEOWNERS` referenced non-existent `/docs/` and `.eslintrc.json` (actual: `app/documentation/`
  and `eslint.config.mjs`)
- `opencode.jsonc` agent descriptions still said "Simple-Tiptap-editor", and its
  `instructions` array pointed at a root `PROJECT_REFERENCE_INDEX.md` that was deleted when
  the PRI moved into `.workspace/PRI/`

### Known gaps (documented, not fixed)
- `/examples/*` routes missing for `markdown`, `legal`, `wiki`, `lexical` (registry hrefs 404)
- `markdown`/`legal`/`wiki` presets unwired in `EditorContext` (fall back to
  `DEFAULT_EXTENSIONS`); `LEXICAL_EXTENSIONS` referenced by the registry does not exist
- No automated test suite (`npm test --if-present` is a no-op)

## [1.0.0] - 2026-08-28

### Added
- **Project renamed** from `simple-tiptap-editor` to `tiptap-editor` (TipTap-Editor)
- Professional repository configuration with GitHub Actions CI/CD pipeline
- GitHub Issues, PR templates, and milestone tracking
- Contributing guidelines, Code of Conduct, Security policy
- MIT License
- Comprehensive PROJECT_REFERENCE_INDEX.md (PRI) for AI reference
- AGENTS.md with project-specific AI agent instructions
- Feature registry (SSOT) at `constants/tiptap-feature-registry.ts`
- Professional README with complete documentation
- DEVELOPMENT_NOTES.md for development context

### Changed
- **Project name**: `simple-tiptap-editor` → `tiptap-editor` (TipTap-Editor)
- **Version**: 0.1.0 → 1.0.0 (production-ready release)
- **Repository**: `coderooz/Simple-Tiptap-editor` → `coderooz/TipTap-Editor`
- **Deployment URL**: `simple-tiptap-editor.vercel.app` → `tiptap-editor.vercel.app`
- **Package name**: `simple-tiptap-editor` → `tiptap-editor`
- Updated all documentation references to new project name
- Updated package.json with professional metadata, keywords, and repository info
- Updated PROJECT_REFERENCE_INDEX.md (PRI) with new project identity
- Updated AGENTS.md with new project name and references

### Fixed
- TypeScript strict mode compliance across codebase
- ESLint warnings resolved (unused imports, explicit any types)
- Build configuration optimized for production

## [0.1.0] - 2025-10-30

### Added
- Initial release of Simple-Tiptap-editor
- Next.js 15 (App Router) with TypeScript
- TipTap v3 integration
- Four editor modes: comment, document, content, default
- Dynamic menu bar with toolbar buttons
- Context-aware bubble menus (text, image, table, YouTube)
- Custom extensions: ImageResizable, FontFamily, FontSize, MarkDownLink
- Modal dialogs for image, link, YouTube, import/export
- shadcn/ui component library integration
- Tailwind CSS 4 styling
- Lucide React icons
- Editor context API for global state management
- Import/Export functionality (HTML/JSON)
- Vercel deployment configuration

### Editor Modes
- **Comment** - Minimal editor for comments
- **Document** - Full-page editor for documents
- **Content** - Blog/post-style rich editor
- **Default** - Basic TipTap setup

### Extensions Included
- StarterKit
- Blockquote, Bold, Code, CodeBlockLowlight
- Collaboration, Details, DragHandle, DragHandleReact
- FileHandler, Heading, Highlight, HorizontalRule
- Image, Italic, Link, List, NodeRange
- Paragraph, Placeholder, Strike, Subscript, Superscript
- Table, Text, TextAlign, TextStyle, Typography
- Underline, YouTube
- Custom: FontFamily, FontSize, ImageResizable, MarkDownLink

---

## Release Template

### [Version] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes in existing functionality

#### Deprecated
- Soon-to-be removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Security improvements