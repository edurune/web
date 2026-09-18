// Prop-facing names for the token scales. Kept separate because a StyleX var
// group's keys also include its internal members, so `keyof typeof space` leaks.
export type SpaceToken =
  | "none"
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl"
  | "huge";

export type RadiusToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "pill" | "circle";

export type IconToken = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

// Icons size themselves through width/height attributes, so these stay numbers.
export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const satisfies Record<IconToken, number>;

// Popup positioning takes a pixel number rather than a CSS length.
export const popupOffset = 8;
