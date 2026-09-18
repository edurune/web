import { useState } from "react";
import { useLingui } from "@lingui/react/macro";
import { InfoIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { SessionView } from "../api/generated/types.gen.ts";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { SkillInfoDialog } from "../realm/skill-info-dialog.tsx";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { CardButton } from "../ui/primitives/card-button.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Spinner } from "../ui/primitives/spinner.tsx";
import { space } from "../ui/tokens/space.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { practiceLayout } from "../ui/tokens/practice.stylex.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { actionKey, actionLabels, skillMetadata, skillIcon, type ActionOption } from "./session.ts";

const styles = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: space.md },
  tabs: {
    display: "grid",
    gridTemplateColumns: practiceLayout.actionColumns,
    gap: space.sm,
    paddingBlockEnd: space.xs,
  },
  tab: {
    blockSize: practiceLayout.actionHeight,
    paddingInline: space.xs,
  },
  tabContent: { display: "flex", flexDirection: "column", alignItems: "center", gap: space.xs },
  icon: { inlineSize: practiceLayout.moveIcon },
  smallIcon: { inlineSize: realmLayout.skillIcon },
  selected: {
    backgroundColor: { default: color.cautionFill, ":hover:not(:disabled)": color.cautionFill },
  },
  disabled: { backgroundColor: color.disabledSurface, borderColor: color.borderDisabled },
  copy: { flex: 1, minInlineSize: space.none },
  cost: { display: "flex", alignItems: "center", gap: space.xxs, flexShrink: 0 },
  skillRow: { display: "flex", alignItems: "center", gap: space.sm, minInlineSize: space.none },
  skillCard: { flex: 1, minInlineSize: space.none },
  info: { flexShrink: 0 },
});

export function MovePicker({
  actions,
  skills,
  pendingAction,
  onAction,
  disabled = false,
  style,
}: {
  actions: ActionOption[];
  skills: SessionView["combatants"][number]["skills"];
  pendingAction?: string;
  onAction: (option: ActionOption) => void;
  disabled?: boolean;
  style?: StyleXStyles;
}) {
  const { t } = useLingui();
  const [showSkills, setShowSkills] = useState(false);
  const skillActions = actions.filter((option) => option.action.kind === "skill");
  return (
    <div {...stylex.props(styles.root, style)}>
      <div {...stylex.props(styles.tabs)}>
        {(["attack", "defend", "skill"] as const).map((kind) => {
          const option = actions.find((value) => value.action.kind === kind);
          const active = kind === "skill" && showSkills;
          return (
            <Button
              key={kind}
              variant="secondary"
              cue={kind === "skill" ? (showSkills ? "collapse" : "expand") : "select"}
              style={[styles.tab, active && styles.selected]}
              disabled={disabled}
              blocked={kind === "skill" ? !skillActions.length : !option?.available}
              loading={kind !== "skill" && pendingAction === kind}
              aria-expanded={kind === "skill" ? showSkills : undefined}
              onClick={() => {
                if (kind === "skill") setShowSkills((open) => !open);
                else if (option) onAction(option);
              }}
            >
              <span {...stylex.props(styles.tabContent)}>
                <span aria-hidden="true">
                  <CombatIcon iconId={`icon-action-${kind}`} style={styles.icon} />
                </span>
                {t(actionLabels[kind])}
              </span>
            </Button>
          );
        })}
      </div>
      {showSkills &&
        skillActions.map((option) => {
          const skill = skills.find((value) => value.id === actionKey(option.action));
          if (!skill) return null;
          const metadata = skillMetadata.get(skill.id);
          const name = metadata?.name ? t(metadata.name) : t`Skill`;
          const pending = pendingAction === skill.id;
          const cost = option.manaCost;
          return (
            <div key={skill.id} {...stylex.props(styles.skillRow)}>
              <CardButton
                cue="select"
                aria-busy={pending || undefined}
                aria-label={!option.available ? t`${name}. Not enough mana` : name}
                disabled={disabled}
                blocked={!option.available}
                style={[styles.skillCard, !option.available && styles.disabled]}
                onClick={() => onAction(option)}
              >
                <CombatIcon iconId={skillIcon(skill)} style={styles.icon} />
                <Stack gap="xs" style={styles.copy}>
                  <Text variant="bodyStrong">{name}</Text>
                  {metadata?.description && (
                    <Text variant="caption" tone="secondary">
                      {t(metadata.description)}
                    </Text>
                  )}
                </Stack>
                {pending ? (
                  <Spinner label={t`Loading question`} />
                ) : (
                  <span {...stylex.props(styles.cost)}>
                    <CombatIcon iconId="icon-resource-mana" style={styles.smallIcon} />
                    <Text variant="label">{cost}</Text>
                  </span>
                )}
              </CardButton>
              <SkillInfoDialog
                skill={skill}
                trigger={
                  <IconButton
                    icon={InfoIcon}
                    label={t`${name}. View skill`}
                    variant="secondary"
                    cue={null}
                    style={styles.info}
                  />
                }
              />
            </div>
          );
        })}
    </div>
  );
}
