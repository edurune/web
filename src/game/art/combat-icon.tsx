import { CombatIcon as Icon, type CombatIconProps as ArtProps } from "@edurune/art";
import type { CombatIconId } from "@edurune/art/catalog";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useLingui } from "@lingui/react/macro";
import { ArtSurface } from "./art-surface.tsx";
import { iconMetadata } from "./catalog.ts";

export interface CombatIconProps extends Omit<ArtProps, "iconId" | "style"> {
  iconId: string;
  style?: StyleXStyles;
}
export function CombatIcon({ iconId, label, style, ...props }: CombatIconProps) {
  const { t } = useLingui();
  const name = iconMetadata.get(iconId)?.name;
  return (
    <ArtSurface
      label={label ?? (name ? t(name) : iconId)}
      kind="icon"
      style={style}
      resetKey={iconId}
    >
      <Icon {...props} iconId={iconId as CombatIconId} />
    </ArtSurface>
  );
}
