import { Field as BaseField } from "@base-ui/react/field";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";

export interface FieldProps {
  label?: ReactNode;
  /** Guidance shown before the control. Hidden once an error replaces it. */
  description?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: space.xs, minWidth: 0 },
  label: {
    fontFamily: font.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: color.textPrimary,
  },
  description: { fontFamily: font.body, fontSize: fontSize.xs, color: color.textMuted },
  error: {
    fontFamily: font.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: color.negativeStrong,
  },
});

export function Field({
  label,
  description,
  error,
  disabled = false,
  children,
  style,
}: FieldProps) {
  return (
    <BaseField.Root
      disabled={disabled}
      invalid={Boolean(error)}
      {...stylex.props(styles.root, style)}
    >
      {label ? <BaseField.Label {...stylex.props(styles.label)}>{label}</BaseField.Label> : null}
      {children}
      {error ? (
        <BaseField.Error match {...stylex.props(styles.error)}>
          {error}
        </BaseField.Error>
      ) : description ? (
        <BaseField.Description {...stylex.props(styles.description)}>
          {description}
        </BaseField.Description>
      ) : null}
    </BaseField.Root>
  );
}
