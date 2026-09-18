import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef, MouseEvent } from "react";
import type { CueName } from "../sound/sound.ts";
import { color } from "../tokens/color.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font } from "../tokens/text.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";

const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    minInlineSize: space.none,
    textAlign: "start",
    paddingInline: space.md,
    paddingBlockStart: space.md,
    paddingBlockEnd: space.md,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBlockEndWidth: press.lipWidth,
    translate: { default: "none", ":active:not(:disabled)": `0 ${press.lipTravel}` },
    transitionProperty: "translate, background-color",
    transitionDuration: duration.instant,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: duration.none },
    borderColor: color.borderStrong,
    borderRadius: radius.xl,
    backgroundColor: { default: color.surfaceRaised, ":hover:not(:disabled)": color.neutralSoft },
    color: { default: color.textPrimary, ":disabled": color.textSecondary },
    fontFamily: font.body,
    cursor: { default: "pointer", ":disabled": "default" },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: press.edgeWidth,
    outlineColor: color.borderFocus,
    outlineOffset: space.xxs,
  },
  blocked: {
    translate: "none",
    backgroundColor: color.surfaceRaised,
    color: color.textSecondary,
    cursor: "default",
  },
});
export interface CardButtonProps extends Omit<ComponentPropsWithRef<"button">, "style"> {
  /** The cue this press means. `null` silences it. */
  cue?: CueName | null;
  /** Refuses the press and says so, instead of going dead like `disabled`. */
  blocked?: boolean;
  /** Opt in to a hover cue. Reserve it for surfaces meant to be browsed. */
  hover?: CueName | null;
  style?: StyleXStyles;
}
/** A multi-line pressable card with one contour and a fixed-depth press. */
export function CardButton({
  children,
  cue = "press",
  hover = null,
  blocked = false,
  disabled = false,
  onClick,
  style,
  type = "button",
  ...props
}: CardButtonProps) {
  const refusing = blocked && !disabled;
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      aria-disabled={refusing || undefined}
      data-uisfx={refusing ? "blocked" : disabled ? undefined : (cue ?? undefined)}
      data-uisfx-hover={disabled ? undefined : (hover ?? undefined)}
      onClick={refusing ? preventPress : onClick}
      {...stylex.props(styles.root, refusing && styles.blocked, style)}
    >
      {children}
    </button>
  );
}

const preventPress = (event: MouseEvent<HTMLButtonElement>) => event.preventDefault();
