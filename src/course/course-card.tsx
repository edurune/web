import { Trans, useLingui } from "@lingui/react/macro";
import { BookOpenIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { Button } from "../ui/primitives/button.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Surface } from "../ui/primitives/surface.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import type { CourseSummary } from "./course-search.ts";
import { errorMessage } from "../api/error-messages.ts";
import { CourseMetadata } from "./course-metadata.tsx";
import { CourseCreator } from "./course-creator.tsx";

export interface CourseCardProps {
  /** Membership and completion are returned by the server. */
  course: CourseSummary;
  joining?: boolean;
  joinDisabled?: boolean;
  joinFailed?: boolean;
  joinError?: unknown;
  onJoin: (courseId: string) => void;
  onOpen: (courseId: string) => void;
  style?: StyleXStyles;
}

const styles = stylex.create({
  card: { display: "flex", flexDirection: "column", gap: space.sm },
  badge: {
    display: "grid",
    placeItems: "center",
    flexShrink: 0,
    inlineSize: layout.badge,
    blockSize: layout.badge,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: borderWidth.thick,
    borderColor: color.borderStrong,
    backgroundColor: {
      default: color.surfaceSunken,
      ':is([data-subject="languages"])': color.accentSoft,
      ':is([data-subject="computer_science"])': color.infoSoft,
      ':is([data-subject="math"])': color.cautionSoft,
      ':is([data-subject="science"])': color.positiveSoft,
    },
  },
  details: { flex: 1, minInlineSize: space.none, overflowWrap: "anywhere" },
  join: { marginInlineStart: "auto", flexShrink: 0 },
});

export function CourseCard({
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
    <Surface as="article" depth="lifted" padding="md" corner="lg" style={[styles.card, style]}>
      <Stack direction="row" gap="sm" align="center" wrap={false}>
        <div aria-hidden="true" data-subject={course.subject} {...stylex.props(styles.badge)}>
          <BookOpenIcon size={iconSize.lg} weight="bold" />
        </div>
        <Stack gap="xs" style={styles.details}>
          <Text as="h2" variant="bodyStrong">
            {title}
          </Text>
          <CourseCreator creator={course.creator} />
          <CourseMetadata course={course} />
        </Stack>
        <Button
          variant="secondary"
          cue={course.joined ? "forward" : "add-to-cart"}
          onClick={() => (course.joined ? onOpen(course.id) : onJoin(course.id))}
          loading={joining}
          disabled={joinDisabled}
          aria-label={
            joining ? t`Joining ${title}` : course.joined ? t`Open ${title}` : t`Join ${title}`
          }
          style={styles.join}
        >
          {course.joined ? <Trans>Open</Trans> : <Trans>Join</Trans>}
        </Button>
      </Stack>
      {joinFailed && (
        <div role="alert">
          <Text tone="negative">{t(errorMessage(joinError))}</Text>
        </div>
      )}
    </Surface>
  );
}
