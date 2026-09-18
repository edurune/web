import { createFileRoute } from "@tanstack/react-router";
import {
  getApiCharacterProfileOptions,
  getApiWalletOptions,
} from "../api/generated/@tanstack/react-query.gen.ts";
import { cosmeticShopOptions } from "../api/character/use-cosmetic-queries.ts";
import { cosmeticShopSearch } from "../character/cosmetics.ts";
import { CosmeticShopScreen } from "../character/cosmetic-shop-screen.tsx";

export const Route = createFileRoute("/_app/shop")({
  validateSearch: cosmeticShopSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) =>
    Promise.allSettled([
      context.queryClient.ensureQueryData(
        getApiCharacterProfileOptions({ client: context.apiClient }),
      ),
      context.queryClient.ensureQueryData(getApiWalletOptions({ client: context.apiClient })),
      context.queryClient.ensureInfiniteQueryData(
        cosmeticShopOptions(context.apiClient, { ...deps, limit: 20 }),
      ),
    ]),
  component: () => <CosmeticShopScreen search={Route.useSearch()} />,
});
