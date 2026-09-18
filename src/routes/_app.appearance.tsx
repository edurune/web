import { createFileRoute } from "@tanstack/react-router";
import {
  getApiCharacterAppearanceOptionsOptions,
  getApiCharacterProfileOptions,
} from "../api/generated/@tanstack/react-query.gen.ts";
import { AppearanceScreen } from "../character/appearance-screen.tsx";

export const Route = createFileRoute("/_app/appearance")({
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(
        getApiCharacterProfileOptions({ client: context.apiClient }),
      ),
      context.queryClient.ensureQueryData(
        getApiCharacterAppearanceOptionsOptions({ client: context.apiClient }),
      ),
    ]),
  component: AppearanceScreen,
});
