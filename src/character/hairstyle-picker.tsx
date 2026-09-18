import { Radio } from "@base-ui/react/radio";
import { RadioGroup } from "@base-ui/react/radio-group";
import { XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { Palette } from "@edurune/art";
import { HairstyleIcon } from "../game/art/hairstyle-icon.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { hoverCue } from "../ui/sound/hover-cue.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { press } from "../ui/tokens/press.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { wardrobeLayout } from "../ui/tokens/wardrobe.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";

export interface HairstylePickerProps {
  label: string;
  options: { value: string; label: string }[];
  palette: Palette;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  style?: StyleXStyles;
}

const styles = stylex.create({
  grid: { display: "grid", gridTemplateColumns: wardrobeLayout.columns, gap: space.sm },
  choice: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    minInlineSize: space.none,
    padding: space.xs,
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBlockEndWidth: press.lipWidth,
    borderColor: color.borderStrong,
    borderRadius: radius.lg,
    color: color.textPrimary,
    backgroundColor: {
      default: color.surfaceRaised,
      ":is([data-checked])": color.accentFill,
    },
    cursor: { default: "pointer", ":is([data-disabled])": "not-allowed" },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: borderWidth.thick,
    outlineOffset: space.xxs,
    outlineColor: color.borderFocus,
    translate: { default: "none", ":active:not([data-disabled])": `0 ${press.lipTravel}` },
  },
  preview: {
    inlineSize: layout.full,
    aspectRatio: "1",
    display: "grid",
    placeItems: "center",
    padding: space.sm,
  },
  portrait: { inlineSize: layout.full },
  label: { textAlign: "center", paddingBlockEnd: space.xs },
});

/** Keyboard-accessible hair choices, without repeating a mannequin in every card. */
export function HairstylePicker({
  label,
  options,
  palette,
  style,
  ...props
}: HairstylePickerProps) {
  return (
    <RadioGroup aria-label={label} {...props} {...stylex.props(styles.grid, style)}>
      {options.map((option) => (
        <Radio.Root
          key={option.value}
          value={option.value}
          aria-label={option.label}
          data-uisfx="select"
          {...hoverCue}
          {...stylex.props(styles.choice)}
        >
          <span aria-hidden="true" {...stylex.props(styles.preview)}>
            {option.value === "none" ? (
              <XIcon weight="bold" size={iconSize.xl} />
            ) : (
              <HairstyleIcon
                hairStyle={option.value}
                palette={palette}
                label=""
                style={styles.portrait}
              />
            )}
          </span>
          <Text variant="label" style={styles.label}>
            {option.label}
          </Text>
        </Radio.Root>
      ))}
    </RadioGroup>
  );
}
