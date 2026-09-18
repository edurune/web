import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import { invalidateQueries } from "../query.ts";
import { useRewardInvalidation } from "../use-reward-invalidation.ts";
import {
  getApiMissionsCurrentOptions,
  getApiMissionsOptions,
  getApiMilestonesProgressOptions,
  getApiMilestonesOptions,
  getApiMeSummaryOptions,
  postApiMilestonesByMilestoneIdClaimMutation,
  postApiMissionsByPeriodIdByMissionIdClaimMutation,
} from "../generated/@tanstack/react-query.gen.ts";

export function useClaimMissionMutation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const invalidateRewards = useRewardInvalidation();
  return useMutation({
    ...postApiMissionsByPeriodIdByMissionIdClaimMutation({ client }),
    onSuccess: () =>
      Promise.all([
        invalidateQueries(queryClient, [
          getApiMissionsCurrentOptions({ client }),
          getApiMissionsOptions({ client }),
        ]),
        invalidateRewards(),
      ]),
    onError: () =>
      queryClient.invalidateQueries({
        queryKey: getApiMissionsCurrentOptions({ client }).queryKey,
      }),
  });
}

export function useClaimMilestoneMutation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const invalidateRewards = useRewardInvalidation();
  return useMutation({
    ...postApiMilestonesByMilestoneIdClaimMutation({ client }),
    onSettled: () =>
      Promise.all([
        invalidateQueries(queryClient, [
          getApiMilestonesProgressOptions({ client }),
          getApiMilestonesOptions({ client }),
          getApiMeSummaryOptions({ client }),
        ]),
        invalidateRewards(),
      ]),
  });
}
