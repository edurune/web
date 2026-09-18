import { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useLingui } from "@lingui/react/macro";
import { BookOpenIcon, CheckIcon, LockSimpleIcon, PlayIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { GetApiCoursesByCourseIdUnitsResponse } from "../api/generated/types.gen.ts";
import { useUnitMapQuery } from "../api/course/use-navigation-queries.ts";
import { errorMessage } from "../api/error-messages.ts";
import { MapTerrain } from "../game/art/map-terrain.tsx";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { CardButton } from "../ui/primitives/card-button.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { Spinner } from "../ui/primitives/spinner.tsx";
import { LoadMoreButton } from "../ui/primitives/load-more-button.tsx";
import { DifficultyBadge } from "../ui/primitives/badge.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { realmStyles } from "./realm-layout.ts";
import { CoursePath, type MapNode } from "./course-path.tsx";

type Unit = GetApiCoursesByCourseIdUnitsResponse["items"][number];
const styles = stylex.create({
  section: { position: "relative", overflow: "hidden" },
  extent: (width: number, height: number) => ({ aspectRatio: `${width} / ${Math.max(height, 1)}` }),
  path: { position: "absolute", inset: space.none },
  remaining: (start: number) => ({
    position: "absolute",
    insetBlockStart: `calc(${start}% + ${realmLayout.node})`,
    insetBlockEnd: space.none,
    insetInline: space.none,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  }),
  active: { backgroundColor: color.cautionFill },
  list: { display: "flex", flexDirection: "column", gap: space.md, padding: space.lg },
  placeholder: { padding: space.lg, inlineSize: layout.full },
  loading: { display: "flex", justifyContent: "center", padding: space.xl },
});
export function UnitMapSection({
  courseId,
  unit,
  view,
  viewport,
  onSelect,
}: {
  courseId: string;
  unit: Unit;
  view: "path" | "list";
  viewport: HTMLDivElement | null;
  onSelect: (node: MapNode) => void;
}) {
  const { t } = useLingui();
  const element = useRef<HTMLDivElement>(null);
  const remaining = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const map = useUnitMapQuery(courseId, unit.id, visible);
  const { hasNextPage, isFetching, isError, fetchNextPage } = map;
  useEffect(() => {
    const target = element.current;
    if (!target || !viewport) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { root: viewport, rootMargin: `${viewport.clientHeight}px 0px` },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [viewport]);
  const page = useMemo(() => {
    const first = map.data?.pages[0];
    if (!first) return null;
    return {
      ...first,
      nodes: map.data!.pages.flatMap((part) => part.nodes),
      segments: [
        ...new Map(
          map
            .data!.pages.flatMap((part) => part.segments)
            .map((segment) => [segment.toItemId, segment]),
        ).values(),
      ],
    };
  }, [map.data]);
  useEffect(() => {
    const target = remaining.current;
    if (!target || !viewport || !hasNextPage || isFetching || isError) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer.disconnect();
          void fetchNextPage({ cancelRefetch: false });
        }
      },
      { root: viewport, rootMargin: `${viewport.clientHeight}px 0px` },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [viewport, hasNextPage, isFetching, isError, fetchNextPage]);
  return (
    <div ref={element} aria-busy={map.isFetching || undefined}>
      <MapTerrain
        sceneId={view === "path" ? unit.sceneId : null}
        style={[
          styles.section,
          view === "path" ? styles.extent(unit.map.width, unit.map.height) : styles.list,
        ]}
      >
        {view === "list" && (
          <Text as="h2" variant="subheading">
            {unit.title}
          </Text>
        )}
        {page &&
          (view === "path" ? (
            <CoursePath page={page} onSelect={onSelect} style={styles.path} />
          ) : (
            page.nodes.map((node) => {
              const title = node.title;
              const hasActiveSession = node.kind === "practice" && Boolean(node.activeSessionId);
              return (
                <CardButton
                  key={node.id}
                  aria-label={hasActiveSession ? t`${title}, battle in progress` : undefined}
                  cue="forward"
                  hover="hover"
                  blocked={!node.available}
                  onClick={() => onSelect(node)}
                  style={node.available && !node.completed && styles.active}
                >
                  {!node.available ? (
                    <LockSimpleIcon weight="bold" size={iconSize.lg} aria-hidden="true" />
                  ) : hasActiveSession ? (
                    <PlayIcon weight="bold" size={iconSize.lg} aria-hidden="true" />
                  ) : node.completed ? (
                    <CheckIcon weight="bold" size={iconSize.lg} aria-hidden="true" />
                  ) : node.kind === "lesson" ? (
                    <BookOpenIcon weight="bold" size={iconSize.lg} aria-hidden="true" />
                  ) : (
                    <CombatIcon iconId="icon-action-attack" style={realmStyles.icon} />
                  )}
                  <Text variant="bodyStrong" style={realmStyles.grow}>
                    {title}
                  </Text>
                  {node.kind === "practice" && (
                    <DifficultyBadge difficulty={node.encounter.difficulty} />
                  )}
                </CardButton>
              );
            })
          ))}
        {!page && map.isFetching && (
          <div {...stylex.props(styles.loading)}>
            <Spinner label={t`Loading map`} />
          </div>
        )}
        {map.isError && (
          <Alert tone="negative" title={t`Couldn’t load the map`} style={styles.placeholder}>
            {t(errorMessage(map.error))}
            <Button
              cue="retry"
              onClick={() => {
                void map.refetch();
              }}
            >
              <Trans>Try again</Trans>
            </Button>
          </Alert>
        )}
        {map.hasNextPage && (
          <div
            ref={remaining}
            {...stylex.props(
              view === "path" &&
                styles.remaining(((page?.nodes.at(-1)?.position.y ?? 0) / unit.map.height) * 100),
            )}
          >
            <LoadMoreButton
              autoLoad={false}
              disabled={map.isFetching}
              loading={map.isFetchingNextPage}
              onLoadMore={() => {
                if (!map.isFetching) void map.fetchNextPage({ cancelRefetch: false });
              }}
            >
              <Trans>Load more</Trans>
            </LoadMoreButton>
          </div>
        )}
      </MapTerrain>
    </div>
  );
}
