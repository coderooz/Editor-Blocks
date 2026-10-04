/**
 * @file /app/layout.tsx
 * @description Root layout. Loads Geist fonts, exports site metadata, mounts the shared
 *              editor provider, and renders the global header and footer.
 * @architecture Next.js App Router (Server Component)
 * @ai-agent Entry point for the whole app. Everything below /documentation renders inside
 *            this chrome, so the header/footer live here rather than in each page.
 * @ai-agent metadataBase must stay pinned to the canonical production origin or every
 *            relative openGraph/twitter image and the /llm.txt link silently resolve
 *            against localhost in development.
 * @ai-agent EditorProvider is mounted here on purpose: it owns a single editor instance for
 *            the whole app. Adding a second provider on a page will desynchronise the
 *            toolbar from the editor.
 * @dependencies Requires <EditorProvider />, <Header />, <Footer />, next/font/google.
 */

import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { EditorProvider } from "@/context/EditorContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EDITOR_MODULES, ENGINE_LABELS, getActiveEngines } from "@/constants/module-registry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/** Canonical production origin — used to resolve every relative URL in `metadata`. */
const SITE_URL = "https://editor-blocks.vercel.app";

const SITE_NAME = "Editor Blocks";
const SITE_DESCRIPTION =
  "A library of ready-to-use, drop-in editor modules for React and Next.js. Pick the block that matches your use case — comments, articles, documents, presentations — copy it in, and ship. Engine-agnostic by design.";

const engines = getActiveEngines().map((engine) => ENGINE_LABELS[engine]);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Ready-to-Use Editor Modules for React`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "editor blocks",
    "editor modules",
    "editor component library",
    "rich text editor",
    "comment editor",
    "document editor",
    "content editor",
    "presentation editor",
    "wysiwyg",
    ...engines.map((engine) => engine.toLowerCase()),
    "nextjs",
    "react",
    "typescript",
    "tailwind css",
    "shadcn ui",
  ],
  authors: [{ name: "Ranit Saha (Coderooz)", url: "https://coderooz.in" }],
  creator: "Ranit Saha",
  publisher: "Coderooz",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Ready-to-Use Editor Modules for React`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/ContentImage.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ready-to-use editor modules`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Ready-to-Use Editor Modules`,
    description: SITE_DESCRIPTION,
    images: ["/ContentImage.png"],
    creator: "@coderooz",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  other: {
    // Machine-readable entry point for AI agents. The llms.txt convention is
    // increasingly used by crawlers to discover a site's canonical docs.
    "llms-txt": "/llm.txt",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/**
 * Structured data (JSON-LD) describing the project for crawlers and AI agents.
 * @ai-agent Keep the module count and names derived from the registry so this never
 *            drifts from the real catalogue.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  license: "https://opensource.org/licenses/MIT",
  programmingLanguage: ["TypeScript", "TSX"],
  runtimePlatform: "Next.js 16",
  author: {
    "@type": "Organization",
    name: "Coderooz",
    url: "https://coderooz.in",
  },
  codeRepository: "https://github.com/coderooz/Editor-Blocks",
  keywords: ["editor", "editor modules", "rich text editor", ...engines],
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: EDITOR_MODULES.length,
    itemListElement: EDITOR_MODULES.map((module, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "SoftwareApplication",
        name: `${module.title} (${ENGINE_LABELS[module.engine]})`,
        applicationCategory: "DeveloperApplication",
        description: module.summary,
        url: `${SITE_URL}${module.href}`,
        softwareVersion: module.engineVersion,
        operatingSystem: "Any",
      },
    })),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/*
          AI-agent discovery tags. These are the standard hints an agent looks for when
          deciding whether a page is worth reading, plus a direct pointer to the
          machine-readable llm.txt manifest.
        */}
        <meta name="ai-content-declaration" content="ai-agent-friendly" />
        <link rel="alternate" type="text/plain" href="/llm.txt" title="AI agent manifest" />
        <link
          rel="alternate"
          type="text/plain"
          href="/llms-full.txt"
          title="Full documentation for AI agents"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <EditorProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </EditorProvider>
      </body>
    </html>
  );
}
