import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { useLingui } from "@lingui/react/macro";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { Ref } from "react";
import { borderWidth } from "../tokens/border.stylex.ts";
import { color } from "../tokens/color.stylex.ts";
import { layout } from "../tokens/layout.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { iconSize } from "../tokens/scale.ts";
import { control } from "../tokens/size.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize } from "../tokens/text.stylex.ts";
import type { Size } from "../types.ts";
import { controlStyles } from "./control-styles.ts";

export interface NumberFieldProps {
  value?: number | null;
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  smallStep?: number;
  allowOutOfRange?: boolean;
  format?: Intl.NumberFormatOptions;
  size?: Size;
  /** Ref to the visible input, for focusing a validation error. */
  inputRef?: Ref<HTMLInputElement>;
  name?: string;
  id?: string;
  autoComplete?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: { inlineSize: layout.full },
  group: {
    display: "flex",
    alignItems: "stretch",
    inlineSize: layout.full,
    minBlockSize: control.md,
    overflow: "hidden",
    backgroundColor: color.surfaceRaised,
    borderStyle: "solid",
    borderWidth: borderWidth.thick,
    borderColor: color.borderStrong,
    borderRadius: radius.lg,
  },
  sizeSm: { minBlockSize: control.sm },
  sizeLg: { minBlockSize: control.lg },
  invalid: { borderColor: color.negativeStrong },
  disabled: { backgroundColor: color.disabledSurface, borderColor: color.borderDefault },
  input: {
    flex: 1,
    minInlineSize: space.none,
    paddingInline: space.md,
    backgroundColor: color.surfaceTransparent,
    borderWidth: borderWidth.none,
    color: color.textPrimary,
    fontFamily: font.body,
    fontSize: fontSize.md,
    outline: "none",
    textAlign: "center",
  },
  stepper: {
    display: "grid",
    placeItems: "center",
    inlineSize: control.md,
    flexShrink: 0,
    padding: space.none,
    backgroundColor: {
      default: color.surfaceRaised,
      ":hover:not([data-disabled])": color.neutralFillHover,
    },
    borderWidth: borderWidth.none,
    color: color.textPrimary,
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
  },
  decrement: {
    borderInlineEndStyle: "solid",
    borderInlineEndWidth: borderWidth.thick,
    borderColor: color.borderStrong,
  },
  increment: {
    borderInlineStartStyle: "solid",
    borderInlineStartWidth: borderWidth.thick,
    borderColor: color.borderStrong,
  },
});

export function NumberField({
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  smallStep,
  allowOutOfRange,
  format,
  size = "md",
  inputRef,
  name,
  id,
  autoComplete,
  placeholder,
  required = false,
  disabled = false,
  readOnly = false,
  invalid = false,
  style,
}: NumberFieldProps) {
  const { t } = useLingui();
  return (
    <BaseNumberField.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      min={min}
      max={max}
      step={step}
      smallStep={smallStep}
      allowOutOfRange={allowOutOfRange}
      format={format}
      name={name}
      id={id}
      required={required}
      disabled={disabled}
      readOnly={readOnly}
      {...stylex.props(styles.root, style)}
    >
      <BaseNumberField.Group
        {...stylex.props(
          styles.group,
          size === "sm" && styles.sizeSm,
          size === "lg" && styles.sizeLg,
          controlStyles.focusWithin,
          invalid && styles.invalid,
          disabled && styles.disabled,
        )}
      >
        <BaseNumberField.Decrement
          aria-label={t`Decrease`}
          data-uisfx="select"
          {...stylex.props(styles.stepper, styles.decrement, controlStyles.focusRing)}
        >
          <MinusIcon size={iconSize.sm} weight="bold" aria-hidden="true" />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          ref={inputRef}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={invalid || undefined}
          {...stylex.props(styles.input)}
        />
        <BaseNumberField.Increment
          aria-label={t`Increase`}
          data-uisfx="select"
          {...stylex.props(styles.stepper, styles.increment, controlStyles.focusRing)}
        >
          <PlusIcon size={iconSize.sm} weight="bold" aria-hidden="true" />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}
