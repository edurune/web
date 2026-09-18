import {
  CharacterPortrait as Portrait,
  type CharacterPortraitProps as ArtProps,
} from "@edurune/art";
import type { CosmeticId, HairstyleId } from "@edurune/art/catalog";
import type { StyleXStyles } from "@stylexjs/stylex";
import { ArtSurface } from "./art-surface.tsx";

export interface CharacterPortraitProps extends Omit<
  ArtProps,
  "cosmeticIds" | "hairStyle" | "style" | "label"
> {
  cosmeticIds: string[];
  hairStyle: string;
  label: string;
  style?: StyleXStyles;
}
export function CharacterPortrait({
  cosmeticIds,
  hairStyle,
  label,
  style,
  ...props
}: CharacterPortraitProps) {
  return (
    <ArtSurface
      label={label}
      kind="character"
      style={style}
      resetKey={JSON.stringify([cosmeticIds, hairStyle, props.palette])}
    >
      <Portrait
        {...props}
        cosmeticIds={cosmeticIds as CosmeticId[]}
        hairStyle={hairStyle as HairstyleId | "none"}
      />
    </ArtSurface>
  );
}
