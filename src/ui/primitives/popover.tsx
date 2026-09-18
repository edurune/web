import { Popover as BasePopover } from "@base-ui/react/popover";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { useOverlayCues } from "../sound/use-overlay-cues.ts";
import { color } from "../tokens/color.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { layer } from "../tokens/layer.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";

export interface PopoverProps {
  trigger: ReactNode;
  title?: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  style?: StyleXStyles;
}

const styles = stylex.create({
  positioner: { zIndex: layer.overlay },
  popup: {
    display: "flex",
    flexDirection: "column",
    gap: space.sm,
    width: "max-content",
    maxWidth: "300px",
    padding: space.md,
    backgroundColor: color.surfaceRaised,
    borderRadius: radius.lg,
    borderStyle: "solid",
    borderWidth: "2px",
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
      ":is([data-starting-style])": "scale(0.95)",
      ":is([data-ending-style])": "scale(0.95)",
    },
    transformOrigin: "var(--transform-origin)",
    transitionProperty: "opacity, transform",
    transitionDuration: duration.fast,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0ms" },
  },
  title: {
    fontFamily: font.display,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: color.textPrimary,
  },
});

export function Popover({
  trigger,
  title,
  side = "bottom",
  open,
  onOpenChange,
  children,
  style,
}: PopoverProps) {
  const [uncontrolled, setUncontrolled] = useState(false);
  useOverlayCues(open ?? uncontrolled);
  return (
    <BasePopover.Root
      open={open}
      onOpenChange={(next: boolean) => {
        setUncontrolled(next);
        onOpenChange?.(next);
      }}
    >
      <BasePopover.Trigger render={trigger as never} />
      <BasePopover.Portal>
        <BasePopover.Positioner side={side} sideOffset={8} {...stylex.props(styles.positioner)}>
          <BasePopover.Popup {...stylex.props(styles.popup, style)}>
            {title ? (
              <BasePopover.Title {...stylex.props(styles.title)}>{title}</BasePopover.Title>
            ) : null}
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
