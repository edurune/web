import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { RarityBadge } from "../ui/primitives/badge.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { duration, easing } from "../ui/tokens/motion.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import type { Cosmetic } from "./cosmetics.ts";

export interface ShopItemTrayProps {
  name: string;
  rarity: Cosmetic["rarity"];
  detail?: ReactNode;
  action: ReactNode;
  style?: StyleXStyles;
}
const slideUp = stylex.keyframes({
  from: { transform: `translateY(${layout.full})` },
  to: { transform: `translateY(${space.none})` },
});
const styles = stylex.create({
  tray: {
    display: "flex",
    alignItems: "center",
    gap: space.md,
    padding: space.lg,
    paddingBlockEnd: `max(${space.lg}, ${layout.safeBottom})`,
    flexShrink: 0,
    minInlineSize: space.none,
    borderBlockStartWidth: borderWidth.thick,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color.borderStrong,
    backgroundColor: color.surfaceRaised,
    animationName: { default: slideUp, "@media (prefers-reduced-motion: reduce)": "none" },
    animationDuration: duration.normal,
    animationTimingFunction: easing.entrance,
  },
  copy: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: space.xs,
    flex: 1,
    minInlineSize: space.none,
    overflowWrap: "anywhere",
  },
  action: { flexShrink: 0 },
});
/** Pinned beneath the shop's scrolling grid; enters when an item is selected. */
export function ShopItemTray({ name, rarity, detail, action, style }: ShopItemTrayProps) {
  return (
    <section {...stylex.props(styles.tray, style)}>
      <div {...stylex.props(styles.copy)}>
        <RarityBadge rarity={rarity} />
        <Text variant="bodyStrong">{name}</Text>
        {detail && <Text variant="caption">{detail}</Text>}
      </div>
      <div {...stylex.props(styles.action)}>{action}</div>
    </section>
  );
}
