/**
 * @file plugin/src/components/EditorMenuBar.tsx
 * @description Toolbar component for the tiptap-editor package.
 */

"use client";

import { useEditorContext } from "../context/EditorContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  MENU_BTN_ITEMS,
  CONTENT_MENU,
  DOCUMENT_MENU,
} from "../constants/menuOptions";
import type { MenuItem } from "../types/editor";

export function EditorMenuBar() {
  const { editor, editorType } = useEditorContext();

  if (!editor) return null;

  const menuItems: MenuItem[] =
    editorType === "content"
      ? CONTENT_MENU
      : editorType === "document"
      ? DOCUMENT_MENU
      : MENU_BTN_ITEMS;

  const groups = [...new Set(menuItems.map((b) => b.group))];

  return (
    <div className="flex flex-wrap gap-3 p-2 border-b bg-muted/30 rounded-t-lg">
      {groups.map((group) => (
        <div key={group} className="flex gap-2 border-r pr-3 items-center">
          {menuItems
            .filter((b) => b.group === group)
            .map((item) => {
              switch (item.type) {
                case "button": {
                  const Icon = item.icon;
                  const active = item.isActive?.(editor) ?? false;
                  return (
                    <Button
                      key={item.title}
                      size="icon"
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
                case "dropdown": {
                  const value = item.getValue?.(editor) ?? "";
                  return (
                    <Select
                      key={item.title}
                      value={value}
                      onValueChange={(val) => item.onSelect?.(editor, val)}
                    >
                      <SelectTrigger className="w-[110px] text-xs h-8">
                        <SelectValue placeholder={item.title} />
                      </SelectTrigger>
                      <SelectContent>
                        {item.options?.map((opt: { label: string; value: string | number }) => (
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
                    <div key={item.title} className="flex items-center gap-1">
                      {Icon && (
                        <Icon
                          size={16}
                          strokeWidth={2}
                          className="text-muted-foreground"
                        />
                      )}
                      <Input
                        type={item.inputType}
                        value={value}
                        placeholder={item.title}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const newVal = e.target.value;
                          item.onSelect?.(editor, newVal);
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
                      <DialogTrigger asChild>
                        <Button
                          size="icon"
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
                          <DialogTitle>{item.model?.title}</DialogTitle>
                          <DialogDescription>
                            {item.model?.description}
                          </DialogDescription>
                          {item.model?.content(editor) ?? ""}
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
