import { useMutation, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import type { ApiClient } from "../client.ts";
import { useCourseProgressInvalidation } from "../course/use-lesson-mutations.ts";
import { invalidateUnitMaps } from "../course/use-navigation-queries.ts";
import {
  getApiCoursesByCourseIdPracticesByItemIdSessionsLatestOptions,
  getApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdOptions,
  postApiCoursesByCourseIdPracticesByItemIdSessionsMutation,
  postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdActionsMutation,
  postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdAnswersMutation,
  postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdAbandonMutation,
  postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdRetryMutation,
} from "../generated/@tanstack/react-query.gen.ts";
import type { SessionResult } from "../generated/types.gen.ts";
import type { SessionPath } from "./use-session-queries.ts";

export function useStartSessionMutation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    ...postApiCoursesByCourseIdPracticesByItemIdSessionsMutation({ client }),
    onSuccess: (data, variables) => {
      writeSession(queryClient, client, { ...variables.path, sessionId: data.id }, data);
    },
    onSettled: (_data, _error, variables) => {
      void invalidateUnitMaps(queryClient, client, variables.path.courseId);
    },
  });
}

function writeSession(
  queryClient: QueryClient,
  client: ApiClient,
  path: SessionPath,
  result: SessionResult,
) {
  queryClient.setQueryData(
    getApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdOptions({ client, path }).queryKey,
    result,
  );
  queryClient.setQueryData(
    getApiCoursesByCourseIdPracticesByItemIdSessionsLatestOptions({
      client,
      path: { courseId: path.courseId, itemId: path.itemId },
    }).queryKey,
    result,
  );
}

function useSessionSettlement(path: SessionPath, progress = false) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const invalidateProgress = useCourseProgressInvalidation(path.courseId);
  return {
    onSuccess: (data: SessionResult) => {
      writeSession(queryClient, client, { ...path, sessionId: data.id }, data);
    },
    onSettled: () => {
      void (progress
        ? invalidateProgress()
        : invalidateUnitMaps(queryClient, client, path.courseId));
    },
  };
}

export function useSelectActionMutation(path: SessionPath) {
  return useMutation({
    ...postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdActionsMutation({
      client: useApiClient(),
    }),
    ...useSessionSettlement(path),
  });
}

export function useSubmitAnswerMutation(path: SessionPath) {
  return useMutation({
    ...postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdAnswersMutation({
      client: useApiClient(),
    }),
    ...useSessionSettlement(path, true),
  });
}

export function useAbandonSessionMutation(path: SessionPath) {
  return useMutation({
    ...postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdAbandonMutation({
      client: useApiClient(),
    }),
    ...useSessionSettlement(path),
  });
}

export function useRetrySessionMutation(path: SessionPath) {
  return useMutation({
    ...postApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdRetryMutation({
      client: useApiClient(),
    }),
    ...useSessionSettlement(path),
  });
}
