import { createFileRoute } from "@tanstack/react-router";
import { lessonOptions } from "../api/course/use-navigation-queries.ts";
import { LessonScreen } from "../course/lesson-screen.tsx";

export const Route = createFileRoute("/_app/courses/$courseId/lessons/$itemId")({
  loader: async ({ context, params }) => {
    try {
      await context.queryClient.ensureQueryData(
        lessonOptions(context.apiClient, params.courseId, params.itemId),
      );
    } catch {
      /* The reader shows a retry without hiding its exit. */
    }
  },
  component: () => (
    <LessonScreen courseId={Route.useParams().courseId} itemId={Route.useParams().itemId} />
  ),
});
