import * as stylex from "@stylexjs/stylex";

// md and above meet the 44px touch target. sm needs surrounding padding.
export const control = stylex.defineVars({
  sm: "32px",
  md: "44px",
  lg: "56px",
});

export const measure = stylex.defineVars({
  narrow: "32ch",
  prose: "64ch",
  wide: "80ch",
});
