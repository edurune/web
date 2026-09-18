import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color, resource } from "../tokens/color.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import type { Size } from "../types.ts";

export type MeterTone = "accent" | "positive" | "caution" | "negative" | "info";

export interface MeterProps {
  value: number;
  /** Part of `value` just earned, drawn as a lighter segment at the end of the fill. */
  gain?: number;
  max?: number;
  tone?: MeterTone;
  size?: Size;
  label?: string;
  /** Hide the visible label while retaining the progress bar's accessible name. */
  showLabel?: boolean;
  /** Text shown beside the label, e.g. "3 / 8". */
  valueLabel?: string;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: space.xs,
    minWidth: 0,
  },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: space.sm,
    fontFamily: font.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: color.textSecondary,
  },
  track: {
    display: "flex",
    overflow: "hidden",
    width: "100%",
    backgroundColor: resource.progressTrack,
    borderRadius: radius.pill,
  },
  fill: {
    height: "100%",
    borderRadius: radius.pill,
    flexShrink: 0,
    transitionProperty: "width",
    transitionDuration: duration.normal,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": {
      transitionDuration: duration.instant,
    },
  },
  continued: { borderStartEndRadius: radius.none, borderEndEndRadius: radius.none },
  joined: { borderStartStartRadius: radius.none, borderEndStartRadius: radius.none },
  width: (percent: number) => ({ width: `${percent}%` }),
});

const sizes = stylex.create({
  sm: { height: "6px" },
  md: { height: "10px" },
  lg: { height: "16px" },
});

const tones = stylex.create({
  accent: { backgroundColor: color.accentFillActive },
  positive: { backgroundColor: color.positiveStrong },
  caution: { backgroundColor: color.cautionStrong },
  negative: { backgroundColor: color.negativeFillActive },
  info: { backgroundColor: color.infoStrong },
});

const gains = stylex.create({
  accent: { backgroundColor: color.accentFill },
  positive: { backgroundColor: color.positiveFill },
  caution: { backgroundColor: color.cautionFill },
  negative: { backgroundColor: color.negativeFill },
  info: { backgroundColor: color.infoFill },
});

export function toPercent(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.min(100, Math.max(0, (value / max) * 100));
}

export function Meter({
  value,
  gain,
  max = 100,
  tone = "accent",
  size = "md",
  label,
  showLabel = true,
  valueLabel,
  style,
}: MeterProps) {
  const percent = toPercent(value, max);
  const gainPercent = gain === undefined ? 0 : toPercent(Math.min(gain, value), max);
  const basePercent = Math.max(0, percent - gainPercent);
  return (
    <div {...stylex.props(styles.root, style)}>
      {showLabel && (label || valueLabel) ? (
        <div {...stylex.props(styles.header)}>
          <span>{label}</span>
          <span>{valueLabel}</span>
        </div>
      ) : null}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
        aria-valuetext={valueLabel}
        {...stylex.props(styles.track, sizes[size])}
      >
        <div
          {...stylex.props(
            styles.fill,
            tones[tone],
            gainPercent > 0 && styles.continued,
            styles.width(basePercent),
          )}
        />
        {gainPercent > 0 && (
          <div
            {...stylex.props(
              styles.fill,
              gains[tone],
              basePercent > 0 && styles.joined,
              styles.width(gainPercent),
            )}
          />
        )}
      </div>
    </div>
  );
}
