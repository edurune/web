import { CosmeticIcon as Icon, type CosmeticIconProps as ArtProps } from "@edurune/art";
import type { CosmeticId } from "@edurune/art/catalog";
import type { StyleXStyles } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";
import { layout } from "../../ui/tokens/layout.stylex.ts";
import { iconSize } from "../../ui/tokens/scale.ts";
import { ArtSurface } from "./art-surface.tsx";

const styles = stylex.create({
  artwork: { inlineSize: layout.full, blockSize: layout.full },
});

export interface CosmeticIconProps extends Omit<ArtProps, "cosmeticId" | "label" | "style"> {
  cosmeticId: string;
  label: string;
  style?: StyleXStyles;
}
export function CosmeticIcon({ cosmeticId, label, style, ...props }: CosmeticIconProps) {
  return (
    <ArtSurface label={label} kind="equipment" style={style} resetKey={cosmeticId}>
      <Icon
        padding={iconSize.xs}
        {...props}
        cosmeticId={cosmeticId as CosmeticId}
        {...stylex.props(styles.artwork)}
      />
    </ArtSurface>
  );
}
