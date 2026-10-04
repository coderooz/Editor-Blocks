/**
 * @file plugin/src/types/editor.ts
 * @description Type definitions for the tiptap-editor package.
 */

export type EditorType = "comment" | "content" | "document";

export type MenuBtnGroups =
  | "styling"
  | "alignment"
  | "lists"
  | "history"
  | "fonts"
  | "file"
  | "table"
  | "insert";

export type MenuItemType = "button" | "dropdown" | "input" | "model";

export interface MenuItem {
  title: string;
  group: MenuBtnGroups;
  type: MenuItemType;
  icon?: React.ElementType;
  isActive?: (editor: any) => boolean;
  action?: (editor: any) => void;
  options?: { label: string; value: string | number }[];
  onSelect?: (editor: any, value: string | number) => void;
  getValue?: (editor: any) => string;
  inputType?: string;
  class?: string;
  model?: {
    title: string;
    description?: string;
    content: (editor: any) => React.ReactNode;
  };
}
