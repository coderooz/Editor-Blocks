/**
 * @file /components/docs/CodeBlock.tsx
 * @description Syntax-highlighted, copyable code block for the documentation section.
 * @architecture Next.js App Router (Server Component) with one client leaf (CopyButton)
 * @ai-agent Pipeline: lib/highlight.ts produces a hast tree on the server, renderHast()
 *            converts it to React elements, and CopyButton is the only client boundary.
 *            Do not introduce dangerouslySetInnerHTML — hast text nodes are rendered as React
 *            text, which escapes them automatically.
 * @ai-agent Token colours come from the .hljs-* rules in app/globals.css. If you change class
 *            names here, change them there too; the highlighter emits standard highlight.js
 *            class names and the stylesheet is what maps them to theme colours.
 * @ai-agent The value passed to CopyButton is the raw source, not the highlighted HTML, so
 *            copying yields clean text with no markup.
 */

import type { ReactNode } from "react";
import { highlightCode, languageLabel, type HastNode } from "@/lib/highlight";
import { CopyButton } from "./CopyButton";

/**
 * Recursively renders a hast tree into React elements.
 *
 * @ai-agent highlight.js only emits text nodes and span elements carrying a className. Any
 *            other node type is rendered as its children so an unexpected shape degrades to
 *            plain text rather than throwing during the static build.
 */
function renderHast(node: HastNode, key: number): ReactNode {
  if (node.type === "text") {
    return node.value ?? "";
  }

  if (node.type === "element") {
    const className = node.properties?.className?.join(" ");
    return (
      <span key={key} className={className}>
        {node.children?.map((child, i) => renderHast(child, i))}
      </span>
    );
  }

  return node.children?.map((child, i) => renderHast(child, i));
}

export function CodeBlock({
  code,
  language = "bash",
  title,
  showLineNumbers = false,
}: {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}) {
  const source = code.replace(/\s+$/, "");
  const tree = highlightCode(source, language);
  const label = languageLabel(language);
  const lines = source.split("\n");

  return (
    <figure className="not-prose my-4 overflow-hidden rounded-lg border bg-muted/40">
      {/* Header: optional filename/title on the left, language + copy on the right. */}
      <div className="flex items-center justify-between gap-3 border-b bg-muted/60 px-3 py-1.5">
        <figcaption className="min-w-0 truncate text-xs font-medium text-muted-foreground">
          {title}
        </figcaption>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground/70">
            {label}
          </span>
          <CopyButton value={source} />
        </div>
      </div>

      <pre className="hljs-surface overflow-x-auto p-4 text-xs leading-relaxed">
        <code className="hljs font-mono">
          {showLineNumbers
            ? lines.map((line, i) => (
                <span key={i} className="table-row">
                  <span className="table-cell select-none pr-4 text-right text-muted-foreground/40">
                    {i + 1}
                  </span>
                  <span className="table-cell">
                    {renderHast({ type: "text", value: line }, 0)}
                  </span>
                </span>
              ))
            : renderHast(tree, 0)}
        </code>
      </pre>
    </figure>
  );
}
