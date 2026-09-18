import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { color } from "../tokens/color.stylex.ts";
import { duration, easing } from "../tokens/motion.stylex.ts";
import { layer } from "../tokens/layer.stylex.ts";
import { radius } from "../tokens/radius.stylex.ts";
import { space } from "../tokens/space.stylex.ts";
import { font, fontSize, fontWeight, lineHeight } from "../tokens/text.stylex.ts";

export interface TooltipProps {
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delay?: number;
  children: ReactNode;
  style?: StyleXStyles;
}

const styles = stylex.create({
  positioner: { zIndex: layer.tooltip },
  popup: {
    maxWidth: "260px",
    paddingBlock: space.xs,
    paddingInline: space.sm,
    backgroundColor: color.surfaceInverse,
    borderRadius: radius.md,
    color: color.textInverse,
    fontFamily: font.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    lineHeight: lineHeight.snug,
    opacity: {
      default: 1,
      ":is([data-starting-style])": 0,
      ":is([data-ending-style])": 0,
    },
    transform: {
      default: "scale(1)",
      ":is([data-starting-style])": "scale(0.92)",
      ":is([data-ending-style])": "scale(0.92)",
    },
    transitionProperty: "opacity, transform",
    transitionDuration: duration.fast,
    transitionTimingFunction: easing.standard,
    "@media (prefers-reduced-motion: reduce)": { transitionDuration: "0ms" },
  },
});

export const TooltipProvider = BaseTooltip.Provider;

export function Tooltip({ content, side = "top", delay = 200, children, style }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger delay={delay} render={children as never} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={8} {...stylex.props(styles.positioner)}>
          <BaseTooltip.Popup {...stylex.props(styles.popup, style)}>{content}</BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
