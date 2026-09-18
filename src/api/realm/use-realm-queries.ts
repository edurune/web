import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import { getApiCoursesByCourseIdRealmOptions } from "../generated/@tanstack/react-query.gen.ts";
import {
  getApiCoursesByCourseIdRealmLoadoutOptions,
  getApiCoursesByCourseIdRealmInventoryInfiniteOptions,
  getApiCoursesByCourseIdRealmShopInfiniteOptions,
} from "../generated/@tanstack/react-query.gen.ts";
import type { ApiClient } from "../client.ts";
import type {
  GetApiCoursesByCourseIdRealmInventoryData,
  GetApiCoursesByCourseIdRealmInventoryResponse,
  GetApiCoursesByCourseIdRealmShopData,
  GetApiCoursesByCourseIdRealmShopResponse,
} from "../generated/types.gen.ts";

export type EquipmentFilters = Omit<
  NonNullable<GetApiCoursesByCourseIdRealmInventoryData["query"]>,
  "cursor"
>;
export type EquipmentShopFilters = Omit<
  NonNullable<GetApiCoursesByCourseIdRealmShopData["query"]>,
  "cursor"
>;
export const loadoutOptions = (client: ApiClient, courseId: string) =>
  getApiCoursesByCourseIdRealmLoadoutOptions({ client, path: { courseId } });
export function inventoryOptions(
  client: ApiClient,
  courseId: string,
  query: EquipmentShopFilters = {},
) {
  return {
    ...getApiCoursesByCourseIdRealmInventoryInfiniteOptions({ client, path: { courseId }, query }),
    initialPageParam: { path: { courseId } },
    getNextPageParam: (page: GetApiCoursesByCourseIdRealmInventoryResponse) =>
      page.nextCursor ?? undefined,
  };
}
export function equipmentShopOptions(
  client: ApiClient,
  courseId: string,
  query: EquipmentFilters = {},
) {
  return {
    ...getApiCoursesByCourseIdRealmShopInfiniteOptions({ client, path: { courseId }, query }),
    initialPageParam: { path: { courseId } },
    getNextPageParam: (page: GetApiCoursesByCourseIdRealmShopResponse) =>
      page.nextCursor ?? undefined,
  };
}
export function useLoadoutQuery(courseId: string) {
  return useQuery(loadoutOptions(useApiClient(), courseId));
}
export function useEquipmentInventoryQuery(courseId: string, query: EquipmentFilters) {
  return useInfiniteQuery(inventoryOptions(useApiClient(), courseId, query));
}
export function useEquipmentShopQuery(courseId: string, query: EquipmentShopFilters) {
  return useInfiniteQuery(equipmentShopOptions(useApiClient(), courseId, query));
}

/** Medals, level, XP and gear, all owned inside one course. */
export function useRealmQuery(courseId: string) {
  return useQuery(
    getApiCoursesByCourseIdRealmOptions({ client: useApiClient(), path: { courseId } }),
  );
}
