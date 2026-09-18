import { Trans } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { borderWidth } from "../../ui/tokens/border.stylex.ts";
import { color } from "../../ui/tokens/color.stylex.ts";
import { space } from "../../ui/tokens/space.stylex.ts";
import { radius } from "../../ui/tokens/radius.stylex.ts";
import { font, fontSize, fontWeight } from "../../ui/tokens/text.stylex.ts";
import { battleMotion } from "../../ui/tokens/practice.stylex.ts";

const arrive = stylex.keyframes({
  "0%": { opacity: 0, translate: `${space.xl} 0` },
  "20%": { opacity: 1, translate: `${space.none} 0` },
  "75%": { opacity: 1, translate: `${space.none} 0` },
  "100%": { opacity: 0, translate: `calc(-1 * ${space.xl}) 0` },
});
const styles = stylex.create({
  root: {
    paddingBlock: space.sm,
    paddingInline: space.xl,
    backgroundColor: color.surfaceInverse,
    color: color.cautionFill,
    borderRadius: radius.pill,
    fontFamily: font.display,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.heavy,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    animationName: arrive,
    animationDuration: battleMotion.wave,
    animationFillMode: "both",
    "@media (prefers-reduced-motion: reduce)": { animationName: "none" },
  },
  boss: {
    backgroundColor: color.negativeFill,
    color: color.textOnFill,
    borderStyle: "solid",
    borderWidth: borderWidth.thick,
    borderColor: color.borderStrong,
  },
});

/** A short, non-interactive arrival marker for the next server-started wave. */
export function WaveTransition({
  wave,
  total,
  boss = false,
  style,
}: {
  wave: number;
  total: number;
  boss?: boolean;
  style?: StyleXStyles;
}) {
  return (
    <span role="status" {...stylex.props(styles.root, boss && styles.boss, style)}>
      {boss ? (
        <Trans>Boss</Trans>
      ) : (
        <Trans>
          Wave {wave}/{total}
        </Trans>
      )}
    </span>
  );
}
