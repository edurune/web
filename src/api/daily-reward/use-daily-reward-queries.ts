import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import { getApiDailyRewardOptions } from "../generated/@tanstack/react-query.gen.ts";

export function useDailyRewardQuery() {
  return useQuery({
    ...getApiDailyRewardOptions({ client: useApiClient() }),
    refetchInterval: (query) => {
      const reset = query.state.data?.resetsAt;
      return reset ? Math.max(1000, Date.parse(reset) - Date.now()) : false;
    },
  });
}
