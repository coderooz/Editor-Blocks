/**
 * @file /components/docs/DocsCode.tsx
 * @description Code block, callout, and table primitives for the documentation section.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent DocsCode is a thin wrapper over <CodeBlock />, which owns the highlighting and the
 *            copy button. Change presentation in CodeBlock, not here. This wrapper exists so
 *            call sites read as prose ("a terminal snippet") rather than as UI concerns.
 * @ai-agent Supported language labels are resolved in lib/highlight.ts. Passing an
 *            unregistered label degrades to plain text rather than failing the build — if a
 *            snippet renders unhighlighted, check that alias table first.
 * @ai-agent DocsCode escapes nothing and accepts a plain string. Never pass pre-rendered HTML.
 */

import type { ReactNode } from "react";
import { Info, TriangleAlert, CircleCheck } from "lucide-react";
import { CodeBlock } from "./CodeBlock";

export function DocsCode({
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
  return (
    <CodeBlock
      code={code}
      language={language}
      showLineNumbers={showLineNumbers}
      // Spread conditionally: this project sets exactOptionalPropertyTypes, so passing
      // `title={undefined}` explicitly is not the same as omitting the prop.
      {...(title ? { title } : {})}
    />
  );
}

const CALLOUT_STYLES = {
  info: {
    icon: Info,
    className: "border-blue-500/30 bg-blue-500/5 text-blue-900 dark:text-blue-200",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-amber-500/30 bg-amber-500/5 text-amber-900 dark:text-amber-200",
  },
  success: {
    icon: CircleCheck,
    className: "border-emerald-500/30 bg-emerald-500/5 text-emerald-900 dark:text-emerald-200",
  },
} as const;

export function DocsCallout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof CALLOUT_STYLES;
  title?: string;
  children: ReactNode;
}) {
  const { icon: Icon, className } = CALLOUT_STYLES[type];

  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${className}`}>
      <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
      <div className="min-w-0 text-sm leading-relaxed">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div>{children}</div>
      </div>
    </div>
  );
}

export function DocsTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            {headers.map((header) => (
              <th
                key={header}
                scope="col"
                className="px-4 py-2.5 text-left font-semibold text-foreground"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-4 py-2.5 text-muted-foreground align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Inline monospace span for prop names, types, and file paths. */
export function DocsInlineCode({ children }: { children: ReactNode }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.8em] text-foreground">
      {children}
    </code>
  );
}
