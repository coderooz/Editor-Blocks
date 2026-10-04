/**
 * @file /app/examples/content/page.tsx
 * @description Example route for the Content Editor module.
 * @architecture Next.js App Router (Client Component)
 * @ai-agent Thin wrapper around <ExamplePageTemplate />. Layout, sample content, output
 *            preview, install guide, and docs links all come from the template and the module
 *            registry — do not duplicate them here.
 * @dependencies Requires <ExamplePageTemplate />.
 */

import { ExamplePageTemplate } from "@/components/examples/ExamplePageTemplate";
import { exampleMetadata } from "@/components/examples/example-metadata";

export const metadata = exampleMetadata("content");

export default function ContentExamplePage() {
  return <ExamplePageTemplate moduleId="content" />;
}
