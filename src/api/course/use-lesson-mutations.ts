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
import type { CourseView, RealmView, WalletView } from "../generated/types.gen.ts";
import { invalidateUnitMaps } from "./use-navigation-queries.ts";

export function useCompleteLessonMutation(courseId: string) {
  const invalidateProgress = useCourseProgressInvalidation(courseId);
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    ...putApiCoursesByCourseIdLessonsByItemIdCompletionMutation({ client }),
    onSettled: (data, _error, variables) => {
      void invalidateProgress(data);
      void queryClient.invalidateQueries({
        queryKey: getApiCoursesByCourseIdLessonsByItemIdOptions({
          client,
          path: variables.path,
        }).queryKey,
      });
    },
  });
}

export interface SettledProgress {
  course: CourseView;
  realm: RealmView;
  wallet: WalletView;
}

/** Lesson completion and battle settlement affect the same course and wallet observers. */
export function useCourseProgressInvalidation(courseId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const options = { client, path: { courseId } };
  return (settled?: SettledProgress) => {
    if (settled) {
      queryClient.setQueryData(getApiCoursesByCourseIdOptions(options).queryKey, settled.course);
      queryClient.setQueryData(
        getApiCoursesByCourseIdRealmOptions(options).queryKey,
        settled.realm,
      );
      queryClient.setQueryData(getApiWalletOptions({ client }).queryKey, settled.wallet);
    }
    return Promise.all([
      invalidateQueries(queryClient, [
        getApiCoursesOptions({ client }),
        getApiCoursesByCourseIdNavigationOptions(options),
        getApiCoursesByCourseIdUnitsOptions(options),
        getApiCoursesByCourseIdMapOptions(options),
        getApiCoursesByCourseIdRealmLoadoutOptions(options),
        getApiCoursesByCourseIdRealmShopOptions(options),
        getApiMissionsOptions({ client }),
        getApiMissionsCurrentOptions({ client }),
        getApiMilestonesOptions({ client }),
        getApiMilestonesProgressOptions({ client }),
        getApiMeSummaryOptions({ client }),
        getApiCharacterShopOptions({ client }),
        ...(settled
          ? []
          : [
              getApiCoursesByCourseIdOptions(options),
              getApiCoursesByCourseIdRealmOptions(options),
              getApiWalletOptions({ client }),
            ]),
      ]),
      invalidateUnitMaps(queryClient, client, courseId),
    ]);
  };
}
