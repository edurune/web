import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import {
  getApiDailyRewardOptions,
  postApiDailyRewardClaimMutation,
} from "../generated/@tanstack/react-query.gen.ts";
import { useRewardInvalidation } from "../use-reward-invalidation.ts";

export function useClaimDailyRewardMutation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const invalidateRewards = useRewardInvalidation();
  return useMutation({
    ...postApiDailyRewardClaimMutation({ client }),
    onSuccess: (data) => {
      queryClient.setQueryData(getApiDailyRewardOptions({ client }).queryKey, data.dailyReward);
      void invalidateRewards(data.wallet);
    },
    onError: (error) => {
      if (error.code === "daily_reward_day_changed")
        void queryClient.invalidateQueries({
          queryKey: getApiDailyRewardOptions({ client }).queryKey,
        });
    },
  });
}
