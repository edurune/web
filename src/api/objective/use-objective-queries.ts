import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import type { ApiClient } from "../client.ts";
import { useApiClient } from "../api-context.ts";
import {
  getApiMissionsCurrentOptions,
  getApiMilestonesProgressInfiniteOptions,
} from "../generated/@tanstack/react-query.gen.ts";
import type { GetApiMilestonesProgressResponse } from "../generated/types.gen.ts";

export function milestonesOptions(client: ApiClient) {
  return {
    ...getApiMilestonesProgressInfiniteOptions({ client, query: { limit: 20 } }),
    initialPageParam: {},
    getNextPageParam: (page: GetApiMilestonesProgressResponse) => page.nextCursor ?? undefined,
  };
}
export function useMilestonesQuery() {
  return useInfiniteQuery(milestonesOptions(useApiClient()));
}

export function useCurrentMissionsQuery() {
  return useQuery({
    ...getApiMissionsCurrentOptions({ client: useApiClient() }),
    refetchInterval: (query) => {
      const endsAt = query.state.data?.endsAt;
      return endsAt ? Math.max(1000, Date.parse(endsAt) - Date.now()) : false;
    },
  });
}
