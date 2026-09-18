import * as stylex from "@stylexjs/stylex";

export const duration = stylex.defineVars({
  none: "0ms",
  orbit: "18s",
  instant: "80ms",
  fast: "140ms",
  normal: "220ms",
  slow: "360ms",
  deliberate: "600ms",
  reward: "1400ms",
});

// bounce overshoots: use for rewards and entrances, not routine state changes.
export const easing = stylex.defineVars({
  standard: "cubic-bezier(0.2, 0, 0, 1)",
  entrance: "cubic-bezier(0, 0, 0, 1)",
  exit: "cubic-bezier(0.3, 0, 1, 1)",
  bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
});
