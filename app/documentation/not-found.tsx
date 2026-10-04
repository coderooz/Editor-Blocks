/**
 * @file /app/documentation/not-found.tsx
 * @description 404 shown when an unknown module id is requested under /documentation/modules.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent Reached via notFound() in app/documentation/modules/[moduleId]/page.tsx when
 *            the requested id is missing from EDITOR_MODULES. The link below is dynamic so
 *            the recovery path stays correct as the catalogue grows.
 */

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { EDITOR_MODULES } from "@/constants/module-registry";
import { DocsTitle } from "@/components/docs/DocsHeading";

export default function DocumentationNotFound() {
  return (
    <>
      <DocsTitle
        eyebrow="404"
        title="Documentation page not found"
        description="That page does not exist. It may have been renamed, or the link that brought you here may be out of date."
      />

      <div className="mt-8 space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Try these instead</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Link
              href="/documentation"
              className="rounded-lg border p-4 transition-colors hover:border-primary/50"
            >
              <p className="font-medium">Documentation overview</p>
              <p className="mt-1 text-sm text-muted-foreground">
                What Editor Blocks is and how modules are packaged.
              </p>
            </Link>
            <Link
              href="/modules"
              className="rounded-lg border p-4 transition-colors hover:border-primary/50"
            >
              <p className="font-medium">Module catalogue</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse every available module with search and filters.
              </p>
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">All modules</h2>
          <ul className="mt-3 space-y-1.5">
            {EDITOR_MODULES.map((module) => (
              <li key={module.id}>
                <Link
                  href={module.docs}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                >
                  <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                  {module.title}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
