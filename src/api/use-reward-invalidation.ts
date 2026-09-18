import { useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./api-context.ts";
import {
  getApiCharacterOptions,
  getApiCharacterShopOptions,
  getApiWalletOptions,
} from "./generated/@tanstack/react-query.gen.ts";
import { invalidateQueries } from "./query.ts";

/** Claims can change purchasing power and newly affordable character items. */
export function useRewardInvalidation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return () =>
    invalidateQueries(queryClient, [
      getApiWalletOptions({ client }),
      getApiCharacterOptions({ client }),
      getApiCharacterShopOptions({ client }),
    ]);
}
