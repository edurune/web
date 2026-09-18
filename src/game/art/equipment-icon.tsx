import { EquipmentIcon as Icon, type EquipmentIconProps as ArtProps } from "@edurune/art";
import type { EquipmentId } from "@edurune/art/catalog";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useLingui } from "@lingui/react/macro";
import { ArtSurface } from "./art-surface.tsx";
import { equipmentMetadata } from "./catalog.ts";

export interface EquipmentIconProps extends Omit<ArtProps, "equipmentId" | "style"> {
  equipmentId: string;
  style?: StyleXStyles;
}
export function EquipmentIcon({ equipmentId, label, style, ...props }: EquipmentIconProps) {
  const { t } = useLingui();
  const name = equipmentMetadata.get(equipmentId)?.name;
  return (
    <ArtSurface
      label={label ?? (name ? t(name) : equipmentId)}
      kind="equipment"
      style={style}
      resetKey={equipmentId}
    >
      <Icon {...props} equipmentId={equipmentId as EquipmentId} />
    </ArtSurface>
  );
}
