/**
 * @file /components/layout/Footer.tsx
 * @description Global site footer rendered by the root layout on every route.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent The description is deliberately engine-agnostic: the project is a catalogue of
 *            editor modules, not a TipTap showcase. Do not hardcode a single engine name in
 *            the copy — reference ENGINE_LABELS from the module registry if you need to
 *            enumerate engines.
 * @dependencies Requires SITE_NAME from ./Header, ENGINE_LABELS from the module registry.
 */

import Link from "next/link";
import { Sparkles, Package, ExternalLink } from "lucide-react";
import { Github, Twitter } from "@/components/icons/brand-icons";
import { SITE_NAME } from "./Header";
import { EDITOR_MODULES, ENGINE_LABELS, getActiveEngines } from "@/constants/module-registry";

const YEAR = 2026;

export function Footer() {
  const engines = [...new Set(getActiveEngines().map((e) => ENGINE_LABELS[e]))];

  return (
    <footer className="bg-muted/30 border-t border-border py-12" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
              {SITE_NAME}
            </h3>
            <p className="text-muted-foreground max-w-sm leading-relaxed">
              A library of ready-to-use, drop-in editor modules for React and Next.js. Pick the
              block that matches your use case, copy it in, and ship — without hand-assembling a
              rich-text editor from scratch.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {EDITOR_MODULES.length} modules available · currently powered by{" "}
              {engines.join(", ")} · extensible to other editor cores
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Live Demo
                </Link>
              </li>
              <li>
                <Link href="/modules" className="hover:text-primary transition-colors">
                  Module Catalogue
                </Link>
              </li>
              <li>
                <Link href="/examples" className="hover:text-primary transition-colors">
                  Examples
                </Link>
              </li>
              <li>
                <Link
                  href="/documentation"
                  className="hover:text-primary transition-colors"
                >
                  Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="https://github.com/coderooz/Editor-Blocks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  GitHub Repository
                  <Github className="w-3 h-3" aria-hidden="true" />
                </a>
              </li>
              <li>
                {/* Package is not published yet — href is intentionally empty and inert. */}
                <span
                  className="inline-flex items-center gap-1 text-muted-foreground/60 cursor-not-allowed"
                  title="Coming soon"
                  aria-disabled="true"
                >
                  NPM Package
                  <Package className="w-3 h-3" aria-hidden="true" />
                  <span className="text-xs">(coming soon)</span>
                </span>
              </li>
              <li>
                <a
                  href="/llm.txt"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  llm.txt
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>
            © {YEAR} Coderooz. MIT Licensed.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/coderooz/Editor-Blocks/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              License
            </a>
            <a
              href="https://github.com/coderooz/Editor-Blocks/blob/main/SECURITY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Security
            </a>
            <a
              href="https://github.com/coderooz/Editor-Blocks/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Contributing
            </a>
            <a
              href="https://github.com/coderooz/Editor-Blocks/blob/main/CODE_OF_CONDUCT.md"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Code of Conduct
            </a>
            <a
              href="https://twitter.com/coderooz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors inline-flex items-center gap-1"
            >
              <Twitter className="w-3 h-3" aria-hidden="true" />
              <span className="sr-only">Twitter</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
