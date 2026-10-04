/**
 * @file plugin/src/index.ts
 * @description Main entry point for @coderooz/tiptap-editor package.
 * Exports all editor components, types, and utilities for external use.
 */

// Core components
export { EditorProvider, useEditorContext } from "./context/EditorContext";
export { default as Editor } from "./components/Editor";
export { EditorMenuBar } from "./components/EditorMenuBar";
export { default as EditorContent } from "./components/EditorContent";

// Types
export type { EditorType } from "./types/editor";
export type { MenuItem, MenuItemType, MenuBtnGroups } from "./types/editor";

// Constants (for advanced usage)
export {
  COMMENT_EXTENSIONS,
  CONTENT_EXTENSIONS,
  DOCUMENT_EXTENSIONS,
} from "./constants/extensions";

// Utilities
export { extractYoutubeId } from "./utils/youtube";
