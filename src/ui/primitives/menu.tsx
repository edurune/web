import { Menu as BaseMenu } from "@base-ui/react/menu";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState, type ReactNode } from "react";
import { useOverlayCues } from "../sound/use-overlay-cues.ts";
import { hoverCue } from "../sound/hover-cue.ts";
import { color } from "../tokens/color.stylex.ts";
import { press } from "../tokens/press.stylex.ts";
import { layer } from "../tokens/layer.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../tokens/text.stylex.ts";

export interface MenuProps {
  trigger: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  children: ReactNode;
  style?: StyleXStyles;
}

const styles = stylex.create({
  positioner: { zIndex: layer.overlay },
  popup: {
    minWidth: "200px",
    padding: space.xxs,
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
      ":is([data-starting-style])": "scale(0.96)",
      ":is([data-ending-style])": "scale(0.96)",
    },
    transformOrigin: "var(--transform-origin)",
    transitionProperty: "opacity, transform",
    transitionDuration: duration.fast,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0ms" },
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    minHeight: "40px",
    paddingBlock: space.xs,
    paddingInline: space.sm,
    backgroundColor: {
      default: "transparent",
      ":is([data-highlighted])": color.accentSoft,
    },
    borderRadius: radius.md,
    color: { default: color.textPrimary, ":is([data-disabled])": color.textDisabled },
    cursor: "pointer",
    fontFamily: font.body,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    outline: "none",
  },
  groupLabel: {
    paddingBlock: space.xs,
    paddingInline: space.sm,
    color: color.textMuted,
    fontFamily: font.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
});

export function Menu({ trigger, side = "bottom", align = "start", children, style }: MenuProps) {
  const [open, setOpen] = useState(false);
  useOverlayCues(open);
  return (
    <BaseMenu.Root onOpenChange={setOpen}>
      <BaseMenu.Trigger render={trigger as never} />
      <BaseMenu.Portal>
        <BaseMenu.Positioner
          side={side}
          align={align}
          sideOffset={6}
          {...stylex.props(styles.positioner)}
        >
          <BaseMenu.Popup {...stylex.props(styles.popup, style)}>{children}</BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}

export function MenuItem({
  onClick,
  disabled = false,
  children,
  style,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: ReactNode;
  style?: StyleXStyles;
}) {
  return (
    <BaseMenu.Item
      onClick={onClick}
      disabled={disabled}
      data-uisfx="select"
      {...hoverCue}
      {...stylex.props(styles.item, style)}
    >
      {children}
    </BaseMenu.Item>
  );
}

export function MenuGroup({ label, children }: { label?: ReactNode; children: ReactNode }) {
  return (
    <BaseMenu.Group>
      {label ? (
        <BaseMenu.GroupLabel {...stylex.props(styles.groupLabel)}>{label}</BaseMenu.GroupLabel>
      ) : null}
      {children}
    </BaseMenu.Group>
  );
}
