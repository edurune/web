import {
  battleFrameForViewport,
  battleLayout,
  battlePresentation,
  animationDuration,
} from "@edurune/art";
import { useEffect, useEffectEvent, useMemo, useRef, useState, type ReactNode } from "react";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { BattleFrame, ClipName } from "@edurune/art";
import * as stylex from "@stylexjs/stylex";
import type {
  CharacterView,
  PresentationEvent,
  SessionView,
} from "../../api/generated/types.gen.ts";
import { BattleScene } from "./battle-scene.tsx";
import { BattleFeedback } from "./battle-feedback.tsx";
import { WaveTransition } from "./wave-transition.tsx";
import { playSound, type CueName } from "../../ui/sound/sound.ts";
import { layout as layoutTokens } from "../../ui/tokens/layout.stylex.ts";
import { space } from "../../ui/tokens/space.stylex.ts";
import { duration as motionDuration, easing } from "../../ui/tokens/motion.stylex.ts";
import { battleMotion } from "../../ui/tokens/practice.stylex.ts";

interface Cue {
  key: string;
  batch: string;
  wave: number;
  clips: Record<string, ClipName>;
  defeated: string[];
  event: PresentationEvent;
  narration?: PresentationEvent;
  combatants: SessionView["combatants"];
  effect?: { id: string; target: "player" | `enemy-${number}` };
}

function bossWave(encounter: SessionView["encounter"], wave: number) {
  return encounter.waves[wave - 1]?.enemies.some((enemy) => enemy.role === "boss") === true;
}

function battleCue(event: PresentationEvent): CueName | null {
  switch (event.kind) {
    case "action_resolved":
      return event.outcome === "miss" ? "blocked" : null;
    case "damage_dealt":
      return event.amount > 0 || event.absorbed > 0 ? "drop" : null;
    case "health_restored":
      return "receive";
    case "effect_applied":
      return event.effect.kind === "shield" ? "lock" : "snap";
    case "guard_changed":
      return event.reduction > 0 ? "lock" : null;
    case "combatant_defeated":
      return "stop";
    default:
      return null;
  }
}

export interface BattlePresentation {
  wave: number;
  combatants: SessionView["combatants"];
  event?: PresentationEvent;
}

function isNarratedBattleEvent(event: PresentationEvent): boolean {
  return (
    event.kind === "action_resolved" ||
    event.kind === "damage_dealt" ||
    event.kind === "health_restored" ||
    event.kind === "effect_applied" ||
    event.kind === "combatant_defeated" ||
    event.kind === "wave_started" ||
    (event.kind === "effect_removed" && event.reason === "expired")
  );
}

// Playback only: apply the reported deltas, never recalculate damage or decide outcomes.
function presentEvent(combatants: SessionView["combatants"], event: PresentationEvent) {
  return combatants.map((value) => {
    const actor = { ...value, effects: value.effects ?? [] };
    const target = "targetId" in event && event.targetId === actor.id;
    if (target && event.kind === "damage_dealt") {
      let absorbed = event.absorbed;
      const effects = actor.effects.map((effect) => {
        if (effect.kind !== "shield") return effect;
        const amount = Math.min(effect.remaining, absorbed);
        absorbed -= amount;
        return { ...effect, remaining: effect.remaining - amount };
      });
      return {
        ...actor,
        health: actor.health - event.amount,
        shield: Math.max(0, actor.shield - event.absorbed),
        effects,
      };
    }
    if (target && event.kind === "health_restored")
      return { ...actor, health: actor.health + event.amount };
    if (target && event.kind === "health_capped")
      return { ...actor, health: actor.health - event.amount };
    if (event.kind === "mana_changed" && event.actorId === actor.id)
      return { ...actor, mana: actor.mana + event.amount };
    if (event.kind === "guard_changed" && event.actorId === actor.id)
      return { ...actor, guard: event.reduction };
    if (target && event.kind === "effect_applied") {
      const effects =
        event.effect.id === undefined
          ? actor.effects
          : [...actor.effects, { ...event.effect, id: event.effect.id }];
      return event.effect.kind === "shield"
        ? { ...actor, effects, shield: actor.shield + event.effect.remaining }
        : {
            ...actor,
            effects,
            stats: {
              ...actor.stats,
              [event.effect.stat]: actor.stats[event.effect.stat] + event.effect.amount,
            },
          };
    }
    if (target && event.kind === "effect_removed") {
      const effect = actor.effects.find((entry) => entry.id === event.effectId);
      const next = {
        ...actor,
        effects: actor.effects.filter((entry) => entry.id !== event.effectId),
      };
      if (effect?.kind === "shield") next.shield = Math.max(0, actor.shield - effect.remaining);
      if (effect?.kind === "modify_stat")
        next.stats = { ...actor.stats, [effect.stat]: actor.stats[effect.stat] - effect.amount };
      return next;
    }
    if (event.kind === "combatant_defeated" && event.combatantId === actor.id)
      return { ...actor, health: 0, guard: 0, shield: 0, effects: [] };
    return actor;
  });
}

const enter = stylex.keyframes({
  from: { opacity: 0, translate: `${space.lg} 0` },
  to: { opacity: 1, translate: `${space.none} 0` },
});
const styles = stylex.create({
  root: { position: "relative", inlineSize: layoutTokens.full, blockSize: layoutTokens.full },
  scene: { inlineSize: layoutTokens.full, blockSize: layoutTokens.full },
  wave: {
    animationName: enter,
    animationDuration: motionDuration.slow,
    animationTimingFunction: easing.entrance,
    "@media (prefers-reduced-motion: reduce)": { animationName: "none" },
  },
  feedback: (x: number, y: number) => ({
    position: "absolute",
    left: `${x}%`,
    top: `${y}%`,
    transform: "translate(-50%, -100%)",
    pointerEvents: "none",
  }),
  transition: {
    position: "absolute",
    inset: space.none,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
});

function wait(duration: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    if (signal.aborted) return resolve();
    const finish = () => {
      clearTimeout(timer);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const timer = setTimeout(finish, duration);
    signal.addEventListener("abort", finish, { once: true });
  });
}

/** Play only newly received server feedback. Reconnects snap to the saved final state. */
export function SessionBattle({
  sessionId,
  session,
  character,
  label,
  layout = "wide",
  frame = battleFrameForViewport(layout),
  onPlaybackChange,
  onPresentationChange,
  renderOverlay,
  style,
}: {
  sessionId: string;
  session: SessionView;
  character: CharacterView;
  label: string;
  layout?: "wide" | "compact";
  frame?: BattleFrame;
  onPlaybackChange?: (playing: boolean, revision: number) => void;
  onPresentationChange?: (presentation: BattlePresentation | null) => void;
  renderOverlay?: (presentation: BattlePresentation) => ReactNode;
  style?: StyleXStyles;
}) {
  const [cue, setCue] = useState<Cue | null>(null);
  const reportPlayback = useEffectEvent((playing: boolean, revision: number) =>
    onPlaybackChange?.(playing, revision),
  );
  const reportPresentation = useEffectEvent((presentation: BattlePresentation | null) =>
    onPresentationChange?.(presentation),
  );
  const batchKey = JSON.stringify({
    id: sessionId,
    feedback: session.feedback,
    encounter: session.encounter,
    playerId: session.playerId,
    combatants: session.combatants,
  });
  const current = useMemo(
    () =>
      JSON.parse(batchKey) as Pick<
        SessionView,
        "feedback" | "encounter" | "playerId" | "combatants"
      > & { id: string },
    [batchKey],
  );
  const seen = useRef<{ id: string; revision: number } | null>(null);
  const previous = useRef(current);
  useEffect(() => {
    const before = previous.current;
    previous.current = current;
    const first = !seen.current || seen.current.id !== current.id;
    const fresh = !first && current.feedback.revision > seen.current!.revision;
    seen.current = { id: current.id, revision: current.feedback.revision };
    if (!fresh || !current.feedback.events.length) return;
    const controller = new AbortController();
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (document.hidden) {
      reportPlayback(false, current.feedback.revision);
      return;
    }
    reportPlayback(true, current.feedback.revision);
    const stop = () => {
      if (preference.matches || document.hidden) {
        controller.abort();
        setCue(null);
        reportPlayback(false, current.feedback.revision);
      }
    };
    preference.addEventListener("change", stop);
    document.addEventListener("visibilitychange", stop);
    const keyFor = (id: string, wave: number): "player" | `enemy-${number}` => {
      if (id === current.playerId) return "player";
      const index =
        current.encounter.waves[wave - 1]?.enemies.findIndex((enemy) => enemy.id === id) ?? -1;
      if (index < 0) throw new Error("Unknown presentation actor");
      return `enemy-${index}`;
    };
    const play = async () => {
      let combatants = before.combatants;
      let defeated = before.combatants
        .filter((actor) => actor.health === 0)
        .map((actor) => actor.id);
      let active: Extract<PresentationEvent, { kind: "action_resolved" }> | null = null;
      let narration: PresentationEvent | undefined;
      for (const [index, event] of current.feedback.events.entries()) {
        if (controller.signal.aborted) return;
        if (isNarratedBattleEvent(event)) narration = event;
        if (event.kind === "wave_started") {
          defeated = [];
          const player = combatants.find((actor) => actor.id === current.playerId);
          combatants =
            event.combatants ??
            current.combatants.map((actor) =>
              actor.id === player?.id
                ? {
                    ...actor,
                    health: Math.min(player.health, actor.stats.maxHealth),
                    mana: player.mana,
                    guard: 0,
                    shield: 0,
                    effects: [],
                  }
                : actor,
            );
          playSound(bossWave(current.encounter, event.wave) ? "warning" : "start");
          setCue({
            key: `${current.id}-${current.feedback.revision}-${index}`,
            batch: batchKey,
            wave: event.wave,
            clips: {},
            defeated: [],
            event,
            narration,
            combatants,
          });
          // The next formation enters before the next turn becomes interactive.
          // eslint-disable-next-line no-await-in-loop
          await wait(Number.parseFloat(battleMotion.wave), controller.signal);
          continue;
        }
        if (event.kind === "action_resolved") active = event;
        combatants = presentEvent(combatants, event);
        const clips: Record<string, ClipName> = {};
        let actorId: string | undefined;
        let effectId: string | undefined;
        let duration = 0;
        const visuals = battlePresentation.defaults;
        const damageEffect =
          active?.action.kind === "skill"
            ? (battlePresentation.damageOverrides[active.action.skillId] ?? visuals.damage)
            : battlePresentation.attack;
        switch (event.kind) {
          case "action_resolved":
            actorId = event.actorId;
            if (event.action.kind !== "defend") clips[keyFor(actorId, event.wave)] = "attack";
            break;
          case "damage_dealt":
            actorId = event.targetId;
            clips[keyFor(actorId, event.wave)] = "hit";
            effectId = damageEffect;
            break;
          case "health_restored":
            actorId = event.targetId;
            effectId = visuals?.heal;
            break;
          case "guard_changed":
            if (event.reduction > 0) {
              actorId = event.actorId;
              effectId = battlePresentation.defend;
            }
            break;
          case "effect_applied":
            actorId = event.targetId;
            effectId =
              event.effect.kind === "shield"
                ? visuals?.shield
                : event.effect.amount > 0
                  ? visuals?.modify_stat_up
                  : visuals?.modify_stat_down;
            break;
          case "effect_removed":
            if (event.reason === "expired") {
              actorId = event.targetId;
              duration = Number.parseFloat(battleMotion.feedback);
            }
            break;
          case "combatant_defeated":
            actorId = event.combatantId;
            clips[keyFor(actorId, event.wave)] = "defeat";
            break;
        }
        if (!actorId) continue;
        const key = keyFor(actorId, event.wave);
        const clip = clips[key];
        const target = current.encounter.waves[event.wave - 1]?.enemies.find(
          (enemy) => enemy.id === actorId,
        );
        duration = Math.max(
          duration,
          animationDuration({
            clip,
            enemyId: key === "player" ? undefined : target?.enemyId,
            effectId,
          }),
        );
        if (
          event.kind === "damage_dealt" ||
          event.kind === "health_restored" ||
          event.kind === "effect_applied" ||
          event.kind === "guard_changed" ||
          event.kind === "action_resolved" ||
          event.kind === "combatant_defeated"
        )
          duration = Math.max(duration, Number.parseFloat(battleMotion.feedback));
        if (controller.signal.aborted) return;
        const next: Cue = {
          key: `${current.id}-${current.feedback.revision}-${index}`,
          batch: batchKey,
          wave: event.wave,
          clips: preference.matches ? {} : clips,
          defeated: defeated.map((id) => keyFor(id, event.wave)),
          event,
          narration,
          combatants,
        };
        if (effectId && !preference.matches) next.effect = { id: effectId, target: key };
        const sound = battleCue(event);
        if (sound) playSound(sound);
        setCue(next);
        // eslint-disable-next-line no-await-in-loop -- Server events must play in order.
        await wait(duration, controller.signal);
        if (event.kind === "combatant_defeated") defeated.push(event.combatantId);
      }
      if (!controller.signal.aborted) setCue(null);
    };
    void play()
      .catch(() => {
        if (!controller.signal.aborted) setCue(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) reportPlayback(false, current.feedback.revision);
      });
    return () => {
      controller.abort();
      reportPlayback(false, current.feedback.revision);
      preference.removeEventListener("change", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [batchKey, current]);
  const activeCue = cue?.batch === batchKey ? cue : null;
  useEffect(() => {
    reportPresentation(
      activeCue
        ? { wave: activeCue.wave, combatants: activeCue.combatants, event: activeCue.narration }
        : null,
    );
  }, [activeCue]);
  const wave = activeCue?.wave ?? session.wave.number;
  const enemies = session.encounter.waves[wave - 1]?.enemies ?? [];
  const event = activeCue?.event;
  const feedbackActor =
    event &&
    ("targetId" in event && event.targetId
      ? event.targetId
      : "actorId" in event
        ? event.actorId
        : undefined);
  const placement = battleLayout(
    frame,
    layout,
    enemies.map((enemy) => enemy.enemyId),
  );
  const feedbackPosition =
    feedbackActor === session.playerId
      ? placement?.player.head
      : placement?.enemies[enemies.findIndex((enemy) => enemy.id === feedbackActor)]?.head;
  const defeated =
    activeCue?.defeated ??
    session.combatants
      .filter((actor) => actor.health === 0)
      .map((actor) =>
        actor.id === session.playerId
          ? "player"
          : `enemy-${enemies.findIndex((enemy) => enemy.id === actor.id)}`,
      );
  // Legacy sessions have no scene; the caller must choose an explicit legacy fallback.
  if (!session.encounter.sceneId || !enemies.length) return null;
  return (
    <div {...stylex.props(styles.root, style)}>
      <BattleScene
        sceneId={session.encounter.sceneId}
        enemyIds={enemies.map((enemy) => enemy.enemyId)}
        cosmeticIds={character.cosmetics
          .filter((item) => item.equipped)
          .map((item) => item.cosmetic.id)}
        hairStyle={character.appearance.hairStyle}
        palette={{
          skin: character.appearance.skinTone,
          hair: character.appearance.hairColor,
          eyes: character.appearance.eyeColor,
        }}
        label={label}
        layout={layout}
        frame={frame}
        defeatedActors={defeated}
        {...(activeCue && { actorClips: activeCue.clips })}
        {...(activeCue?.effect && { effect: activeCue.effect })}
        style={[styles.scene, event?.kind === "wave_started" && styles.wave]}
      />
      {renderOverlay?.({
        wave,
        combatants: activeCue?.combatants ?? session.combatants,
        event: activeCue?.narration,
      })}
      {event && feedbackPosition && (
        <div {...stylex.props(styles.feedback(feedbackPosition.x, feedbackPosition.y))}>
          <BattleFeedback key={activeCue?.key} event={event} />
        </div>
      )}
      {event?.kind === "wave_started" && (
        <div {...stylex.props(styles.transition)}>
          <WaveTransition
            key={activeCue?.key}
            wave={event.wave}
            total={session.wave.total}
            boss={bossWave(session.encounter, event.wave)}
          />
        </div>
      )}
    </div>
  );
}
