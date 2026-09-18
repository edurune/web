import { useLingui } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { SessionView } from "../../api/generated/types.gen.ts";
import { CombatIcon } from "./combat-icon.tsx";
import { color } from "../../ui/tokens/color.stylex.ts";
import { radius } from "../../ui/tokens/radius.stylex.ts";
import { space } from "../../ui/tokens/space.stylex.ts";
import { fontSize, fontWeight } from "../../ui/tokens/text.stylex.ts";
import { realmLayout } from "../../ui/tokens/realm.stylex.ts";

export const statLabels = {
  maxHealth: msg`Max health`,
  attack: msg`Attack`,
  defense: msg`Defense`,
  speed: msg`Speed`,
};
const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: space.xs,
  },
  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xxs,
    paddingInline: space.xs,
    borderRadius: radius.sm,
    backgroundColor: color.cautionFill,
    color: color.textPrimary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  positive: { backgroundColor: color.positiveFill },
  negative: { backgroundColor: color.negativeFill },
  icon: { inlineSize: realmLayout.skillIcon, flexShrink: 0 },
});

export interface CombatStatusProps {
  /** Active server effects, including partially consumed shields. */
  effects: SessionView["combatants"][number]["effects"];
  guard?: number;
  style?: StyleXStyles;
}

/** Persistent, target-local icons; repeated modifiers of the same stat share one chip. */
const noEffects: CombatStatusProps["effects"] = [];
export function CombatStatus({ effects = noEffects, guard = 0, style }: CombatStatusProps) {
  const { t } = useLingui();
  const stats = new Map<keyof typeof statLabels, number>();
  let shield = 0;
  for (const effect of effects) {
    if (effect.kind === "shield") shield += effect.remaining;
    else stats.set(effect.stat, (stats.get(effect.stat) ?? 0) + effect.amount);
  }
  if (!shield && !guard && !stats.size) return null;
  const reduction = Math.round(guard * 100);
  return (
    <span {...stylex.props(styles.root, style)}>
      {guard > 0 && (
        <span title={t`Guard: ${reduction}%`} {...stylex.props(styles.status)}>
          <CombatIcon
            iconId="icon-action-defend"
            label={t`Guard: ${reduction}%`}
            style={styles.icon}
          />
        </span>
      )}
      {shield > 0 && (
        <span title={t`Shield: ${shield}`} {...stylex.props(styles.status)}>
          <CombatIcon
            iconId="icon-effect-shield"
            label={t`Shield: ${shield}`}
            style={styles.icon}
          />
          {shield}
        </span>
      )}
      {[...stats].map(([stat, amount]) => {
        const name = t(statLabels[stat]);
        const value = amount > 0 ? `+${amount}` : `${amount}`;
        return (
          <span
            key={stat}
            title={t`${name}: ${value}`}
            {...stylex.props(styles.status, amount >= 0 ? styles.positive : styles.negative)}
          >
            <CombatIcon
              iconId={`icon-status-${stat === "maxHealth" ? "max-health" : stat}-${amount < 0 ? "down" : "up"}`}
              label={t`${name}: ${value}`}
              style={styles.icon}
            />
            {value}
          </span>
        );
      })}
    </span>
  );
}
