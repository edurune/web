import { Select as BaseSelect } from "@base-ui/react/select";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color } from "../tokens/color.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { layer } from "../tokens/layer.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { iconSize, popupOffset } from "../tokens/scale.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";
import { controlStyles } from "./control-styles.ts";
import { useState } from "react";
import { useOverlayCues } from "../sound/use-overlay-cues.ts";
import { hoverCue } from "../sound/hover-cue.ts";
import { popup } from "../tokens/popup.stylex.ts";
import { control } from "../tokens/size.stylex.ts";
import { borderWidth } from "../tokens/border.stylex.ts";
import type { Size } from "../types.ts";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: unknown) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  name?: string;
  size?: Size;
  style?: StyleXStyles;
}

const styles = stylex.create({
  trigger: { justifyContent: "space-between", cursor: "pointer", textAlign: "start" },
  value: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  positioner: { zIndex: layer.overlay },
  popup: {
    minWidth: popup.anchorWidth,
    maxHeight: `min(${popup.listHeight}, ${popup.availableHeight})`,
    overflowY: "auto",
    padding: space.xxs,
    backgroundColor: color.surfaceRaised,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: borderWidth.thick,
    borderBottomWidth: press.lipWidth,
    borderColor: color.borderStrong,
    outline: "none",
    opacity: {
      default: 1,
      ":is([data-starting-style])": 0,
      ":is([data-ending-style])": 0,
    },
    transform: {
      default: "scale(1)",
      ":is([data-starting-style])": "scale(0.97)",
      ":is([data-ending-style])": "scale(0.97)",
    },
    transformOrigin: popup.transformOrigin,
    transitionProperty: "opacity, transform",
    transitionDuration: duration.fast,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: duration.instant },
  },
  item: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
    minHeight: control.md,
    paddingBlock: space.xs,
    paddingInline: space.sm,
    backgroundColor: {
      default: color.surfaceTransparent,
      ":is([data-selected])": color.accentSoft,
      ":is([data-highlighted])": color.accentFill,
    },
    borderRadius: radius.md,
    color: color.textPrimary,
    cursor: "pointer",
    fontFamily: font.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    outline: "none",
  },
});

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled = false,
  invalid = false,
  name,
  size = "md",
  style,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  useOverlayCues(open);
  return (
    <BaseSelect.Root
      items={options}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      onOpenChange={setOpen}
      disabled={disabled}
      name={name}
    >
      <BaseSelect.Trigger
        {...stylex.props(
          controlStyles.box,
          controlStyles.focusRing,
          styles.trigger,
          size === "sm" && controlStyles.sizeSm,
          size === "lg" && controlStyles.sizeLg,
          invalid && controlStyles.invalid,
          disabled && controlStyles.disabled,
          style,
        )}
      >
        <BaseSelect.Value placeholder={placeholder} {...stylex.props(styles.value)} />
        <BaseSelect.Icon>
          <CaretDownIcon size={iconSize.sm} weight="bold" aria-hidden="true" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner
          alignItemWithTrigger={false}
          sideOffset={popupOffset}
          {...stylex.props(styles.positioner)}
        >
          <BaseSelect.Popup {...stylex.props(styles.popup)}>
            {options.map((option) => (
              <BaseSelect.Item
                key={option.value}
                value={option.value}
                data-uisfx="select"
                {...hoverCue}
                {...stylex.props(styles.item)}
              >
                <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
                <BaseSelect.ItemIndicator>
                  <CheckIcon size={iconSize.sm} weight="bold" aria-hidden="true" />
                </BaseSelect.ItemIndicator>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
