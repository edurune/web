import { useLingui } from "@lingui/react/macro";
import { BookOpenIcon, CheckIcon, LockSimpleIcon, PlayIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { GetApiCoursesByCourseIdUnitsByUnitIdMapResponse } from "../api/generated/types.gen.ts";
import { CombatIcon } from "../game/art/combat-icon.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { realmLayout } from "../ui/tokens/realm.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { duration } from "../ui/tokens/motion.stylex.ts";

export type MapPage = GetApiCoursesByCourseIdUnitsByUnitIdMapResponse;
export type MapNode = MapPage["nodes"][number];
const orbit = stylex.keyframes({ from: { rotate: "0deg" }, to: { rotate: "360deg" } });
const styles = stylex.create({
  path: (width: number, height: number) => ({
    position: "relative",
    inlineSize: layout.full,
    aspectRatio: `${width} / ${height}`,
  }),
  drawing: {
    position: "absolute",
    inset: space.none,
    inlineSize: layout.full,
    blockSize: layout.full,
    overflow: "hidden",
    pointerEvents: "none",
  },
  line: {
    fill: "none",
    stroke: color.neutralFill,
    strokeWidth: realmLayout.pathWidth,
    strokeLinecap: "round",
  },
  complete: { stroke: color.accentFill },
  node: (y: number) => ({
    position: "absolute",
    insetInline: space.none,
    insetBlockStart: `${y}%`,
  }),
  buttonPosition: (x: number) => ({
    position: "absolute",
    insetInlineStart: `${x}%`,
    transform: "translate(-50%, -50%)",
  }),
  button: {
    inlineSize: realmLayout.node,
    blockSize: realmLayout.node,
    borderRadius: radius.circle,
    paddingInline: space.none,
  },
  current: {
    backgroundColor: { default: color.cautionFill, ":hover:not(:disabled)": color.cautionSoft },
  },
  ringAnchor: {
    inlineSize: `calc(${realmLayout.node} + ${space.lg})`,
    blockSize: `calc(${realmLayout.node} + ${space.lg})`,
    pointerEvents: "none",
  },
  ring: {
    display: "block",
    inlineSize: layout.full,
    blockSize: layout.full,
    borderStyle: "dashed",
    borderWidth: realmLayout.nodeRing,
    borderColor: color.cautionStrong,
    borderRadius: radius.circle,
    pointerEvents: "none",
    animationName: orbit,
    animationDuration: duration.orbit,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    "@media (prefers-reduced-motion: reduce)": { animationName: "none" },
  },
  label: {
    position: "absolute",
    insetBlockStart: `calc(${realmLayout.node} / 2)`,
    transform: "translateX(-50%)",
    inlineSize: realmLayout.nodeLabel,
    paddingBlockStart: space.sm,
    pointerEvents: "none",
  },
  labelPosition: (x: number) => ({
    insetInlineStart: `clamp(calc(${realmLayout.nodeLabel} / 2), ${x}%, calc(${layout.full} - ${realmLayout.nodeLabel} / 2))`,
  }),
  icon: { inlineSize: realmLayout.statIcon },
});
export interface CoursePathProps {
  page: MapPage;
  onSelect: (node: MapNode) => void;
  style?: StyleXStyles;
}
export function CoursePath({ page, onSelect, style }: CoursePathProps) {
  const { t } = useLingui();
  const nodes = new Map(page.nodes.map((node) => [node.id, node]));
  const segmentCompleted = (fromItemId: string, toItemId: string) =>
    nodes.get(fromItemId)?.completed ?? nodes.get(toItemId)?.available ?? false;
  return (
    <div {...stylex.props(styles.path(page.width, page.height), style)}>
      <svg
        viewBox={`0 0 ${page.width} ${page.height}`}
        aria-hidden="true"
        {...stylex.props(styles.drawing)}
      >
        {page.segments.map((segment) => (
          <path
            key={segment.toItemId}
            d={`M${segment.start.x},${segment.start.y} C${segment.control1.x},${segment.control1.y} ${segment.control2.x},${segment.control2.y} ${segment.end.x},${segment.end.y}`}
            {...stylex.props(
              styles.line,
              segmentCompleted(segment.fromItemId, segment.toItemId) && styles.complete,
            )}
          />
        ))}
      </svg>
      {page.nodes.map((node) => {
        const title = node.title;
        const hasActiveSession = node.kind === "practice" && Boolean(node.activeSessionId);
        return (
          <div key={node.id} {...stylex.props(styles.node((node.position.y / page.height) * 100))}>
            {node.available && !node.completed && (
              <span
                aria-hidden="true"
                {...stylex.props(
                  styles.ringAnchor,
                  styles.buttonPosition((node.position.x / page.width) * 100),
                )}
              >
                <span {...stylex.props(styles.ring)} />
              </span>
            )}
            <Button
              variant={node.completed ? "primary" : "secondary"}
              aria-label={
                !node.available
                  ? t`${title}, locked`
                  : hasActiveSession
                    ? t`${title}, battle in progress`
                    : node.completed
                      ? t`${title}, completed`
                      : title
              }
              cue="forward"
              hover="hover"
              blocked={!node.available}
              onClick={() => onSelect(node)}
              style={[
                styles.button,
                styles.buttonPosition((node.position.x / page.width) * 100),
                node.available && !node.completed && styles.current,
              ]}
            >
              {!node.available ? (
                <LockSimpleIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
              ) : hasActiveSession ? (
                <PlayIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
              ) : node.completed ? (
                <CheckIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
              ) : node.kind === "lesson" ? (
                <BookOpenIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
              ) : (
                <CombatIcon
                  iconId={node.role === "unit_review" ? "icon-action-skill" : "icon-action-attack"}
                  style={styles.icon}
                />
              )}
            </Button>
            <Text
              variant="label"
              tone={!node.available ? "secondary" : "primary"}
              align="center"
              lines={2}
              style={[styles.label, styles.labelPosition((node.position.x / page.width) * 100)]}
            >
              {title}
            </Text>
          </div>
        );
      })}
    </div>
  );
}
