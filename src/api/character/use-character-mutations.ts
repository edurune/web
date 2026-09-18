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

function useCharacterInvalidation() {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return () =>
    invalidateQueries(queryClient, [
      getApiCharacterOptions({ client }),
      getApiCharacterProfileOptions({ client }),
      getApiWalletOptions({ client }),
      getApiCharacterWardrobeOptions({ client }),
      getApiCharacterShopOptions({ client }),
      getApiCharacterSummaryOptions({ client }),
      getApiMeSummaryOptions({ client }),
    ]);
}

export function useUpdateAppearanceMutation() {
  const client = useApiClient();
  return useMutation({
    ...putApiCharacterAppearanceMutation({ client }),
    onSuccess: useCharacterInvalidation(),
  });
}

export function useEquipCosmeticMutation() {
  const client = useApiClient();
  return useMutation({
    ...putApiCharacterCosmeticsMutation({ client }),
    onSettled: useCharacterInvalidation(),
  });
}

export function useUnequipCosmeticMutation() {
  const client = useApiClient();
  return useMutation({
    ...deleteApiCharacterCosmeticsMutation({ client }),
    onSettled: useCharacterInvalidation(),
  });
}

export function usePurchaseCosmeticMutation() {
  const client = useApiClient();
  return useMutation({
    ...postApiCharacterPurchasesMutation({ client }),
    onSettled: useCharacterInvalidation(),
  });
}
