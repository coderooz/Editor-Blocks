/**
 * @file plugin/src/constants/menuOptions.ts
 * @description Menu item definitions for the tiptap-editor package toolbar.
 */

import type { MenuItem } from "../types/editor";

export type { MenuItem };

export const MENU_BTN_ITEMS: MenuItem[] = [
  {
    title: "Undo",
    group: "history",
    type: "button",
    isActive: (editor) => editor.isActive("undo"),
    action: (editor) => editor.chain().focus().undo().run(),
  },
  {
    title: "Redo",
    group: "history",
    type: "button",
    isActive: (editor) => editor.isActive("redo"),
    action: (editor) => editor.chain().focus().redo().run(),
  },
  {
    title: "Bold",
    group: "styling",
    type: "button",
    isActive: (editor) => editor.isActive("bold"),
    action: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    title: "Italic",
    group: "styling",
    type: "button",
    isActive: (editor) => editor.isActive("italic"),
    action: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    title: "Underline",
    group: "styling",
    type: "button",
    isActive: (editor) => editor.isActive("underline"),
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
  },
  {
    title: "Strike",
    group: "styling",
    type: "button",
    isActive: (editor) => editor.isActive("strike"),
    action: (editor) => editor.chain().focus().toggleStrike().run(),
  },
];

export const CONTENT_MENU: MenuItem[] = [
  ...MENU_BTN_ITEMS,
  {
    title: "Heading",
    group: "fonts",
    type: "dropdown",
    options: [
      { label: "None", value: "0" },
      { label: "H1", value: "1" },
      { label: "H2", value: "2" },
      { label: "H3", value: "3" },
      { label: "H4", value: "4" },
      { label: "H5", value: "5" },
      { label: "H6", value: "6" },
    ],
    onSelect: (editor, value) => {
      const val = Number(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      if (val === 0) {
        editor.chain().focus().setParagraph().run();
      } else {
        editor.chain().focus().setHeading({ level: val }).run();
      }
    },
    getValue: (editor) => {
      const level = (editor.getAttributes("heading") as Record<string, unknown>)["level"] as number;
      return level ? level.toString() : "";
    },
  },
  {
    title: "Bullet List",
    group: "lists",
    type: "button",
    isActive: (editor) => editor.isActive("bulletList"),
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: "Ordered List",
    group: "lists",
    type: "button",
    isActive: (editor) => editor.isActive("orderedList"),
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
];

export const DOCUMENT_MENU: MenuItem[] = [
  ...CONTENT_MENU,
  {
    title: "Code",
    group: "insert",
    type: "button",
    isActive: (editor) => editor.isActive("code"),
    action: (editor) => editor.chain().focus().toggleCode().run(),
  },
  {
    title: "Blockquote",
    group: "insert",
    type: "button",
    isActive: (editor) => editor.isActive("blockquote"),
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
];
