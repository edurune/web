import { Switch as BaseSwitch } from "@base-ui/react/switch";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { playSound } from "../sound/sound.ts";
import { color } from "../tokens/color.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import { controlStyles } from "./control-styles.ts";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  name?: string;
  children?: ReactNode;
  style?: StyleXStyles;
}

const styles = stylex.create({
  label: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
    minHeight: "44px",
    color: color.textPrimary,
    cursor: "pointer",
    fontFamily: font.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  labelDisabled: { color: color.textDisabled, cursor: "not-allowed" },
  // 52 - 4 border - 4 padding = 44 inner; a 22px thumb centres with an even
  // 2px gap all round and travels exactly 22px.
  track: {
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    width: "52px",
    height: "30px",
    padding: "2px",
    backgroundColor: {
      default: color.neutralFill,
      ":is([data-checked])": color.accentFill,
      ":is([data-disabled])": color.disabledSurface,
    },
    borderRadius: radius.pill,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: { default: color.borderStrong, ":is([data-disabled])": color.borderDefault },
    cursor: "inherit",
    outline: "none",
    transitionProperty: "background-color",
    transitionDuration: duration.fast,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0ms" },
  },
  thumb: {
    display: "block",
    width: "22px",
    height: "22px",
    backgroundColor: color.surfaceRaised,
    borderRadius: radius.circle,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: color.borderStrong,
    transform: { default: "translateX(0)", ":is([data-checked])": "translateX(22px)" },
    transitionProperty: "transform",
    transitionDuration: duration.fast,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0ms" },
  },
});

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled = false,
  name,
  children,
  style,
}: SwitchProps) {
  const control = (
    <BaseSwitch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={(next: boolean) => {
        playSound(next ? "toggle-on" : "toggle-off");
        onCheckedChange?.(next);
      }}
      disabled={disabled}
      name={name}
      {...stylex.props(styles.track, controlStyles.focusRing, !children && style)}
    >
      <BaseSwitch.Thumb {...stylex.props(styles.thumb)} />
    </BaseSwitch.Root>
  );

  if (!children) return control;

  return (
    <label {...stylex.props(styles.label, disabled && styles.labelDisabled, style)}>
      {children}
      {control}
    </label>
  );
}
