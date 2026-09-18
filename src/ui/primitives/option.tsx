import { CheckIcon, XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef, ReactNode } from "react";
import type { CueName } from "../sound/sound.ts";
import { color } from "../tokens/color.stylex.ts";
import { palette } from "../tokens/palette.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../tokens/text.stylex.ts";
import { controlStyles } from "./control-styles.ts";

export type OptionState = "default" | "correct" | "incorrect";

// One answer in a choice question. `state` is grading feedback and is applied
// after submission, independently of what the learner selected.
export interface OptionProps extends Omit<ComponentPropsWithRef<"button">, "style"> {
  children: ReactNode;
  selected?: boolean;
  state?: OptionState;
  /** Square marker for multi-select, round for single-select. */
  multi?: boolean;
  /** Opt in to a hover cue. Reserve it for surfaces meant to be browsed. */
  hover?: CueName | null;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    inlineSize: "100%",
    minBlockSize: press.height,
    paddingBlock: space.sm,
    paddingInline: space.md,
    backgroundColor: {
      default: color.surfaceRaised,
      ":hover:not(:disabled)": color.neutralFillHover,
    },
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBottomWidth: press.lipWidth,
    borderColor: press.edgeColor,
    borderRadius: radius.lg,
    color: color.textPrimary,
    cursor: { default: "pointer", ":disabled": "not-allowed" },
    fontFamily: font.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    lineHeight: lineHeight.snug,
    textAlign: "start",
  },
  selected: {
    backgroundColor: { default: color.accentSoft, ":hover:not(:disabled)": color.accentSoft },
  },
  correct: {
    backgroundColor: { default: color.positiveSoft, ":hover:not(:disabled)": color.positiveSoft },
  },
  incorrect: {
    backgroundColor: { default: color.negativeSoft, ":hover:not(:disabled)": color.negativeSoft },
  },
  disabled: {
    backgroundColor: color.disabledSurface,
    borderColor: palette.paper400,
    borderBottomWidth: press.edgeWidth,
    color: color.textDisabled,
  },
  label: { flex: 1, minInlineSize: 0 },
  marker: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    inlineSize: "24px",
    blockSize: "24px",
    backgroundColor: color.surfaceRaised,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderColor: press.edgeColor,
    color: color.textOnFill,
  },
  markerSingle: { borderRadius: radius.circle },
  markerMulti: { borderRadius: radius.sm },
  markerSelected: { backgroundColor: color.accentFill },
  markerCorrect: { backgroundColor: color.positiveFill },
  markerIncorrect: { backgroundColor: color.negativeFill },
});

export function Option({
  children,
  selected = false,
  state = "default",
  multi = false,
  hover = null,
  disabled = false,
  type = "button",
  style,
  ...rest
}: OptionProps) {
  const graded = state !== "default";
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      aria-pressed={selected}
      data-uisfx={multi && selected ? "deselect" : "select"}
      data-uisfx-hover={hover ?? undefined}
      {...stylex.props(
        styles.root,
        controlStyles.focusRing,
        !disabled && controlStyles.pressable,
        selected && !graded && styles.selected,
        state === "correct" && styles.correct,
        state === "incorrect" && styles.incorrect,
        disabled && styles.disabled,
        style,
      )}
    >
      <span
        {...stylex.props(
          styles.marker,
          multi ? styles.markerMulti : styles.markerSingle,
          selected && !graded && styles.markerSelected,
          state === "correct" && styles.markerCorrect,
          state === "incorrect" && styles.markerIncorrect,
        )}
      >
        {state === "incorrect" ? (
          <XIcon size={iconSize.sm} weight="bold" />
        ) : state === "correct" || selected ? (
          <CheckIcon size={iconSize.sm} weight="bold" />
        ) : null}
      </span>
      <span {...stylex.props(styles.label)}>{children}</span>
    </button>
  );
}
