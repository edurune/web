import { Trans } from "@lingui/react/macro";
import { PlusIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { CardButton } from "../ui/primitives/card-button.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { color } from "../ui/tokens/color.stylex.ts";
import { radius } from "../ui/tokens/radius.stylex.ts";
import { wardrobeLayout } from "../ui/tokens/wardrobe.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";

const styles = stylex.create({
  card: {
    flexDirection: "column",
    justifyContent: "center",
    blockSize: wardrobeLayout.tile,
    borderRadius: radius.lg,
    backgroundColor: { default: color.cautionFill, ":hover:not(:disabled)": color.cautionSoft },
  },
});

export interface WardrobeShopCardProps {
  /** Open the shop in the wardrobe's current category. */
  onClick: () => void;
  style?: StyleXStyles;
}

/** The final tile in each wardrobe category. */
export function WardrobeShopCard({ onClick, style }: WardrobeShopCardProps) {
  return (
    <CardButton cue="forward" onClick={onClick} style={[styles.card, style]}>
      <PlusIcon weight="bold" size={iconSize.xl} aria-hidden="true" />
      <Text as="span" variant="bodyStrong">
        <Trans>Shop</Trans>
      </Text>
    </CardButton>
  );
}
