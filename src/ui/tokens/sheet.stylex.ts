import * as stylex from "@stylexjs/stylex";

export const sheet = stylex.defineVars({
  maxHeight: "85dvh",
});

// Gesture values must resolve on the drawer, not on the document's token scope.
export const sheetGesture = stylex.defineConsts({
  movement: "var(--drawer-swipe-movement-y, 0px)",
  progress: "var(--drawer-swipe-progress, 0)",
  strength: "var(--drawer-swipe-strength, 1)",
});
