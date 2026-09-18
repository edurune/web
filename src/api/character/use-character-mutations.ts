import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import { invalidateQueries } from "../query.ts";
import {
  deleteApiCharacterCosmeticsMutation,
  getApiCharacterOptions,
  getApiCharacterProfileOptions,
  getApiWalletOptions,
  getApiCharacterWardrobeOptions,
  getApiCharacterShopOptions,
  getApiCharacterSummaryOptions,
  getApiMeSummaryOptions,
  postApiCharacterPurchasesMutation,
  putApiCharacterCosmeticsMutation,
  putApiCharacterAppearanceMutation,
} from "../generated/@tanstack/react-query.gen.ts";
import type { CharacterProfile, WalletView } from "../generated/types.gen.ts";

/** Wardrobe commands answer with the settled profile and wallet; the rest refreshes behind them. */
function useCharacterSettlement() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return {
    onSuccess: (data: { profile: CharacterProfile; wallet: WalletView }) => {
      queryClient.setQueryData(getApiCharacterProfileOptions({ client }).queryKey, data.profile);
      queryClient.setQueryData(getApiWalletOptions({ client }).queryKey, data.wallet);
    },
    onSettled: () => {
      void invalidateQueries(queryClient, [
        getApiCharacterOptions({ client }),
        getApiCharacterWardrobeOptions({ client }),
        getApiCharacterShopOptions({ client }),
        getApiCharacterSummaryOptions({ client }),
        getApiMeSummaryOptions({ client }),
      ]);
    },
  };
}

export function useUpdateAppearanceMutation() {
  return useMutation({
    ...putApiCharacterAppearanceMutation({ client: useApiClient() }),
    ...useCharacterSettlement(),
  });
}

export function useEquipCosmeticMutation() {
  return useMutation({
    ...putApiCharacterCosmeticsMutation({ client: useApiClient() }),
    ...useCharacterSettlement(),
  });
}

export function useUnequipCosmeticMutation() {
  return useMutation({
    ...deleteApiCharacterCosmeticsMutation({ client: useApiClient() }),
    ...useCharacterSettlement(),
  });
}

export function usePurchaseCosmeticMutation() {
  return useMutation({
    ...postApiCharacterPurchasesMutation({ client: useApiClient() }),
    ...useCharacterSettlement(),
  });
}
