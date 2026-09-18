import { Field as BaseField } from "@base-ui/react/field";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ChangeEvent, ChangeEventHandler, ComponentPropsWithRef, KeyboardEvent } from "react";
import { color } from "../tokens/color.stylex.ts";
import { font } from "../tokens/text.stylex.ts";
import type { Size } from "../types.ts";
import { controlStyles } from "./control-styles.ts";
import { playSound, type CueName } from "../sound/sound.ts";

export interface TextFieldProps extends Omit<
  ComponentPropsWithRef<"input">,
  "size" | "style" | "value" | "defaultValue" | "type"
> {
  value?: string;
  defaultValue?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  maxLength?: number;
  size?: Size;
  disabled?: boolean;
  invalid?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  name?: string;
  type?: "text" | "email" | "password";
  required?: boolean;
  minLength?: number;
  inputMode?: "text" | "numeric" | "search";
  /** Sounds each key contact. Reserve it for answering, not for every form. */
  cue?: CueName | null;
  style?: StyleXStyles;
}

const styles = stylex.create({
  input: {
    "::placeholder": { color: color.textDisabled },
  },
});

export function TextField({
  value,
  defaultValue,
  onChange,
  placeholder,
  maxLength,
  size = "md",
  disabled = false,
  invalid = false,
  readOnly = false,
  autoComplete,
  name,
  type = "text",
  required,
  minLength,
  inputMode,
  cue = null,
  onKeyDown,
  style,
  ...rest
}: TextFieldProps) {
  return (
    <BaseField.Control
      {...rest}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
        if (cue && !readOnly && event.key.length === 1) playSound(cue, { cooldownMs: 40 });
        onKeyDown?.(event);
      }}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      readOnly={readOnly}
      autoComplete={autoComplete}
      name={name}
      type={type}
      required={required}
      minLength={minLength}
      inputMode={inputMode}
      {...stylex.props(
        controlStyles.box,
        controlStyles.focusRing,
        styles.input,
        size === "sm" && controlStyles.sizeSm,
        size === "lg" && controlStyles.sizeLg,
        invalid && controlStyles.invalid,
        disabled && controlStyles.disabled,
        style,
      )}
    />
  );
}

export interface TextAreaProps extends Omit<TextFieldProps, "inputMode" | "onChange"> {
  rows?: number;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const areaStyles = stylex.create({
  area: {
    alignItems: "stretch",
    minHeight: "auto",
    fontFamily: font.body,
    resize: "vertical",
  },
});

export function TextArea({
  rows = 4,
  value,
  defaultValue,
  onChange,
  placeholder,
  maxLength,
  disabled = false,
  invalid = false,
  readOnly = false,
  name,
  style,
}: TextAreaProps) {
  return (
    <BaseField.Control
      render={<textarea rows={rows} />}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange as unknown as ChangeEventHandler<HTMLInputElement>}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      readOnly={readOnly}
      name={name}
      {...stylex.props(
        controlStyles.box,
        controlStyles.focusRing,
        styles.input,
        areaStyles.area,
        invalid && controlStyles.invalid,
        disabled && controlStyles.disabled,
        style,
      )}
    />
  );
}
