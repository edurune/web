import * as stylex from "@stylexjs/stylex";
import { rarity as rarityVars } from "../tokens/color.stylex.ts";

// Shared so badges, portraits and item tiles tint identically.
export const raritySurface = stylex.create({
  common: { backgroundColor: rarityVars.commonSurface, color: rarityVars.commonText },
  uncommon: { backgroundColor: rarityVars.uncommonSurface, color: rarityVars.uncommonText },
  rare: { backgroundColor: rarityVars.rareSurface, color: rarityVars.rareText },
  epic: { backgroundColor: rarityVars.epicSurface, color: rarityVars.epicText },
  legendary: { backgroundColor: rarityVars.legendarySurface, color: rarityVars.legendaryText },
});

export const rarityBorder = stylex.create({
  common: { borderColor: rarityVars.commonBorder },
  uncommon: { borderColor: rarityVars.uncommonBorder },
  rare: { borderColor: rarityVars.rareBorder },
  epic: { borderColor: rarityVars.epicBorder },
  legendary: { borderColor: rarityVars.legendaryBorder },
});
