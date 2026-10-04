/**
 * @file /components/extensions/MarkDownLink.ts
 * @description Link extension that additionally converts a [label](url) markdown shortcut into a real link mark.
 * @architecture TipTap Extension Module
 * @ai-hint This extension inherits the name 'link' from Link, so register it INSTEAD of Link — registering both yields two extensions named 'link' and TipTap logs a duplicate-extension warning. Spread this.parent() so autolink keeps working.
 * @dependencies Requires Link from @tiptap/extension-link, InputRule from @tiptap/core.
 */

import { Link } from "@tiptap/extension-link";
import { InputRule } from "@tiptap/core";

const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/;

export const MarkdownLink = Link.extend({
  addInputRules() {
    // Keep every rule the parent `Link` contributes (notably `autolink`), then
    // append the markdown shortcut.
    return [
      ...(this.parent?.() ?? []),
      new InputRule({
        find: MARKDOWN_LINK_REGEX,
        handler: ({ range, match, chain }) => {
          const [, text, href] = match;
          if (!text || !href) return;

          chain()
            .insertContentAt({ from: range.from, to: range.to }, [
              {
                type: "text",
                text,
                marks: [{ type: this.name, attrs: { href } }],
              },
              { type: "text", text: " " },
            ])
            .run();
        },
      }),
    ];
  },
});