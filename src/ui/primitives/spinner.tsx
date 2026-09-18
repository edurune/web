import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { iconSize } from "../tokens/scale.ts";
import type { IconToken } from "../tokens/scale.ts";

const spin = stylex.keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});

export interface SpinnerProps {
  size?: IconToken;
  label?: string;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: {
    flexShrink: 0,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 3,
    strokeLinecap: "round",
    animationName: spin,
    animationDuration: "800ms",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    "@media (prefers-reduced-motion: reduce)": {
      animationDuration: "2400ms",
    },
  },
});

export function Spinner({ size = "md", label, style }: SpinnerProps) {
  const px = iconSize[size];
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      role={label ? "status" : "presentation"}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      {...stylex.props(styles.root, style)}
    >
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" />
    </svg>
  );
}
