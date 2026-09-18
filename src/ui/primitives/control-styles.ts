import * as stylex from "@stylexjs/stylex";
import { color } from "../tokens/color.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { control } from "../tokens/size.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize } from "../tokens/text.stylex.ts";

// Shared by every typed or selected control so their boxes line up.
export const controlStyles = stylex.create({
  box: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    width: "100%",
    minHeight: control.md,
    paddingBlock: space.sm,
    paddingInline: space.md,
    backgroundColor: color.surfaceRaised,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: color.borderStrong,
    color: color.textPrimary,
    fontFamily: font.body,
    fontSize: fontSize.md,
    outline: "none",
    transitionProperty: "border-color, background-color",
    transitionDuration: duration.fast,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0ms" },
  },
  focusRing: {
    outlineColor: { ":focus-visible": color.borderFocus },
    outlineStyle: { ":focus-visible": "solid" },
    outlineWidth: { ":focus-visible": "3px" },
    outlineOffset: { ":focus-visible": "2px" },
  },
  pressable: {
    translate: { default: "none", ":active:not(:disabled)": `0 ${press.lipTravel}` },
    transitionProperty: "translate, background-color",
    transitionDuration: duration.instant,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: duration.none },
  },
  focusWithin: {
    outlineColor: { ":focus-within": color.borderFocus },
    outlineStyle: { ":focus-within": "solid" },
    outlineWidth: { ":focus-within": "3px" },
    outlineOffset: { ":focus-within": "2px" },
  },
  invalid: {
    borderColor: color.negativeStrong,
  },
  disabled: {
    backgroundColor: color.disabledSurface,
    borderColor: color.borderDefault,
    color: color.textDisabled,
    cursor: "not-allowed",
  },
  sizeSm: { minHeight: control.sm, paddingBlock: space.xs, fontSize: fontSize.sm },
  sizeLg: { minHeight: control.lg, fontSize: fontSize.lg },
});
