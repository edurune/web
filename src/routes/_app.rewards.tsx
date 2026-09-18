import { createFileRoute } from "@tanstack/react-router";
import {
  getApiDailyRewardOptions,
  getApiWalletOptions,
} from "../api/generated/@tanstack/react-query.gen.ts";
import { RewardsScreen } from "../reward/rewards-screen.tsx";
import { milestonesOptions } from "../api/objective/use-objective-queries.ts";

export const Route = createFileRoute("/_app/rewards")({
  loader: ({ context }) =>
    Promise.allSettled([
      context.queryClient.ensureInfiniteQueryData(milestonesOptions(context.apiClient)),
      context.queryClient.ensureQueryData(getApiDailyRewardOptions({ client: context.apiClient })),
      context.queryClient.ensureQueryData(getApiWalletOptions({ client: context.apiClient })),
    ]),
  component: RewardsScreen,
});
