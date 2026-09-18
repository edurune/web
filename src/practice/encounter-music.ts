import { regions } from "@edurune/art/catalog";
import type { SessionView } from "../api/generated/types.gen.ts";
import { encounterMusicUrls } from "@edurune/art/assets";

export function encounterTrack(session: SessionView, wave: number) {
  const { sceneId, waves } = session.encounter;
  const region = regions.find((item) => item.id === sceneId);
  if (!region) return null;
  const boss = waves[wave - 1]?.enemies.some((enemy) => enemy.role === "boss");
  return encounterMusicUrls[region.id]?.[boss ? "boss" : "normal"] ?? null;
}
