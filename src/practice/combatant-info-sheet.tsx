import { Trans, useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { SessionView } from "../api/generated/types.gen.ts";
import { CharacterPortrait } from "../game/art/character-portrait.tsx";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { statLabels } from "../game/art/combat-status.tsx";
import { EnemyPortrait } from "../game/art/enemy-portrait.tsx";
import { EquipmentIcon } from "../game/art/equipment-icon.tsx";
import { equipmentMetadata } from "../game/art/catalog.ts";
import { SkillChip } from "../realm/skill-chip.tsx";
import { Badge } from "../ui/primitives/badge.tsx";
import {
  BottomSheet,
  BottomSheetClose,
  type BottomSheetProps,
} from "../ui/primitives/bottom-sheet.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { practiceLayout } from "../ui/tokens/practice.stylex.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { enemyMetadata } from "./session.ts";

export type CombatantIdentity =
  | { kind: "enemy"; enemyId: string; role: "normal" | "boss" }
  | {
      kind: "player";
      cosmeticIds: string[];
      hairStyle: string;
      palette: { skin: string; hair: string; eyes: string };
    };

export interface CombatantInfoSheetProps extends Pick<
  BottomSheetProps,
  "open" | "defaultOpen" | "onOpenChange" | "trigger" | "style"
> {
  identity: CombatantIdentity;
  /** Use the presented combatant so the panel agrees with the visible battle. */
  combatant: SessionView["combatants"][number];
}

const stats = ["attack", "defense", "speed"] as const;
const styles = stylex.create({
  hero: { display: "flex", alignItems: "center", gap: space.lg },
  portrait: { inlineSize: realmLayout.itemArt, flexShrink: 0 },
  details: { flex: 1, minInlineSize: space.none },
  roles: { display: "flex", flexWrap: "wrap", gap: space.sm },
  icon: { inlineSize: realmLayout.statIcon, flexShrink: 0 },
  stats: {
    display: "grid",
    gridTemplateColumns: practiceLayout.enemyStatColumns,
    gap: space.sm,
    margin: space.none,
  },
  stat: { display: "flex", flexDirection: "column", alignItems: "center", gap: space.sm },
  term: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: space.xs,
    textAlign: "center",
  },
  equipments: {
    display: "grid",
    gridTemplateColumns: practiceLayout.pairColumns,
    gap: space.sm,
  },
  equipment: { display: "flex", alignItems: "center", gap: space.sm, minInlineSize: space.none },
  equipmentArt: { inlineSize: realmLayout.slotArt, flexShrink: 0 },
  skills: { display: "flex", flexWrap: "wrap", gap: space.sm },
});

/** Effective stats and battle capabilities shared by player and enemy combatants. */
export function CombatantInfoSheet({
  identity,
  combatant,
  style,
  ...sheet
}: CombatantInfoSheetProps) {
  const { t } = useLingui();
  const metadata = identity.kind === "enemy" ? enemyMetadata.get(identity.enemyId) : undefined;
  const name = combatant.name
    ? combatant.name
    : metadata?.name
      ? t(metadata.name)
      : identity.kind === "player"
        ? t`You`
        : t`Enemy`;
  return (
    <BottomSheet
      {...sheet}
      title={name}
      footer={
        <BottomSheetClose render={<Button fullWidth cue={null} />}>
          <Trans>Back to battle</Trans>
        </BottomSheetClose>
      }
      style={style}
    >
      <Stack gap="lg">
        <div {...stylex.props(styles.hero)}>
          {identity.kind === "enemy" ? (
            <EnemyPortrait enemyId={identity.enemyId} animated={false} style={styles.portrait} />
          ) : (
            <CharacterPortrait
              cosmeticIds={identity.cosmeticIds}
              hairStyle={identity.hairStyle}
              palette={identity.palette}
              label={name}
              animated={false}
              style={styles.portrait}
            />
          )}
          <Stack gap="sm" style={styles.details}>
            <div {...stylex.props(styles.roles)}>
              <Badge tone="neutral">
                {identity.kind === "player" ? <Trans>Player</Trans> : <Trans>Monster</Trans>}
              </Badge>
              {identity.kind === "enemy" && identity.role === "boss" && (
                <Badge tone="negative">
                  <Trans>Boss</Trans>
                </Badge>
              )}
            </div>
            {metadata?.description && <Text tone="secondary">{t(metadata.description)}</Text>}
          </Stack>
        </div>
        <Stack gap="sm">
          <Text as="h3" variant="bodyStrong">
            <Trans>Current stats</Trans>
          </Text>
          <dl {...stylex.props(styles.stats)}>
            {stats.map((stat) => (
              <Surface key={stat} tone="warm" depth="lifted" padding="md" style={styles.stat}>
                <dt {...stylex.props(styles.term)}>
                  <CombatIcon iconId={`icon-stat-${stat}`} style={styles.icon} />
                  <Text variant="label">{t(statLabels[stat])}</Text>
                </dt>
                <Text as="dd" variant="stat">
                  {combatant.stats[stat]}
                </Text>
              </Surface>
            ))}
          </dl>
        </Stack>
        {combatant.equipmentIds.length > 0 && (
          <Stack gap="sm">
            <Text as="h3" variant="bodyStrong">
              <Trans>Equipment</Trans>
            </Text>
            <div {...stylex.props(styles.equipments)}>
              {combatant.equipmentIds.map((equipmentId) => {
                const descriptor = equipmentMetadata.get(equipmentId)?.name;
                const equipmentName = descriptor ? t(descriptor) : equipmentId;
                return (
                  <Surface key={equipmentId} depth="lifted" padding="sm" style={styles.equipment}>
                    <EquipmentIcon
                      equipmentId={equipmentId}
                      label={equipmentName}
                      style={styles.equipmentArt}
                    />
                    <Text variant="label" lines={2}>
                      {equipmentName}
                    </Text>
                  </Surface>
                );
              })}
            </div>
          </Stack>
        )}
        {combatant.skills.length > 0 && (
          <Stack gap="sm">
            <Text as="h3" variant="bodyStrong">
              <Trans>Skills</Trans>
            </Text>
            <div {...stylex.props(styles.skills)}>
              {combatant.skills.map((skill) => (
                <SkillChip key={skill.id} skill={skill} />
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    </BottomSheet>
  );
}
