/**
 * @file /src/adapters/lexicalAdapter.ts
 * @description EditorAdapter interface and Lexical implementation scaffold.
 * @architecture Adaptor pattern for engine-agnostic toolbar and context integration.
 * @project Editor Blocks — this adapter bridges the declarative MenuItem system
 *            (EditorMenuOptions) with the Lexical editor core.
 * @ai-agent INVARIANT: the adapter must implement all methods declared in EditorAdapter
 *            so that EditorMenuBar/ToolbarItem can call commands without knowing
 *            the underlying engine. Adding a new engine requires implementing this
 *            interface and registering it in EditorContext.
 */

import { LexicalEditor } from "lexical";

export type EditorAdapter = {
  /** Check if a given mark/node type is active at the current selection. */
  isActive: (type: string) => boolean;
  /** Apply a bold mark to the current selection. */
  toggleBold: () => void;
  /** Apply a heading mark (e.g., H1–H6) to the current selection. */
  setHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => void;
  /** Get the current editor content as HTML / XML string. */
  getContent: () => string;
  /** Insert content at the current selection. */
  insertContent: (content: string) => void;
  /** Focus the editor. */
  focus: () => void;
};

/**
 * Creates an adapter instance for a Lexical editor.
 *
 * This is a scaffold adapter. Full Lexical integration will replace this
 * with proper dollar-function calls and command dispatching.
 *
 * @param editor - The Lexical Editor instance (obtained via useLexical()).
 * @returns An EditorAdapter that the UI layer can call independently of Lexical internals.
 */
export function lexicalAdapter(editor: LexicalEditor): EditorAdapter {
  return {
    isActive: () => false,
    toggleBold: () => {},
    setHeading: () => {},
    getContent: () => JSON.stringify(editor.toJSON()),
    insertContent: () => {},
    focus: () => editor.focus(),
  };
}