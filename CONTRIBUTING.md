# Contributing to Editor Blocks

Thank you for your interest in contributing to Editor Blocks! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Style](#code-style)
- [Testing](#testing)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Editor-Blocks.git
   cd Editor-Blocks
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/coderooz/Editor-Blocks.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```

## Development Setup

### Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Git

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Type checking (tsc --noEmit)
```

## Making Changes

### Branch Naming

Use descriptive branch names following this pattern:

- `feat/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `chore/description` - Maintenance tasks
- `test/description` - Adding tests

### Editor Modules

When making changes to the editor, test all shipped modules:

1. **Comment** (`/examples/comment`) - Minimal editor for comments
2. **Content** (`/examples/content`) - Blog/post-style rich editor
3. **Document** (`/examples/docs`) - Full-featured document editor
4. **Presentation** (`/examples/presentation`) - Slide-shaped content (beta)
5. **Default** (`/`) - Basic editor on the landing demo

Plus the module switcher on `/` and the catalogue at `/modules`. See the "Known Gaps"
section of `AGENTS.md` for modules that are registered but not yet fully shipped.

### Adding New Features

1. Check existing patterns in `components/`, `constants/`, `context/`
2. Follow shadcn/ui component patterns for new UI
3. Add new extensions to `constants/EditorExtension.tsx`
4. Add new toolbar items to `constants/EditorMenuOptions.ts`
5. Register new modules in `constants/module-registry.ts` (single source of truth)

### Adding New Toolbar Buttons

1. Add icon import to `EditorMenuOptions.ts`
2. Add button config to appropriate group
3. Define `isActive` and `action` functions

### Adding New TipTap Extensions

1. Create extension in `components/extensions/`
2. Export from `constants/EditorExtension.tsx`
3. Add to relevant extension arrays

## Commit Guidelines

This project follows [Conventional Commits](https://www.conventionalcommits.org/).

### Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `refactor` - Code refactoring
- `chore` - Maintenance tasks
- `docs` - Documentation updates
- `test` - Adding tests
- `style` - Code style changes
- `perf` - Performance improvements

### Examples

```
feat(modules): add wiki module route
fix(toolbar): restore document menu grouping
refactor(context): simplify preset map
docs(readme): update installation instructions
```

## Pull Request Process

1. Ensure your branch is up to date with `main`:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. Run quality checks:
   ```bash
   npm run lint
   npm run typecheck
   npm run build
   ```

3. Push your branch:
   ```bash
   git push origin your-branch-name
   ```

4. Create a Pull Request on GitHub:
   - Use the PR template
   - Fill out all required fields
   - Link related issues
   - Request review from maintainers

5. Address review feedback:
   - Make requested changes
   - Push updates to your branch
   - Respond to comments

6. Once approved, a maintainer will merge your PR.

### PR Requirements

- All CI checks must pass
- At least 1 approval required
- No merge conflicts
- Follow commit conventions
- Update documentation if needed

## Code Style

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

- Components: PascalCase (`EditorPage.tsx`)
- Utilities: camelCase (`utils.ts`)
- Constants: PascalCase (`EditorExtension.tsx`)
- Types: PascalCase with `Type` suffix (`EditorType`)

## Testing

Currently, no test framework is configured. When adding tests:

- Unit: Vitest for utilities and hooks
- Integration: Playwright for editor flows
- Visual: Chromatic for UI components
- E2E: Playwright for critical user journeys

## Reporting Issues

Before creating an issue:

1. Check existing issues to avoid duplicates
2. Use the issue templates
3. Provide clear reproduction steps
4. Include environment details

### Issue Types

- **Bug Report** - Something isn't working
- **Feature Request** - New functionality
- **Documentation** - Improvements to docs
- **Question** - General questions

## Questions?

Feel free to open an issue with the "Question" label or reach out to the maintainers.

---

**Thank you for contributing!** 🎉