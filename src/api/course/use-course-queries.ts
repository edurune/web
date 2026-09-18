import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { GetApiCoursesData, GetApiCoursesResponse } from "../generated/types.gen.ts";
import type { ApiClient } from "../client.ts";
import { useApiClient } from "../api-context.ts";
import {
  getApiCoursesByCourseIdMapOptions,
  getApiCoursesByCourseIdOptions,
  getApiCoursesOptions,
  getApiCoursesInfiniteOptions,
} from "../generated/@tanstack/react-query.gen.ts";

export type CourseFilters = Omit<NonNullable<GetApiCoursesData["query"]>, "cursor">;

export function coursesInfiniteOptions(client: ApiClient, query: CourseFilters = {}) {
  return {
    ...getApiCoursesInfiniteOptions({ client, query }),
    initialPageParam: {},
    getNextPageParam: (page: GetApiCoursesResponse) => page.nextCursor ?? undefined,
  };
}

export function useCoursesInfiniteQuery(query: CourseFilters = {}) {
  return useInfiniteQuery(coursesInfiniteOptions(useApiClient(), query));
}

export function useCoursesQuery(query: GetApiCoursesData["query"] = {}) {
  return useQuery(getApiCoursesOptions({ client: useApiClient(), query }));
}

export function useCourseQuery(courseId: string) {
  return useQuery(getApiCoursesByCourseIdOptions({ client: useApiClient(), path: { courseId } }));
}

/** Node coordinates and cubic segments, generated once per course from its seed. */
export function useCourseMapQuery(courseId: string) {
  return useQuery(
    getApiCoursesByCourseIdMapOptions({ client: useApiClient(), path: { courseId } }),
  );
}
