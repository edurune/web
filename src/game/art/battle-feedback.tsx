import { Trans } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { PresentationEvent } from "../../api/generated/types.gen.ts";
import { CombatIcon } from "./combat-icon.tsx";
import { color } from "../../ui/tokens/color.stylex.ts";
import { space } from "../../ui/tokens/space.stylex.ts";
import { radius } from "../../ui/tokens/radius.stylex.ts";
import { borderWidth } from "../../ui/tokens/border.stylex.ts";
import { font, fontSize, fontWeight } from "../../ui/tokens/text.stylex.ts";
import { realmLayout } from "../../ui/tokens/realm.stylex.ts";
import { battleMotion } from "../../ui/tokens/practice.stylex.ts";

const rise = stylex.keyframes({
  "0%": { opacity: 0, translate: `0 ${space.sm}` },
  "15%": { opacity: 1, translate: `0 ${space.none}` },
  "75%": { opacity: 1 },
  "100%": { opacity: 0, translate: `0 calc(-1 * ${space.lg})` },
});
const styles = stylex.create({
  root: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xs,
    paddingBlock: space.xxs,
    paddingInline: space.sm,
    borderRadius: radius.pill,
    borderWidth: borderWidth.thick,
    borderStyle: "solid",
    borderColor: color.borderStrong,
    backgroundColor: color.surfaceRaised,
    color: color.textPrimary,
    fontFamily: font.display,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.heavy,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    animationName: rise,
    animationDuration: battleMotion.feedback,
    animationFillMode: "both",
    "@media (prefers-reduced-motion: reduce)": { animationName: "none" },
  },
  damage: { color: color.negativeStrong },
  healing: { color: color.positiveStrong },
  icon: { inlineSize: realmLayout.skillIcon },
});

export interface BattleFeedbackProps {
  /** Actual server event amounts, including absorbed damage. */
  event: PresentationEvent;
  style?: StyleXStyles;
}

/** A target-local combat number. Remount with the event's key to replay it. */
export function BattleFeedback({ event, style }: BattleFeedbackProps) {
  let content;
  let tone;
  if (event.kind === "damage_dealt") {
    tone = styles.damage;
    content = (
      <>
        {event.amount > 0 && <span>−{event.amount}</span>}
        {event.absorbed > 0 && (
          <>
            <CombatIcon iconId="icon-effect-shield" style={styles.icon} />
            <span>−{event.absorbed}</span>
          </>
        )}
      </>
    );
    if (!event.amount && !event.absorbed) return null;
  } else if (event.kind === "health_restored") {
    tone = styles.healing;
    content = (
      <>
        <CombatIcon iconId="icon-resource-health" style={styles.icon} />+{event.amount}
      </>
    );
  } else if (event.kind === "action_resolved" && event.outcome === "miss") {
    content = <Trans>Miss</Trans>;
  } else if (event.kind === "effect_applied") {
    const amount = event.effect.kind === "shield" ? event.effect.remaining : event.effect.amount;
    const icon =
      event.effect.kind === "shield"
        ? "icon-effect-shield"
        : `icon-stat-${event.effect.stat === "maxHealth" ? "max-health" : event.effect.stat}`;
    content = (
      <>
        <CombatIcon iconId={icon} style={styles.icon} />
        {amount > 0 ? "+" : ""}
        {amount}
      </>
    );
  } else if (event.kind === "guard_changed" && event.reduction > 0) {
    content = <CombatIcon iconId="icon-action-defend" style={styles.icon} />;
  } else return null;
  return <span {...stylex.props(styles.root, tone, style)}>{content}</span>;
}
