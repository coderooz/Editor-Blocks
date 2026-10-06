/**
 * @file /components/EditorMenuBar.tsx
 * @description Renders the toolbar by grouping menu definitions from EditorMenuOptions and dispatching each item type (button, dropdown, input, model).
 * @architecture Next.js App Router (Client Component)
 * @ai-hint Radix DialogTrigger renders its own <button>; wrapping a shadcn Button inside it produces nested-button HTML. Always use asChild on DialogTrigger. Every item in a group must carry a unique key.
 * @ai-agent INVARIANT: the editor is guarded for null before any item calls a command. On the
 *            server and the first client pass `editor` is null, and an unguarded
 *            `item.isActive?.(editor)` would throw during hydration.
 * @ai-agent The module → menu-array mapping now lives in MENU_BY_TYPE below, typed as a total
 *            map over EditorType so a missing key is a compile error. It previously fell
 *            through to MENU_BTN_ITEMS at runtime, which is how `presentation` shipped with a
 *            6-button toolbar. See the comment on MENU_BY_TYPE before adding a module.
 * @ai-agent A `button` item calls a command that only exists if its extension is in the active
 *            module's preset. Adding a button without its extension throws on click.
 * @ai-agent Grouping is derived from each item's `group` field, so two items sharing a group
 *            render in the same separator block. Keep group names consistent across presets.
 * @dependencies Requires <ToolbarItem />, useEditorContext(),
 *            MENU_BTN_ITEMS/COMMENT_MENU/CONTENT_MENU/DOCUMENT_MENU, cn().
 */

import React from "react";
import { useEditorContext } from "@/context/EditorContext";
import type { EditorType } from "@/context/EditorContext";
import {
  MENU_BTN_ITEMS,
  COMMENT_MENU,
  CONTENT_MENU,
  DOCUMENT_MENU,
  type MenuItem,
} from "@/constants/EditorMenuOptions";
import { ToolbarItem } from "@/components/toolbar/ToolbarItem";
import { cn } from "@/lib/utils";

/**
 * Module id → toolbar menu array.
 *
 * @ai-agent INVARIANT: this map and the provider's extension map (context/EditorContext.tsx)
 *            must both have an entry for every value in `EditorType`. A missing entry here
 *            used to fall through to MENU_BTN_ITEMS silently: when the `presentation` module
 *            was added, this map was not updated and that module rendered a 6-button toolbar
 *            instead of its 23-item menu, with no error anywhere. If you add a module id,
 *            add it here in the same change.
 * @ai-agent `default` is the only value intentionally mapped to the minimal set — it is the
 *            fallback preset, not a published module.
 * @ai-agent Typed as a total map over EditorType so TypeScript flags a missing key at compile
 *            time rather than letting it degrade at runtime.
 */
const MENU_BY_TYPE: Record<EditorType, MenuItem[]> = {
  comment: COMMENT_MENU,
  content: CONTENT_MENU,
  document: DOCUMENT_MENU,
  presentation: CONTENT_MENU,
  default: MENU_BTN_ITEMS,
};

export function EditorMenuBar() {
  const { editor, editorType } = useEditorContext();

  if (!editor) return null;

  const menuItems: MenuItem[] = MENU_BY_TYPE[editorType] ?? MENU_BTN_ITEMS;
  const groups = [...new Set(menuItems.map((b) => b.group))];

  return (
    <div 
      className='flex flex-wrap gap-3 p-2 border-b bg-muted/30 rounded-t-lg'
      role='toolbar'
      aria-label='Editor toolbar'
    >
      {groups.map((group) => (
        <div key={group} className='flex gap-2 border-r pr-3 items-center'>
          {menuItems
            .filter((b) => b.group === group)
            .map((item) => (
              <ToolbarItem 
                key={item.title} 
                item={item} 
                editor={editor} 
              />
            ))}
        </div>
      ))}
    </div>
  );
}
