import { Trans, useLingui } from "@lingui/react/macro";
import { SparkleIcon, XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useWalletQuery } from "../api/character/use-character-queries.ts";
import { useDailyRewardQuery } from "../api/daily-reward/use-daily-reward-queries.ts";
import { useClaimDailyRewardMutation } from "../api/daily-reward/use-daily-reward-mutations.ts";
import { errorMessage } from "../api/error-messages.ts";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { useSoundWhen } from "../ui/sound/use-sound-when.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { WalletBalance } from "../wallet/wallet-balance.tsx";
import { DailyRewardCard } from "./daily-reward-card.tsx";
import { useMilestonesQuery } from "../api/objective/use-objective-queries.ts";
import { useClaimMilestoneMutation } from "../api/objective/use-objective-mutations.ts";
import { MissionCard } from "../objective/mission-card.tsx";
import { EmptyState } from "../ui/primitives/empty-state.tsx";
import { LoadMoreButton } from "../ui/primitives/load-more-button.tsx";
import { Skeleton } from "../ui/primitives/skeleton.tsx";
import { layout } from "../ui/tokens/layout.stylex.ts";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minBlockSize: space.none,
    minInlineSize: space.none,
  },
  header: {
    position: "relative",
    flexShrink: 0,
    padding: space.sm,
    borderBlockEndWidth: borderWidth.thick,
    borderBlockEndStyle: "solid",
    borderBlockEndColor: color.borderStrong,
    backgroundColor: color.surfaceRaised,
  },
  scroll: { flex: 1, minBlockSize: space.none },
  content: { padding: space.lg },
});

export function RewardsScreen({ style }: { style?: StyleXStyles }) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const wallet = useWalletQuery();
  const daily = useDailyRewardQuery();
  const claim = useClaimDailyRewardMutation();
  const milestones = useMilestonesQuery();
  const claimMilestone = useClaimMilestoneMutation();
  const items = milestones.data?.pages.flatMap((page) => page.items) ?? [];
  const error = daily.error ?? wallet.error;
  useSoundWhen("streak", claim.isSuccess);
  return (
    <main {...stylex.props(styles.page, style)}>
      <Stack direction="row" justify="between" wrap={false} gap="xs" style={styles.header}>
        <Stack direction="row" gap="xs" wrap={false}>
          <IconButton
            icon={XIcon}
            label={t`Back to Home`}
            variant="ghost"
            size="sm"
            cue="close"
            onClick={() => {
              void navigate({ to: "/" });
            }}
          />
          <Text as="h1" variant="bodyStrong">
            <Trans>Rewards</Trans>
          </Text>
        </Stack>
        <WalletBalance />
      </Stack>
      <ScrollArea label={t`Rewards`} indicator="none" style={styles.scroll}>
        <Stack gap="lg" style={styles.content}>
          {!daily.data && (
            <Text as="h2" variant="subheading">
              <Trans>Daily reward</Trans>
            </Text>
          )}
          {error && (
            <Alert
              tone="negative"
              action={
                <Button
                  variant="secondary"
                  cue="retry"
                  onClick={() => {
                    void daily.refetch();
                    void wallet.refetch();
                  }}
                >
                  <Trans>Try again</Trans>
                </Button>
              }
            >
              {t(errorMessage(error))}
            </Alert>
          )}
          {claim.error && <Alert tone="negative">{t(errorMessage(claim.error))}</Alert>}
          {daily.isPending && (
            <Text>
              <Trans>Loading rewards…</Trans>
            </Text>
          )}
          {daily.data && (
            <DailyRewardCard
              title={t`Daily reward`}
              reward={daily.data}
              claiming={claim.isPending}
              onClaim={() => {
                if (daily.data && !daily.data.claimed && !claim.isPending)
                  claim.mutate({ body: { day: daily.data.day } });
              }}
            />
          )}
          <Text as="h2" variant="subheading">
            <Trans>Milestones</Trans>
          </Text>
          {milestones.error && (
            <Alert
              tone="negative"
              action={
                <Button
                  variant="secondary"
                  cue="retry"
                  onClick={() => {
                    void milestones.refetch();
                  }}
                >
                  <Trans>Try again</Trans>
                </Button>
              }
            >
              {t(errorMessage(milestones.error))}
            </Alert>
          )}
          {claimMilestone.error && (
            <Alert tone="negative">{t(errorMessage(claimMilestone.error))}</Alert>
          )}
          {milestones.isPending && <Skeleton height={layout.cardSkeleton} corner="lg" />}
          {milestones.data && items.length === 0 && (
            <EmptyState icon={SparkleIcon} title={t`No milestones yet`} />
          )}
          {items.map((item) => (
            <MissionCard
              key={item.objective.id}
              mission={item}
              claimCue="achievement"
              claimDisabled={claimMilestone.isPending}
              claiming={
                claimMilestone.isPending &&
                claimMilestone.variables?.path.milestoneId === item.objective.id
              }
              onClaim={() =>
                claimMilestone.mutate({ path: { milestoneId: item.objective.id }, body: {} })
              }
              onOpenCourse={(courseId) => {
                void navigate({ to: "/courses/$courseId", params: { courseId } });
              }}
            />
          ))}
          {milestones.hasNextPage && (
            <LoadMoreButton
              autoLoad={!milestones.isError}
              loading={milestones.isFetchingNextPage}
              disabled={milestones.isFetching}
              onLoadMore={() => {
                if (!milestones.isFetching) void milestones.fetchNextPage({ cancelRefetch: false });
              }}
            >
              <Trans>Load more</Trans>
            </LoadMoreButton>
          )}
        </Stack>
      </ScrollArea>
    </main>
  );
}
