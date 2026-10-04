# Development Notes — TipTap-Editor

**Project:** TipTap-Editor  
**Version:** 1.0.0  
**Last Updated:** 2026-08-28  
**Author:** Ranit Saha (Coderooz)  
**Repository:** https://github.com/coderooz/TipTap-Editor

---

## Project Overview

TipTap-Editor is a **professional, production-ready TipTap rich-text editor showcase and reference implementation**. It serves three purposes simultaneously:

1. **Showcase** — Interactive demonstration of TipTap capabilities
2. **Reference Implementation** — Canonical patterns for TipTap feature integration
3. **Reusable Component Library** — Copy/adapt features for other projects

---

## Architecture Summary

### Core Stack
- **Framework:** Next.js 16 (App Router, Turbopack)
- **Runtime:** React 19 (Server Components by default)
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS 4 (CSS Variables, @theme inline)
- **UI Library:** shadcn/ui + Radix UI primitives
- **Editor:** TipTap v3.10.1
- **Icons:** Lucide React 0.548.0
- **Syntax Highlighting:** Lowlight
- **Collaboration Ready:** Yjs + y-protocols (dependencies removed from runtime; planned for a future module)

### Key Architectural Patterns

1. **Feature-First Organization** — Each TipTap capability in its own discoverable boundary
2. **Composable Extension Factory** — `createEditorExtensions({ features: [...] })` for selective inclusion
3. **Registry-Driven Systems** — Feature registry (SSOT), toolbar registry, bubble menu registry
4. **Context-Based State** — Single `EditorProvider` with `useEditor` hook, mode switching via key
5. **Configuration-Driven UI** — Declarative toolbar, bubble menus, dialogs

---

## Project Structure (Key Directories)

```
TipTap-Editor/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page with LiveEditorDemo
│   ├── demo/page.tsx             # Full playground
│   ├── features/                 # Feature explorer & detail pages
│   ├── comment/page.tsx          # Comment editor mode
│   ├── content/page.tsx          # Content/blog editor mode
│   ├── docs/page.tsx             # Documentation editor mode
│   ├── layout.tsx                # Root layout + providers
│   └── globals.css               # Tailwind v4 + CSS variables
├── components/
│   ├── editor/                   # Core editor components
│   ├── toolbar/                  # Toolbar system + registry
│   ├── bubble-menus/             # Bubble menus + registry
│   ├── dialogs/                  # Modal dialogs
│   ├── commands/                 # Command layer + registry
│   ├── showcase/                 # Showcase UI components
│   ├── ui/                       # shadcn/ui components
│   ├── LiveEditorDemo.tsx        # Landing page demo
│   └── ThemeToggle.tsx           # Dark/light toggle
├── constants/
│   ├── tiptap-feature-registry.ts # Feature registry (SSOT)
│   ├── EditorMenuOptions.ts      # Toolbar definitions
│   └── EditorStateOptions.ts     # Type definitions
├── context/
│   └── EditorContext.tsx         # Global editor state
├── editor/
│   ├── core/                     # Editor factory + config
│   ├── extensions/               # Feature-based extensions
│   ├── commands/                 # Command layer
│   ├── state/                    # State management
│   ├── serializers/              # HTML/JSON/Markdown
│   └── types/                    # Type definitions
├── features/                     # Feature-centric implementations
├── examples/                     # Minimal integration examples
├── docs/                         # Documentation
├── tests/                        # Test suite
├── lib/
│   └── utils.ts                  # cn() utility
├── public/                       # Static assets
├── .workspace/                   # Project workspace docs
├── PROJECT_REFERENCE_INDEX.md    # PRI (AI reference)
├── AGENTS.md                     # AI agent instructions
├── CHANGELOG.md
└── package.json
```

---

## Editor Modes (4)

| Mode | Route | Description | Extension Set |
|------|-------|-------------|---------------|
| `comment` | `/comment` | Minimal editor for comments | `COMMENT_EXTENSIONS` |
| `document` | `/docs` | Full-page editor for documents | `DOCUMENT_EXTENSIONS` |
| `content` | `/content` | Blog/post-style rich editor | `BLOG_EXTENSIONS` |
| `default` | `/` | Basic TipTap setup | `DEFAULT_EXTENSIONS` |

**Switching:** `setEditorType("document")` via `useEditorContext()`

---

## Extension Composition

### Factory Function
```typescript
import { createEditorExtensions } from "@/editor/core/extensions";

const extensions = createEditorExtensions({
  features: ["basicFormatting", "links", "images", "tables"],
});
```

### Preset Configurations
- `minimal` — Basic formatting + links
- `comment` — Minimal + character count (2500 limit)
- `default` — Basic + markdown links + text align + undo/redo
- `content` — Full blog editor (all features except character count)
- `document` — Full document editor (all features + character count)

---

## Key Components

### EditorContext (`context/EditorContext.tsx`)
- Global editor state via React Context
- `useEditorContext()` hook for access
- Manages: `editor`, `editorType`, `editorContent`, `charCount`
- Mode switching via `key=[editorType]` for full reinitialization
- `immediatelyRender: false` prevents hydration mismatch

### Toolbar System (`components/toolbar/`)
- **Registry-based** — Features declare toolbar contributions
- **Types:** `button`, `dropdown`, `input`, `model`, `custom`
- **Groups:** `history`, `styling`, `fonts`, `insert`, `lists`, `alignment`, `table`, `file`

### Bubble Menus (`components/bubble-menus/`)
- **BaseBubbleMenu** — Shared styling + positioning
- **Registry-based** — Node type → menu component mapping
- **Menus:** Text, Image, Table, YouTube

### Feature Registry (`constants/tiptap-feature-registry.ts`)
- **Single Source of Truth** for all features
- Includes: identity, category, extensions, dependencies, paths, reusability score
- Drives: toolbar, bubble menus, docs, examples, explorer

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

# Linting
npm run lint

# Type checking
npm run typecheck

# Husky setup
npm run prepare
```

---

## Quality Gates (Pre-commit via Husky)

```bash
npm run lint        # ESLint passes
npm run typecheck   # TypeScript strict passes
npm run build       # Production build passes
```

---

## Git Workflow

- **Branch:** `main` (protected)
- **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `ci:`, `perf:`)
- **PR Required:** Yes, for all changes to main
- **Reviews:** At least 1 approval required

---

## Deployment

- **Platform:** Vercel
- **Production URL:** https://tiptap-editor.vercel.app
- **Auto-deploy:** Push to `main` → production; PR → preview
- **Vercel Project:** `coderooz-projects/tiptap-editor`

---

## Testing Strategy (In Progress)

| Layer | Tool | Target |
|-------|------|--------|
| Unit | Vitest | 80% |
| Integration | Vitest | 70% |
| E2E | Playwright | Critical paths |
| Accessibility | axe-core | 100% critical |
| Visual | Chromatic | Key states |

---

## Accessibility

- WCAG 2.1 AA compliance target
- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals
- Color contrast compliance
- Reduced motion support

---

## Performance

- `immediatelyRender: false` in TipTap
- Dynamic imports for heavy components
- Memoized editor extensions
- Optimized images with `next/image`
- Bundle analysis via `@next/bundle-analyzer`

---

## Security

- No secrets in code
- Input validation on all user inputs
- HTML sanitization for editor output (DOMPurify recommended)
- CSP headers via `next.config.ts`
- Rate limiting for API routes (when added)

---

## Known Issues / Technical Debt

1. **Test Suite** — In progress (Vitest + Playwright setup)
2. **CI/CD Pipeline** — GitHub Actions planned
3. **Dependabot** — Configuration planned
4. **Error Boundaries** — Not yet implemented
5. **Analytics** — Not configured
6. **Collaborative Editing** — Yjs deps installed, demo planned
7. **Command Palette** — cmdk installed, integration pending
8. **Markdown Export** — Only input rule implemented, full export pending

---

## Future Enhancements (Prioritized)

1. Complete test suite (Vitest + Playwright)
2. CI/CD pipeline with GitHub Actions
3. Dependabot for dependency updates
4. Error boundaries
5. Analytics integration
6. Collaborative editing (Yjs) demo
7. More editor modes
8. Accessibility audit (WCAG 2.1 AA)
9. Dark mode support
10. Keyboard shortcuts documentation
11. Command palette (cmdk integration)
12. Full Markdown import/export

---

## Important Files for AI Context

When working on this project, read in this order:

1. `AGENTS.md` — Project-specific AI instructions
2. `PROJECT_REFERENCE_INDEX.md` — Full project reference
3. `context/EditorContext.tsx` — Core state management
4. `constants/tiptap-feature-registry.ts` — Feature registry (SSOT)
5. `constants/EditorExtension.tsx` — TipTap extension configs
5. `constants/EditorMenuOptions.ts` — Toolbar configuration
6. `components/editor/EditorCore.tsx` — Main editor component
7. `components/toolbar/Toolbar.tsx` — Toolbar rendering
8. `components/bubble-menus/*.tsx` — Context menus
9. `components/extensions/*.ts` — Custom extensions
10. `components/dialogs/*.tsx` — Modal dialogs

---

## Contact

**Author:** Ranit Saha (Coderooz)  
**Email:** contact@coderooz.in  
**Website:** https://coderooz.in  
**GitHub:** https://github.com/coderooz  
**Repository:** https://github.com/coderooz/TipTap-Editor  
**Live Demo:** https://tiptap-editor.vercel.app