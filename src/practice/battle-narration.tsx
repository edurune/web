import { useLingui } from "@lingui/react/macro";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { PresentationEvent, SessionView } from "../api/generated/types.gen.ts";
import { BattleLog } from "../game/art/battle-log.tsx";
import { statLabels } from "../game/art/combat-status.tsx";
import { enemyMetadata, skillMetadata } from "./session.ts";

/** Localized narration of public events, never a second combat simulation. */
export function BattleNarration({
  session,
  event,
  style,
}: {
  session: SessionView;
  event: PresentationEvent;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const playerName =
    session.combatants.find((actor) => actor.id === session.playerId)?.name ?? null;
  const actorName = (id: string) => {
    const combatant = session.combatants.find((actor) => actor.id === id);
    if (combatant?.name) return combatant.name;
    if (id === session.playerId) return t`You`;
    const enemy = session.encounter.waves
      .flatMap((wave) => wave.enemies)
      .find((entry) => entry.id === id);
    const descriptor = enemy && enemyMetadata.get(enemy.enemyId)?.name;
    return descriptor ? t(descriptor) : t`Enemy`;
  };
  let message = t`Your turn.`;
  let iconId = "icon-action-attack";
  if (event?.kind === "action_resolved") {
    const name = actorName(event.actorId);
    if (event.outcome === "miss") message = t`${name} missed!`;
    else if (event.action.kind === "skill") {
      const descriptor = skillMetadata.get(event.action.skillId)?.name;
      const move = descriptor ? t(descriptor) : t`Skill`;
      message = t`${name} used ${move}.`;
      iconId = "icon-action-skill";
    } else if (event.action.kind === "defend") {
      message = t`${name} took a defensive stance.`;
      iconId = "icon-action-defend";
    } else message = t`${name} attacked!`;
  } else if (event?.kind === "damage_dealt") {
    const name = actorName(event.targetId);
    const amount = event.amount;
    const absorbed = event.absorbed;
    message = amount ? t`${name} lost ${amount} HP.` : t`${name} blocked ${absorbed} damage.`;
    iconId = amount ? "icon-resource-health" : "icon-effect-shield";
  } else if (event?.kind === "health_restored") {
    const name = actorName(event.targetId);
    const amount = event.amount;
    message = t`${name} recovered ${amount} HP.`;
    iconId = "icon-effect-heal";
  } else if (event?.kind === "effect_applied") {
    const name = actorName(event.targetId);
    if (event.effect.kind === "shield") {
      message = t`${name} gained a shield.`;
      iconId = "icon-effect-shield";
    } else {
      const stat = t(statLabels[event.effect.stat]);
      message = event.effect.amount >= 0 ? t`${name}: ${stat} rose!` : t`${name}: ${stat} fell!`;
      iconId = `icon-status-${event.effect.stat === "maxHealth" ? "max-health" : event.effect.stat}-${event.effect.amount < 0 ? "down" : "up"}`;
    }
  } else if (event?.kind === "effect_removed") {
    const name = actorName(event.targetId);
    message = t`${name}: an effect wore off.`;
    iconId = "icon-effect-modify-stat";
  } else if (event?.kind === "combatant_defeated") {
    const name = actorName(event.combatantId);
    message =
      event.combatantId === session.playerId && !playerName
        ? t`You were defeated.`
        : t`${name} was defeated.`;
    iconId = "icon-effect-defeat";
  } else if (event?.kind === "wave_started") {
    const wave = event.wave;
    message = t`Wave ${wave}`;
    iconId = "icon-target-all-enemies";
  }
  return <BattleLog message={message} iconId={iconId} style={style} />;
}
