import { Trans, useLingui } from "@lingui/react/macro";
import { CaretLeftIcon, ArrowClockwiseIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { Outlet, useLocation, useNavigate, useRouterState } from "@tanstack/react-router";
import { useCourseNavigationQuery } from "../api/course/use-navigation-queries.ts";
import { useLoadoutQuery } from "../api/realm/use-realm-queries.ts";
import { CurrencyChip } from "../ui/primitives/currency-chip.tsx";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { CourseCreator } from "../course/course-creator.tsx";
import { Skeleton } from "../ui/primitives/skeleton.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { fontSize } from "../ui/tokens/text.stylex.ts";
import { realmStyles } from "./realm-layout.ts";
import { RealmNavigation } from "./realm-navigation.tsx";
import { SettingsMenu } from "../user/settings-menu.tsx";

const styles = stylex.create({
  header: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    padding: space.md,
    backgroundColor: color.surfaceInverse,
    flexShrink: 0,
  },
  back: { color: { default: color.textInverse, ":hover:not(:disabled)": color.textPrimary } },
  level: {
    flexShrink: 0,
    borderRadius: radius.pill,
    paddingInline: space.sm,
    fontSize: fontSize.lg,
    backgroundColor: { default: color.cautionFill, ":hover:not(:disabled)": color.cautionSoft },
  },
});
export function RealmShell({ courseId }: { courseId: string }) {
  const { t } = useLingui();
  const course = useCourseNavigationQuery(courseId);
  const loadout = useLoadoutQuery(courseId);
  const path = useLocation({ select: (location) => location.pathname });
  const navigate = useNavigate();
  const level = loadout.data?.progression.level;
  // Lessons and practice own the whole page, so the shell drops its chrome for them. Read that
  // from the rendered matches, not from the location: the location flips to the destination the
  // moment a navigation starts, while the screen leaving is still on screen.
  const immersive = useRouterState({
    select: (state) =>
      state.matches.some(
        (match) => match.routeId.includes("/lessons/") || match.routeId.includes("/practices/"),
      ),
  });
  // Header and navigation mount and unmount around a fixed `Outlet` slot. Returning a different
  // tree shape instead would remount the whole screen whenever the chrome came or went, replaying
  // its mount effects: that is how pressing Continue used to sound the victory fanfare twice.
  return (
    <div {...stylex.props(realmStyles.page)}>
      {!immersive && (
        <header {...stylex.props(styles.header)}>
          <IconButton
            icon={CaretLeftIcon}
            label={t`Back to courses`}
            variant="ghost"
            cue="back"
            style={styles.back}
            onClick={() => {
              void navigate({ to: "/" });
            }}
          />
          <Stack gap="xs" style={realmStyles.grow}>
            <Text as="h1" variant="bodyStrong" tone="inverse" lines={2}>
              {course.data?.title ?? <Trans>Course</Trans>}
            </Text>
            {course.data && <CourseCreator creator={course.data.creator} tone="inverse" />}
          </Stack>
          {loadout.data ? (
            <>
              <Button
                variant="secondary"
                size="sm"
                cue="forward"
                style={styles.level}
                aria-label={t`Level ${level}. Open loadout`}
                onClick={() => {
                  void navigate({ to: "/courses/$courseId/loadout", params: { courseId } });
                }}
              >
                <Trans>Lv {level}</Trans>
              </Button>
              <CurrencyChip key={courseId} kind="medal" amount={loadout.data.medals} />
            </>
          ) : loadout.isError ? (
            <IconButton
              icon={ArrowClockwiseIcon}
              label={t`Retry balance`}
              variant="ghost"
              cue="retry"
              style={styles.back}
              onClick={() => {
                void loadout.refetch();
              }}
            />
          ) : (
            <Skeleton />
          )}
          <SettingsMenu style={styles.back} />
        </header>
      )}
      <Outlet />
      {!immersive && (
        <RealmNavigation
          active={path.endsWith("/loadout") ? "loadout" : path.endsWith("/shop") ? "shop" : "map"}
          onNavigate={(destination) => {
            void navigate({
              to:
                destination === "map"
                  ? "/courses/$courseId"
                  : destination === "loadout"
                    ? "/courses/$courseId/loadout"
                    : "/courses/$courseId/shop",
              params: { courseId },
              search: {},
            });
          }}
        />
      )}
    </div>
  );
}
