import { createFileRoute } from "@tanstack/react-router";
import { equipmentShopOptions, loadoutOptions } from "../api/realm/use-realm-queries.ts";
import { equipmentShopSearch } from "../realm/equipment.ts";
import { EquipmentShopScreen } from "../realm/equipment-shop-screen.tsx";
export const Route = createFileRoute("/_app/courses/$courseId/shop")({
  validateSearch: equipmentShopSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, params, deps }) =>
    Promise.all([
      context.queryClient
        .ensureInfiniteQueryData(equipmentShopOptions(context.apiClient, params.courseId, deps))
        .catch(() => undefined),
      context.queryClient
        .ensureQueryData(loadoutOptions(context.apiClient, params.courseId))
        .catch(() => undefined),
    ]),
  component: () => (
    <EquipmentShopScreen courseId={Route.useParams().courseId} search={Route.useSearch()} />
  ),
});
