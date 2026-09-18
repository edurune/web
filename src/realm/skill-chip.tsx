import { useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { skillMetadata } from "../game/art/catalog.ts";
import { Button } from "../ui/primitives/button.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { SkillInfoDialog, type Skill } from "./skill-info-dialog.tsx";

const styles = stylex.create({
  chip: {
    borderRadius: radius.pill,
    maxInlineSize: "100%",
    minInlineSize: space.none,
    paddingInline: space.sm,
    whiteSpace: "normal",
    textAlign: "start",
  },
  icon: { inlineSize: realmLayout.skillIcon, flexShrink: 0 },
  name: { minInlineSize: space.none },
});
export interface SkillChipProps {
  /** Gameplay values come from the current loadout or shop response. */
  skill: Skill;
  style?: StyleXStyles;
}
export function SkillChip({ skill, style }: SkillChipProps) {
  const { t } = useLingui();
  const descriptor = skillMetadata.get(skill.id)?.name;
  const name = descriptor ? t(descriptor) : t`Skill`;
  const mainEffect = skill.effects[0];
  const icon = !mainEffect
    ? "icon-action-skill"
    : mainEffect.kind === "modify_stat"
      ? `icon-status-${mainEffect.stat === "maxHealth" ? "max-health" : mainEffect.stat}-${mainEffect.amount < 0 ? "down" : "up"}`
      : `icon-effect-${mainEffect.kind}`;
  return (
    <SkillInfoDialog
      skill={skill}
      trigger={
        <Button
          variant="secondary"
          size="sm"
          cue={null}
          style={[styles.chip, style]}
          aria-label={t`${name}. View skill`}
        >
          <CombatIcon iconId={icon} style={styles.icon} />
          <Text variant="caption" lines={1} style={styles.name}>
            {name}
          </Text>
        </Button>
      }
    />
  );
}
