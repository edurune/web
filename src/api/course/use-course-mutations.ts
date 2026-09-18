import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import { invalidateQueries } from "../query.ts";
import {
  getApiCoursesOptions,
  getApiMeSummaryOptions,
  putApiCoursesByCourseIdEnrollmentMutation,
} from "../generated/@tanstack/react-query.gen.ts";

export function useJoinCourseMutation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return useMutation({
    ...putApiCoursesByCourseIdEnrollmentMutation({ client }),
    onSuccess: () => {
      void invalidateQueries(queryClient, [
        getApiCoursesOptions({ client }),
        getApiMeSummaryOptions({ client }),
      ]);
    },
  });
}
