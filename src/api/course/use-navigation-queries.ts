import { useInfiniteQuery, useQuery, type QueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import type { ApiClient } from "../client.ts";
import {
  getApiCoursesByCourseIdNavigationOptions,
  getApiCoursesByCourseIdUnitsInfiniteOptions,
  getApiCoursesByCourseIdUnitsByUnitIdMapInfiniteOptions,
  getApiCoursesByCourseIdUnitsByUnitIdMapOptions,
  getApiCoursesByCourseIdLessonsByItemIdOptions,
} from "../generated/@tanstack/react-query.gen.ts";
import type {
  GetApiCoursesByCourseIdUnitsResponse,
  GetApiCoursesByCourseIdUnitsByUnitIdMapResponse,
} from "../generated/types.gen.ts";

export const navigationOptions = (client: ApiClient, courseId: string) =>
  getApiCoursesByCourseIdNavigationOptions({ client, path: { courseId } });
export function unitsOptions(client: ApiClient, courseId: string) {
  return {
    ...getApiCoursesByCourseIdUnitsInfiniteOptions({
      client,
      path: { courseId },
      query: { limit: 20 },
    }),
    initialPageParam: { path: { courseId } },
    getNextPageParam: (page: GetApiCoursesByCourseIdUnitsResponse) => page.nextCursor ?? undefined,
  };
}
export function unitMapOptions(client: ApiClient, courseId: string, unitId: string) {
  return {
    ...getApiCoursesByCourseIdUnitsByUnitIdMapInfiniteOptions({
      client,
      path: { courseId, unitId },
      query: { limit: 20 },
    }),
    initialPageParam: { path: { courseId, unitId } },
    getNextPageParam: (page: GetApiCoursesByCourseIdUnitsByUnitIdMapResponse) =>
      page.nextCursor ?? undefined,
  };
}
export function useCourseNavigationQuery(courseId: string) {
  return useQuery(navigationOptions(useApiClient(), courseId));
}
export function useUnitsQuery(courseId: string) {
  return useInfiniteQuery(unitsOptions(useApiClient(), courseId));
}
export function useUnitMapQuery(courseId: string, unitId: string, enabled = true) {
  return useInfiniteQuery({ ...unitMapOptions(useApiClient(), courseId, unitId), enabled });
}
export function invalidateUnitMaps(queryClient: QueryClient, client: ApiClient, courseId: string) {
  const mapKey = getApiCoursesByCourseIdUnitsByUnitIdMapOptions({
    client,
    path: { courseId, unitId: "" },
  }).queryKey;
  return queryClient.invalidateQueries({
    predicate: (query) => {
      const key = query.queryKey[0] as { _id?: string; path?: { courseId?: string } } | undefined;
      // Match the generated endpoint identity across this course's unit pages.
      // eslint-disable-next-line no-underscore-dangle
      return key?._id === mapKey[0]._id && key.path?.courseId === courseId;
    },
  });
}
export const lessonOptions = (client: ApiClient, courseId: string, itemId: string) =>
  getApiCoursesByCourseIdLessonsByItemIdOptions({ client, path: { courseId, itemId } });
export function useLessonQuery(courseId: string, itemId: string) {
  return useQuery(lessonOptions(useApiClient(), courseId, itemId));
}
