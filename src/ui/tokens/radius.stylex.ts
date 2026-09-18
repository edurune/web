import * as stylex from "@stylexjs/stylex";

export const radius = stylex.defineVars({
  none: "0",
  xs: "4px",
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  xxl: "28px",
  pill: "999px",
  circle: "50%",
});

export const cornerStyles = stylex.create({
  none: { borderRadius: radius.none },
  xs: { borderRadius: radius.xs },
  sm: { borderRadius: radius.sm },
  md: { borderRadius: radius.md },
  lg: { borderRadius: radius.lg },
  xl: { borderRadius: radius.xl },
  xxl: { borderRadius: radius.xxl },
  pill: { borderRadius: radius.pill },
  circle: { borderRadius: radius.circle },
});
