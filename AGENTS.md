# AGENTS.md — TipTap-Editor

> Project-specific instructions for AI agents working on this repository.

---

## Project Identity

- **Name:** TipTap-Editor
- **Type:** Next.js 16 + TipTap v3 Rich Text Editor Showcase & Reference Implementation
- **Author:** Ranit Saha (Coderooz)
- **Repository:** https://github.com/coderooz/TipTap-Editor
- **Deployment:** https://tiptap-editor.vercel.app

---

## Technology Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI:** React 19, Tailwind CSS 4, shadcn/ui
- **Editor:** TipTap v3.10.1
- **Icons:** Lucide React
- **Package Manager:** npm

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
npx tsc --noEmit
```

---

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── page.tsx                  # Landing page with live demo
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
│   └── EditorContext.tsx         # Global editor state (Provider + Hook)
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
│   └── utils.ts                  # Utility functions (cn)
└── public/                       # Static assets
```

---

## Editor Architecture

### Editor Modes (4 types)

| Mode | Use Case | Extensions |
|------|----------|------------|
| `comment` | Minimal comments | `COMMENT_EXTENSIONS` |
| `document` | Full documents | `DOCUMENT_EXTENSIONS` |
| `content` | Blog/posts | `BLOG_EXTENSIONS` |
| `default` | Basic editor | `DEFAULT_EXTENSIONS` |

### Key Components

1. **EditorContext.tsx** — Global state provider with `useEditorContext()` hook
2. **components/editor/EditorCore.tsx** — Minimal editor wrapper
3. **components/toolbar/Toolbar.tsx** — Dynamic toolbar from registry
4. **components/bubble-menus/BubbleMenuRegistry.tsx** — Bubble menu registry
5. **Custom Extensions** — ImageResizable, FontFamily, FontSize, MarkDownLink
6. **Feature Registry** — `constants/tiptap-feature-registry.ts` (SSOT)

---

## Code Conventions

### TypeScript
- Strict mode enabled
- Prefer `interface` over `type` for object shapes
- Use `const` over `let`, never `var`
- Avoid `any` — use `unknown` with type guards
- Use optional chaining (`?.`) and nullish coalescing (`??`)

### React/Next.js
- Server Components by default
- `'use client'` only when needed (interactivity, browser APIs, context)
- Colocate styles, tests, types with components
- Use `next/image` for images

### Styling
- Tailwind CSS 4 with CSS variables
- shadcn/ui patterns: `cva()` for variants, `cn()` for class merging
- Use `clsx` + `tailwind-merge` via `lib/utils.ts`

### File Naming
- Components: PascalCase (`EditorCore.tsx`)
- Utilities: camelCase (`utils.ts`)
- Constants: PascalCase (`EditorExtension.tsx`)
- Types: PascalCase with `Type` suffix (`EditorType`)

---

## Git Workflow

- **Branch:** `main` (protected)
- **Commits:** Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`, `test:`, `style:`, `perf:`)
- **PR Required:** Yes, for all changes to main
- **Reviews:** At least 1 approval required

---

## Quality Gates

Before committing/pushing:
1. `npm run lint` — passes
2. `npx tsc --noEmit` — passes
3. `npm run build` — passes
4. No console.log in production code
5. No commented-out code blocks

---

## Agent Instructions

### When Adding Features
1. Check existing patterns in `components/`, `constants/`, `context/`, `editor/`
2. Follow shadcn/ui component patterns for new UI
3. Add new extensions to `editor/extensions/` and register in feature registry
4. Add new toolbar items via toolbar registry
5. Update feature registry (`constants/tiptap-feature-registry.ts`)

### When Fixing Bugs
1. Reproduce locally first
2. Check EditorContext for state management issues
3. Verify TipTap extension configurations
4. Test all 4 editor modes

### When Refactoring
1. Maintain backward compatibility
2. Update all 4 editor modes if changing extensions
3. Test bubble menus for affected nodes
4. Verify import/export functionality
5. Update feature registry and documentation

---

## Common Tasks

### Add New Toolbar Button
1. Add feature to toolbar registry (`components/toolbar/registry.ts`)
2. Define `isActive` and `action` functions
3. Register in feature registry

### Add New TipTap Extension
1. Create extension in `editor/extensions/{category}/`
2. Export from `editor/extensions/index.ts`
3. Add to `createEditorExtensions` factory
4. Register in feature registry

### Add New Editor Mode
1. Add mode to `EditorType` in `EditorContext.tsx`
2. Create extension preset in `editor/core/extensions.ts`
3. Add case to extensions map in `EditorContext.tsx`
4. Create page in `app/<mode>/page.tsx`
5. Register in feature registry

---

## Testing Strategy

- Unit: Vitest for utilities and hooks
- Integration: Playwright for editor flows
- Visual: Chromatic for UI components
- E2E: Playwright for critical user journeys
- Accessibility: axe-core for WCAG compliance

---

## Deployment

- **Platform:** Vercel
- **Trigger:** Push to `main`
- **Preview:** Automatic for PRs
- **Environment:** Production on `main`, Preview on PRs
- **Project:** `coderooz-projects/tiptap-editor`

---

## Security

- No secrets in code
- Validate all user inputs
- Sanitize HTML output from editor (DOMPurify recommended)
- Rate limit API routes (when added)
- CSP headers via `next.config.ts`

---

## Accessibility

- Semantic HTML
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals
- Color contrast compliance (WCAG 2.1 AA)

---

## Performance

- Dynamic imports for heavy components
- `immediatelyRender: false` in TipTap
- Memoize editor extensions
- Optimize images with `next/image`
- Bundle analysis via `@next/bundle-analyzer`

---

## References

- [TipTap Documentation](https://tiptap.dev/)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PROJECT_REFERENCE_INDEX.md](./PROJECT_REFERENCE_INDEX.md)
- [DEVELOPMENT_NOTES.md](./DEVELOPMENT_NOTES.md)
- [CHANGELOG.md](./CHANGELOG.md)

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
