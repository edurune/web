import type { ReactNode } from "react";
import { MarkdownHooks, type Components, type UrlTransform } from "react-markdown";
import type { PluggableList } from "unified";
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import "katex/dist/katex.min.css";
import { borderWidth } from "../tokens/border.stylex.ts";
import { color } from "../tokens/color.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../tokens/text.stylex.ts";

const styles = stylex.create({
  document: {
    display: "flex",
    flexDirection: "column",
    gap: space.lg,
    minInlineSize: space.none,
    color: color.textPrimary,
    fontFamily: font.body,
    fontSize: fontSize.md,
    lineHeight: lineHeight.relaxed,
    overflowWrap: "anywhere",
  },
  inline: { display: "inline", overflowWrap: "anywhere" },
  heading1: {
    margin: space.none,
    fontFamily: font.display,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
  },
  heading2: {
    margin: space.none,
    fontFamily: font.display,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  heading3: {
    margin: space.none,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  paragraph: { margin: space.none },
  quote: {
    margin: space.none,
    padding: space.lg,
    borderInlineStartWidth: borderWidth.thick,
    borderInlineStartStyle: "solid",
    borderInlineStartColor: color.borderStrong,
    backgroundColor: color.surfaceWarm,
  },
  list: { margin: space.none, paddingInlineStart: space.xl },
  code: {
    paddingInline: space.xs,
    borderRadius: radius.xs,
    backgroundColor: color.surfaceSunken,
    fontFamily: font.mono,
  },
  codeBlock: {
    overflow: "auto",
    margin: space.none,
    padding: space.md,
    borderRadius: radius.sm,
    backgroundColor: color.surfaceSunken,
  },
  link: { color: color.textLink, textDecoration: "underline" },
  rule: {
    inlineSize: "100%",
    margin: space.none,
    borderBlockStartWidth: borderWidth.hairline,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color.borderDefault,
    borderInlineWidth: borderWidth.none,
    borderBlockEndWidth: borderWidth.none,
  },
  tableScroll: { maxInlineSize: "100%", overflowX: "auto" },
  table: {
    inlineSize: "100%",
    borderCollapse: "collapse",
    borderSpacing: space.none,
  },
  tableCell: {
    paddingBlock: space.sm,
    paddingInline: space.md,
    borderWidth: borderWidth.hairline,
    borderStyle: "solid",
    borderColor: color.borderDefault,
    textAlign: "start",
    verticalAlign: "top",
  },
  tableHeading: { backgroundColor: color.surfaceSunken, fontWeight: fontWeight.semibold },
});

// Mermaid derives shades with colour maths, so it needs literal values rather
// than the StyleX custom properties.
const mermaidPlugin: PluggableList[number] = [
  rehypeMermaid,
  {
    strategy: "inline-svg",
    mermaidConfig: {
      theme: "base",
      themeVariables: {
        background: "#fffefb",
        primaryColor: "#f4eddc",
        primaryTextColor: "#303047",
        primaryBorderColor: "#303047",
        secondaryColor: "#deebdc",
        tertiaryColor: "#eeefe6",
        lineColor: "#303047",
        textColor: "#303047",
      },
    },
  },
];

const documentComponents: Components = {
  h1: ({ children }) => <h2 {...stylex.props(styles.heading1)}>{children}</h2>,
  h2: ({ children }) => <h3 {...stylex.props(styles.heading2)}>{children}</h3>,
  h3: ({ children }) => <h4 {...stylex.props(styles.heading3)}>{children}</h4>,
  h4: ({ children }) => <h5 {...stylex.props(styles.heading3)}>{children}</h5>,
  p: ({ children }) => <p {...stylex.props(styles.paragraph)}>{children}</p>,
  blockquote: ({ children }) => <blockquote {...stylex.props(styles.quote)}>{children}</blockquote>,
  ul: ({ children }) => <ul {...stylex.props(styles.list)}>{children}</ul>,
  ol: ({ children }) => <ol {...stylex.props(styles.list)}>{children}</ol>,
  code: ({ children }) => <code {...stylex.props(styles.code)}>{children}</code>,
  pre: ({ children }) => <pre {...stylex.props(styles.codeBlock)}>{children}</pre>,
  hr: () => <hr {...stylex.props(styles.rule)} />,
  table: ({ children }) => (
    <div {...stylex.props(styles.tableScroll)}>
      <table {...stylex.props(styles.table)}>{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th {...stylex.props(styles.tableCell, styles.tableHeading)}>{children}</th>
  ),
  td: ({ children }) => <td {...stylex.props(styles.tableCell)}>{children}</td>,
  a: ({ children, href }) => {
    const external = href != null && !href.startsWith("#");
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-uisfx="forward"
        {...stylex.props(styles.link)}
      >
        {children}
      </a>
    );
  },
};

const Inline = ({ children }: { children?: ReactNode }) => <span>{children}</span>;
const inlineComponents: Components = {
  h1: Inline,
  h2: Inline,
  h3: Inline,
  h4: Inline,
  h5: Inline,
  h6: Inline,
  p: Inline,
  blockquote: Inline,
  ul: Inline,
  ol: Inline,
  li: Inline,
  pre: Inline,
  table: Inline,
  thead: Inline,
  tbody: Inline,
  tr: Inline,
  th: Inline,
  td: Inline,
  section: Inline,
  a: Inline,
  hr: () => null,
  input: () => null,
  code: ({ children }) => <code {...stylex.props(styles.code)}>{children}</code>,
};

export interface MarkdownContentProps {
  markdown: string;
  /** Use phrasing elements when the content sits inside a button or label. */
  inline?: boolean;
  id?: string;
  image?: NonNullable<Components["img"]>;
  urlTransform?: UrlTransform;
  style?: StyleXStyles;
}

/** Safe authored content with shared support for GFM and TeX math. */
export function MarkdownContent({
  markdown,
  inline = false,
  id,
  image,
  urlTransform,
  style,
}: MarkdownContentProps) {
  const components = inline
    ? inlineComponents
    : image
      ? { ...documentComponents, img: image }
      : documentComponents;
  // `rehype-mermaid` is asynchronous, so rendering goes through the hook-based
  // renderer throughout.
  const content = (
    <MarkdownHooks
      skipHtml
      disallowedElements={inline || !image ? ["img"] : undefined}
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex, mermaidPlugin]}
      components={components}
      urlTransform={urlTransform}
    >
      {markdown}
    </MarkdownHooks>
  );

  return inline ? (
    <span id={id} {...stylex.props(styles.inline, style)}>
      {content}
    </span>
  ) : (
    <article id={id} {...stylex.props(styles.document, style)}>
      {content}
    </article>
  );
}
