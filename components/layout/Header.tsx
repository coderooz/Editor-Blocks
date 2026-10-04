/**
 * @file /components/layout/Header.tsx
 * @description Global site header rendered by the root layout on every route.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent The wordmark is the project's single source of truth for the product name.
 *            If the product is renamed, change SITE_NAME here and in
 *            app/layout.tsx metadata — the footer heading reads from SITE_NAME too, so it
 *            follows automatically.
 * @dependencies Requires <ThemeToggle />, brand icons.
 */

import Link from "next/link";
import { Sparkles, LayoutGrid, Star, BookOpen } from "lucide-react";
import { Github } from "@/components/icons/brand-icons";
import { ThemeToggle } from "@/components/ThemeToggle";

/** The product name. Update here first when renaming. */
export const SITE_NAME = "Editor Blocks";

const NAV_LINKS = [
  { href: "/", label: "Live Demo", icon: Sparkles, primary: true },
  { href: "/modules", label: "Modules", icon: LayoutGrid, primary: false },
  { href: "/documentation", label: "Docs", icon: BookOpen, primary: false },
] as const;

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2" aria-label={`${SITE_NAME} home`}>
              <span className="text-xl font-bold text-foreground">{SITE_NAME}</span>
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">
              <Star className="w-3 h-3" aria-hidden="true" />
              v0.3.0
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            {NAV_LINKS.map(({ href, label, icon: Icon, primary }) => (
              <Link
                key={href}
                href={href}
                className={
                  primary
                    ? "hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    : "flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                }
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="hidden md:inline">{label}</span>
                <span className="sr-only md:hidden">{label}</span>
              </Link>
            ))}

            <Link
              href="https://github.com/coderooz/Editor-Blocks"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              <span className="hidden md:inline">GitHub</span>
              <span className="sr-only md:hidden">GitHub</span>
            </Link>

            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
