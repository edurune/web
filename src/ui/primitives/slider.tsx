import { Slider as BaseSlider } from "@base-ui/react/slider";
import * as stylex from "@stylexjs/stylex";
import { playSound } from "../sound/sound.ts";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color, resource } from "../tokens/color.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import { controlStyles } from "./control-styles.ts";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label?: string;
  showValue?: boolean;
  name?: string;
  style?: StyleXStyles;
}

const styles = stylex.create({
  root: { display: "flex", flexDirection: "column", gap: space.xs, minWidth: 0, width: "100%" },
  header: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: space.sm,
    color: color.textSecondary,
    fontFamily: font.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  control: { display: "flex", alignItems: "center", width: "100%", height: "24px" },
  track: {
    width: "100%",
    height: "10px",
    backgroundColor: {
      default: resource.progressTrack,
      ":is([data-disabled])": color.disabledSurface,
    },
    borderRadius: radius.pill,
    // Base UI sizes the indicator with `height: inherit`, which ignores the
    // track's content box. An outline keeps the ink ring without shrinking it.
    outlineStyle: "solid",
    outlineWidth: "2px",
    outlineColor: { default: color.borderStrong, ":is([data-disabled])": color.borderDefault },
    outlineOffset: 0,
  },
  indicator: {
    height: "100%",
    backgroundColor: {
      default: color.accentFill,
      ":is([data-disabled])": color.neutralFill,
    },
    borderRadius: radius.pill,
  },
  thumb: {
    width: "22px",
    height: "22px",
    backgroundColor: {
      default: color.surfaceRaised,
      ":is([data-disabled])": color.disabledSurface,
    },
    borderRadius: radius.circle,
    borderStyle: "solid",
    borderWidth: "2px",
    borderColor: { default: color.borderStrong, ":is([data-disabled])": color.borderDefault },
    outline: "none",
  },
  value: { fontVariantNumeric: "tabular-nums" },
});

export function Slider({
  value,
  defaultValue,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  label,
  showValue = true,
  name,
  style,
}: SliderProps) {
  return (
    <BaseSlider.Root
      value={value}
      defaultValue={defaultValue}
      onValueChange={(next: number | number[]) => {
        playSound("volume-change");
        onValueChange?.(next);
      }}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      name={name}
      {...stylex.props(styles.root, style)}
    >
      {label || showValue ? (
        <div {...stylex.props(styles.header)}>
          {label ? <BaseSlider.Label>{label}</BaseSlider.Label> : <span />}
          {showValue ? <BaseSlider.Value {...stylex.props(styles.value)} /> : null}
        </div>
      ) : null}
      <BaseSlider.Control {...stylex.props(styles.control)}>
        <BaseSlider.Track {...stylex.props(styles.track)}>
          <BaseSlider.Indicator {...stylex.props(styles.indicator)} />
          <BaseSlider.Thumb {...stylex.props(styles.thumb, controlStyles.focusRing)} />
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
