import { Plural, Trans, useLingui } from "@lingui/react/macro";
import { CheckIcon, FireIcon, LockSimpleIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { GetApiDailyRewardResponse } from "../api/generated/types.gen.ts";
import { Button } from "../ui/primitives/button.tsx";
import { CurrencyAmount } from "../ui/primitives/currency-amount.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { VisuallyHidden } from "../ui/primitives/visually-hidden.tsx";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { color, currency } from "../ui/tokens/color.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { rewardLayout } from "../ui/tokens/reward.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { control } from "../ui/tokens/size.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";

const styles = stylex.create({
  streak: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xxs,
    paddingBlock: space.xs,
    paddingInline: space.sm,
    borderRadius: radius.pill,
    color: color.textPrimary,
  },
  flame: { color: color.notificationFill },
  days: {
    display: "grid",
    gridTemplateColumns: rewardLayout.calendarColumns,
    gap: space.sm,
    listStyle: "none",
    margin: space.none,
    padding: space.none,
  },
  day: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
    minInlineSize: space.none,
    minBlockSize: rewardLayout.dayHeight,
    paddingBlock: space.sm,
    paddingInline: space.xxs,
    backgroundColor: {
      default: color.surfaceRaised,
      ':is([data-state="today"])': color.cautionFill,
      ':is([data-state="complete"])': color.positiveFill,
    },
    color: color.textPrimary,
  },
  bonus: {
    gridColumn: "span 2",
    backgroundColor: {
      default: currency.gemFill,
      ':is([data-state="complete"])': color.positiveFill,
    },
  },
  dayAmount: { flexDirection: "column", gap: space.xxs, color: color.textPrimary },
  dayState: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minBlockSize: space.lg,
  },
  claim: {
    backgroundColor: {
      default: color.cautionFill,
      ":hover:not(:disabled)": color.cautionSoft,
      ":disabled": color.cautionSoft,
    },
  },
  collected: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    minBlockSize: control.md,
    paddingInline: space.sm,
    borderStyle: "solid",
    borderWidth: borderWidth.thick,
    borderColor: color.borderStrong,
    borderRadius: radius.lg,
    backgroundColor: color.positiveFill,
    color: color.textPrimary,
  },
});

export interface DailyRewardCardProps {
  title?: string;
  reward: GetApiDailyRewardResponse;
  claiming?: boolean;
  onClaim: () => void;
  style?: StyleXStyles;
}

export function DailyRewardCard({ title, reward, claiming, onClaim, style }: DailyRewardCardProps) {
  const { t } = useLingui();
  const streak = reward.streak;
  return (
    <Stack gap="sm" style={style}>
      <Stack direction="row" justify={title ? "between" : "end"} wrap={false}>
        {title && (
          <Text as="h2" variant="subheading">
            {title}
          </Text>
        )}
        <span {...stylex.props(styles.streak)}>
          <FireIcon
            weight="fill"
            size={iconSize.md}
            aria-hidden="true"
            {...stylex.props(styles.flame)}
          />
          <Text variant="bodyStrong" tone="inherit">
            <span aria-hidden="true">{streak}</span>
            <VisuallyHidden>
              <Plural value={streak} one="# day streak" other="# day streak" />
            </VisuallyHidden>
          </Text>
        </span>
      </Stack>
      <Surface depth="lifted" padding="md">
        <Stack gap="lg">
          <ol aria-label={t`Daily rewards`} {...stylex.props(styles.days)}>
            {reward.rewards.map((dayReward, index) => {
              const day = index + 1;
              const today = day === reward.rewardDay;
              const complete = day < reward.rewardDay || (today && reward.claimed);
              const bonus = day === reward.rewards.length && reward.rewards.length % 4 === 3;
              return (
                <Surface
                  as="li"
                  depth="lifted"
                  padding="sm"
                  corner="md"
                  key={day}
                  aria-current={today ? "step" : undefined}
                  data-state={complete ? "complete" : today ? "today" : "upcoming"}
                  style={[styles.day, bonus && styles.bonus]}
                >
                  <Text variant="caption" tone="inherit">
                    <Trans>Day {day}</Trans>
                  </Text>
                  <Stack direction="row" gap="sm" justify="center">
                    {dayReward.coins > 0 && (
                      <CurrencyAmount
                        kind="coin"
                        amount={dayReward.coins}
                        size="md"
                        signed
                        style={styles.dayAmount}
                      />
                    )}
                    {dayReward.gems > 0 && (
                      <CurrencyAmount
                        kind="gem"
                        amount={dayReward.gems}
                        size="md"
                        signed
                        style={styles.dayAmount}
                      />
                    )}
                  </Stack>
                  <span {...stylex.props(styles.dayState)}>
                    {complete ? (
                      <>
                        <CheckIcon weight="bold" size={iconSize.sm} aria-hidden="true" />
                        <VisuallyHidden>
                          <Trans>Claimed</Trans>
                        </VisuallyHidden>
                      </>
                    ) : today ? (
                      <Text variant="caption" tone="inherit">
                        <Trans>Today</Trans>
                      </Text>
                    ) : (
                      <>
                        <LockSimpleIcon weight="bold" size={iconSize.xs} aria-hidden="true" />
                        <VisuallyHidden>
                          <Trans>Upcoming</Trans>
                        </VisuallyHidden>
                      </>
                    )}
                  </span>
                </Surface>
              );
            })}
          </ol>
          {reward.claimed ? (
            <div role="status" {...stylex.props(styles.collected)}>
              <CheckIcon size={iconSize.md} weight="bold" aria-hidden="true" />
              <Text variant="bodyStrong" tone="inherit">
                <Trans>Claimed</Trans>
              </Text>
            </div>
          ) : (
            <Button
              fullWidth
              cue="reward"
              loading={claiming}
              onClick={onClaim}
              style={styles.claim}
            >
              <Trans>Claim</Trans>
            </Button>
          )}
        </Stack>
      </Surface>
    </Stack>
  );
}
