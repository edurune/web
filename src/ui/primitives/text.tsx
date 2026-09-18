import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ElementType, ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { font, fontSize, fontWeight, letterSpacing, lineHeight } from "../tokens/text.stylex.ts";

export type TextVariant =
  | "display"
  | "title"
  | "heading"
  | "subheading"
  | "body"
  | "bodyStrong"
  | "label"
  | "caption"
  | "overline"
  | "stat";

export type TextTone =
  | "primary"
  | "secondary"
  | "muted"
  | "disabled"
  | "inverse"
  | "link"
  | "positive"
  | "negative"
  | "caution"
  | "inherit";

const defaultElements: Record<TextVariant, ElementType> = {
  display: "h1",
  title: "h1",
  heading: "h2",
  subheading: "h3",
  body: "p",
  bodyStrong: "p",
  label: "span",
  caption: "span",
  overline: "span",
  stat: "span",
};

export interface TextProps {
  children?: ReactNode;
  variant?: TextVariant;
  tone?: TextTone;
  align?: "start" | "center" | "end";
  /** Clamp to N lines with an ellipsis. */
  lines?: number;
  as?: ElementType;
  id?: string;
  style?: StyleXStyles;
}

const variants = stylex.create({
  display: {
    fontFamily: font.display,
    fontSize: fontSize.display,
    fontWeight: fontWeight.heavy,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  title: {
    fontFamily: font.display,
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.tight,
    letterSpacing: letterSpacing.tight,
  },
  heading: {
    fontFamily: font.display,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
  },
  subheading: {
    fontFamily: font.display,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  body: {
    fontFamily: font.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.normal,
  },
  bodyStrong: {
    fontFamily: font.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.normal,
  },
  label: {
    fontFamily: font.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
  },
  caption: {
    fontFamily: font.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.regular,
    lineHeight: lineHeight.snug,
  },
  overline: {
    fontFamily: font.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
    letterSpacing: letterSpacing.caps,
    textTransform: "uppercase",
  },
  stat: {
    fontFamily: font.display,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.heavy,
    lineHeight: lineHeight.tight,
    fontVariantNumeric: "tabular-nums",
  },
});

const tones = stylex.create({
  primary: { color: color.textPrimary },
  secondary: { color: color.textSecondary },
  muted: { color: color.textMuted },
  disabled: { color: color.textDisabled },
  inverse: { color: color.textInverse },
  link: { color: color.textLink },
  positive: { color: color.positiveStrong },
  negative: { color: color.negativeStrong },
  caution: { color: color.cautionStrong },
  inherit: { color: "inherit" },
});

const alignments = stylex.create({
  start: { textAlign: "start" },
  center: { textAlign: "center" },
  end: { textAlign: "end" },
});

const styles = stylex.create({
  root: {
    margin: 0,
    minWidth: 0,
  },
  clamp: (lines: number) => ({
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: lines,
    overflow: "hidden",
  }),
});

export function Text({
  children,
  variant = "body",
  tone = "primary",
  align = "start",
  lines,
  as,
  id,
  style,
}: TextProps) {
  const Component = as ?? defaultElements[variant];
  return (
    <Component
      id={id}
      {...stylex.props(
        styles.root,
        variants[variant],
        tones[tone],
        alignments[align],
        lines != null && styles.clamp(lines),
        style,
      )}
    >
      {children}
    </Component>
  );
}
