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
 * @dependencies Requires <Button />, <Input />, <Select />, <Dialog />, useEditorContext(),
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
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog";

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
  // COMMENT_MENU, not MENU_BTN_ITEMS: the comment module advertises lists and inline
  // code, so its toolbar has to reach them.
  comment: COMMENT_MENU,
  content: CONTENT_MENU,
  document: DOCUMENT_MENU,
  // PRESENTATION_EXTENSIONS is the complex set, so it gets the content menu.
  presentation: CONTENT_MENU,
  // The fallback preset keeps the minimal set — every item in it is backed by
  // DEFAULT_EXTENSIONS, which now includes Strike.
  default: MENU_BTN_ITEMS,
};

export function EditorMenuBar() {
  const { editor, editorType } = useEditorContext();

  // 🛡️ Safety check: no editor = no toolbar
  if (!editor) return null;

  const menuItems: MenuItem[] = MENU_BY_TYPE[editorType] ?? MENU_BTN_ITEMS;

  // 🧩 Group items by their "group" property
  const groups = [...new Set(menuItems.map((b) => b.group))];

  return (
    <div className='flex flex-wrap gap-3 p-2 border-b bg-muted/30 rounded-t-lg'>
      {groups.map((group) => (
        <div key={group} className='flex gap-2 border-r pr-3 items-center'>
          {menuItems
            .filter((b) => b.group === group)
            .map((item) => {
              switch (item.type) {
                // 🧱 Button Menu Items
                case "button": {
                  const Icon = item.icon;
                  const active = item.isActive?.(editor) ?? false;

                  return (
                    <Button
                      key={item.title}
                      size='icon'
                      variant={active ? "default" : "ghost"}
                      title={item.title}
                      onClick={() => item.action?.(editor)}
                      className={cn(
                        "transition h-8 w-8",
                        active && "bg-primary/20 text-primary"
                      )}
                    >
                      {Icon && <Icon size={16} strokeWidth={2} />}
                    </Button>
                  );
                }

                // 🧭 Dropdown Menu Items
                case "dropdown": {
                  const value = item.getValue?.(editor) ?? "";
                  return (
                    <Select
                      key={item.title}
                      value={value}
                      onValueChange={(val) => item.onSelect(editor, val)}
                    >
                      <SelectTrigger className='w-[110px] text-xs h-8'>
                        <SelectValue placeholder={item.title} />
                      </SelectTrigger>
                      <SelectContent>
                        {item.options.map((opt) => (
                          <SelectItem
                            key={opt.value.toString()}
                            value={opt.value.toString()}
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }
                case "input": {
                  const value = item.getValue?.(editor) ?? "";
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className='flex items-center gap-1'>
                      {Icon && (
                        <Icon
                          size={16}
                          strokeWidth={2}
                          className='text-muted-foreground'
                        />
                      )}
                      <Input
                        type={item.inputType}
                        value={value}
                        placeholder={item.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newVal = e.target.value;
                          item.onSelect(editor, newVal);
                        }}
                        className={cn(
                          "h-8 text-xs w-[100px]",
                          item?.class ?? ""
                        )}
                        title={item.title}
                      />
                    </div>
                  );
                }

                case "model": {
                  const Icon = item.icon;
                  const active = item.isActive?.(editor) ?? false;

                  return (
                    <Dialog key={item.title}>
                      {/* `asChild` is required: without it Radix renders its own
                          <button> and the shadcn <Button> inside becomes a nested
                          <button>, which is invalid HTML and a hydration error. */}
                      <DialogTrigger asChild>
                        <Button
                          size='icon'
                          variant={active ? "default" : "ghost"}
                          title={item.title}
                          aria-label={item.title}
                          className={cn(
                            "transition h-8 w-8",
                            active && "bg-primary/20 text-primary"
                          )}
                        >
                          {Icon && <Icon size={16} strokeWidth={2} />}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{item.model.title}</DialogTitle>
                          <DialogDescription>
                            {item.model.description}
                          </DialogDescription>
                          {item.model.content(editor) ?? ""}
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  );
                }
                default:
                  return null;
              }
            })}
        </div>
      ))}
    </div>
  );
}
