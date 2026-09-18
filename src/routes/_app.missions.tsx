import { createFileRoute } from "@tanstack/react-router";
import {
  getApiMissionsCurrentOptions,
  getApiWalletOptions,
} from "../api/generated/@tanstack/react-query.gen.ts";
import { MissionsScreen } from "../objective/missions-screen.tsx";

export const Route = createFileRoute("/_app/missions")({
  loader: ({ context }) =>
    Promise.allSettled([
      context.queryClient.ensureQueryData(
        getApiMissionsCurrentOptions({ client: context.apiClient }),
      ),
      context.queryClient.ensureQueryData(getApiWalletOptions({ client: context.apiClient })),
    ]),
  component: MissionsScreen,
});
