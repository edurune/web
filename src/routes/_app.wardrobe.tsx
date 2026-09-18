import { createFileRoute } from "@tanstack/react-router";
import {
  getApiCharacterProfileOptions,
  getApiWalletOptions,
} from "../api/generated/@tanstack/react-query.gen.ts";
import { wardrobeOptions } from "../api/character/use-cosmetic-queries.ts";
import { wardrobeSearch } from "../character/cosmetics.ts";
import { WardrobeScreen } from "../character/wardrobe-screen.tsx";

export const Route = createFileRoute("/_app/wardrobe")({
  validateSearch: wardrobeSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    Promise.allSettled([
      context.queryClient.ensureQueryData(
        getApiCharacterProfileOptions({ client: context.apiClient }),
      ),
      context.queryClient.ensureQueryData(getApiWalletOptions({ client: context.apiClient })),
      context.queryClient.ensureInfiniteQueryData(
        wardrobeOptions(context.apiClient, { ...deps, limit: 20 }),
      ),
    ]),
  component: () => <WardrobeScreen search={Route.useSearch()} />,
});
