import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { playSound } from "../sound/sound.ts";
import { color } from "../tokens/color.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import { controlStyles } from "./control-styles.ts";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
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
    gap: space.sm,
    minHeight: "44px",
    color: color.textPrimary,
    cursor: "pointer",
    fontFamily: font.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  labelDisabled: { color: color.textDisabled, cursor: "not-allowed" },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    width: "24px",
    height: "24px",
    padding: 0,
    backgroundColor: {
      default: color.surfaceRaised,
      ":is([data-checked])": color.accentFill,
      ":is([data-indeterminate])": color.accentFill,
      ":is([data-disabled])": color.disabledSurface,
    },
    borderRadius: radius.sm,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: { default: color.borderStrong, ":is([data-disabled])": color.borderDefault },
    color: color.textOnFill,
    cursor: "inherit",
    outline: "none",
  },
  indicator: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    inlineSize: "100%",
    blockSize: "100%",
  },
});

export function Checkbox({
  checked,
  defaultChecked,
  indeterminate,
  onCheckedChange,
  disabled = false,
  name,
  children,
  style,
}: CheckboxProps) {
  const control = (
    <BaseCheckbox.Root
      checked={checked}
      defaultChecked={defaultChecked}
      indeterminate={indeterminate}
      onCheckedChange={(next: boolean) => {
        playSound(next ? "check" : "uncheck");
        onCheckedChange?.(next);
      }}
      disabled={disabled}
      name={name}
      {...stylex.props(styles.box, controlStyles.focusRing, !children && style)}
    >
      <BaseCheckbox.Indicator {...stylex.props(styles.indicator)}>
        {indeterminate ? (
          <MinusIcon size={iconSize.sm} weight="bold" />
        ) : (
          <CheckIcon size={iconSize.sm} weight="bold" />
        )}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );

  if (!children) return control;

  return (
    <label {...stylex.props(styles.label, disabled && styles.labelDisabled, style)}>
      {control}
      {children}
    </label>
  );
}
