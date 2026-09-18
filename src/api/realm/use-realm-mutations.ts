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

function useRealmInvalidation(courseId: string) {
  const client = useApiClient();
  const queryClient = useQueryClient();
  return () =>
    invalidateQueries(queryClient, [
      getApiCoursesByCourseIdRealmOptions({ client, path: { courseId } }),
      getApiCoursesByCourseIdRealmLoadoutOptions({ client, path: { courseId } }),
      getApiCoursesByCourseIdRealmInventoryOptions({ client, path: { courseId } }),
      getApiCoursesByCourseIdRealmShopOptions({ client, path: { courseId } }),
    ]);
}

export function useEquipEquipmentMutation(courseId: string) {
  const client = useApiClient();
  return useMutation({
    ...putApiCoursesByCourseIdRealmEquipmentsMutation({ client }),
    onSettled: useRealmInvalidation(courseId),
  });
}

export function useUnequipEquipmentMutation(courseId: string) {
  const client = useApiClient();
  return useMutation({
    ...deleteApiCoursesByCourseIdRealmEquipmentsMutation({ client }),
    onSettled: useRealmInvalidation(courseId),
  });
}

export function usePurchaseEquipmentMutation(courseId: string) {
  const client = useApiClient();
  return useMutation({
    ...postApiCoursesByCourseIdRealmPurchasesMutation({ client }),
    onSettled: useRealmInvalidation(courseId),
  });
}
