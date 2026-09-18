import { createFileRoute } from "@tanstack/react-router";
import { ProfileScreen } from "../user/profile-screen.tsx";
import {
  getApiCharacterProfileOptions,
  getApiWalletOptions,
  getApiMeSummaryOptions,
} from "../api/generated/@tanstack/react-query.gen.ts";
export const Route = createFileRoute("/_app/me")({
  loader: ({ context }) =>
    Promise.allSettled([
      context.queryClient.ensureQueryData(
        getApiCharacterProfileOptions({ client: context.apiClient }),
      ),
      context.queryClient.ensureQueryData(getApiWalletOptions({ client: context.apiClient })),
      context.queryClient.ensureQueryData(getApiMeSummaryOptions({ client: context.apiClient })),
    ]),
  component: ProfileScreen,
});
