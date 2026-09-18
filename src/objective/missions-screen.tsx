import { Trans, useLingui } from "@lingui/react/macro";
import { ClipboardTextIcon, XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useWalletQuery } from "../api/character/use-character-queries.ts";
import { useCurrentMissionsQuery } from "../api/objective/use-objective-queries.ts";
import { useClaimMissionMutation } from "../api/objective/use-objective-mutations.ts";
import { errorMessage } from "../api/error-messages.ts";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { EmptyState } from "../ui/primitives/empty-state.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { Skeleton } from "../ui/primitives/skeleton.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { VisuallyHidden } from "../ui/primitives/visually-hidden.tsx";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { WalletBalance } from "../wallet/wallet-balance.tsx";
import { MissionCard } from "./mission-card.tsx";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minBlockSize: space.none,
    minInlineSize: space.none,
  },
  header: {
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

export function MissionsScreen({ style }: { style?: StyleXStyles }) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const wallet = useWalletQuery();
  const missions = useCurrentMissionsQuery();
  const claimMission = useClaimMissionMutation();
  const error = missions.error ?? wallet.error;
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
            <Trans>Missions</Trans>
          </Text>
        </Stack>
        <WalletBalance />
      </Stack>
      <ScrollArea label={t`Missions`} indicator="none" style={styles.scroll}>
        <Stack gap="xl" style={styles.content}>
          {error && (
            <Alert
              tone="negative"
              action={
                <Button
                  variant="secondary"
                  cue="retry"
                  onClick={() => {
                    void missions.refetch();
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
          {claimMission.error && (
            <Alert tone="negative">{t(errorMessage(claimMission.error))}</Alert>
          )}
          <Stack gap="md">
            {missions.isPending && (
              <div role="status">
                <VisuallyHidden>
                  <Trans>Loading missions…</Trans>
                </VisuallyHidden>
                <Stack gap="md">
                  <Skeleton height={layout.cardSkeleton} corner="lg" />
                  <Skeleton height={layout.cardSkeleton} corner="lg" />
                </Stack>
              </div>
            )}
            {missions.data?.missions.length === 0 && (
              <EmptyState icon={ClipboardTextIcon} title={t`No missions yet`} />
            )}
            {missions.data && missions.data.missions.length > 0 && (
              <Text as="h2" variant="bodyStrong">
                <Trans>Today’s missions</Trans>
              </Text>
            )}
            {missions.data?.missions.map((mission) => (
              <MissionCard
                key={mission.objective.id}
                mission={mission}
                onOpenCourse={(courseId) => {
                  void navigate({ to: "/courses/$courseId", params: { courseId } });
                }}
                claiming={
                  claimMission.isPending &&
                  claimMission.variables?.path.missionId === mission.objective.id
                }
                claimDisabled={claimMission.isPending}
                onClaim={() => {
                  if (missions.data)
                    claimMission.mutate({
                      path: { periodId: missions.data.id, missionId: mission.objective.id },
                      body: {},
                    });
                }}
              />
            ))}
          </Stack>
        </Stack>
      </ScrollArea>
    </main>
  );
}
