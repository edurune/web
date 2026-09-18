import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";

export interface SegmentedControlProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** Allows more than one segment at a time. */
  multiple?: boolean;
  disabled?: boolean;
  children: ReactNode;
  style?: StyleXStyles;
}

const styles = stylex.create({
  group: {
    display: "inline-flex",
    gap: space.xxs,
    padding: space.xxs,
    backgroundColor: color.surfaceSunken,
    borderRadius: radius.pill,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: color.borderStrong,
  },
  segment: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    minHeight: "36px",
    paddingInline: space.md,
    backgroundColor: {
      default: "transparent",
      ":hover:not(:disabled)": color.neutralFillHover,
      ":is([data-pressed])": color.accentFill,
    },
    borderRadius: radius.pill,
    borderWidth: 0,
    color: { default: color.textMuted, ":is([data-pressed])": color.textOnFill },
    cursor: "pointer",
    fontFamily: font.display,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    outlineColor: { ":focus-visible": color.borderFocus },
    outlineStyle: { ":focus-visible": "solid" },
    outlineWidth: { ":focus-visible": "3px" },
    outlineOffset: { ":focus-visible": "2px" },
    whiteSpace: "nowrap",
  },
});

export function SegmentedControl({
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled = false,
  children,
  style,
}: SegmentedControlProps) {
  return (
    <ToggleGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      multiple={multiple}
      disabled={disabled}
      {...stylex.props(styles.group, style)}
    >
      {children}
    </ToggleGroup>
  );
}

export function Segment({
  value,
  disabled = false,
  children,
  style,
}: {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  style?: StyleXStyles;
}) {
  return (
    <Toggle
      value={value}
      disabled={disabled}
      data-uisfx="select"
      {...stylex.props(styles.segment, style)}
    >
      {children}
    </Toggle>
  );
}
