import { Trans, useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { EquipmentIcon } from "../game/art/equipment-icon.tsx";
import { Badge, RarityBadge } from "../ui/primitives/badge.tsx";
import {
  BottomSheet,
  BottomSheetClose,
  type BottomSheetProps,
} from "../ui/primitives/bottom-sheet.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import {
  equipmentMetadata,
  slotLabels,
  stats,
  statIcons,
  statLabels,
  type Equipment,
} from "./equipment.ts";
import { SkillChip } from "./skill-chip.tsx";

export interface EquipmentInfoSheetProps extends Pick<
  BottomSheetProps,
  "open" | "defaultOpen" | "onOpenChange" | "trigger" | "style"
> {
  equipment: Equipment;
}

const styles = stylex.create({
  hero: { display: "flex", alignItems: "center", gap: space.lg },
  art: { inlineSize: realmLayout.itemArt, flexShrink: 0 },
  details: { flex: 1, minInlineSize: space.none },
  badges: { display: "flex", flexWrap: "wrap", gap: space.sm },
  modifiers: {
    display: "grid",
    gridTemplateColumns: realmLayout.statColumns,
    gap: space.sm,
    margin: space.none,
  },
  modifier: { display: "flex", flexDirection: "column", alignItems: "center", gap: space.sm },
  term: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: space.xs,
    textAlign: "center",
  },
  icon: { inlineSize: realmLayout.statIcon, flexShrink: 0 },
  skills: { display: "flex", flexWrap: "wrap", gap: space.sm },
});

/** Full stats, skills, and lore for one piece of equipment. */
export function EquipmentInfoSheet({ equipment, style, ...sheet }: EquipmentInfoSheetProps) {
  const { t } = useLingui();
  const metadata = equipmentMetadata.get(equipment.equipment.id);
  const name = metadata?.name ? t(metadata.name) : equipment.equipment.id;
  return (
    <BottomSheet
      {...sheet}
      title={name}
      footer={
        <BottomSheetClose render={<Button fullWidth cue={null} />}>
          <Trans>Close</Trans>
        </BottomSheetClose>
      }
      style={style}
    >
      <Stack gap="lg">
        <div {...stylex.props(styles.hero)}>
          <EquipmentIcon equipmentId={equipment.equipment.id} label={name} style={styles.art} />
          <Stack gap="sm" style={styles.details}>
            <div {...stylex.props(styles.badges)}>
              <RarityBadge rarity={equipment.rarity} />
              <Badge tone="neutral">{t(slotLabels[equipment.slot])}</Badge>
            </div>
            {metadata?.description && <Text tone="secondary">{t(metadata.description)}</Text>}
          </Stack>
        </div>
        <Stack gap="sm">
          <Text as="h3" variant="bodyStrong">
            <Trans>Stat modifiers</Trans>
          </Text>
          <dl {...stylex.props(styles.modifiers)}>
            {stats.map((stat) => {
              const value = equipment.equipment.statModifiers[stat];
              return (
                <Surface key={stat} tone="warm" depth="lifted" padding="md" style={styles.modifier}>
                  <dt {...stylex.props(styles.term)}>
                    <CombatIcon iconId={statIcons[stat]} style={styles.icon} />
                    <Text variant="label">{t(statLabels[stat])}</Text>
                  </dt>
                  <Text
                    as="dd"
                    variant="stat"
                    tone={value > 0 ? "positive" : value < 0 ? "negative" : "secondary"}
                  >
                    {value > 0 ? "+" : ""}
                    {value}
                  </Text>
                </Surface>
              );
            })}
          </dl>
        </Stack>
        {equipment.equipment.skills.length > 0 && (
          <Stack gap="sm">
            <Text as="h3" variant="bodyStrong">
              <Trans>Skills</Trans>
            </Text>
            <div {...stylex.props(styles.skills)}>
              {equipment.equipment.skills.map((skill) => (
                <SkillChip key={skill.id} skill={skill} />
              ))}
            </div>
          </Stack>
        )}
      </Stack>
    </BottomSheet>
  );
}
