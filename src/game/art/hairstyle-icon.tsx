import { HairstyleIcon as Icon, type HairstyleIconProps as ArtProps } from "@edurune/art";
import type { HairstyleId } from "@edurune/art/catalog";
import type { StyleXStyles } from "@stylexjs/stylex";
import * as stylex from "@stylexjs/stylex";
import { layout } from "../../ui/tokens/layout.stylex.ts";
import { iconSize } from "../../ui/tokens/scale.ts";
import { ArtSurface } from "./art-surface.tsx";

const styles = stylex.create({
  artwork: { inlineSize: layout.full, blockSize: layout.full },
});

export interface HairstyleIconProps extends Omit<ArtProps, "hairStyle" | "label" | "style"> {
  hairStyle: string;
  label: string;
  style?: StyleXStyles;
}
export function HairstyleIcon({ hairStyle, label, style, ...props }: HairstyleIconProps) {
  return (
    <ArtSurface
      label={label}
      kind="equipment"
      style={style}
      resetKey={JSON.stringify([hairStyle, props.palette])}
    >
      <Icon
        padding={iconSize.xs}
        {...props}
        hairStyle={hairStyle as HairstyleId}
        {...stylex.props(styles.artwork)}
      />
    </ArtSurface>
  );
}
