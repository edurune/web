import type { Rarity } from "./types.ts";

export type CatalogDirection = "asc" | "desc";
export type CatalogSort = "rarity" | "cost";
export type CatalogCurrency = "coin" | "gem";

export interface CatalogSearch {
  rarity?: Rarity;
  direction?: CatalogDirection;
  sort?: CatalogSort;
  currency?: CatalogCurrency;
}

export const catalogRarities = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
] as const satisfies readonly Rarity[];
export const catalogDirections = ["asc", "desc"] as const satisfies readonly CatalogDirection[];
export const catalogSorts = ["rarity", "cost"] as const satisfies readonly CatalogSort[];
export const catalogCurrencies = ["coin", "gem"] as const satisfies readonly CatalogCurrency[];
