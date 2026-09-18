import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ElementType, ReactNode } from "react";
import type { SpaceToken } from "../tokens/scale.ts";
import { space } from "../tokens/space.stylex.ts";

type Align = "start" | "center" | "end" | "stretch" | "baseline";
type Justify = "start" | "center" | "end" | "between" | "around";

export interface StackProps {
  children?: ReactNode;
  direction?: "row" | "column";
  gap?: SpaceToken;
  align?: Align;
  justify?: Justify;
  wrap?: boolean;
  inline?: boolean;
  as?: ElementType;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: "flex",
    minWidth: 0,
  },
  inline: {
    display: "inline-flex",
  },
  row: {
    flexDirection: "row",
  },
  column: {
    flexDirection: "column",
  },
  wrap: {
    flexWrap: "wrap",
  },
});

const gaps = stylex.create({
  none: { gap: space.none },
  xxs: { gap: space.xxs },
  xs: { gap: space.xs },
  sm: { gap: space.sm },
  md: { gap: space.md },
  lg: { gap: space.lg },
  xl: { gap: space.xl },
  xxl: { gap: space.xxl },
  xxxl: { gap: space.xxxl },
  huge: { gap: space.huge },
});

const alignments = stylex.create({
  start: { alignItems: "flex-start" },
  center: { alignItems: "center" },
  end: { alignItems: "flex-end" },
  stretch: { alignItems: "stretch" },
  baseline: { alignItems: "baseline" },
});

const justifications = stylex.create({
  start: { justifyContent: "flex-start" },
  center: { justifyContent: "center" },
  end: { justifyContent: "flex-end" },
  between: { justifyContent: "space-between" },
  around: { justifyContent: "space-around" },
});

export function Stack({
  children,
  direction = "column",
  gap = "md",
  align = direction === "row" ? "center" : "stretch",
  justify = "start",
  wrap = direction === "row",
  inline = false,
  as: Component = "div",
  style,
}: StackProps) {
  return (
    <Component
      {...stylex.props(
        styles.root,
        inline && styles.inline,
        styles[direction],
        wrap && styles.wrap,
        gaps[gap],
        alignments[align],
        justifications[justify],
        style,
      )}
    >
      {children}
    </Component>
  );
}
