import * as stylex from "@stylexjs/stylex";

export const font = stylex.defineVars({
  display: '"Nunito Variable", system-ui, sans-serif',
  body: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
});

export const fontSize = stylex.defineVars({
  xs: "11px",
  sm: "12px",
  md: "14px",
  lg: "16px",
  xl: "20px",
  xxl: "26px",
  xxxl: "34px",
  display: "44px",
});

export const fontWeight = stylex.defineVars({
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  heavy: "800",
});

export const lineHeight = stylex.defineVars({
  tight: "1.15",
  snug: "1.3",
  normal: "1.5",
  relaxed: "1.7",
});

export const letterSpacing = stylex.defineVars({
  tight: "-0.01em",
  normal: "0",
  wide: "0.02em",
  caps: "0.06em",
});
