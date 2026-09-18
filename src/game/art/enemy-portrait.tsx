import { EnemyPortrait as Portrait, type EnemyPortraitProps as ArtProps } from "@edurune/art";
import type { EnemyId } from "@edurune/art/catalog";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useLingui } from "@lingui/react/macro";
import { ArtSurface } from "./art-surface.tsx";
import { enemyMetadata } from "./catalog.ts";

export interface EnemyPortraitProps extends Omit<ArtProps, "enemyId" | "style"> {
  enemyId: string;
  style?: StyleXStyles;
}
export function EnemyPortrait({ enemyId, label, style, ...props }: EnemyPortraitProps) {
  const { t } = useLingui();
  const name = enemyMetadata.get(enemyId)?.name;
  return (
    <ArtSurface
      label={label ?? (name ? t(name) : enemyId)}
      kind="character"
      style={style}
      resetKey={enemyId}
    >
      <Portrait {...props} enemyId={enemyId as EnemyId} />
    </ArtSurface>
  );
}
