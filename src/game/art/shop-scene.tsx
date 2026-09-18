import { ShopScene as Scene } from "@edurune/art";
import type { CosmeticId } from "@edurune/art/catalog";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { layout } from "../../ui/tokens/layout.stylex.ts";

const styles = stylex.create({
  root: { inlineSize: layout.full, blockSize: layout.homeCharacterStage },
});

/** Shop interior with a cosmetic background fitted into its curtained alcove. */
export function ShopScene({
  backgroundId,
  style,
}: {
  backgroundId?: string | null;
  style?: StyleXStyles;
}) {
  return (
    <Scene
      backgroundId={backgroundId as CosmeticId | null | undefined}
      {...stylex.props(styles.root, style)}
    />
  );
}
