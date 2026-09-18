import { Trans } from "@lingui/react/macro";
import { CheckIcon, XIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { ReactNode } from "react";
import { CosmeticIcon } from "../game/art/cosmetic-icon.tsx";
import { CurrencyAmount } from "../ui/primitives/currency-amount.tsx";
import { Spinner } from "../ui/primitives/spinner.tsx";
import { hoverCue } from "../ui/sound/hover-cue.ts";
import { RarityBadge } from "../ui/primitives/badge.tsx";
import { raritySurface } from "../ui/primitives/rarity-styles.ts";
import { cosmeticMetadata } from "./cosmetics.ts";
import { color, currency } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { press } from "../ui/tokens/press.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { font, fontSize, fontWeight } from "../ui/tokens/text.stylex.ts";
import { wardrobeLayout } from "../ui/tokens/wardrobe.stylex.ts";
import type { GetApiCharacterShopResponse } from "../api/generated/types.gen.ts";

export interface CosmeticTileProps {
  /** Omit for the wardrobe's empty-slot control. */
  cosmeticId?: string;
  label: string;
  price?: GetApiCharacterShopResponse["items"][number]["price"];
  owned?: boolean;
  equipped?: boolean;
  selected?: boolean;
  loading?: boolean;
  disabled?: boolean;
  /** Refuses the press and says so, instead of going dead like `disabled`. */
  blocked?: boolean;
  onClick?: () => void;
  style?: StyleXStyles;
}

const styles = stylex.create({
  tile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    inlineSize: layout.full,
    minInlineSize: space.none,
    blockSize: wardrobeLayout.tile,
    padding: space.none,
    translate: { default: "none", ":active:not(:disabled)": `0 ${press.lipTravel}` },
    borderStyle: "solid",
    borderWidth: press.edgeWidth,
    borderBlockEndWidth: press.lipWidth,
    borderColor: color.borderStrong,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: color.surfaceRaised,
    color: color.textPrimary,
    cursor: { default: "pointer", ":disabled": "default" },
    fontFamily: font.body,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: press.edgeWidth,
    outlineColor: color.borderFocus,
    outlineOffset: space.xxs,
  },
  badge: {
    flexShrink: 0,
    alignSelf: "flex-start",
    margin: space.xs,
    paddingInline: space.xs,
    maxInlineSize: `calc(${layout.full} - ${space.sm})`,
    whiteSpace: "normal",
    gap: space.xxs,
  },
  selected: {
    outlineStyle: "solid",
    outlineColor: color.accentStrong,
    outlineWidth: press.edgeWidth,
    outlineOffset: space.xxs,
  },
  image: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minBlockSize: space.none,
    inlineSize: `calc(${layout.full} - ${space.sm})`,
  },
  artwork: {
    inlineSize: layout.full,
    blockSize: layout.full,
    maxBlockSize: wardrobeLayout.artwork,
  },
  footer: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xxs,
    inlineSize: layout.full,
    minBlockSize: space.xl,
    paddingInline: space.xxs,
    backgroundColor: color.surfaceSunken,
  },
  coin: { backgroundColor: currency.coinFill },
  gem: { backgroundColor: currency.gemFill },
  owned: { backgroundColor: color.accentFill },
});

export function CosmeticTile({
  cosmeticId,
  label,
  price,
  owned,
  equipped,
  selected,
  loading,
  disabled,
  blocked,
  onClick,
  style,
}: CosmeticTileProps) {
  const refusing = Boolean(blocked) && !disabled;
  const rarity = cosmeticId ? cosmeticMetadata.get(cosmeticId)?.rarity : undefined;
  let status: ReactNode = null;
  if (loading) status = <Spinner size="sm" />;
  else if (equipped)
    status = (
      <>
        <CheckIcon size={iconSize.xs} weight="bold" aria-hidden="true" />
        <Trans>Worn</Trans>
      </>
    );
  else if (owned) status = <Trans>Owned</Trans>;
  else if (price) status = <CurrencyAmount kind={price.currency} amount={price.amount} size="sm" />;
  else if (!cosmeticId) status = <Trans>None</Trans>;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected ?? equipped ?? false}
      aria-busy={loading}
      disabled={disabled}
      aria-disabled={refusing || undefined}
      data-uisfx={refusing ? "blocked" : disabled ? undefined : "select"}
      {...hoverCue}
      onClick={refusing ? undefined : onClick}
      {...stylex.props(
        styles.tile,
        rarity && raritySurface[rarity],
        (selected ?? equipped) && styles.selected,
        style,
      )}
    >
      {rarity && <RarityBadge rarity={rarity} style={styles.badge} />}
      <span {...stylex.props(styles.image)}>
        {cosmeticId ? (
          <CosmeticIcon cosmeticId={cosmeticId} label="" style={styles.artwork} />
        ) : (
          <XIcon size={iconSize.lg} weight="bold" aria-hidden="true" />
        )}
      </span>
      {status && (
        <span
          {...stylex.props(
            styles.footer,
            price?.currency === "coin" && styles.coin,
            price?.currency === "gem" && styles.gem,
            (owned || equipped) && styles.owned,
          )}
        >
          {status}
        </span>
      )}
    </button>
  );
}
