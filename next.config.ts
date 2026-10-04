/**
 * @file /next.config.ts
 * @description Next.js configuration: image formats, bundle optimisation, security headers,
 *              and permanent redirects.
 * @architecture Next.js Configuration (Server)
 * @ai-agent Redirects here exist because the example routes were consolidated under
 *            /examples/* so every example page shares one template. Keep this list in sync
 *            with EDITOR_MODULES[].href in constants/module-registry.ts — the registry is the
 *            source of truth for where a module's demo lives, and these entries exist only to
 *            catch links made before the move.
 * @ai-agent Headers are security defaults: no framing, no MIME sniffing, and a restrictive
 *            permissions policy. Do not relax X-Frame-Options without understanding why the
 *            editor may be embedded.
 */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },
  async redirects() {
    return [
      {
        // The Presentation demo moved under /examples so it uses the shared template.
        source: "/presentation",
        destination: "/examples/presentation",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Machine-readable manifests for AI agents. Advertised explicitly so crawlers do
        // not have to guess the path. The <link rel="alternate"> tags in app/layout.tsx
        // point at the same two files.
        source: "/llm.txt",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
      {
        source: "/llms-full.txt",
        headers: [{ key: "Content-Type", value: "text/plain; charset=utf-8" }],
      },
    ];
  },
};

export default nextConfig;
