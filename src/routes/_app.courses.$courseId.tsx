import { createFileRoute } from "@tanstack/react-router";
import { navigationOptions } from "../api/course/use-navigation-queries.ts";
import { loadoutOptions } from "../api/realm/use-realm-queries.ts";
import { RealmShell } from "../realm/realm-shell.tsx";

export const Route = createFileRoute("/_app/courses/$courseId")({
  loader: ({ context, params }) =>
    Promise.allSettled([
      context.queryClient.ensureQueryData(navigationOptions(context.apiClient, params.courseId)),
      context.queryClient.ensureQueryData(loadoutOptions(context.apiClient, params.courseId)),
    ]),
  component: () => <RealmShell courseId={Route.useParams().courseId} />,
});
