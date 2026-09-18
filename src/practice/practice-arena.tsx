import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLingui } from "@lingui/react/macro";
import { InfoIcon } from "@phosphor-icons/react";
import { battleLayout, battleFrameForViewport, type BattleFrame } from "@edurune/art";
import { hoverCue } from "../ui/sound/hover-cue.ts";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { CharacterView, SessionView } from "../api/generated/types.gen.ts";
import { SessionBattle, type BattlePresentation } from "../game/art/session-battle.tsx";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { CombatStatus } from "../game/art/combat-status.tsx";
import { BattleNarration } from "./battle-narration.tsx";
import { CombatantInfoSheet } from "./combatant-info-sheet.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { ResourceBar } from "../ui/primitives/resource-bar.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { Badge } from "../ui/primitives/badge.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import {
  enemyMetadata,
  skillIcon,
  actionLabels,
  skillMetadata,
  type AnswerPhase,
} from "./session.ts";

const styles = stylex.create({
  root: {
    position: "relative",
    flex: 1,
    minBlockSize: space.none,
    overflow: "hidden",
    backgroundColor: color.surfaceWarm,
  },
  art: { position: "absolute", inset: space.none, inlineSize: layout.full, blockSize: layout.full },
  enemy: { position: "absolute", pointerEvents: "none" },
  target: {
    position: "absolute",
    inset: space.none,
    inlineSize: layout.full,
    blockSize: layout.full,
    pointerEvents: "auto",
    padding: space.none,
    borderWidth: borderWidth.none,
    backgroundColor: color.surfaceTransparent,
    borderRadius: radius.lg,
    cursor: { default: "pointer", ":disabled": "default" },
    outlineColor: color.borderFocus,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
  },
  position: (left: number, top: number, width: number, height: number) => ({
    left: `${left}%`,
    top: `${top}%`,
    width: `${width}%`,
    height: `${height}%`,
  }),
  label: {
    position: "absolute",
    insetBlockEnd: layout.full,
    insetInline: space.none,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    gap: space.xs,
    paddingBlockEnd: space.xs,
    pointerEvents: "none",
  },
  name: {
    pointerEvents: "auto",
    backgroundColor: {
      default: color.surfaceRaised,
      ":is([data-selected])": color.cautionFill,
      ":hover:not(:disabled)": color.neutralFillHover,
      ":is([data-selected]):hover:not(:disabled)": color.cautionFill,
    },
    borderRadius: radius.pill,
    paddingInline: space.sm,
    maxInlineSize: `calc(${layout.full} + ${space.md})`,
  },
  labelHeight: (top: number) => ({ insetBlockEnd: `${100 - top}%` }),
  icon: { inlineSize: realmLayout.skillIcon, flexShrink: 0 },
  selection: {
    inlineSize: realmLayout.skillIcon,
    blockSize: realmLayout.skillIcon,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  player: {
    position: "absolute",
    transform: `translate(-50%, ${space.xs})`,
    display: "flex",
    alignItems: "center",
    gap: space.xs,
  },
  playerPosition: (x: number, y: number) => ({ left: `${x}%`, top: `${y}%` }),
  log: {
    position: "absolute",
    insetInline: space.none,
    insetBlockEnd: space.none,
    pointerEvents: "none",
  },
});
const noTargets: string[] = [];

export interface PracticeArenaProps {
  sessionId: string;
  session: SessionView;
  character: CharacterView;
  targetIds?: string[];
  selectedIds?: string[];
  selection?: AnswerPhase["selection"];
  onTarget?: (id: string) => void;
  playing?: boolean;
  onPlaybackChange?: (playing: boolean, revision: number) => void;
  onPresentationChange?: (presentation: BattlePresentation | null) => void;
  style?: StyleXStyles;
}

/** One responsive camera for the arena, persistent labels, target hit areas and feedback. */
export function PracticeArena({
  sessionId,
  session,
  character,
  targetIds = noTargets,
  selectedIds = noTargets,
  selection,
  onTarget,
  playing = false,
  onPlaybackChange,
  onPresentationChange,
  style,
}: PracticeArenaProps) {
  const { t } = useLingui();
  const root = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    if (!root.current) return;
    const resize = () => {
      const bounds = root.current!.getBoundingClientRect();
      setViewport((before) =>
        before.width === bounds.width && before.height === bounds.height
          ? before
          : { width: bounds.width, height: bounds.height },
      );
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const frame = useMemo(
    () => battleFrameForViewport("compact", viewport.width, viewport.height),
    [viewport],
  );
  const visible = session.encounter.sceneId
    ? session
    : { ...session, encounter: { ...session.encounter, sceneId: "forest-clearing" } };
  return (
    <div ref={root} {...stylex.props(styles.root, style)}>
      <SessionBattle
        sessionId={sessionId}
        session={visible}
        character={character}
        label={t`Battlefield`}
        layout="compact"
        frame={frame}
        onPlaybackChange={onPlaybackChange}
        onPresentationChange={onPresentationChange}
        style={styles.art}
        renderOverlay={(presentation) => (
          <>
            <CombatantLabels
              session={session}
              presentation={presentation}
              frame={frame}
              selectedIds={selectedIds}
              targetIds={targetIds}
              selection={selection}
              onTarget={playing ? undefined : onTarget}
            />
            {presentation.event && (
              <BattleNarration session={session} event={presentation.event} style={styles.log} />
            )}
          </>
        )}
      />
    </div>
  );
}

function CombatantLabels({
  session,
  presentation,
  frame,
  selectedIds,
  targetIds,
  selection,
  onTarget,
}: {
  session: SessionView;
  presentation: BattlePresentation;
  frame: BattleFrame;
  selectedIds: string[];
  targetIds: string[];
  selection?: AnswerPhase["selection"];
  onTarget?: (id: string) => void;
}) {
  const { t } = useLingui();
  const enemies = session.encounter.waves[presentation.wave - 1]?.enemies ?? [];
  const placement = battleLayout(
    frame,
    "compact",
    enemies.map((enemy) => enemy.enemyId),
  );
  if (!placement) return null;
  const action = selection?.action;
  const player = presentation.combatants.find((actor) => actor.id === session.playerId);
  const skill =
    action?.kind === "skill"
      ? player?.skills.find((item) => item.id === action.skillId)
      : undefined;
  const metadata = skill ? skillMetadata.get(skill.id) : undefined;
  const icon = skill
    ? skillIcon(skill)
    : action
      ? `icon-action-${action.kind}`
      : "icon-target-single-enemy";
  const actionName = metadata?.name
    ? t(metadata.name)
    : action
      ? t(actionLabels[action.kind])
      : t`Target`;
  const self =
    action &&
    !selection?.targetId &&
    (skill?.targeting === "self" || skill?.targeting === "all_allies" || action.kind === "defend");
  return (
    <>
      {enemies.map((enemy, index) => {
        const actor = presentation.combatants.find((value) => value.id === enemy.id);
        if (!actor) return null;
        const position = placement.enemies[index]!;
        const message = enemyMetadata.get(enemy.enemyId)?.name;
        const name = message ? t(message) : t`Enemy`;
        const health = Math.max(0, actor.health);
        const max = actor.stats.maxHealth;
        const selected =
          selectedIds.includes(enemy.id) ||
          (action?.kind === "skill" && skill?.targeting === "all_enemies");
        return (
          <div
            key={enemy.id}
            {...stylex.props(
              styles.enemy,
              styles.position(position.left, position.top, position.width, position.height),
            )}
          >
            <button
              type="button"
              aria-label={t`${name}: ${health}/${max} health`}
              aria-pressed={selected}
              disabled={!onTarget || !targetIds.includes(enemy.id) || health === 0}
              data-uisfx="select"
              {...hoverCue}
              onClick={() => onTarget?.(enemy.id)}
              {...stylex.props(styles.target)}
            />
            <span {...stylex.props(styles.label, styles.labelHeight(position.labelTop))}>
              <CombatantInfoSheet
                identity={{ kind: "enemy", enemyId: enemy.enemyId, role: enemy.role }}
                combatant={actor}
                trigger={
                  <Button
                    variant="secondary"
                    size="sm"
                    iconEnd={InfoIcon}
                    cue={null}
                    aria-label={t`${name}. View enemy info`}
                    data-selected={selected || undefined}
                    style={styles.name}
                  >
                    {selected && (
                      <span {...stylex.props(styles.selection)}>
                        <CombatIcon iconId={icon} label={actionName} style={styles.icon} />
                      </span>
                    )}
                    <Text variant="caption" lines={1}>
                      {name}
                    </Text>
                  </Button>
                }
              />
              <ResourceBar
                kind="health"
                value={health}
                max={max}
                shield={Math.max(0, actor.shield)}
                label={name}
                size="sm"
                showValue={false}
              />
              {health > 0 && <CombatStatus effects={actor.effects} guard={actor.guard} />}
            </span>
          </div>
        );
      })}
      <div
        {...stylex.props(
          styles.player,
          styles.playerPosition(placement.player.ground.x, placement.player.ground.y),
        )}
      >
        {self && (
          <Badge tone="caution">
            <CombatIcon iconId={icon} label={actionName} style={styles.icon} />
          </Badge>
        )}
        {player && <CombatStatus effects={player.effects} guard={player.guard} />}
      </div>
    </>
  );
}
