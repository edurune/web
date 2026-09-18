import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color } from "../tokens/color.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";

// One line of an equipment or skill stat change. Zero is shown rather than
// hidden, because an authored `0` means "unchanged", not "absent".
export interface StatDeltaProps {
  label: string;
  value: number;
  icon?: PhosphorIcon;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    fontFamily: font.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  label: { flex: 1, minInlineSize: 0, color: color.textSecondary },
  value: { fontVariantNumeric: "tabular-nums" },
  positive: { color: color.positiveStrong },
  negative: { color: color.negativeStrong },
  neutral: { color: color.textMuted },
});

export function StatDelta({ label, value, icon: Glyph, style }: StatDeltaProps) {
  const tone = value > 0 ? styles.positive : value < 0 ? styles.negative : styles.neutral;
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";

  return (
    <div {...stylex.props(styles.root, style)}>
      {Glyph ? <Glyph size={iconSize.sm} weight="bold" /> : null}
      <span {...stylex.props(styles.label)}>{label}</span>
      <span {...stylex.props(styles.value, tone)}>
        {sign}
        {Math.abs(value)}
      </span>
    </div>
  );
}
