import { msg } from "@lingui/core/macro";
import type { GetApiCharacterWardrobeResponse } from "../api/generated/types.gen.ts";
import type {
  CosmeticFilters,
  CosmeticShopFilters,
} from "../api/character/use-cosmetic-queries.ts";
import {
  catalogCurrencies,
  catalogDirections,
  catalogRarities,
  catalogSorts,
} from "../ui/catalog-search.ts";
export { cosmeticMetadata } from "../game/art/catalog.ts";

export type Cosmetic = GetApiCharacterWardrobeResponse["items"][number]["cosmetic"];
export type CosmeticSlot = Cosmetic["slot"];
export const cosmeticSlots = [
  "top",
  "bottom",
  "shoes",
  "hat",
  "accessory",
  "full_body",
  "pet",
  "background",
] as const satisfies CosmeticSlot[];
export const cosmeticSlotLabels = {
  top: msg`Tops`,
  bottom: msg`Bottoms`,
  shoes: msg`Shoes`,
  hat: msg`Hats`,
  accessory: msg`Accessories`,
  full_body: msg`Outfits`,
  pet: msg`Pets`,
  background: msg`Backgrounds`,
} satisfies Record<CosmeticSlot, ReturnType<typeof msg>>;
export type WardrobeSearch = Required<Pick<CosmeticFilters, "slot">> &
  Pick<CosmeticFilters, "rarity" | "direction">;
export type CosmeticShopSearch = Required<Pick<CosmeticShopFilters, "slot">> &
  Pick<CosmeticShopFilters, "rarity" | "direction" | "sort" | "currency">;

function catalogSearch(search: Record<string, unknown>) {
  return {
    slot: cosmeticSlots.includes(search.slot as CosmeticSlot)
      ? (search.slot as CosmeticSlot)
      : "top",
    rarity: catalogRarities.find((rarity) => rarity === search.rarity),
    direction: catalogDirections.find((direction) => direction === search.direction),
  };
}

export function wardrobeSearch(search: Record<string, unknown>): WardrobeSearch {
  return catalogSearch(search);
}

export function cosmeticShopSearch(search: Record<string, unknown>): CosmeticShopSearch {
  return {
    ...catalogSearch(search),
    sort: catalogSorts.find((sort) => sort === search.sort),
    currency: catalogCurrencies.find((currency) => currency === search.currency),
  };
}
