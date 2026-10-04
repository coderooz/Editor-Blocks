/**
 * @file /constants/sample-content.ts
 * @description Pre-filled HTML seeded into each module's editor on the example pages, so a
 *              visitor lands on a working document instead of an empty box.
 * @architecture Static Configuration Module (plain strings, no React)
 * @ai-agent These strings are the first real test of each module's schema. ProseMirror drops
 *            any node or mark it does not recognise, so a sample using a node outside its
 *            module's extension set silently loses that element on load. When you add a
 *            module, write its sample using only that module's preset — and if the sample
 *            looks right but something is missing, suspect a schema mismatch first.
 * @ai-agent The comment sample is deliberately short. Its preset enforces a 2,500 character
 *            limit (CharacterCount in nodeSize mode), so a longer sample would be truncated
 *            mid-paragraph and look like a rendering bug.
 * @ai-agent These strings are rendered with dangerouslySetInnerHTML in the example preview
 *            pane. That is acceptable here because the content is ours and the render is
 *            same-origin — but it is exactly the pattern you must NOT copy into an app that
 *            renders user-submitted HTML. Sanitise there (DOMPurify / sanitize-html).
 * @ai-agent TOP-LEVEL HEADINGS START AT <h2>, NOT <h1>. These samples are injected into the
 *            live editor on both the example pages and the landing-page demo. An <h1> inside
 *            the document produced a second <h1> on the page — invalid document outline and an
 *            SEO problem. Every heading level is still demonstrated because the samples
 *            continue down through h2 and h3.
 */

export interface SampleContent {
  /** The HTML seeded into the editor. */
  html: string;
  /** One-line description of what the sample demonstrates. */
  demonstrates: string;
}

export const SAMPLE_CONTENT: Record<string, SampleContent> = {
  /**
   * Comment — DEFAULT_EXTENSIONS + CharacterCount(2500).
   * Only basic marks, links, lists, and blockquotes. No headings, tables, or media.
   */
  comment: {
    demonstrates:
      "Basic marks, autolinked text, a markdown link shortcut, lists, and a blockquote — all inside a 2,500 character budget.",
    html: `<p>This editor is deliberately small. It has everything a commenter needs and nothing they don't.</p>
<p>You get <strong>bold</strong>, <em>italic</em>, <u>underline</u>, and <s>strike</s>, plus <code>inline code</code> and links. Try pasting a URL — it autolinks as you type. Or type <code>[the docs](https://tiptap.dev)</code> and the markdown shortcut converts it.</p>
<ul>
  <li>Bullet lists for enumerating steps</li>
  <li>Nested lists work too
    <ul><li>Like this</li></ul>
  </li>
</ul>
<ol>
  <li>Ordered lists when order matters</li>
  <li>Which it often does in a review thread</li>
</ol>
<blockquote>
  <p>A 2,500 character cap keeps a comment from swallowing the whole thread view.</p>
</blockquote>`,
  },

  /**
   * Content — BLOG_EXTENSIONS (the full complex set).
   * Exercises typography, headings, alignment, highlight, and horizontal rules.
   */
  content: {
    demonstrates:
      "The full typography set: six heading levels, alignment, highlight, sub/superscript, smart punctuation, and horizontal rules.",
    html: `<h2>Designing a content editor</h2>
<p class="editor-text">A long-form editor earns its keep on typography, not on features nobody uses. This sample shows what the <strong>Content</strong> module switches on.</p>
<h3>Typography</h3>
<p>Six heading levels, each with deliberate Tailwind sizing. <mark class="bg-yellow-200 text-yellow-900">Highlighting</mark> works inline, and <sub>subscript</sub> / <sup>superscript</sup> cover the scientific and legal cases.</p>
<p style="text-align: center">Every block can be left, center, right, or justified aligned.</p>
<h3>What ships in this tier</h3>
<ul>
  <li>Headings H1&ndash;H6</li>
  <li>Text alignment</li>
  <li>Multi-colour highlight</li>
  <li>Horizontal rules</li>
  <li>Font family, size, and line height</li>
  <li>Smart typography &mdash; curly quotes and en dashes typed automatically</li>
</ul>
<hr>
<p>That's the long-form surface. For tables, code blocks, and embeds, move up to the <strong>Document</strong> module.</p>`,
  },

  /**
   * Document — DOCUMENT_EXTENSIONS (complex set + CharacterCount textSize).
   * Exercises tables, code blocks, details, and YouTube embeds.
   */
  document: {
    demonstrates:
      "Tables with resizable columns, syntax-highlighted code blocks, collapsible details, and a YouTube embed.",
    html: `<h2>Document module reference</h2>
<p>The heaviest configuration in the catalogue. Everything from <em>Content</em>, plus the block types technical writing actually needs.</p>
<h3>Tables</h3>
<table>
  <tbody>
    <tr><th>Module</th><th>Tier</th><th>Best for</th></tr>
    <tr><td>Comment</td><td>Minimal</td><td>Replies and notes</td></tr>
    <tr><td>Content</td><td>Rich Content</td><td>Blog posts</td></tr>
    <tr><td>Document</td><td>Full Featured</td><td>Docs and wikis</td></tr>
  </tbody>
</table>
<h2>Code blocks</h2>
<pre><code class="language-ts">const map = {
  comment: COMMENT_EXTENSIONS,
  content: BLOG_EXTENSIONS,
} as const;</code></pre>
<h2>Collapsible details</h2>
<details open="open">
  <summary>Why does a module switch discard my content?</summary>
  <p>Because <code>useEditor</code> is keyed on the module id. Changing it tears the editor down and builds a new one, which drops the document and its undo history. Capture the HTML before switching if you need to preserve it.</p>
</details>
<h2>Media</h2>
<figure><div style="padding-bottom: 56.25%; position: relative; overflow: hidden;"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%;"></iframe></div></figure>`,
  },

  /**
   * Presentation — PRESENTATION_EXTENSIONS (complex set + CharacterCount textSize).
   * Heading-led structure, mirroring how slides are actually written.
   */
  presentation: {
    demonstrates:
      "Heading-led structure with the full block set — the shape slide copy and speaker notes actually take.",
    html: `<h2>Editor Blocks</h2>
<p style="text-align: center">Ready-to-use editor modules for React and Next.js</p>
<hr>
<h3>The problem</h3>
<p>Every project rebuilds the same editor. Once for a comment field, once for a blog body. The two drift apart within a month.</p>
<h3>The approach</h3>
<p>Package editors the way shadcn packages components &mdash; a small, readable implementation you own once you copy it.</p>
<ul>
  <li><strong>Modules</strong>, not frameworks</li>
  <li><strong>Engine-agnostic</strong> by design</li>
  <li><strong>One contract</strong> across every block</li>
</ul>
<h3>Where it's going</h3>
<p>TipTap today. Lexical, ProseMirror, and BlockNote are reserved values in the module registry, ready to be added without breaking the shape of a module.</p>`,
  },
};

/**
 * Returns the sample content for a module id.
 * @ai-agent Returns undefined for an unknown id so callers can decide whether to seed the
 *            editor or leave it empty. Never return a hardcoded fallback string here — a
 *            module without a sample should show an honest empty editor.
 */
export function getSampleContent(moduleId: string): SampleContent | undefined {
  return SAMPLE_CONTENT[moduleId];
}

/** Module ids that have a sample defined, for coverage checks and tests. */
export const SAMPLE_MODULE_IDS = Object.keys(SAMPLE_CONTENT);
