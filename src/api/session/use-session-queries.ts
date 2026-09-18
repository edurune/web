import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import type { Client } from "../generated/client/index.ts";
import { getApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdOptions } from "../generated/@tanstack/react-query.gen.ts";

export interface SessionPath {
  courseId: string;
  itemId: string;
  sessionId: string;
}

export const sessionOptions = (client: Client, path: SessionPath) => ({
  ...getApiCoursesByCourseIdPracticesByItemIdSessionsBySessionIdOptions({ client, path }),
  staleTime: 0,
  refetchOnWindowFocus: true,
});

export function useSessionQuery(path: SessionPath) {
  return useQuery(sessionOptions(useApiClient(), path));
}
