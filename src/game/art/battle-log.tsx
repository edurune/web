import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { CombatIcon } from "./combat-icon.tsx";
import { Text } from "../../ui/primitives/text.tsx";
import { color } from "../../ui/tokens/color.stylex.ts";
import { space } from "../../ui/tokens/space.stylex.ts";
import { borderWidth } from "../../ui/tokens/border.stylex.ts";
import { realmLayout } from "../../ui/tokens/realm.stylex.ts";
import { practiceLayout } from "../../ui/tokens/practice.stylex.ts";
import { duration, easing } from "../../ui/tokens/motion.stylex.ts";

const arrive = stylex.keyframes({
  from: { opacity: 0, translate: `0 ${space.xs}` },
  to: { opacity: 1, translate: `0 ${space.none}` },
});
const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    blockSize: practiceLayout.logHeight,
    paddingInline: space.lg,
    backgroundColor: color.surfaceWarm,
    color: color.textPrimary,
    borderBlockStart: `${borderWidth.thin} solid ${color.borderStrong}`,
  },
  line: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    minInlineSize: space.none,
    animationName: arrive,
    animationDuration: duration.fast,
    animationTimingFunction: easing.entrance,
    "@media (prefers-reduced-motion: reduce)": { animationName: "none" },
  },
  icon: { inlineSize: realmLayout.skillIcon, flexShrink: 0 },
});

export interface BattleLogProps {
  /** One concise, translated message for the event currently being played. */
  message: string;
  iconId?: string;
  style?: StyleXStyles;
}

/** A fixed-height narration line that never pushes the arena or answer panel around. */
export function BattleLog({ message, iconId, style }: BattleLogProps) {
  return (
    <div role="status" aria-live="polite" aria-atomic="true" {...stylex.props(styles.root, style)}>
      <div key={message} {...stylex.props(styles.line)}>
        {iconId && <CombatIcon iconId={iconId} style={styles.icon} />}
        <Text variant="bodyStrong" lines={2}>
          {message}
        </Text>
      </div>
    </div>
  );
}
