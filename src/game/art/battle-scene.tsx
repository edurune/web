import {
  BattleScene as Scene,
  battleFrameForViewport,
  type BattleSceneProps as ArtProps,
} from "@edurune/art";
import {
  type RegionId,
  type EnemyId,
  type CosmeticId,
  type HairstyleId,
  type EffectId,
} from "@edurune/art/catalog";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useLingui } from "@lingui/react/macro";
import { ArtSurface } from "./art-surface.tsx";
import { regionMetadata } from "./catalog.ts";

export interface BattleSceneProps extends Omit<
  ArtProps,
  "regionId" | "enemyIds" | "cosmeticIds" | "hairStyle" | "effect" | "style"
> {
  sceneId: string;
  enemyIds: string[];
  cosmeticIds: string[];
  hairStyle: string;
  effect?: { id: string; target: "player" | `enemy-${number}` };
  style?: StyleXStyles;
}
export function BattleScene({
  sceneId,
  enemyIds,
  cosmeticIds,
  hairStyle,
  effect,
  label,
  style,
  layout = "wide",
  frame = battleFrameForViewport(layout),
  ...props
}: BattleSceneProps) {
  const { t } = useLingui();
  const title = regionMetadata.get(sceneId)?.title;
  const [, , width, height] = frame.layouts[layout].viewBox;
  return (
    <ArtSurface
      label={label ?? (title ? t(title) : sceneId)}
      kind="scene"
      ratio={`${width}/${height}`}
      style={style}
      resetKey={JSON.stringify([sceneId, enemyIds, cosmeticIds, hairStyle, effect, props.palette])}
    >
      <Scene
        {...props}
        layout={layout}
        frame={frame}
        regionId={sceneId as RegionId}
        enemyIds={enemyIds as EnemyId[]}
        cosmeticIds={cosmeticIds as CosmeticId[]}
        hairStyle={hairStyle as HairstyleId | "none"}
        effect={effect && { ...effect, id: effect.id as EffectId }}
      />
    </ArtSurface>
  );
}
