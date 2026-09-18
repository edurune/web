import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color } from "../tokens/color.stylex.ts";
import { palette } from "../tokens/palette.stylex.ts";
import { cornerStyles, radius } from "../tokens/radius.stylex.ts";
import type { RadiusToken } from "../tokens/scale.ts";

const pulse = stylex.keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0.55 },
  "100%": { opacity: 1 },
});

export interface SkeletonProps {
  width?: string;
  height?: string;
  corner?: RadiusToken;
  /** Matches one line of body text and inherits the reading rhythm. */
  lines?: number;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    backgroundColor: color.surfaceSunken,
    animationName: pulse,
    animationDuration: "1600ms",
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    "@media (prefers-reduced-motion: reduce)": { animationName: "none" },
  },
  stack: { display: "flex", flexDirection: "column", gap: "8px" },
  line: { height: "12px", borderRadius: radius.pill, backgroundColor: palette.paper300 },
  lastLine: { width: "60%" },
  size: (width: string, height: string) => ({ width, height }),
});

export function Skeleton({
  width = "100%",
  height = "16px",
  corner = "md",
  lines,
  style,
}: SkeletonProps) {
  if (lines != null) {
    return (
      <div aria-hidden="true" {...stylex.props(styles.stack, style)}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            {...stylex.props(
              styles.root,
              styles.line,
              index === lines - 1 && lines > 1 && styles.lastLine,
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      {...stylex.props(styles.root, cornerStyles[corner], styles.size(width, height), style)}
    />
  );
}
