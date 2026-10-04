/**
 * @file /components/ThemeToggle.tsx
 * @description Light/dark theme switch that persists the choice to localStorage and toggles the dark class on the document element.
 * @architecture Next.js App Router (Client Component)
 * @ai-hint The mounted guard is required — reading localStorage or matchMedia during render would break hydration. Keep theme state in localStorage and the html.dark class in sync.
 * @dependencies Requires react (useState, useEffect), lucide-react (Moon, Sun).
 */

"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = stored || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) {
    return (
      <button
        className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="w-5 h-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      aria-pressed={theme === "dark"}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" aria-hidden="true" />
      ) : (
        <Sun className="w-5 h-5" aria-hidden="true" />
      )}
    </button>
  );
}