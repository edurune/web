import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import { invalidateQueries } from "../query.ts";
import {
  putApiCoursesByCourseIdLessonsByItemIdCompletionMutation,
  getApiCoursesOptions,
  getApiCoursesByCourseIdOptions,
  getApiCoursesByCourseIdNavigationOptions,
  getApiCoursesByCourseIdUnitsOptions,
  getApiCoursesByCourseIdLessonsByItemIdOptions,
  getApiCoursesByCourseIdMapOptions,
  getApiCoursesByCourseIdRealmOptions,
  getApiCoursesByCourseIdRealmLoadoutOptions,
  getApiCoursesByCourseIdRealmShopOptions,
  getApiWalletOptions,
  getApiMissionsOptions,
  getApiMissionsCurrentOptions,
  getApiMilestonesOptions,
  getApiMilestonesProgressOptions,
  getApiMeSummaryOptions,
  getApiCharacterShopOptions,
} from "../generated/@tanstack/react-query.gen.ts";
import { invalidateUnitMaps } from "./use-navigation-queries.ts";

export function useCompleteLessonMutation(courseId: string) {
  const invalidateProgress = useCourseProgressInvalidation(courseId);
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    ...putApiCoursesByCourseIdLessonsByItemIdCompletionMutation({ client }),
    onSettled: (_data, _error, variables) =>
      Promise.all([
        invalidateProgress(),
        queryClient.invalidateQueries({
          queryKey: getApiCoursesByCourseIdLessonsByItemIdOptions({
            client,
            path: variables.path,
          }).queryKey,
        }),
      ]),
  });
}

/** Lesson completion and battle settlement affect the same course and wallet observers. */
export function useCourseProgressInvalidation(courseId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const options = { client, path: { courseId } };
  return () =>
    Promise.all([
      invalidateQueries(queryClient, [
        getApiCoursesOptions({ client }),
        getApiCoursesByCourseIdOptions(options),
        getApiCoursesByCourseIdNavigationOptions(options),
        getApiCoursesByCourseIdUnitsOptions(options),
        getApiCoursesByCourseIdMapOptions(options),
        getApiCoursesByCourseIdRealmOptions(options),
        getApiCoursesByCourseIdRealmLoadoutOptions(options),
        getApiCoursesByCourseIdRealmShopOptions(options),
        getApiWalletOptions({ client }),
        getApiMissionsOptions({ client }),
        getApiMissionsCurrentOptions({ client }),
        getApiMilestonesOptions({ client }),
        getApiMilestonesProgressOptions({ client }),
        getApiMeSummaryOptions({ client }),
        getApiCharacterShopOptions({ client }),
      ]),
      invalidateUnitMaps(queryClient, client, courseId),
    ]);
}
