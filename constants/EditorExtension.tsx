/**
 * @file /constants/EditorExtension.tsx
 * @description Declares the TipTap extension presets and the heading/list/image customisations shared by all four editor modes.
 * @architecture Static Configuration Module
 * @project Editor Blocks — these presets back the modules catalogued in
 *          @/constants/module-registry. Presets are currently TipTap-specific; the registry's
 *          `engine` field is what will let a second engine be introduced later.
 * @ai-hint Register a link extension exactly once — MarkdownLink already extends Link and re-registering Link produces a duplicate 'link' extension. Keep extension names matching the commands used in EditorMenuOptions.
 * @ai-agent INVARIANT: presets spread upward. DEFAULT ⊂ COMPLEX ⊂ {BLOG, DOCUMENT, PRESENTATION}.
 *            To add a capability most modules should get, add it to the lowest preset that
 *            needs it rather than patching each tier — otherwise the tiers stop being
 *            cumulative and the docs' feature matrix becomes a lie.
 * @ai-agent INVARIANT: every id in the provider's module → preset map (context/EditorContext.tsx)
 *            must resolve to a preset exported here. An unresolved id falls back to
 *            DEFAULT_EXTENSIONS and fails silently.
 * @ai-agent `createLowlight(all)` bundles every supported language into the client bundle.
 *            If bundle size becomes a concern, swap to `createLowlight(common)` or register
 *            only the languages the project actually documents.
 * @ai-agent Image allows base64 sources and FileHandler accepts pasted/dropped images. The
 *            editor does not sanitise; consumers must sanitise before persisting HTML.
 * @ai-agent @deprecated-pending — DEFAULT_EXTENSIONS is the fallback tier, not a published
 *            module. The `default` EditorType value exists but no route mounts it.
 * @dependencies Requires @tiptap/core and @tiptap/extension-* packages, MarkdownLink.
 */

import Bold from "@tiptap/extension-bold";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Underline from "@tiptap/extension-underline";
import Code from "@tiptap/extension-code";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import { Heading as BaseHeading } from "@tiptap/extension-heading";
import type { Level } from "@tiptap/extension-heading";
import { mergeAttributes } from "@tiptap/core";
import Youtube from "@tiptap/extension-youtube";
import { CharacterCount, UndoRedo } from "@tiptap/extensions";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { MarkdownLink } from "@/extensions/MarkDownLink";
import {
  Details,
  DetailsContent,
  DetailsSummary,
} from "@tiptap/extension-details";
import { TableKit } from "@tiptap/extension-table";

import {
  TextStyle,
  Color,
  BackgroundColor,
  FontFamily,
  FontSize,
  LineHeight,
} from "@tiptap/extension-text-style";
import Image from "@tiptap/extension-image";
import FileHandler from "@tiptap/extension-file-handler";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Blockquote from "@tiptap/extension-blockquote";
import { all, createLowlight } from "lowlight";

const lowlight = createLowlight(all);

const baseAttr = {
  HTMLAttributes: {
    class: "editor-text prose prose-sm md:prose md:max-w-none",
  },
};

async function fileUploader(file: File, currentEditor: { chain: () => { focus: () => any; run: () => any; insertContentAt: (pos: number, content: any) => any } }, pos: number) {
  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = () => {
    currentEditor
      .chain()
      .insertContentAt(pos, {
        type: "image",
        attrs: {
          src: fileReader.result,
        },
      })
      .focus()
      .run();
  };
}

/** Custom Heading with per-level classes (Tailwind included) */
const Heading = BaseHeading.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      levels: [1, 2, 3, 4, 5, 6] as Level[],
      HTMLAttributes: {},
      levelClassMap: {
        1: "text-4xl font-bold leading-tight mt-0 mb-4",
        2: "text-3xl font-semibold leading-snug mt-6 mb-3",
        3: "text-2xl font-semibold leading-snug mt-6 mb-3",
        4: "text-xl font-medium mt-6 mb-2",
        5: "text-lg font-medium mt-6 mb-2",
        6: "text-base font-normal mt-6 mb-1",
      } as Record<Level, string>,
    };
  },
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs["level"] as Level;
    const options = this.options as unknown as { levelClassMap: Record<number, string>; HTMLAttributes: Record<string, unknown> };
    const levelClass = options.levelClassMap[level] || "";
    return [
      `h${level}`,
      mergeAttributes(options.HTMLAttributes, HTMLAttributes, {
        class: levelClass,
      }),
      0,
    ];
  },
});

/**
 * Basic formatting shared by every tier.
 *
 * @ai-agent These are configured ONCE and spread into both the base and the complex tier.
 *            Configuring the same extension separately in two presets registers it twice and
 *            TipTap logs a duplicate-extension warning, so never inline them again in
 *            COMPLEX_EXTENSIONS.
 * @ai-agent The base tier needs them because MENU_BTN_ITEMS renders a Strike button and the
 *            comment module's seed content carries <code>, <ul> and <ol>. Before this split
 *            the base tier had none of them: clicking Strike threw
 *            `toggleStrike is not a function` and the seeded lists were flattened into plain
 *            paragraphs on load, while the registry advertised all of them as shipped.
 */
const StrikeExt = Strike.configure({
  HTMLAttributes: {
    class: "line-through text-gray-500",
  },
});

const CodeExt = Code.configure({
  HTMLAttributes: {
    class: "bg-gray-100 px-1 rounded text-sm font-mono",
  },
});

const BulletListExt = BulletList.configure({
  itemTypeName: "listItem",
  keepAttributes: true,
  keepMarks: true,
  HTMLAttributes: {
    class: "list-disc list-outside mb-4 space-y-2 pl-6",
  },
});

const OrderedListExt = OrderedList.configure({
  itemTypeName: "listItem",
  keepMarks: true,
  keepAttributes: true,
  HTMLAttributes: {
    class: "list-decimal list-outside mb-4 space-y-2 pl-6",
  },
});

const ListItemExt = ListItem.configure({
  HTMLAttributes: {
    class: "mb-1",
  },
});

export const DEFAULT_EXTENSIONS = [
  Document.configure(baseAttr),
  Paragraph.configure({
    HTMLAttributes: {
      class: "mb-4 mt-0",
    },
  }),
  Text.configure(baseAttr),
  Italic.configure(baseAttr),
  Bold.configure(baseAttr),
  Underline.configure(baseAttr),
  CodeExt,
  StrikeExt,
  BulletListExt,
  OrderedListExt,
  ListItemExt,
  // `MarkdownLink` IS `Link` plus a `[label](url)` input rule. Register only one
  // of the two — registering both yields two extensions named "link".
  MarkdownLink.configure({
    openOnClick: true,
    autolink: true,
    defaultProtocol: "http",
    HTMLAttributes: {
      class: "text-blue-600 hover:underline hover:opacity-80",
    },
  }),
  TextAlign.configure({
    types: ["heading", "paragraph"],
    alignments: ["left", "center", "right", "justify"],
  }),
  UndoRedo.configure({ depth: 50, newGroupDelay: 500 }),
  Typography,
  Blockquote.configure({
    HTMLAttributes: {
      class: "my-custom-class",
    },
  }),
];

export const COMPLEX_EXTENSIONS = [
  // Code, Strike and the three list extensions are inherited from DEFAULT — do not
  // re-declare them here or TipTap registers each one twice.
  ...DEFAULT_EXTENSIONS,
  CodeBlockLowlight.configure({
    lowlight,
    exitOnTripleEnter: false,
    languageClassPrefix: "language-",
    enableTabIndentation: true,
    defaultLanguage: "plaintext",
    tabSize: 4,
    HTMLAttributes: {
      class: "bg-gray-500 p-2 rounded text-sm font-mono",
    },
  }),
  Highlight.configure({
    multicolor: true,
    HTMLAttributes: {
      class: "bg-yellow-200 text-yellow-900",
    },
  }),
  Subscript.configure({
    HTMLAttributes: {
      class: "align-sub",
    },
  }),
  Superscript.configure({
    HTMLAttributes: {
      class: "align-super",
    },
  }),
  TextStyle.configure(baseAttr),
  Color.configure({ types: ["textStyle"] }),
  BackgroundColor.configure({ types: ["textStyle"] }),
  Heading, // Use our custom Heading
  FontFamily.configure({
    types: ["textStyle"],
  }),
  FontSize.configure({
    types: ["textStyle"],
  }),
  LineHeight.configure({
    types: ["textStyle"],
  }),
  Details.configure({
    HTMLAttributes: {
      class: "border rounded-md p-3 my-3 bg-gray-50",
    },
  }),
  DetailsSummary.configure({
    HTMLAttributes: {
      class: "font-semibold cursor-pointer",
    },
  }),
  DetailsContent.configure({
    HTMLAttributes: {
      class: "text-sm mt-2",
    },
  }),
  HorizontalRule.configure({
    HTMLAttributes: {
      class: "my-6 border-gray-300",
    },
  }),
  Image.configure({
    inline: true,
    allowBase64: true,
    HTMLAttributes: {
      class: "my-4 max-w-full rounded",
    },
  }),
  FileHandler.configure({
    allowedMimeTypes: ["image/png", "image/jpeg", "image/gif", "image/webp"],
    onDrop: (editor: { chain: () => { focus: () => any; run: () => any; insertContentAt: (pos: number, content: any) => any } }, files: File[], pos: number) => {
      files.forEach((file) => {
        fileUploader(file, editor, pos);
      });
    },
    onPaste: (editor: { chain: () => { focus: () => any; run: () => any; insertContentAt: (pos: number, content: any) => any }; state: { selection: { anchor: number } } }, files: File[], htmlContent?: string) => {
      if (htmlContent) {
        return false;
      }
      files.forEach((file) => {
        fileUploader(file, editor, editor.state.selection.anchor);
      });
      return true;
    },
  }),
  TableKit.configure({
    table: {
      resizable: true,
      HTMLAttributes: {
        class:
          "border border-gray-300 border-collapse table-auto w-full rounded-md overflow-hidden",
      },
    },
    tableHeader: {
      HTMLAttributes: {
        class:
          "bg-gray-200 text-left font-semibold border border-gray-300 px-2 py-1",
      },
    },
    tableCell: {
      HTMLAttributes: {
        class: "border border-gray-300 px-2 py-1 align-top",
      },
    },
    tableRow: {
      HTMLAttributes: {
        class: "",
      },
    },
  }),
  Youtube.configure({
    inline: false,
    allowFullscreen: true,
    autoplay: true,
    controls: false,
    nocookie: true,
    ccLanguage: "en",
    ccLoadPolicy: true,
    enableIFrameApi: true,
    disableKBcontrols: false,
    interfaceLanguage: "en",
  }),
];

export const BLOG_EXTENSIONS = [...COMPLEX_EXTENSIONS];

export const DOCUMENT_EXTENSIONS = [
  ...COMPLEX_EXTENSIONS,
  CharacterCount.configure({
    mode: "textSize",
  }),
];

export const COMMENT_EXTENSIONS = [
  ...DEFAULT_EXTENSIONS,
  CharacterCount.configure({
    limit: 2500,
    // textSize, not nodeSize: the registry and the docs promise a "2,500 character"
    // ceiling, and nodeSize counts structural markup, so the cap fired a few characters
    // early and disagreed with the counter the user actually sees.
    mode: "textSize",
  }),
];

export const PRESENTATION_EXTENSIONS = [
  ...COMPLEX_EXTENSIONS,
  CharacterCount.configure({
    mode: "textSize",
  }),
];
