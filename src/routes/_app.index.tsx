import { createFileRoute } from "@tanstack/react-router";
import { coursesInfiniteOptions } from "../api/course/use-course-queries.ts";
import { HomeScreen } from "../home/home-screen.tsx";
import {
  getApiCharacterProfileOptions,
  getApiWalletOptions,
  getApiDailyRewardOptions,
  getApiMissionsCurrentOptions,
} from "../api/generated/@tanstack/react-query.gen.ts";

export const Route = createFileRoute("/_app/")({
  loader: ({ context }) =>
    Promise.allSettled([
      context.queryClient.ensureInfiniteQueryData(
        coursesInfiniteOptions(context.apiClient, { joined: true, limit: 20 }),
      ),
      context.queryClient.ensureQueryData(
        getApiCharacterProfileOptions({ client: context.apiClient }),
      ),
      context.queryClient.ensureQueryData(getApiWalletOptions({ client: context.apiClient })),
      context.queryClient.ensureQueryData(getApiDailyRewardOptions({ client: context.apiClient })),
      context.queryClient.ensureQueryData(
        getApiMissionsCurrentOptions({ client: context.apiClient }),
      ),
    ]),
  component: HomeScreen,
});
