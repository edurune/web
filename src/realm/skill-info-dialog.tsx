import { Trans, Plural, useLingui } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import * as stylex from "@stylexjs/stylex";
import type { DialogProps } from "../ui/primitives/dialog.tsx";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { skillMetadata } from "../game/art/catalog.ts";
import { Dialog } from "../ui/primitives/dialog.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { realmStyles } from "./realm-layout.ts";
import { statLabels, statIcons, type Loadout } from "./equipment.ts";

export type Skill = Loadout["skills"][number];

const targets = {
  self: msg`Self`,
  single_enemy: msg`One enemy`,
  all_enemies: msg`All enemies`,
  all_allies: msg`All allies`,
};
const styles = stylex.create({
  icon: { inlineSize: realmLayout.skillIcon, flexShrink: 0 },
  effects: { display: "flex", flexDirection: "column", gap: space.md },
});

export interface SkillInfoDialogProps extends Pick<
  DialogProps,
  "open" | "defaultOpen" | "onOpenChange" | "trigger" | "style"
> {
  /** Gameplay values come from the current loadout, shop, or battle response. */
  skill: Skill;
}

export function SkillInfoDialog({ skill, style, ...dialog }: SkillInfoDialogProps) {
  const { t } = useLingui();
  const descriptor = skillMetadata.get(skill.id)?.name;
  const description = skillMetadata.get(skill.id)?.description;
  const name = descriptor ? t(descriptor) : t`Skill`;
  const cost = skill.manaCost;
  return (
    <Dialog {...dialog} title={name} style={style}>
      <Stack gap="lg">
        {description && <Text>{t(description)}</Text>}
        <div {...stylex.props(realmStyles.row)}>
          <CombatIcon iconId="icon-resource-mana" style={styles.icon} />
          <Text variant="label">
            <Trans>{cost} mana</Trans>
          </Text>
        </div>
        <div {...stylex.props(realmStyles.row)}>
          <CombatIcon
            iconId={`icon-target-${skill.targeting.replaceAll("_", "-")}`}
            style={styles.icon}
          />
          <Text variant="label">{t(targets[skill.targeting])}</Text>
        </div>
        <Surface padding="md" style={styles.effects}>
          {skill.effects.map((effect, index) => {
            const amount = "amount" in effect ? effect.amount : 0;
            const multiplier = "multiplier" in effect ? effect.multiplier : 0;
            const turns = "duration" in effect ? effect.duration : 0;
            const stat = "stat" in effect ? t(statLabels[effect.stat]) : "";
            const change = amount > 0 ? `+${amount}` : String(amount);
            // Repeated effects are separate ordered hits, with no IDs in the contract.
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Stack key={index} gap="xs">
                <div {...stylex.props(realmStyles.row)}>
                  <CombatIcon
                    iconId={
                      effect.kind === "modify_stat"
                        ? statIcons[effect.stat]
                        : `icon-effect-${effect.kind}`
                    }
                    style={styles.icon}
                  />
                  <Text variant="bodyStrong">
                    {effect.kind === "damage" ? (
                      <Trans>{multiplier}× attack</Trans>
                    ) : effect.kind === "heal" ? (
                      <Trans>Restore {amount} health</Trans>
                    ) : effect.kind === "shield" ? (
                      <Trans>{amount} shield</Trans>
                    ) : (
                      <>
                        {stat} {change}
                      </>
                    )}
                  </Text>
                </div>
                {turns > 0 && (
                  <Text variant="caption" tone="secondary">
                    <Plural value={turns} one="# target turn" other="# target turns" />
                  </Text>
                )}
              </Stack>
            );
          })}
        </Surface>
      </Stack>
    </Dialog>
  );
}
