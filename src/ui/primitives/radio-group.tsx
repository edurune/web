import { Radio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useId, type ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import { controlStyles } from "./control-styles.ts";

export interface RadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: unknown) => void;
  name?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  children: ReactNode;
  style?: StyleXStyles;
}

export interface RadioOptionProps {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  style?: StyleXStyles;
}

const styles = stylex.create({
  group: { display: "flex", gap: space.sm, minWidth: 0 },
  vertical: { flexDirection: "column" },
  horizontal: { flexDirection: "row", flexWrap: "wrap" },
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
  dot: {
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
      ":is([data-disabled])": color.disabledSurface,
    },
    borderRadius: radius.circle,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: { default: color.borderStrong, ":is([data-disabled])": color.borderDefault },
    cursor: "inherit",
    outline: "none",
  },
  indicator: {
    width: "8px",
    height: "8px",
    backgroundColor: color.textOnFill,
    borderRadius: radius.circle,
  },
});

export function RadioGroup({
  value,
  defaultValue,
  onValueChange,
  name,
  disabled = false,
  orientation = "vertical",
  children,
  style,
}: RadioGroupProps) {
  return (
    <BaseRadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      name={name}
      disabled={disabled}
      {...stylex.props(styles.group, styles[orientation], style)}
    >
      {children}
    </BaseRadioGroup>
  );
}

export function RadioOption({ value, disabled = false, children, style }: RadioOptionProps) {
  const labelId = useId();
  return (
    <label {...stylex.props(styles.label, disabled && styles.labelDisabled, style)}>
      <Radio.Root
        value={value}
        aria-labelledby={labelId}
        disabled={disabled}
        data-uisfx="select"
        {...stylex.props(styles.dot, controlStyles.focusRing)}
      >
        <Radio.Indicator {...stylex.props(styles.indicator)} />
      </Radio.Root>
      <span id={labelId}>{children}</span>
    </label>
  );
}
