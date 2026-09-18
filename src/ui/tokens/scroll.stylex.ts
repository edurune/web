import * as stylex from "@stylexjs/stylex";

// Alpha masks indicate overflow; surfaces still use flat fills.
export const scroll = stylex.defineVars({
  thickness: "8px",
  thumbMinimum: "24px",
  demoHeight: "240px",
  fadeStartX: "linear-gradient(to right, transparent, black 24px)",
  fadeEndX: "linear-gradient(to left, transparent, black 24px)",
  fadeBothX:
    "linear-gradient(to right, transparent, black 24px, black calc(100% - 24px), transparent)",
  fadeStartY: "linear-gradient(to bottom, transparent, black 24px)",
  fadeEndY: "linear-gradient(to top, transparent, black 24px)",
  fadeBothY:
    "linear-gradient(to bottom, transparent, black 24px, black calc(100% - 24px), transparent)",
});
