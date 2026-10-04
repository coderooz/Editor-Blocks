/**
 * @file /app/examples/docs/page.tsx
 * @description Example route for the Document Editor module.
 * @architecture Next.js App Router (Client Component)
 * @ai-agent Thin wrapper around <ExamplePageTemplate />.
 * @ai-agent IMPORTANT: the URL segment is `docs` but the module id is `document`. The
 *            template prop takes the MODULE ID, not the URL segment. Confusing the two is
 *            the most likely mistake when adding another example route — the template throws
 *            a named error if the id is not in the registry, so a mistake fails loudly
 *            rather than rendering an empty page.
 * @ai-agent This is a live demo, not documentation. Real docs live under /documentation.
 * @dependencies Requires <ExamplePageTemplate />.
 */

import { ExamplePageTemplate } from "@/components/examples/ExamplePageTemplate";
import { exampleMetadata } from "@/components/examples/example-metadata";

export const metadata = exampleMetadata("document");

export default function DocumentExamplePage() {
  return <ExamplePageTemplate moduleId="document" />;
}
