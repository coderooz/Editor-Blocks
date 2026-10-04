/**
 * @file /lib/utils.ts
 * @description Exports cn(), the class-name helper that merges conditional classes with clsx and resolves Tailwind conflicts.
 * @architecture Utility Module
 * @ai-hint Every component must style through cn() plus Tailwind utilities so tailwind-merge can de-duplicate conflicting classes. Do not reintroduce inline style objects for layout.
 * @dependencies Requires clsx, tailwind-merge.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
