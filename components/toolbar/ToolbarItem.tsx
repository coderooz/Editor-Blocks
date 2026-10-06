/**
 * @file /components/toolbar/ToolbarItem.tsx
 * @description A polymorphic component that renders a toolbar item based on its type 
 *              (button, dropdown, input, model). Decouples rendering logic from the 
 *              main EditorMenuBar.
 * @architecture Atomic Component
 * @ai-agent Ensure `asChild` is used on DialogTrigger to prevent nested buttons.
 */

import React from "react";
import { Editor } from "@tiptap/react";
import { MenuItem } from "@/constants/EditorMenuOptions";
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

interface ToolbarItemProps {
  item: MenuItem;
  editor: Editor;
}

export function ToolbarItem({ item, editor }: ToolbarItemProps) {
  switch (item.type) {
    case "button": {
      const Icon = item.icon;
      const active = item.isActive?.(editor) ?? false;

      return (
        <Button
          size="icon"
          variant={active ? "default" : "ghost"}
          title={item.title}
          aria-label={item.title}
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
          value={value}
          onValueChange={(val) => item.onSelect(editor, val)}
        >
          <SelectTrigger className="w-[110px] text-xs h-8" aria-label={item.title}>
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
        <div className="flex items-center gap-1">
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
              item.onSelect(editor, newVal);
            }}
            className={cn(
              "h-8 text-xs w-[100px]",
              item?.class ?? ""
            )}
            title={item.title}
            aria-label={item.title}
          />
        </div>
      );
    }

    case "model": {
      const Icon = item.icon;
      const active = item.isActive?.(editor) ?? false;

      return (
        <Dialog>
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
}
