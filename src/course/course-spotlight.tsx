import { Trans, useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import { regionSceneUrls } from "@edurune/art/assets";
import { Button } from "../ui/primitives/button.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import type { CourseCardProps } from "./course-card.tsx";
import { errorMessage } from "../api/error-messages.ts";
import { CourseMetadata } from "./course-metadata.tsx";

const styles = stylex.create({
  card: { overflow: "hidden" },
  landscape: {
    display: "block",
    inlineSize: layout.full,
    blockSize: layout.courseLandscape,
    objectFit: "cover",
    objectPosition: "center",
  },
  details: { padding: space.lg, backgroundColor: color.surfaceWarm },
  title: { overflowWrap: "anywhere" },
});

/** A visual lead-in to discovery, not a popularity or recommendation rank. */
export function CourseSpotlight({
  course,
  joining,
  joinDisabled,
  joinFailed,
  joinError,
  onJoin,
  onOpen,
  style,
}: CourseCardProps) {
  const { t } = useLingui();
  const { title } = course;
  return (
    <Surface as="article" padding="none" depth="lifted" style={[styles.card, style]}>
      <img src={regionSceneUrls["forest-clearing"]} alt="" {...stylex.props(styles.landscape)} />
      <Stack gap="sm" style={styles.details}>
        <Text as="h2" variant="subheading" style={styles.title}>
          {title}
        </Text>
        <CourseMetadata course={course} />
        <Stack direction="row" justify="end" align="center" wrap={false}>
          <Button
            cue={course.joined ? "forward" : "add-to-cart"}
            loading={joining}
            disabled={joinDisabled}
            onClick={() => (course.joined ? onOpen(course.id) : onJoin(course.id))}
            aria-label={
              joining ? t`Joining ${title}` : course.joined ? t`Open ${title}` : t`Join ${title}`
            }
          >
            {course.joined ? <Trans>Open</Trans> : <Trans>Join</Trans>}
          </Button>
        </Stack>
        {joinFailed && (
          <div role="alert">
            <Text tone="negative">{t(errorMessage(joinError))}</Text>
          </div>
        )}
      </Stack>
    </Surface>
  );
}
