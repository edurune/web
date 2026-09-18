import { useLingui } from "@lingui/react/macro";
import { InfoIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { ReactNode } from "react";
import type { StyleXStyles } from "@stylexjs/stylex";
import { EquipmentIcon } from "../game/art/equipment-icon.tsx";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { IconButton } from "../ui/primitives/button.tsx";
import { RarityBadge } from "../ui/primitives/badge.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { raritySurface } from "../ui/primitives/rarity-styles.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { equipmentMetadata, stats, statLabels, statIcons, type Equipment } from "./equipment.ts";
import { EquipmentInfoSheet } from "./equipment-info-sheet.tsx";
import { SkillChip } from "./skill-chip.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";

const styles = stylex.create({
  card: { display: "flex", flexDirection: "column", overflow: "hidden", minInlineSize: space.none },
  skills: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    paddingBlock: space.xs,
    paddingInline: space.xs,
  },
  skill: { flexShrink: 0 },
  artPanel: {
    padding: space.sm,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: space.xs,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: borderWidth.thick,
    borderBlockEndColor: color.borderStrong,
  },
  header: { display: "flex", alignItems: "center", gap: space.sm, alignSelf: "stretch" },
  badge: { marginInlineEnd: "auto" },
  art: { inlineSize: realmLayout.itemArt },
  content: { padding: space.md, display: "flex", flexDirection: "column", gap: space.sm, flex: 1 },
  name: { overflowWrap: "anywhere" },
  modifiers: { display: "grid", gridTemplateColumns: realmLayout.shopColumns, gap: space.xs },
  stat: { display: "flex", alignItems: "center", gap: space.xs },
  icon: { inlineSize: realmLayout.skillIcon },
  action: { marginBlockStart: "auto", paddingBlockStart: space.xs },
});
export interface EquipmentCardProps {
  equipment: Equipment;
  action?: ReactNode;
  detail?: ReactNode;
  style?: StyleXStyles;
}
export function EquipmentCard({ equipment, action, detail, style }: EquipmentCardProps) {
  const { t } = useLingui();
  const metadata = equipmentMetadata.get(equipment.equipment.id);
  const name = metadata?.name ? t(metadata.name) : equipment.equipment.id;
  return (
    <Surface depth="lifted" padding="none" style={[styles.card, style]}>
      <div {...stylex.props(styles.artPanel, raritySurface[equipment.rarity])}>
        <div {...stylex.props(styles.header)}>
          <RarityBadge rarity={equipment.rarity} style={styles.badge} />
          <EquipmentInfoSheet
            equipment={equipment}
            trigger={
              <IconButton
                icon={InfoIcon}
                label={t`${name}. View equipment info`}
                variant="secondary"
                size="sm"
                cue={null}
              />
            }
          />
        </div>
        <EquipmentIcon equipmentId={equipment.equipment.id} style={styles.art} />
      </div>
      <div {...stylex.props(styles.content)}>
        <Text variant="bodyStrong" style={styles.name}>
          {name}
        </Text>
        <div {...stylex.props(styles.modifiers)}>
          {stats.map((stat) => {
            const value = equipment.equipment.statModifiers[stat];
            return (
              <div key={stat} title={t(statLabels[stat])} {...stylex.props(styles.stat)}>
                <CombatIcon
                  iconId={statIcons[stat]}
                  label={t(statLabels[stat])}
                  style={styles.icon}
                />
                <Text
                  variant="label"
                  tone={value > 0 ? "positive" : value < 0 ? "negative" : "secondary"}
                >
                  {value > 0 ? "+" : ""}
                  {value}
                </Text>
              </div>
            );
          })}
        </div>
        {equipment.equipment.skills.length > 0 && (
          <ScrollArea
            orientation="horizontal"
            indicator="fade"
            label={t`Skills`}
            contentStyle={styles.skills}
          >
            {equipment.equipment.skills.map((skill) => (
              <SkillChip key={skill.id} skill={skill} style={styles.skill} />
            ))}
          </ScrollArea>
        )}
        {detail}
        {action && <div {...stylex.props(styles.action)}>{action}</div>}
      </div>
    </Surface>
  );
}
