import { useLingui } from "@lingui/react/macro";
import { InfoIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { CharacterView, SessionView } from "../api/generated/types.gen.ts";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { IconButton } from "../ui/primitives/button.tsx";
import { ResourceBar } from "../ui/primitives/resource-bar.tsx";
import { space } from "../ui/tokens/space.stylex.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { practiceLayout } from "../ui/tokens/practice.stylex.ts";
import { CombatantInfoSheet } from "./combatant-info-sheet.tsx";

const styles = stylex.create({
  root: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    blockSize: practiceLayout.resourceHeight,
    flexShrink: 0,
  },
  resource: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    minInlineSize: space.none,
    gap: space.xs,
  },
  icon: { inlineSize: realmLayout.skillIcon },
  info: { flexShrink: 0 },
});

export function PlayerResources({
  session,
  character,
  style,
}: {
  session: SessionView;
  character?: CharacterView;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const player = session.combatants.find((actor) => actor.id === session.playerId);
  if (!player) return null;
  const playerName = player.name;
  return (
    <div {...stylex.props(styles.root, style)}>
      <div {...stylex.props(styles.resource)}>
        <CombatIcon iconId="icon-resource-health" style={styles.icon} />
        <ResourceBar
          kind="health"
          value={player.health}
          max={player.stats.maxHealth}
          shield={player.shield}
          label={t`Your health`}
          size="sm"
        />
      </div>
      <div {...stylex.props(styles.resource)}>
        <CombatIcon iconId="icon-resource-mana" label={t`Mana`} style={styles.icon} />
        <ResourceBar
          kind="mana"
          value={player.mana}
          max={session.maxMana}
          label={t`Your mana`}
          size="sm"
        />
      </div>
      {character && (
        <CombatantInfoSheet
          identity={{
            kind: "player",
            cosmeticIds: character.cosmetics
              .filter((item) => item.equipped)
              .map((item) => item.cosmetic.id),
            hairStyle: character.appearance.hairStyle,
            palette: {
              skin: character.appearance.skinTone,
              hair: character.appearance.hairColor,
              eyes: character.appearance.eyeColor,
            },
          }}
          combatant={player}
          trigger={
            <IconButton
              icon={InfoIcon}
              label={playerName ? t`${playerName}. View player info` : t`You. View player info`}
              variant="secondary"
              size="sm"
              cue={null}
              style={styles.info}
            />
          }
        />
      )}
    </div>
  );
}
