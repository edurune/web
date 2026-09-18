import { Trans, useLingui } from "@lingui/react/macro";
import type { StyleXStyles } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";
import type { RealmProgression } from "../api/generated/types.gen.ts";
import { Meter } from "../ui/primitives/meter.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";

const styles = stylex.create({
  badge: {
    backgroundColor: color.cautionFill,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    inlineSize: realmLayout.node,
    flexShrink: 0,
  },
  progress: { flex: 1, minInlineSize: space.none },
});

export interface RealmProgressProps {
  /** Server-supplied XP and thresholds for this course realm. Null next threshold means max level. */
  progression: Pick<
    RealmProgression,
    "experience" | "level" | "levelExperience" | "nextLevelExperience"
  >;
  /** XP the run just earned, marked off as a lighter segment at the end of the bar. */
  gained?: number;
  style?: StyleXStyles;
}

export function hasLevelledUp(
  progression: RealmProgressProps["progression"],
  gained: number,
): boolean {
  return gained > progression.experience - progression.levelExperience;
}

/** The player's course-specific level and progress toward the next level. */
export function RealmProgress({ progression, gained, style }: RealmProgressProps) {
  const { t } = useLingui();
  const { level, experience, levelExperience, nextLevelExperience } = progression;
  const earned = experience - levelExperience;
  const required = nextLevelExperience === null ? null : nextLevelExperience - levelExperience;
  return (
    <Stack direction="row" align="center" gap="md" {...(style && { style })}>
      <Surface
        depth="outlined"
        corner="lg"
        padding="sm"
        style={styles.badge}
        aria-label={t`Level ${level}`}
      >
        <Text variant="caption">
          <Trans>Lv</Trans>
        </Text>
        <Text variant="stat">{level}</Text>
      </Surface>
      <Stack gap="sm" style={styles.progress}>
        {nextLevelExperience === null ? (
          <Text variant="caption">
            <Trans>Maximum level</Trans>
          </Text>
        ) : (
          <>
            <Meter
              value={earned}
              gain={gained}
              max={required ?? 0}
              label={t`Experience`}
              showLabel={false}
            />
            <Text variant="caption">
              <Trans>
                {earned} / {required} XP
              </Trans>
            </Text>
          </>
        )}
        {gained !== undefined && hasLevelledUp(progression, gained) && (
          <Text variant="bodyStrong" tone="positive">
            <Trans>Level up!</Trans>
          </Text>
        )}
      </Stack>
    </Stack>
  );
}
