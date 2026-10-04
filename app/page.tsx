/**
 * @file /app/page.tsx
 * @description Marketing landing page with hero, live editor demo, feature grid, tech stack,
 *              and featured module cards. Header and footer come from the root layout.
 * @architecture Next.js App Router (Server Component)
 * @project Editor Blocks — a catalogue of ready-to-use editor modules. Copy here should stay
 *          engine-agnostic; name a specific engine only where the fact genuinely requires it
 *          (the tech-stack table reports the engine actually in use).
 * @ai-agent Internal links must point at routes that exist under app/ — a typo becomes a
 *            production 404. Verify against the build output route list before adding one.
 * @ai-agent FEATURED_MODULES is sliced from EDITOR_MODULES rather than duplicated, so a new
 *            module in the registry shows up here without editing this file.
 * @ai-agent There is no header or footer markup in this file. They render once in
 *            app/layout.tsx; adding them here would double them.
 * @dependencies Requires <LiveEditorDemo />, EDITOR_MODULES/ENGINE_LABELS/getActiveEngines
 *              from @/constants/module-registry.
 */

import { LiveEditorDemo } from "@/components/LiveEditorDemo";
import Link from "next/link";
import { Github } from "@/components/icons/brand-icons";
import {
  Package,
  Sparkles,
  Code,
  Layers,
  Zap,
  Shield,
  Accessibility,
  ArrowRight,
  Star,
  Heart,
  LayoutGrid,
  BookOpen,
  Copy,
  Wrench,
  MessageSquare,
  PenTool,
  FileText,
  type LucideIcon,
} from "lucide-react";
import {
  EDITOR_MODULES,
  ENGINE_LABELS,
  getActiveEngines,
  type EditorModule,
} from "@/constants/module-registry";

const FEATURES = [
  {
    icon: Layers,
    title: "Ready-Made Modules",
    description:
      "Comment, Content, Document, and Presentation blocks — each with a pre-tuned extension set, toolbar, and constraints already decided.",
    href: "/modules",
  },
  {
    icon: Copy,
    title: "Copy the Code",
    description:
      "Every module is readable source you vendor into your own repo. No runtime lock-in, no black box, no waiting on a maintainer.",
    href: "/documentation",
  },
  {
    icon: Wrench,
    title: "Engine-Agnostic",
    description:
      "Each module declares which editor core powers it. TipTap today; Lexical, ProseMirror, and others are reserved for future modules.",
    href: "/documentation/roadmap",
  },
  {
    icon: Package,
    title: "Full Extension Set",
    description:
      "Headings, tables, syntax-highlighted code blocks, images, YouTube embeds, and collapsible blocks — wired up per module.",
    href: "/modules",
  },
  {
    icon: Zap,
    title: "Collaborative Ready",
    description:
      "Yjs and y-protocols pre-installed. Add a WebSocket provider for real-time collaborative editing.",
    href: "/documentation",
  },
  {
    icon: Shield,
    title: "TypeScript Strict",
    description:
      "Full strict mode with typed module contracts. A single registry keeps every module consistent.",
    href: "/documentation/api",
  },
  {
    icon: Accessibility,
    title: "Accessibility First",
    description:
      "WCAG 2.1 AA oriented. Semantic HTML, ARIA labels, keyboard navigation, focus management, screen reader support.",
    href: "/documentation",
  },
  {
    icon: Star,
    title: "Modern Stack",
    description:
      "Next.js 16 App Router, React 19, Tailwind CSS 4, shadcn/ui on Radix UI primitives.",
    href: "/documentation",
  },
];

const ENGINES = getActiveEngines().map((engine) => ENGINE_LABELS[engine]);

const TECH_SPECS = [
  { label: "Framework", value: "Next.js 16 (App Router)" },
  { label: "Language", value: "TypeScript 5 (Strict)" },
  { label: "Runtime", value: "React 19" },
  { label: "Current Engine", value: ENGINES.join(", ") },
  { label: "Styling", value: "Tailwind CSS 4" },
  { label: "UI Library", value: "shadcn/ui + Radix UI" },
  { label: "Icons", value: "Lucide React" },
  { label: "Deployment", value: "Vercel" },
  { label: "Package Manager", value: "npm" },
  { label: "License", value: "MIT" },
];

const STATS = [
  { label: "Modules", value: String(EDITOR_MODULES.length) },
  { label: "Editor Cores", value: String(ENGINES.length) },
  {
    label: "Feature Tiers",
    value: String(new Set(EDITOR_MODULES.map((m) => m.category)).size),
  },
  { label: "Docs Pages", value: "9" },
  { label: "Bundle Size", value: "~180KB" },
  { label: "License", value: "MIT" },
];

/**
 * The first three modules, surfaced on the landing page.
 * @ai-agent Sliced from the registry on purpose. Adding a module to EDITOR_MODULES puts it
 *            here automatically; the full list lives at /modules.
 */
const FEATURED_MODULES = EDITOR_MODULES.slice(0, 3);

const MODULE_ICONS: Record<string, LucideIcon> = {
  comment: MessageSquare,
  content: PenTool,
  document: FileText,
  presentation: BookOpen,
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* A plain <div>, not a second <main>: app/layout.tsx already renders the single
          <main> landmark for the whole app. Nesting another produced a duplicate landmark
          that screen readers announce twice. pt-16 clears the fixed h-16 header. */}
      <div className="pt-16">
        {/* ---------------------------------------------------------------- Hero */}
        <section
          className="relative overflow-hidden py-20 sm:py-32 lg:py-40"
          aria-labelledby="hero-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                <span>Ready-to-Use Editor Modules</span>
              </div>

              <h1
                id="hero-heading"
                className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6"
              >
                Stop Building the{" "}
                <span className="text-primary">Same Editor Twice</span>
                <br />
                Ship Editor Blocks Instead
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                A library of drop-in editor modules for React and Next.js. Pick the block that
                matches your use case — comments, articles, documents, presentations — copy it
                in, and ship. Engine-agnostic by design, so you are never locked to one editor.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                <Link
                  href="/modules"
                  className="group inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
                >
                  <LayoutGrid className="w-5 h-5" aria-hidden="true" />
                  Browse Modules
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/documentation/getting-started"
                  className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-all duration-200"
                >
                  <BookOpen className="w-5 h-5" aria-hidden="true" />
                  Get Started
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Shield className="w-4 h-4" aria-hidden="true" />
                  MIT Licensed
                </span>
                <span className="flex items-center gap-1">
                  <Code className="w-4 h-4" aria-hidden="true" />
                  TypeScript Strict
                </span>
                <span className="flex items-center gap-1">
                  <Accessibility className="w-4 h-4" aria-hidden="true" />
                  WCAG 2.1 AA
                </span>
                <span className="flex items-center gap-1">
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  Copy the source, own it
                </span>
              </div>
            </div>

            <LiveEditorDemo />
          </div>
        </section>

        {/* ------------------------------------------------------------ Features */}
        <section
          className="py-20 sm:py-28 bg-muted/30"
          aria-labelledby="features-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2
                id="features-heading"
                className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
              >
                Why <span className="text-primary">Editor Blocks</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Modules instead of frameworks. Readable source instead of a black box.
                One contract that outlives any single editor core.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature, index) => (
                <article
                  key={feature.title}
                  className="group relative p-6 bg-background rounded-xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                  <div className="relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <feature.icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed">
                      {feature.description}
                    </p>
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Explore
                      <ArrowRight
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------------- Stats */}
        <section className="py-20 sm:py-28" aria-labelledby="stats-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2
                id="stats-heading"
                className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
              >
                The Catalogue Today
              </h2>
              <p className="text-lg text-muted-foreground">
                Every number below is read from the module registry, so it cannot drift from
                what actually ships.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center p-6">
                  <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- Tech stack */}
        <section
          className="py-20 sm:py-28 bg-muted/30"
          aria-labelledby="tech-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2
                id="tech-heading"
                className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
              >
                Built On Proven Tools
              </h2>
              <p className="text-lg text-muted-foreground">
                Carefully selected for performance, developer experience, and maintainability.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {TECH_SPECS.map((spec) => (
                <div
                  key={spec.label}
                  className="p-4 bg-background rounded-lg border border-border text-center hover:border-primary/50 transition-colors"
                >
                  <div className="text-sm font-semibold text-foreground mb-1">
                    {spec.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{spec.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Featured modules */}
        <section className="py-20 sm:py-28" aria-labelledby="modules-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2
                id="modules-heading"
                className="text-3xl sm:text-4xl font-bold text-foreground mb-4"
              >
                Pick a Block, Drop It In
              </h2>
              <p className="text-lg text-muted-foreground">
                Each module is a complete editor with its extension set, toolbar, and limits
                already decided. No configuration marathon.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {FEATURED_MODULES.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>

            <div className="text-center mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/modules"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-all duration-200"
              >
                <LayoutGrid className="w-4 h-4" aria-hidden="true" />
                View All Modules
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/documentation"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-all duration-200"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                Read the Docs
              </Link>
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------------------- CTA */}
        <section
          className="py-20 sm:py-28 bg-gradient-to-br from-primary/5 via-background to-background"
          aria-labelledby="cta-heading"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-3xl mx-auto">
              <h2
                id="cta-heading"
                className="text-3xl sm:text-4xl font-bold text-foreground mb-6"
              >
                Ship Your Editor Today
              </h2>
              <p className="text-lg text-muted-foreground mb-10">
                Clone the repository, pick a module, and adapt it. Contributing a module that
                others can use is worth more than a narrowly tailored one.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="https://github.com/coderooz/Editor-Blocks"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/25"
                >
                  <Github className="w-5 h-5" aria-hidden="true" />
                  Star on GitHub
                  <ArrowRight
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/documentation/custom-modules"
                  className="inline-flex items-center gap-2 px-8 py-3 text-base font-semibold text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-all duration-200"
                >
                  <Wrench className="w-5 h-5" aria-hidden="true" />
                  Build a Module
                </Link>
              </div>
              <p className="mt-8 text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Heart className="w-4 h-4 text-red-500" aria-hidden="true" />
                Built with care by{" "}
                <a
                  href="https://coderooz.in"
                  className="text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Coderooz
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/**
 * Featured module card.
 *
 * @ai-agent Shows the engine badge and the module tier so a visitor can tell at a glance
 *            what powers the block. Both values come from the registry, not local props.
 */
function ModuleCard({ module }: { module: EditorModule }) {
  const Icon = MODULE_ICONS[module.id] ?? Layers;
  const engineLabel = ENGINE_LABELS[module.engine];

  return (
    <article className="flex flex-col p-6 bg-background rounded-xl border border-border hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
          <Icon className="w-6 h-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">{module.title}</h3>
          <div className="mt-1 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {engineLabel} Editor
            </span>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {module.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground mb-4 leading-relaxed">{module.summary}</p>

      <ul className="space-y-2 mb-6 flex-1" role="list">
        {module.features.slice(0, 5).map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <svg
              className="w-4 h-4 text-primary flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={module.href}
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors w-full justify-center py-2 px-4 rounded-lg border border-primary/20 hover:bg-primary/5 transition-all"
      >
        Try {module.title}
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </article>
  );
}
