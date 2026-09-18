import * as stylex from "@stylexjs/stylex";
import { palette } from "./palette.stylex.ts";

// Filled controls put ink text on a mid-tone fill, matching the outlined artwork.
// White on these fills would drop below 4.5:1.
export const color = stylex.defineVars({
  surfacePage: palette.paper100,
  surfaceRaised: palette.paper0,
  surfaceTransparent: "transparent",
  surfaceSunken: palette.paper200,
  surfaceWarm: palette.cream,
  surfaceInverse: palette.ink700,
  surfaceScrim: "color-mix(in srgb, #22223a 55%, transparent)",
  surfaceAudioScrim: "color-mix(in srgb, #22223a 35%, transparent)",

  borderSubtle: palette.paper300,
  borderDefault: palette.paper400,
  borderStrong: palette.ink700, // interactive outlines
  borderDisabled: palette.ink200,
  borderFocus: palette.indigo700,

  textPrimary: palette.ink700,
  textSecondary: palette.ink500,
  textMuted: palette.ink400,
  textDisabled: palette.ink300,
  textInverse: palette.paper0,
  textOnFill: palette.ink700,
  textLink: palette.indigo700,

  accentSoft: palette.sage100,
  accentFill: palette.sage300,
  accentFillHover: palette.sage200,
  accentFillActive: palette.sage500,
  accentStrong: palette.sage700,

  positiveSoft: palette.sage100,
  positiveFill: palette.sage300,
  positiveStrong: palette.sage700,
  negativeSoft: palette.berry100,
  negativeFill: palette.berry300,
  negativeFillHover: palette.berry200,
  negativeFillActive: palette.berry500,
  negativeStrong: palette.berry700,
  cautionSoft: palette.ochre100,
  cautionFill: palette.ochre200,
  cautionStrong: palette.ochre700,
  infoSoft: palette.indigo100,
  infoFill: palette.indigo300,
  infoStrong: palette.indigo700,

  neutralSoft: palette.paper200,
  neutralFill: palette.paper300,
  neutralFillHover: palette.paper200,
  neutralFillActive: palette.paper400,
  disabledSurface: palette.paper200,
  notificationFill: palette.berry500,
});

// Battle and progression bars. Track is the empty part.
export const resource = stylex.defineVars({
  healthTrack: palette.sage100,
  healthFill: palette.sage500,
  healthWarningFill: palette.ochre500,
  healthLowFill: palette.berry500,
  manaTrack: palette.indigo100,
  manaFill: palette.indigo500,
  shieldTrack: palette.ochre100,
  shieldFill: palette.ochre300,
  guardFill: palette.clay300,
  progressTrack: palette.paper300,
  progressFill: palette.sage500,
});

// coin and gem are global; medal is per course realm.
export const currency = stylex.defineVars({
  coinSurface: palette.ochre100,
  coinFill: palette.ochre200,
  coinStroke: palette.ochre700,
  gemSurface: palette.plum100,
  gemFill: palette.plum300,
  gemStroke: palette.plum700,
  medalSurface: palette.clay100,
  medalFill: palette.clay300,
  medalStroke: palette.clay700,
});

// Shared by cosmetics and equipment. Pairs match the art room chips.
export const rarity = stylex.defineVars({
  commonSurface: "#e9ece3",
  commonText: "#515b4f",
  commonBorder: "#c6ccc0",
  uncommonSurface: palette.sage100,
  uncommonText: palette.sage700,
  uncommonBorder: palette.sage300,
  rareSurface: palette.indigo100,
  rareText: palette.indigo700,
  rareBorder: palette.indigo300,
  epicSurface: palette.plum100,
  epicText: palette.plum700,
  epicBorder: palette.plum300,
  legendarySurface: palette.ochre100,
  legendaryText: palette.ochre700,
  legendaryBorder: palette.ochre300,
});

export const difficulty = stylex.defineVars({
  easySurface: palette.sage100,
  easyText: palette.sage700,
  mediumSurface: palette.ochre100,
  mediumText: palette.ochre700,
  hardSurface: palette.berry100,
  hardText: palette.berry700,
});
