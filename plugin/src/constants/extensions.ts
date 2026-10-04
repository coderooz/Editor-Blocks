/**
 * @file plugin/src/constants/extensions.ts
 * @description TipTap extension presets for each editor mode.
 */

import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { CharacterCount } from "@tiptap/extensions";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Blockquote from "@tiptap/extension-blockquote";
import Link from "@tiptap/extension-link";

const baseAttr = {
  HTMLAttributes: {
    class: "editor-text prose prose-sm md:prose md:max-w-none",
  },
};

export const COMMENT_EXTENSIONS = [
  Document.configure(baseAttr),
  Paragraph.configure({ HTMLAttributes: { class: "mb-4 mt-0" } }),
  Text.configure(baseAttr),
  Italic.configure(baseAttr),
  Bold.configure(baseAttr),
  Underline.configure(baseAttr),
  Strike.configure(baseAttr),
  Code.configure({ HTMLAttributes: { class: "bg-gray-100 px-1 rounded text-sm font-mono" } }),
  Link.configure({
    openOnClick: true,
    autolink: true,
    defaultProtocol: "http",
    HTMLAttributes: { class: "text-blue-600 hover:underline hover:opacity-80" },
  }),
  BulletList.configure({ HTMLAttributes: { class: "list-disc list-outside mb-4 space-y-2 pl-6" } }),
  OrderedList.configure({ HTMLAttributes: { class: "list-decimal list-outside mb-4 space-y-2 pl-6" } }),
  ListItem.configure({ HTMLAttributes: { class: "mb-1" } }),
  Blockquote.configure({ HTMLAttributes: { class: "my-custom-class" } }),
  CharacterCount.configure({ limit: 2500, mode: "nodeSize" }),
];

export const CONTENT_EXTENSIONS = [
  ...COMMENT_EXTENSIONS,
  Subscript.configure({ HTMLAttributes: { class: "align-sub" } }),
  Superscript.configure({ HTMLAttributes: { class: "align-super" } }),
  Highlight.configure({ multicolor: true, HTMLAttributes: { class: "bg-yellow-200 text-yellow-900" } }),
  TextAlign.configure({ types: ["heading", "paragraph"], alignments: ["left", "center", "right", "justify"] }),
  Typography,
  HorizontalRule.configure({ HTMLAttributes: { class: "my-6 border-gray-300" } }),
];

export const DOCUMENT_EXTENSIONS = [
  ...CONTENT_EXTENSIONS,
  CharacterCount.configure({ mode: "textSize" }),
];
