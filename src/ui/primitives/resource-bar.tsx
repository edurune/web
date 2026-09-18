import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useLingui } from "@lingui/react/macro";
import { color, resource } from "../tokens/color.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { borderWidth } from "../tokens/border.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import type { Size } from "../types.ts";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { toPercent } from "./meter.tsx";

export type ResourceBarKind = "health" | "mana" | "shield";

const LOW_HEALTH_RATIO = 0.25;
const WARNING_HEALTH_RATIO = 0.5;

export interface ResourceBarProps {
  kind: ResourceBarKind;
  value: number;
  max: number;
  /** Absorbed damage drawn over the health fill, from combatant.shield. */
  shield?: number;
  size?: Size;
  label: string;
  icon?: PhosphorIcon;
  showValue?: boolean;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    width: "100%",
    minWidth: 0,
  },
  track: {
    position: "relative",
    flex: 1,
    overflow: "hidden",
    borderStyle: "solid",
    borderWidth: borderWidth.thin,
    borderColor: color.borderStrong,
    borderRadius: radius.pill,
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
    transitionProperty: "width, background-color",
    transitionDuration: duration.normal,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": {
      transitionDuration: duration.instant,
    },
  },
  shieldOverlay: {
    position: "absolute",
    insetBlock: 0,
    insetInlineStart: 0,
    backgroundColor: resource.shieldFill,
    borderRadius: radius.pill,
    opacity: 0.85,
  },
  value: {
    fontFamily: font.display,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    fontVariantNumeric: "tabular-nums",
    color: color.textSecondary,
  },
  width: (percent: number) => ({ width: `${percent}%` }),
});

const sizes = stylex.create({
  sm: { height: "8px" },
  md: { height: "14px" },
  lg: { height: "20px" },
});

const tracks = stylex.create({
  health: { backgroundColor: resource.healthTrack },
  mana: { backgroundColor: resource.manaTrack },
  shield: { backgroundColor: resource.shieldTrack },
});

const fills = stylex.create({
  health: { backgroundColor: resource.healthFill },
  healthWarning: { backgroundColor: resource.healthWarningFill },
  healthLow: { backgroundColor: resource.healthLowFill },
  mana: { backgroundColor: resource.manaFill },
  shield: { backgroundColor: resource.shieldFill },
});

export function ResourceBar({
  kind,
  value,
  max,
  shield = 0,
  size = "md",
  label,
  icon: Glyph,
  showValue = true,
  style,
}: ResourceBarProps) {
  const { t } = useLingui();
  const percent = toPercent(value, max);
  const shieldPercent = toPercent(shield, max);
  const healthRatio = max > 0 ? value / max : 1;
  const low = kind === "health" && healthRatio <= LOW_HEALTH_RATIO;
  const warning = kind === "health" && healthRatio < WARNING_HEALTH_RATIO;

  return (
    <div {...stylex.props(styles.root, style)}>
      {Glyph ? <Glyph size={iconSize.sm} weight="bold" /> : null}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        aria-valuetext={t`${value} of ${max}`}
        {...stylex.props(styles.track, tracks[kind], sizes[size])}
      >
        <div
          {...stylex.props(
            styles.fill,
            low ? fills.healthLow : warning ? fills.healthWarning : fills[kind],
            styles.width(percent),
          )}
        />
        {shield > 0 ? (
          <div {...stylex.props(styles.shieldOverlay, styles.width(shieldPercent))} />
        ) : null}
      </div>
      {showValue ? (
        <span {...stylex.props(styles.value)}>
          {value}
          <span aria-hidden="true">/</span>
          {max}
        </span>
      ) : null}
    </div>
  );
}
