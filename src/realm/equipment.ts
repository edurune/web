import { msg } from "@lingui/core/macro";
import type {
  GetApiCoursesByCourseIdRealmLoadoutResponse,
  GetApiCoursesByCourseIdRealmShopResponse,
} from "../api/generated/types.gen.ts";
import type { EquipmentShopFilters } from "../api/realm/use-realm-queries.ts";
import { catalogDirections, catalogRarities, catalogSorts } from "../ui/catalog-search.ts";
export { equipmentMetadata } from "../game/art/catalog.ts";

export type Loadout = GetApiCoursesByCourseIdRealmLoadoutResponse;
export type Equipment = Loadout["equipped"][number];
export type EquipmentSlot = Equipment["slot"];
export type ShopItem = GetApiCoursesByCourseIdRealmShopResponse["items"][number];
export const equipmentSlots = [
  "weapon",
  "armor",
  "charm",
] as const satisfies readonly EquipmentSlot[];
export const slotLabels = { weapon: msg`Weapon`, armor: msg`Armor`, charm: msg`Charm` };
export const statLabels = {
  maxHealth: msg`Health`,
  attack: msg`Attack`,
  defense: msg`Defense`,
  speed: msg`Speed`,
};
export const statIcons = {
  maxHealth: "icon-stat-max-health",
  attack: "icon-stat-attack",
  defense: "icon-stat-defense",
  speed: "icon-stat-speed",
};
export const stats = ["maxHealth", "attack", "defense", "speed"] as const;
export type EquipmentShopSearch = Pick<
  EquipmentShopFilters,
  "slot" | "rarity" | "direction" | "sort"
>;
export function equipmentShopSearch(search: Record<string, unknown>): EquipmentShopSearch {
  return {
    slot: equipmentSlots.find((slot) => slot === search.slot),
    rarity: catalogRarities.find((rarity) => rarity === search.rarity),
    direction: catalogDirections.find((direction) => direction === search.direction),
    sort: catalogSorts.find((sort) => sort === search.sort),
  };
}
