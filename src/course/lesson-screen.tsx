import { useEffect, useRef, useState } from "react";
import { Trans, useLingui } from "@lingui/react/macro";
import { useNavigate } from "@tanstack/react-router";
import { XIcon, ClockIcon, CaretRightIcon, MedalIcon, CoinsIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useLessonQuery } from "../api/course/use-navigation-queries.ts";
import { useCompleteLessonMutation } from "../api/course/use-lesson-mutations.ts";
import { errorMessage } from "../api/error-messages.ts";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { Meter } from "../ui/primitives/meter.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { Skeleton } from "../ui/primitives/skeleton.tsx";
import { color, currency } from "../ui/tokens/color.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { realmStyles } from "../realm/realm-layout.ts";
import { LessonContent } from "./lesson-content.tsx";
import { MediaAttachments } from "../asset/media-attachments.tsx";
import { SettingsMenu } from "../user/settings-menu.tsx";

const styles = stylex.create({
  header: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    backgroundColor: color.surfaceRaised,
    flexShrink: 0,
  },
  title: { flex: 1, minInlineSize: space.none },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    padding: space.lg,
    backgroundColor: color.surfaceRaised,
    borderBlockStartWidth: borderWidth.thick,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color.borderStrong,
    flexShrink: 0,
  },
  rewards: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.lg,
    flexWrap: "wrap",
  },
  medal: { color: currency.medalStroke },
  coin: { color: currency.coinStroke },
});
export function LessonScreen({ courseId, itemId }: { courseId: string; itemId: string }) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const lesson = useLessonQuery(courseId, itemId);
  const complete = useCompleteLessonMutation(courseId);
  const viewport = useRef<HTMLDivElement>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const data = lesson.data;
  const error = complete.error ?? lesson.error;
  const unit = data?.unitNumber;
  const minutes = data?.estimatedDurationMinutes;
  useEffect(() => {
    const element = viewport.current;
    if (!data || !element) return;
    const measure = () => {
      const remaining = element.scrollHeight - element.clientHeight;
      setReadingProgress(remaining > 0 ? (element.scrollTop / remaining) * 100 : 100);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (element.firstElementChild) observer.observe(element.firstElementChild);
    return () => observer.disconnect();
  }, [data]);
  const back = () => {
    void navigate({
      to: "/courses/$courseId",
      params: { courseId },
      search: { unit: data?.unitId },
    });
  };
  return (
    <main {...stylex.props(realmStyles.page)}>
      <header {...stylex.props(styles.header)}>
        <IconButton
          icon={XIcon}
          label={t`Back to map`}
          variant="ghost"
          cue="close"
          onClick={back}
        />
        <Stack gap="xs" style={styles.title}>
          {unit !== undefined && (
            <Text variant="caption" tone="secondary">
              <Trans>Unit {unit}</Trans>
            </Text>
          )}
          <Text as="h1" variant="bodyStrong" lines={2}>
            {data?.title ?? <Trans>Lesson</Trans>}
          </Text>
        </Stack>
        {minutes && (
          <div {...stylex.props(realmStyles.row)}>
            <ClockIcon size={iconSize.sm} weight="bold" aria-hidden="true" />
            <Text variant="caption">
              <Trans>{minutes}m</Trans>
            </Text>
          </div>
        )}
        <SettingsMenu />
      </header>
      <Meter value={readingProgress} label={t`Reading progress`} showLabel={false} size="sm" />
      <ScrollArea
        viewportRef={viewport}
        label={t`Lesson`}
        indicator="none"
        style={realmStyles.scroll}
        contentStyle={realmStyles.content}
        onScroll={(event) => {
          const element = event.currentTarget;
          const remaining = element.scrollHeight - element.clientHeight;
          setReadingProgress(remaining > 0 ? (element.scrollTop / remaining) * 100 : 100);
        }}
      >
        {error && (
          <Alert tone="negative" title={t`Couldn’t complete the request`}>
            {t(errorMessage(error))}
            <Button
              variant="secondary"
              cue="retry"
              onClick={() => {
                complete.reset();
                void lesson.refetch();
              }}
            >
              <Trans>Try again</Trans>
            </Button>
          </Alert>
        )}
        {lesson.isPending ? (
          <Skeleton lines={5} />
        ) : (
          data && (
            <>
              <LessonContent markdown={data.contentMd} />
              <MediaAttachments attachments={data.attachments ?? []} />
            </>
          )
        )}
      </ScrollArea>
      <footer {...stylex.props(styles.footer)}>
        {data && !data.completed && (
          <div {...stylex.props(styles.rewards)}>
            <span {...stylex.props(realmStyles.row)}>
              <MedalIcon
                weight="fill"
                size={iconSize.sm}
                aria-label={t`Medals`}
                {...stylex.props(styles.medal)}
              />
              <Text variant="label">+{data.rewards.medals}</Text>
            </span>
            <Text variant="label">
              +{data.rewards.experience} <Trans>XP</Trans>
            </Text>
            <span {...stylex.props(realmStyles.row)}>
              <CoinsIcon
                weight="fill"
                size={iconSize.sm}
                aria-label={t`Coins`}
                {...stylex.props(styles.coin)}
              />
              <Text variant="label">+{data.rewards.coins}</Text>
            </span>
          </div>
        )}
        <Button
          fullWidth
          cue={data?.completed ? "back" : "complete"}
          iconEnd={CaretRightIcon}
          disabled={!data}
          loading={complete.isPending}
          onClick={() => {
            if (data?.completed) back();
            else complete.mutate({ path: { courseId, itemId }, body: {} }, { onSuccess: back });
          }}
        >
          {data?.completed ? <Trans>Back to map</Trans> : <Trans>Complete</Trans>}
        </Button>
      </footer>
    </main>
  );
}
