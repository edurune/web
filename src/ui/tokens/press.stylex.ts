import * as stylex from "@stylexjs/stylex";
import { palette } from "./palette.stylex.ts";

// Depth of a pressable control, drawn as a thick bottom border rather than a
// shadow, so one ink contour wraps the slab and a focus outline traces a single
// clean silhouette.
//
// Pressing translates the complete face by lipTravel. Its layout box stays put;
// neither padding nor height animates, including on multiline card buttons.
export const press = stylex.defineVars({
  height: "44px",
  edgeWidth: "2px",
  lipWidth: "5px",
  lipTravel: "3px",
  edgeColor: palette.ink700,
});
