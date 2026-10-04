/**
 * @file /lib/highlight.ts
 * @description Server-side syntax highlighting for documentation code blocks.
 * @architecture Server-only Utility Module (no React, no "use client")
 * @ai-agent This module MUST stay server-side. Highlighting runs at build time on the server
 *            and emits static HTML, so highlight.js never reaches the client bundle. Adding
 *            "use client" or importing this from a client component would pull the entire
 *            highlighter into the browser and bloat every docs page.
 * @ai-agent Only the languages registered in LANGUAGES below are available. Registering all of
 *            highlight.js is unnecessary here — the docs snippets are TypeScript, shell, JSON,
 *            CSS, HTML, Markdown, and diffs. Add an entry when a new snippet language appears.
 * @ai-agent The returned value is a hast tree, rendered by components/docs/CodeBlock.tsx into
 *            React elements. Nothing here produces an HTML string, so there is no
 *            dangerouslySetInnerHTML anywhere in the docs pipeline.
 * @dependencies Requires lowlight (ESM) and highlight.js language definitions.
 */

import { createLowlight } from "lowlight";
import type { LanguageFn } from "highlight.js";
import typescript from "highlight.js/lib/languages/typescript";
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import markdown from "highlight.js/lib/languages/markdown";
import diff from "highlight.js/lib/languages/diff";

/**
 * A minimal hast node as produced by lowlight.
 * @ai-agent Only the fields the renderer actually reads are typed. `properties` is narrowed
 *            to className because that is the only attribute highlight.js emits on spans.
 */
export interface HastNode {
  type: "root" | "element" | "text";
  tagName?: string;
  value?: string;
  properties?: { className?: string[] };
  children?: HastNode[];
}

/**
 * Languages registered with the highlighter.
 * @ai-agent Keep this list minimal — every entry is bundled into the server build.
 */
const LANGUAGES: Record<string, LanguageFn> = {
  typescript,
  javascript,
  bash,
  json,
  css,
  xml,
  markdown,
  diff,
};

const lowlight = createLowlight(LANGUAGES);

/**
 * Maps the language labels used in documentation to registered grammar names.
 * @ai-agent Documentation should use the friendly label (e.g. "tsx"); this table resolves it.
 *            highlight.js has no separate tsx grammar — JSX is part of the typescript and
 *            javascript grammars.
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  ts: "typescript",
  tsx: "typescript",
  typescript: "typescript",
  js: "javascript",
  jsx: "javascript",
  javascript: "javascript",
  sh: "bash",
  shell: "bash",
  bash: "bash",
  json: "json",
  css: "css",
  html: "xml",
  xml: "xml",
  svg: "xml",
  md: "markdown",
  markdown: "markdown",
  diff: "diff",
  patch: "diff",
  text: "plaintext",
  txt: "plaintext",
  plaintext: "plaintext",
};

/** Language labels a reader would recognise but the grammar table does not have. */
const DISPLAY_LABELS: Record<string, string> = {
  typescript: "TypeScript",
  javascript: "JavaScript",
  bash: "Shell",
  json: "JSON",
  css: "CSS",
  xml: "HTML",
  markdown: "Markdown",
  diff: "Diff",
  plaintext: "Text",
};

/** Resolves a documentation language label to a registered grammar name. */
export function resolveLanguage(language?: string): string {
  if (!language) return "plaintext";
  return LANGUAGE_ALIASES[language.toLowerCase()] ?? "plaintext";
}

/** Human-readable label for the badge shown in the code block header. */
export function languageLabel(language?: string): string {
  return DISPLAY_LABELS[resolveLanguage(language)] ?? "Text";
}

/**
 * Highlights `code` and returns a hast tree.
 *
 * @ai-agent Plain text short-circuits before the highlighter runs: there is no `plaintext`
 *            grammar registered (it is not a real highlight.js language), and a single text
 *            node is both correct and cheaper.
 * @ai-agent Falls back to auto-detection, then to a single plain text node, so an
 *            unrecognised or malformed language never throws during the build. A throw here
 *            would take down every static docs page.
 */
export function highlightCode(code: string, language?: string): HastNode {
  const resolved = resolveLanguage(language);

  if (resolved === "plaintext") {
    return { type: "root", children: [{ type: "text", value: code }] };
  }

  try {
    return lowlight.highlight(resolved, code) as HastNode;
  } catch {
    try {
      return lowlight.highlightAuto(code) as HastNode;
    } catch {
      return { type: "root", children: [{ type: "text", value: code }] };
    }
  }
}

/** True when the label resolves to a grammar we actually registered. */
export function isKnownLanguage(language?: string): boolean {
  if (!language) return false;
  return language.toLowerCase() in LANGUAGE_ALIASES;
}
