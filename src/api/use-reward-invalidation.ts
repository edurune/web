import { useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "./api-context.ts";
import {
  getApiCharacterOptions,
  getApiCharacterShopOptions,
  getApiWalletOptions,
} from "./generated/@tanstack/react-query.gen.ts";
import type { WalletView } from "./generated/types.gen.ts";
import { invalidateQueries } from "./query.ts";

/** Claims can change purchasing power and newly affordable character items. */
export function useRewardInvalidation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return (wallet?: WalletView) => {
    if (wallet) queryClient.setQueryData(getApiWalletOptions({ client }).queryKey, wallet);
    return invalidateQueries(queryClient, [
      ...(wallet ? [] : [getApiWalletOptions({ client })]),
      getApiCharacterOptions({ client }),
      getApiCharacterShopOptions({ client }),
    ]);
  };
}
