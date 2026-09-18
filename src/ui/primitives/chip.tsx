import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef, ReactNode } from "react";
import type { CueName } from "../sound/sound.ts";
import { color } from "../tokens/color.stylex.ts";
import { palette } from "../tokens/palette.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import { controlStyles } from "./control-styles.ts";

export type ChipState = "default" | "correct" | "incorrect";

// Tappable token for letter banks, ordering trays, and matching columns.
export interface ChipProps extends Omit<ComponentPropsWithRef<"button">, "style"> {
  children: ReactNode;
  selected?: boolean;
  /** Already placed elsewhere: holds its slot but reads as unavailable. */
  spent?: boolean;
  state?: ChipState;
  size?: "sm" | "md";
  /** The cue this tap means. `null` silences it. */
  cue?: CueName | null;
  /** Opt in to a hover cue. Reserve it for surfaces meant to be browsed. */
  hover?: CueName | null;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    blockSize: press.height,
    paddingBlock: 0,
    backgroundColor: {
      default: color.surfaceRaised,
      ":hover:not(:disabled)": color.neutralFillHover,
    },
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBottomWidth: press.lipWidth,
    borderColor: press.edgeColor,
    borderRadius: radius.md,
    color: color.textPrimary,
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    fontFamily: font.display,
    fontWeight: fontWeight.bold,
    userSelect: "none",
    whiteSpace: "nowrap",
  },
  selected: {
    backgroundColor: {
      default: color.accentFill,
      ":hover:not(:disabled)": color.accentFill,
    },
  },
  correct: {
    backgroundColor: { default: color.positiveFill, ":hover:not(:disabled)": color.positiveFill },
  },
  incorrect: {
    backgroundColor: { default: color.negativeFill, ":hover:not(:disabled)": color.negativeFill },
  },
  // Keeps the slot so the bank does not reflow while an answer is built.
  spent: {
    backgroundColor: color.surfaceSunken,
    borderColor: palette.paper400,
    borderBottomWidth: press.edgeWidth,
    paddingBlockStart: press.lipTravel,
    color: "transparent",
    cursor: "default",
  },
});

const sizes = stylex.create({
  sm: { paddingInline: space.sm, fontSize: fontSize.sm },
  md: { paddingInline: space.md, fontSize: fontSize.md },
});

const depthSm = stylex.createTheme(press, { height: "32px", lipWidth: "4px", lipTravel: "2px" });
const depthMd = stylex.createTheme(press, { height: "44px" });
const sizeDepth = { sm: depthSm, md: depthMd };

export function Chip({
  children,
  selected = false,
  spent = false,
  state = "default",
  size = "md",
  disabled = false,
  type = "button",
  cue = "select",
  hover = null,
  style,
  ...rest
}: ChipProps) {
  const inert = disabled || spent;
  return (
    <button
      {...rest}
      type={type}
      disabled={inert}
      aria-pressed={spent ? undefined : selected}
      aria-hidden={spent || undefined}
      data-uisfx={cue ?? undefined}
      data-uisfx-hover={inert ? undefined : (hover ?? undefined)}
      {...stylex.props(
        sizeDepth[size],
        styles.root,
        controlStyles.focusRing,
        sizes[size],
        !inert && controlStyles.pressable,
        selected && state === "default" && styles.selected,
        state === "correct" && styles.correct,
        state === "incorrect" && styles.incorrect,
        spent && styles.spent,
        style,
      )}
    >
      {children}
    </button>
  );
}
