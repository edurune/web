import { Trans, useLingui } from "@lingui/react/macro";
import { msg } from "@lingui/core/macro";
import type { MessageDescriptor } from "@lingui/core";
import {
  TrophyIcon,
  FlagIcon,
  ArrowsClockwiseIcon,
  SwordIcon,
  BookOpenTextIcon,
  type Icon,
} from "@phosphor-icons/react";
import { InfoIcon } from "@phosphor-icons/react";
import { victoryMusicUrl } from "@edurune/art/assets";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useEffect } from "react";
import type { SessionResult } from "../api/generated/types.gen.ts";
import { playStinger } from "../ui/sound/music.ts";
import { playSound } from "../ui/sound/sound.ts";
import { RealmProgress, hasLevelledUp } from "../game/realm-progress.tsx";
import { EquipmentIcon } from "../game/art/equipment-icon.tsx";
import { equipmentMetadata } from "../game/art/catalog.ts";
import { EquipmentInfoSheet } from "../realm/equipment-info-sheet.tsx";
import { IconButton } from "../ui/primitives/button.tsx";
import { CurrencyChip } from "../ui/primitives/currency-chip.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { space } from "../ui/tokens/space.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";

const titles = {
  won: msg`Victory!`,
  lost: msg`Defeated`,
  abandoned: msg`Practice ended`,
  turn_limit_reached: msg`Turn limit reached`,
};
// A defeat is where the next run gets planned, so the panel names the ways to come back stronger.
const tips: { id: string; icon: Icon; text: MessageDescriptor }[] = [
  {
    id: "replay",
    icon: ArrowsClockwiseIcon,
    text: msg`Replay practices to earn medals and gear.`,
  },
  {
    id: "equipment",
    icon: SwordIcon,
    text: msg`Buy and equip gear to get stronger.`,
  },
  {
    id: "lessons",
    icon: BookOpenTextIcon,
    text: msg`Read new lessons to gain XP and level up.`,
  },
];
const styles = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: space.xl },
  summary: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: space.lg,
    backgroundColor: color.cautionFill,
  },
  badge: { inlineSize: realmLayout.node },
  rewards: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: space.md,
  },
  item: { display: "flex", alignItems: "center", gap: space.md },
  itemName: { flex: 1, minInlineSize: space.none, overflowWrap: "anywhere" },
  tips: { display: "flex", flexDirection: "column", gap: space.md },
  tip: { display: "flex", alignItems: "flex-start", gap: space.md },
  tipIcon: { flexShrink: 0, marginBlockStart: space.xxs },
});

type Outcome = SessionResult["session"]["phase"] extends infer Phase
  ? Phase extends { kind: "finished"; outcome: infer Value }
    ? Value
    : never
  : never;

// A session celebrates itself once. The marker outlives the component because remounting the
// screen must not restart a five second fanfare, and the cues that follow are fire and forget:
// cancelling them on unmount would silence the whole sequence under StrictMode's double mount.
let sounded: string | null = null;

function useOutcomeFanfare(outcome: Outcome | null, result: SessionResult) {
  useEffect(() => {
    if (!outcome || sounded === result.id) return;
    sounded = result.id;
    if (outcome !== "won") {
      playSound("stop");
      return;
    }
    playStinger(victoryMusicUrl);
    if (result.session.rewards.equipments.length > 0)
      window.setTimeout(() => playSound("bonus"), 450);
    if (hasLevelledUp(result.realm.progression, result.session.rewards.experience))
      window.setTimeout(() => playSound("level-up"), 900);
  }, [outcome, result]);
}

export function PracticeResult({ result, style }: { result: SessionResult; style?: StyleXStyles }) {
  const { t } = useLingui();
  const { session } = result;
  const outcome = session.phase.kind === "finished" ? session.phase.outcome : null;
  useOutcomeFanfare(outcome, result);
  if (session.phase.kind !== "finished") return null;
  const won = session.phase.outcome === "won";
  const xp = session.rewards.experience;
  return (
    <div {...stylex.props(styles.root, style)}>
      <Surface depth="lifted" style={styles.summary}>
        {won ? (
          <TrophyIcon size={iconSize.xxl} weight="bold" aria-hidden="true" />
        ) : (
          <FlagIcon size={iconSize.xxl} weight="bold" aria-hidden="true" />
        )}
        <Text as="h2" variant="title">
          {t(titles[session.phase.outcome])}
        </Text>
        {won && (
          <div {...stylex.props(styles.rewards)}>
            <CurrencyChip kind="medal" amount={session.rewards.medals} />
            <CurrencyChip kind="coin" amount={session.rewards.coins} />
            <Text variant="bodyStrong">
              <Trans>+{xp} XP</Trans>
            </Text>
          </div>
        )}
      </Surface>
      {won && (
        <>
          <RealmProgress progression={result.realm.progression} gained={xp} />
          {session.rewards.equipments.map((id) => {
            const descriptor = equipmentMetadata.get(id)?.name;
            const name = descriptor ? t(descriptor) : id;
            const owned = result.realm.equipments.find(
              (entry) => entry.equipment.equipment.id === id,
            );
            return (
              <Surface key={id} depth="lifted" padding="md" style={styles.item}>
                <EquipmentIcon equipmentId={id} style={styles.badge} />
                <Text variant="bodyStrong" style={styles.itemName}>
                  {descriptor ? t(descriptor) : <Trans>Equipment</Trans>}
                </Text>
                {owned && (
                  <EquipmentInfoSheet
                    equipment={owned.equipment}
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
                )}
              </Surface>
            );
          })}
        </>
      )}
      {!won && (
        <Surface depth="lifted" style={styles.tips}>
          <Text variant="bodyStrong" as="h3">
            <Trans>Before you try again</Trans>
          </Text>
          {tips.map(({ id, icon: Glyph, text }) => (
            <div key={id} {...stylex.props(styles.tip)}>
              <Glyph
                size={iconSize.md}
                weight="bold"
                aria-hidden="true"
                {...stylex.props(styles.tipIcon)}
              />
              <Text>{t(text)}</Text>
            </div>
          ))}
        </Surface>
      )}
    </div>
  );
}
