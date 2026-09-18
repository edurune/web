import { createFileRoute } from "@tanstack/react-router";
import { sessionOptions } from "../api/session/use-session-queries.ts";
import { getApiCharacterOptions } from "../api/generated/@tanstack/react-query.gen.ts";
import { PracticeScreen } from "../practice/practice-screen.tsx";

export const Route = createFileRoute(
  "/_app/courses/$courseId/practices/$itemId/sessions/$sessionId",
)({
  loader: async ({ context, params }) => {
    await Promise.allSettled([
      context.queryClient.ensureQueryData(sessionOptions(context.apiClient, params)),
      context.queryClient.ensureQueryData(getApiCharacterOptions({ client: context.apiClient })),
    ]);
  },
  component: () => <PracticeScreen key={Route.useParams().sessionId} path={Route.useParams()} />,
});
