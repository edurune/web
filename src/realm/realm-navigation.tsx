import { Trans, useLingui } from "@lingui/react/macro";
import { MapTrifoldIcon, BackpackIcon, StorefrontIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { font, fontSize, fontWeight } from "../ui/tokens/text.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";

const styles = stylex.create({
  nav: {
    display: "flex",
    flexShrink: 0,
    minBlockSize: layout.navigation,
    paddingBlockEnd: layout.safeBottom,
    backgroundColor: color.surfaceInverse,
  },
  item: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    flex: 1,
    padding: space.sm,
    borderWidth: borderWidth.none,
    backgroundColor: color.surfaceTransparent,
    color: { default: color.textInverse, ":is([data-active])": color.cautionFill },
    fontFamily: font.body,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    cursor: "pointer",
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineColor: color.cautionFill,
    outlineWidth: borderWidth.thick,
    outlineOffset: `calc(-1 * ${space.xs})`,
  },
});
export type RealmDestination = "map" | "loadout" | "shop";
export interface RealmNavigationProps {
  active: RealmDestination;
  onNavigate: (destination: RealmDestination) => void;
  style?: StyleXStyles;
}
export function RealmNavigation({ active, onNavigate, style }: RealmNavigationProps) {
  const { t } = useLingui();
  return (
    <nav aria-label={t`Course navigation`} {...stylex.props(styles.nav, style)}>
      <button
        type="button"
        data-active={active === "map" || undefined}
        aria-current={active === "map" ? "page" : undefined}
        onClick={() => onNavigate("map")}
        data-uisfx="select"
        {...stylex.props(styles.item)}
      >
        <MapTrifoldIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
        <Trans>Map</Trans>
      </button>
      <button
        type="button"
        data-active={active === "loadout" || undefined}
        aria-current={active === "loadout" ? "page" : undefined}
        onClick={() => onNavigate("loadout")}
        data-uisfx="select"
        {...stylex.props(styles.item)}
      >
        <BackpackIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
        <Trans>Loadout</Trans>
      </button>
      <button
        type="button"
        data-active={active === "shop" || undefined}
        aria-current={active === "shop" ? "page" : undefined}
        onClick={() => onNavigate("shop")}
        data-uisfx="select"
        {...stylex.props(styles.item)}
      >
        <StorefrontIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
        <Trans>Shop</Trans>
      </button>
    </nav>
  );
}
