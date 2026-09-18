import { CaretRightIcon, type Icon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ComponentPropsWithRef, ReactNode } from "react";
import type { CueName } from "../sound/sound.ts";
import { borderWidth } from "../tokens/border.stylex.ts";
import { color } from "../tokens/color.stylex.ts";
import { layout } from "../tokens/layout.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { control } from "../tokens/size.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../tokens/text.stylex.ts";

export interface ActionRowProps extends Omit<ComponentPropsWithRef<"button">, "style" | "title"> {
  icon: Icon;
  title: ReactNode;
  detail?: ReactNode;
  trailing?: ReactNode;
  tone?: "sage" | "gold" | "neutral";
  /** The cue this press means. `null` silences it. */
  cue?: CueName | null;
  /** Opt in to a hover cue. Reserve it for surfaces meant to be browsed. */
  hover?: CueName | null;
  style?: StyleXStyles;
}
const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    inlineSize: layout.full,
    minInlineSize: space.none,
    blockSize: space.huge,
    paddingInline: space.md,
    paddingBlockStart: space.none,
    paddingBlockEnd: space.none,
    borderWidth: press.edgeWidth,
    borderBlockEndWidth: press.lipWidth,
    translate: { default: "none", ":active:not(:disabled)": `0 ${press.lipTravel}` },
    transitionProperty: "translate, background-color",
    transitionDuration: duration.instant,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: duration.none },
    borderStyle: "solid",
    borderColor: color.borderStrong,
    borderRadius: radius.lg,
    backgroundColor: { default: color.surfaceRaised, ":hover:not(:disabled)": color.neutralSoft },
    color: color.textPrimary,
    fontFamily: font.display,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.snug,
    textAlign: "start",
    cursor: "pointer",
    outlineColor: color.borderFocus,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    inlineSize: control.sm,
    blockSize: control.sm,
    borderWidth: borderWidth.thick,
    borderStyle: "solid",
    borderColor: color.borderStrong,
    borderRadius: radius.md,
  },
  copy: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
    flex: 1,
    minInlineSize: space.none,
  },
  detail: { fontSize: fontSize.sm, fontWeight: fontWeight.medium, color: color.textSecondary },
  trailing: {
    display: "flex",
    alignItems: "center",
    gap: space.xs,
    flexShrink: 0,
    fontSize: fontSize.sm,
  },
  caret: { flexShrink: 0 },
});
const tones = stylex.create({
  sage: { backgroundColor: color.accentFill },
  gold: { backgroundColor: color.cautionFill },
  neutral: { backgroundColor: color.surfaceSunken },
});
export function ActionRow({
  icon: Glyph,
  title,
  detail,
  trailing,
  tone = "neutral",
  cue = "forward",
  hover = null,
  style,
  ...rest
}: ActionRowProps) {
  return (
    <button
      {...rest}
      type="button"
      data-uisfx={cue ?? undefined}
      data-uisfx-hover={hover ?? undefined}
      {...stylex.props(styles.root, style)}
    >
      <span aria-hidden="true" {...stylex.props(styles.icon, tones[tone])}>
        <Glyph weight="bold" size={iconSize.md} />
      </span>
      <span {...stylex.props(styles.copy)}>
        <span>{title}</span>
        {detail && <span {...stylex.props(styles.detail)}>{detail}</span>}
      </span>
      {trailing && <span {...stylex.props(styles.trailing)}>{trailing}</span>}
      <CaretRightIcon
        weight="bold"
        size={iconSize.sm}
        aria-hidden="true"
        {...stylex.props(styles.caret)}
      />
    </button>
  );
}
