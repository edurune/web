import { createFileRoute } from "@tanstack/react-router";
import { loadoutOptions } from "../api/realm/use-realm-queries.ts";
import { LoadoutScreen } from "../realm/loadout-screen.tsx";
export const Route = createFileRoute("/_app/courses/$courseId/loadout")({
  loader: ({ context, params }) =>
    context.queryClient
      .ensureQueryData(loadoutOptions(context.apiClient, params.courseId))
      .catch(() => undefined),
  component: () => <LoadoutScreen courseId={Route.useParams().courseId} />,
});
