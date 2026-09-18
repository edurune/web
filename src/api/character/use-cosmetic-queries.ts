import { useInfiniteQuery } from "@tanstack/react-query";
import type { ApiClient } from "../client.ts";
import { useApiClient } from "../api-context.ts";
import {
  getApiCharacterWardrobeInfiniteOptions,
  getApiCharacterShopInfiniteOptions,
} from "../generated/@tanstack/react-query.gen.ts";
import type {
  GetApiCharacterWardrobeData,
  GetApiCharacterWardrobeResponse,
  GetApiCharacterShopResponse,
  GetApiCharacterShopData,
} from "../generated/types.gen.ts";
export type CosmeticFilters = Omit<NonNullable<GetApiCharacterWardrobeData["query"]>, "cursor">;
export type CosmeticShopFilters = Omit<NonNullable<GetApiCharacterShopData["query"]>, "cursor">;
export function wardrobeOptions(client: ApiClient, query: CosmeticFilters) {
  return {
    ...getApiCharacterWardrobeInfiniteOptions({ client, query }),
    initialPageParam: {},
    getNextPageParam: (page: GetApiCharacterWardrobeResponse) => page.nextCursor ?? undefined,
  };
}
export function cosmeticShopOptions(client: ApiClient, query: CosmeticShopFilters) {
  return {
    ...getApiCharacterShopInfiniteOptions({ client, query }),
    initialPageParam: {},
    getNextPageParam: (page: GetApiCharacterShopResponse) => page.nextCursor ?? undefined,
  };
}
export function useWardrobeQuery(query: CosmeticFilters) {
  return useInfiniteQuery(wardrobeOptions(useApiClient(), query));
}
export function useCosmeticShopQuery(query: CosmeticShopFilters) {
  return useInfiniteQuery(cosmeticShopOptions(useApiClient(), query));
}
