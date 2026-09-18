import { Trans, useLingui } from "@lingui/react/macro";
import { ArrowRightIcon, PlusIcon, GiftIcon, ClipboardTextIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { CharacterArea } from "../character/character-area.tsx";
import { useDailyRewardQuery } from "../api/daily-reward/use-daily-reward-queries.ts";
import { useCurrentMissionsQuery } from "../api/objective/use-objective-queries.ts";
import { errorMessage } from "../api/error-messages.ts";
import { useCoursesInfiniteQuery } from "../api/course/use-course-queries.ts";
import { CourseCard } from "../course/course-card.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { LoadMoreButton } from "../ui/primitives/load-more-button.tsx";
import { EmptyState } from "../ui/primitives/empty-state.tsx";
import { Meter } from "../ui/primitives/meter.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { iconSize } from "../ui/tokens/scale.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minBlockSize: space.none,
    minInlineSize: space.none,
  },
  scroll: { flex: 1, minBlockSize: space.none },
  main: { padding: space.lg },
  rewardButton: {
    backgroundColor: {
      default: color.cautionFill,
      ":hover:not(:disabled)": color.cautionSoft,
    },
  },
});

export function HomeScreen({ style }: { style?: StyleXStyles }) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const query = useCoursesInfiniteQuery({ joined: true, limit: 20 });
  const dailyReward = useDailyRewardQuery();
  const missions = useCurrentMissionsQuery();
  const readyMissions =
    missions.data?.missions.filter((mission) => mission.status === "completed").length ?? 0;
  const courses = query.data?.pages.flatMap((page) => page.items) ?? [];
  const current = courses.find((course) => course.status === "in_progress") ?? courses[0];
  const completed = current?.completedItems ?? 0;
  const total = current?.totalItems ?? 0;
  const open = (courseId: string) => {
    void navigate({ to: "/courses/$courseId", params: { courseId } });
  };
  const search = () => {
    void navigate({ to: "/search", search: {} });
  };
  return (
    <main {...stylex.props(styles.page, style)}>
      <CharacterArea
        compact
        characterLabel={t`Your profile`}
        onCharacterClick={() => {
          void navigate({ to: "/me" });
        }}
        actions={
          <Stack gap="md">
            <IconButton
              icon={ClipboardTextIcon}
              label={readyMissions > 0 ? t`Missions, ${readyMissions} rewards ready` : t`Missions`}
              variant="secondary"
              shape="circle"
              size="lg"
              badge={readyMissions}
              cue="forward"
              onClick={() => {
                void navigate({ to: "/missions" });
              }}
            />
            <IconButton
              icon={GiftIcon}
              label={dailyReward.data?.claimed === false ? t`Daily reward available` : t`Rewards`}
              variant="secondary"
              shape="circle"
              size="lg"
              badge={dailyReward.data?.claimed === false ? "!" : undefined}
              cue="forward"
              style={styles.rewardButton}
              onClick={() => {
                void navigate({ to: "/rewards" });
              }}
            />
          </Stack>
        }
      />
      <ScrollArea label={t`Your courses`} indicator="none" style={styles.scroll}>
        <Stack gap="xl" style={styles.main}>
          {current && (
            <Surface depth="lifted">
              <Stack gap="md">
                <Text variant="subheading" as="h2">
                  {current.title}
                </Text>
                {total > 0 && (
                  <Meter
                    value={completed}
                    max={total}
                    size="sm"
                    label={t`Progress`}
                    valueLabel={t`${completed} of ${total} complete`}
                  />
                )}
                <Button fullWidth cue="forward" onClick={() => open(current.id)}>
                  <Trans>Continue</Trans>
                  <ArrowRightIcon size={iconSize.md} weight="bold" aria-hidden="true" />
                </Button>
              </Stack>
            </Surface>
          )}
          {query.isPending && (
            <Text>
              <Trans>Loading courses…</Trans>
            </Text>
          )}
          {query.isError && (
            <Alert
              tone="negative"
              action={
                <Button
                  variant="secondary"
                  cue="retry"
                  onClick={() => {
                    void query.refetch();
                  }}
                >
                  <Trans>Try again</Trans>
                </Button>
              }
            >
              {t(errorMessage(query.error))}
            </Alert>
          )}
          {!query.isPending && !query.isError && !courses.length && (
            <EmptyState
              title={t`Your next adventure starts here`}
              description={t`Join a course to start learning.`}
            />
          )}
          {courses.length > 0 && (
            <Stack gap="md">
              <Text variant="subheading" as="h2">
                <Trans>Your courses</Trans>
              </Text>
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} onJoin={open} onOpen={open} />
              ))}
            </Stack>
          )}
          {query.hasNextPage && (
            <LoadMoreButton
              autoLoad={!query.isError}
              disabled={query.isFetching}
              loading={query.isFetchingNextPage}
              onLoadMore={() => {
                if (!query.isFetching) void query.fetchNextPage({ cancelRefetch: false });
              }}
            >
              <Trans>Load more</Trans>
            </LoadMoreButton>
          )}
          <Button variant="secondary" fullWidth cue="forward" onClick={search}>
            <PlusIcon size={iconSize.md} weight="bold" aria-hidden="true" />
            <Trans>Find courses</Trans>
          </Button>
        </Stack>
      </ScrollArea>
    </main>
  );
}
