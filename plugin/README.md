# @coderooz/tiptap-editor

> **Status: scaffold — NOT published to npm.** This directory is a standalone package
> scaffold kept as a reference for eventually publishing the Editor Blocks editor as a
> library. `npm install @coderooz/tiptap-editor` will fail until it is published. It has its
> own `package.json` and `tsup` build, is not part of the Next.js app build, and is
> independent of the site's `editor-blocks` package version.

Ready-to-use TipTap editor components for Next.js projects. Like shadcn/ui, but for rich text editors.

## Installation

```bash
npm install @coderooz/tiptap-editor
```

## Quick Start

### 1. Wrap your app with the EditorProvider

```tsx
// app/layout.tsx
import { EditorProvider } from "@coderooz/tiptap-editor";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <EditorProvider>{children}</EditorProvider>
      </body>
    </html>
  );
}
```

### 2. Use the editor component

```tsx
// app/page.tsx
"use client";

import { Editor } from "@coderooz/tiptap-editor";

export default function Page() {
  return <Editor type="comment" />;
}
```

## Editor Types

| Type | Use Case | Extensions |
|------|----------|------------|
| `comment` | Minimal comments | Basic formatting, lists, code |
| `content` | Blog/posts | Full formatting, images, YouTube, tables |
| `document` | Full documents | All content features + import/export + char count |

## API

### Editor Props

```tsx
interface EditorProps {
  type: "comment" | "content" | "document";
  initialContent?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  className?: string;
}
```

### useEditorContext Hook

```tsx
const { editor, editorType, charCount, setEditorContent } = useEditorContext();
```

## License

MIT
