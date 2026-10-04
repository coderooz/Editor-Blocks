/**
 * @file /app/examples/comment/page.tsx
 * @description Example route for the Comment Editor module.
 * @architecture Next.js App Router (Client Component)
 * @ai-agent Every example route is a thin wrapper around <ExamplePageTemplate />. The layout,
 *            the seeded sample, the output preview, the install guide, and the docs links all
 *            come from the template and the registry — there is nothing to customise here.
 * @ai-agent The URL segment (`comment`) happens to match the module id. Where it does not —
 *            /examples/docs serves module id `document` — the mapping is passed explicitly
 *            in the template prop, because the registry is the authority on module ids.
 * @dependencies Requires <ExamplePageTemplate />.
 */

import { ExamplePageTemplate } from "@/components/examples/ExamplePageTemplate";
import { exampleMetadata } from "@/components/examples/example-metadata";

export const metadata = exampleMetadata("comment");

export default function CommentExamplePage() {
  return <ExamplePageTemplate moduleId="comment" />;
}
