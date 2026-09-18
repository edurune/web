import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useLingui } from "@lingui/react/macro";
import {
  ListBulletsIcon,
  PathIcon,
  CaretDownIcon,
  BookOpenIcon,
  CheckIcon,
  LockSimpleIcon,
} from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import { useNavigate } from "@tanstack/react-router";
import { useCourseNavigationQuery, useUnitsQuery } from "../api/course/use-navigation-queries.ts";
import { errorMessage } from "../api/error-messages.ts";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { CardButton } from "../ui/primitives/card-button.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Dialog } from "../ui/primitives/dialog.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { EmptyState } from "../ui/primitives/empty-state.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { LoadMoreButton } from "../ui/primitives/load-more-button.tsx";
import { Spinner } from "../ui/primitives/spinner.tsx";
import { useSoundLoop } from "../ui/sound/use-sound-loop.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { realmStyles } from "./realm-layout.ts";
import { type MapNode } from "./course-path.tsx";
import { UnitMapSection } from "./unit-map-section.tsx";
import { PracticeSheet } from "./practice-sheet.tsx";

const styles = stylex.create({
  select: { minInlineSize: space.none, flex: 1 },
  listItem: { textAlign: "start" },
  feedback: { padding: space.lg },
  loading: { display: "flex", justifyContent: "center", padding: space.xl },
});
export function CourseMapScreen({
  courseId,
  unitId,
  view = "path",
}: {
  courseId: string;
  unitId?: string;
  view?: "path" | "list";
}) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const navigation = useCourseNavigationQuery(courseId);
  const units = useUnitsQuery(courseId);
  const { hasNextPage, isFetching, isError, fetchNextPage } = units;
  const summaries = useMemo(
    () => units.data?.pages.flatMap((page) => page.items) ?? [],
    [units.data],
  );
  const [viewport, setViewport] = useState<HTMLDivElement | null>(null);
  const sections = useRef(new Map<string, HTMLDivElement>());
  const [unitsOpen, setUnitsOpen] = useState(false);
  const [selected, setSelected] = useState<Extract<MapNode, { kind: "practice" }> | null>(null);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [visibleUnit, setVisibleUnit] = useState<string | null>(null);
  const target = unitId ?? navigation.data?.currentUnitId;
  const jumped = useRef<string | null>(null);
  useSoundLoop("loading", units.isPending);
  const active =
    summaries.find((unit) => unit.id === visibleUnit) ??
    summaries.find((unit) => unit.id === target) ??
    summaries[0];
  useEffect(() => {
    if (!target || !viewport || jumped.current === target + view) return;
    const section = summaries.some((unit) => unit.id === target)
      ? sections.current.get(target)
      : undefined;
    if (section) {
      viewport.scrollTo({
        top:
          viewport.scrollTop +
          section.getBoundingClientRect().top -
          viewport.getBoundingClientRect().top,
      });
      jumped.current = target + view;
    } else if (hasNextPage && !isFetching && !isError) {
      void fetchNextPage({ cancelRefetch: false });
    }
  }, [target, view, viewport, summaries, hasNextPage, isFetching, isError, fetchNextPage]);
  const selectNode = (node: MapNode) => {
    if (node.kind === "lesson") {
      void navigate({
        to: "/courses/$courseId/lessons/$itemId",
        params: { courseId, itemId: node.id },
      });
    } else {
      setSelected(node);
      setPracticeOpen(true);
    }
  };
  return (
    <main {...stylex.props(realmStyles.page)}>
      <div {...stylex.props(realmStyles.toolbar)}>
        <Button
          variant="secondary"
          cue={null}
          iconEnd={CaretDownIcon}
          style={styles.select}
          onClick={() => setUnitsOpen(true)}
        >
          <Text variant="bodyStrong" lines={1}>
            {active?.title ?? <Trans>Units</Trans>}
          </Text>
          {active && (
            <Text variant="label">
              {active.completedItems}/{active.totalItems}
            </Text>
          )}
        </Button>
        <IconButton
          icon={view === "path" ? ListBulletsIcon : PathIcon}
          label={view === "path" ? t`Show level list` : t`Show path`}
          variant="secondary"
          cue="select"
          onClick={() => {
            void navigate({
              to: "/courses/$courseId",
              params: { courseId },
              search: { unit: active?.id, view: view === "path" ? "list" : "path" },
              replace: true,
              resetScroll: false,
            });
          }}
        />
      </div>
      <ScrollArea
        viewportRef={setViewport}
        label={t`Course map`}
        indicator="none"
        style={realmStyles.scroll}
        onScroll={() => {
          if (!viewport) return;
          const boundary = viewport.getBoundingClientRect().top + viewport.clientHeight / 3;
          let id = summaries[0]?.id;
          for (const unit of summaries) {
            const section = sections.current.get(unit.id);
            if (section && section.getBoundingClientRect().top <= boundary) id = unit.id;
            else break;
          }
          if (id) setVisibleUnit(id);
        }}
      >
        {units.isError && (
          <Alert tone="negative" title={t`Couldn’t load the course`} style={styles.feedback}>
            {t(errorMessage(units.error))}
            <Button
              cue="retry"
              onClick={() => {
                void units.refetch();
              }}
            >
              <Trans>Try again</Trans>
            </Button>
          </Alert>
        )}
        {units.isPending && (
          <div {...stylex.props(styles.loading)}>
            <Spinner label={t`Loading map`} />
          </div>
        )}
        {summaries.map((unit) => (
          <div
            key={unit.id}
            ref={(element) => {
              if (element) sections.current.set(unit.id, element);
              else sections.current.delete(unit.id);
            }}
          >
            <UnitMapSection
              courseId={courseId}
              unit={unit}
              view={view}
              viewport={viewport}
              onSelect={selectNode}
            />
          </div>
        ))}
        {units.data && !summaries.length && (
          <EmptyState icon={BookOpenIcon} title={t`No levels yet`} />
        )}
        {units.hasNextPage && (
          <LoadMoreButton
            autoLoad={!units.isError}
            disabled={units.isFetching}
            loading={units.isFetchingNextPage}
            onLoadMore={() => {
              if (!units.isFetching) void units.fetchNextPage({ cancelRefetch: false });
            }}
          >
            <Trans>Load more</Trans>
          </LoadMoreButton>
        )}
      </ScrollArea>
      {unitsOpen && (
        <UnitPicker
          courseId={courseId}
          onClose={() => setUnitsOpen(false)}
          onSelect={(id) => {
            setUnitsOpen(false);
            jumped.current = null;
            void navigate({
              to: "/courses/$courseId",
              params: { courseId },
              search: { unit: id, view },
              replace: true,
              resetScroll: false,
            });
            const section = sections.current.get(id);
            if (viewport && section) {
              viewport.scrollTo({
                top:
                  viewport.scrollTop +
                  section.getBoundingClientRect().top -
                  viewport.getBoundingClientRect().top,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                  ? "instant"
                  : "smooth",
              });
              jumped.current = id + view;
            }
          }}
        />
      )}
      <PracticeSheet
        courseId={courseId}
        node={selected}
        open={practiceOpen}
        onOpenChange={setPracticeOpen}
        onClose={() => {
          setPracticeOpen(false);
          setSelected(null);
        }}
      />
    </main>
  );
}

function UnitPicker({
  courseId,
  onClose,
  onSelect,
}: {
  courseId: string;
  onClose: () => void;
  onSelect: (id: string) => void;
}) {
  const { t } = useLingui();
  const units = useUnitsQuery(courseId);
  return (
    <Dialog
      open
      title={t`Units`}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Stack gap="md">
        {units.isError && (
          <Alert tone="negative" title={t`Couldn’t load the course`}>
            {t(errorMessage(units.error))}
            <Button
              cue="retry"
              onClick={() => {
                void units.refetch();
              }}
            >
              <Trans>Try again</Trans>
            </Button>
          </Alert>
        )}
        {units.isPending && <Spinner label={t`Loading map`} />}
        {units.data?.pages
          .flatMap((page) => page.items)
          .map((unit) => (
            <CardButton
              key={unit.id}
              cue="forward"
              style={styles.listItem}
              onClick={() => onSelect(unit.id)}
            >
              {unit.status === "completed" ? (
                <CheckIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
              ) : !unit.available ? (
                <LockSimpleIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
              ) : (
                <BookOpenIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
              )}
              <Text variant="bodyStrong" style={realmStyles.grow}>
                {unit.title}
              </Text>
              <Text variant="label">
                {unit.completedItems}/{unit.totalItems}
              </Text>
            </CardButton>
          ))}
        {units.hasNextPage && (
          <LoadMoreButton
            autoLoad={!units.isError}
            disabled={units.isFetching}
            loading={units.isFetchingNextPage}
            onLoadMore={() => {
              if (!units.isFetching) void units.fetchNextPage({ cancelRefetch: false });
            }}
          >
            <Trans>Load more</Trans>
          </LoadMoreButton>
        )}
      </Stack>
    </Dialog>
  );
}
