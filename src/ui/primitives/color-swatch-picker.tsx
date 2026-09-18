import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color } from "../tokens/color.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { borderWidth } from "../tokens/border.stylex.ts";
import { control } from "../tokens/size.stylex.ts";
import { hoverCue } from "../sound/hover-cue.ts";

// Appearance stores skinTone, hairColor, and eyeColor as hex, so swatches carry
// their colour as an inline value rather than a token.
export interface ColorSwatchPickerProps {
  label: string;
  colors: readonly string[];
  /** Localized color names for assistive technology; defaults to the stored color. */
  labels?: Readonly<Record<string, string>>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: unknown) => void;
  disabled?: boolean;
  size?: "sm" | "md";
  name?: string;
  style?: StyleXStyles;
}

const styles = stylex.create({
  group: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
  },
  swatch: {
    padding: space.none,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderColor: press.edgeColor,
    borderRadius: radius.circle,
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    outlineColor: {
      default: color.surfaceTransparent,
      ":is([data-checked])": color.borderStrong,
      ":focus-visible": color.borderFocus,
    },
    outlineStyle: "solid",
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
  },
  fill: (hex: string) => ({ backgroundColor: hex }),
});

const sizes = stylex.create({
  sm: { inlineSize: control.sm, blockSize: control.sm },
  md: { inlineSize: control.md, blockSize: control.md },
});

export function ColorSwatchPicker({
  label,
  colors,
  labels,
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  size = "md",
  name,
  style,
}: ColorSwatchPickerProps) {
  return (
    <RadioGroup
      aria-label={label}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      name={name}
      {...stylex.props(styles.group, style)}
    >
      {colors.map((hex) => (
        <Radio.Root
          key={hex}
          value={hex}
          aria-label={labels?.[hex] ?? hex}
          data-uisfx="select"
          {...hoverCue}
          {...stylex.props(styles.swatch, sizes[size], styles.fill(hex))}
        />
      ))}
    </RadioGroup>
  );
}
