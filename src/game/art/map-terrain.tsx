import { MapTerrain as Terrain } from "@edurune/art";
import { regions } from "@edurune/art/catalog";
import type { ReactNode } from "react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { GetApiCoursesByCourseIdUnitsByUnitIdMapResponse } from "../../api/generated/types.gen.ts";
import { layout } from "../../ui/tokens/layout.stylex.ts";
import { space } from "../../ui/tokens/space.stylex.ts";

export interface MapTerrainProps {
  sceneId: GetApiCoursesByCourseIdUnitsByUnitIdMapResponse["unit"]["sceneId"];
  children?: ReactNode;
  style?: StyleXStyles;
}
const styles = stylex.create({
  root: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minInlineSize: space.none,
    inlineSize: layout.full,
  },
});
export function MapTerrain({ sceneId, children, style }: MapTerrainProps) {
  return (
    <Terrain
      regionId={regions.find((region) => region.id === sceneId)?.id}
      {...stylex.props(styles.root, style)}
    >
      {children}
    </Terrain>
  );
}
