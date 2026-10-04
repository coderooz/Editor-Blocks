/**
 * @file /app/examples/presentation/page.tsx
 * @description Example route for the Presentation Editor module.
 * @architecture Next.js App Router (Client Component)
 * @ai-agent Thin wrapper around <ExamplePageTemplate />. The module is marked `beta` in the
 *            registry, so the template renders a status badge and the sample notes that the
 *            extension set may change between releases.
 * @ai-agent The previous route for this module was /presentation. A permanent redirect from
 *            that path is configured in next.config.ts, and EDITOR_MODULES[].href was updated
 *            to point here so every module's demo lives under /examples/*.
 * @dependencies Requires <ExamplePageTemplate />.
 */

import { ExamplePageTemplate } from "@/components/examples/ExamplePageTemplate";
import { exampleMetadata } from "@/components/examples/example-metadata";

export const metadata = exampleMetadata("presentation");

export default function PresentationExamplePage() {
  return <ExamplePageTemplate moduleId="presentation" />;
}
