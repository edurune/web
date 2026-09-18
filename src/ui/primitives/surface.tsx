import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import type { RadiusToken, SpaceToken } from "../tokens/scale.ts";
import { cornerStyles } from "../tokens/radius.stylex.ts";
import { borderWidth } from "../tokens/border.stylex.ts";
import { space } from "../tokens/space.stylex.ts";

export interface SurfaceProps extends Omit<ComponentPropsWithRef<"div">, "style"> {
  children?: ReactNode;
  tone?: "raised" | "sunken" | "warm" | "inverse";
  /** Depth comes from the ink contour and a thick bottom edge, never a shadow. */
  depth?: "flat" | "outlined" | "lifted";
  padding?: SpaceToken;
  corner?: RadiusToken;
  as?: ElementType;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    minWidth: 0,
    borderStyle: "solid",
    borderWidth: borderWidth.none,
    borderColor: "transparent",
  },
});

const tones = stylex.create({
  raised: { backgroundColor: color.surfaceRaised, color: color.textPrimary },
  sunken: { backgroundColor: color.surfaceSunken, color: color.textPrimary },
  warm: { backgroundColor: color.surfaceWarm, color: color.textPrimary },
  inverse: { backgroundColor: color.surfaceInverse, color: color.textInverse },
});

const depths = stylex.create({
  flat: {},
  outlined: { borderWidth: borderWidth.thick, borderColor: color.borderStrong },
  lifted: {
    borderWidth: borderWidth.thick,
    borderBottomWidth: press.lipWidth,
    borderColor: color.borderStrong,
  },
});

const paddings = stylex.create({
  none: { padding: space.none },
  xxs: { padding: space.xxs },
  xs: { padding: space.xs },
  sm: { padding: space.sm },
  md: { padding: space.md },
  lg: { padding: space.lg },
  xl: { padding: space.xl },
  xxl: { padding: space.xxl },
  xxxl: { padding: space.xxxl },
  huge: { padding: space.huge },
});

export function Surface({
  children,
  tone = "raised",
  depth = "outlined",
  padding = "lg",
  corner = "xl",
  as: Component = "div",
  style,
  ...rest
}: SurfaceProps) {
  return (
    <Component
      {...rest}
      {...stylex.props(
        styles.root,
        tones[tone],
        depths[depth],
        paddings[padding],
        cornerStyles[corner],
        style,
      )}
    >
      {children}
    </Component>
  );
}
