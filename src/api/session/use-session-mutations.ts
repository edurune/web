import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import { useCourseProgressInvalidation } from "../course/use-lesson-mutations.ts";
import { invalidateUnitMaps } from "../course/use-navigation-queries.ts";
import { invalidateQueries } from "../query.ts";
import {
  getApiCoursesByCourseIdPracticesByItemIdSessionsLatestOptions,
  getApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdOptions,
  postApiCoursesByCourseIdPracticesByItemIdSessionsMutation,
  postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdActionsMutation,
  postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdAnswersMutation,
  postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdAbandonMutation,
  postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdRetryMutation,
} from "../generated/@tanstack/react-query.gen.ts";
import type { SessionPath } from "./use-session-queries.ts";

export function useStartSessionMutation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    ...postApiCoursesByCourseIdPracticesByItemIdSessionsMutation({ client }),
    onSettled: (_data, _error, variables) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: getApiCoursesByCourseIdPracticesByItemIdSessionsLatestOptions({
            client,
            path: variables.path,
          }).queryKey,
        }),
        invalidateUnitMaps(queryClient, client, variables.path.courseId),
      ]),
  });
}

function useSessionInvalidation(path: SessionPath, progress = false) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const invalidateProgress = useCourseProgressInvalidation(path.courseId);
  return () =>
    Promise.all([
      invalidateQueries(queryClient, [
        getApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdOptions({ client, path }),
        getApiCoursesByCourseIdPracticesByItemIdSessionsLatestOptions({
          client,
          path: { courseId: path.courseId, itemId: path.itemId },
        }),
      ]),
      progress ? invalidateProgress() : invalidateUnitMaps(queryClient, client, path.courseId),
    ]);
}

export function useSelectActionMutation(path: SessionPath) {
  return useMutation({
    ...postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdActionsMutation({
      client: useApiClient(),
    }),
    onSettled: useSessionInvalidation(path),
  });
}

export function useSubmitAnswerMutation(path: SessionPath) {
  return useMutation({
    ...postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdAnswersMutation({
      client: useApiClient(),
    }),
    onSettled: useSessionInvalidation(path, true),
  });
}

export function useAbandonSessionMutation(path: SessionPath) {
  return useMutation({
    ...postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdAbandonMutation({
      client: useApiClient(),
    }),
    onSettled: useSessionInvalidation(path),
  });
}

export function useRetrySessionMutation(path: SessionPath) {
  return useMutation({
    ...postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdRetryMutation({
      client: useApiClient(),
    }),
    onSettled: useSessionInvalidation(path),
  });
}
