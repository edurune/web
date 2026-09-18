import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "../api-context.ts";
import { invalidateQueries } from "../query.ts";
import {
  deleteApiCoursesByCourseIdRealmEquipmentsMutation,
  getApiCoursesByCourseIdRealmOptions,
  postApiCoursesByCourseIdRealmPurchasesMutation,
  putApiCoursesByCourseIdRealmEquipmentsMutation,
  getApiCoursesByCourseIdRealmLoadoutOptions,
  getApiCoursesByCourseIdRealmInventoryOptions,
  getApiCoursesByCourseIdRealmShopOptions,
} from "../generated/@tanstack/react-query.gen.ts";
import type { RealmLoadout } from "../generated/types.gen.ts";

/** Equipment commands answer with the settled loadout; the rest refreshes behind the screen. */
function useRealmSettlement(courseId: string, shop = false) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  const options = { client, path: { courseId } };
  return {
    onSuccess: (data: RealmLoadout) => {
      queryClient.setQueryData(getApiCoursesByCourseIdRealmLoadoutOptions(options).queryKey, data);
    },
    onSettled: () => {
      void invalidateQueries(queryClient, [
        getApiCoursesByCourseIdRealmOptions(options),
        getApiCoursesByCourseIdRealmInventoryOptions(options),
        ...(shop ? [getApiCoursesByCourseIdRealmShopOptions(options)] : []),
      ]);
    },
  };
}

export function useEquipEquipmentMutation(courseId: string) {
  return useMutation({
    ...putApiCoursesByCourseIdRealmEquipmentsMutation({ client: useApiClient() }),
    ...useRealmSettlement(courseId),
  });
}

export function useUnequipEquipmentMutation(courseId: string) {
  return useMutation({
    ...deleteApiCoursesByCourseIdRealmEquipmentsMutation({ client: useApiClient() }),
    ...useRealmSettlement(courseId),
  });
}

export function usePurchaseEquipmentMutation(courseId: string) {
  return useMutation({
    ...postApiCoursesByCourseIdRealmPurchasesMutation({ client: useApiClient() }),
    ...useRealmSettlement(courseId, true),
  });
}
