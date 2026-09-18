import { createFileRoute } from "@tanstack/react-router";
import {
  navigationOptions,
  unitMapOptions,
  unitsOptions,
} from "../api/course/use-navigation-queries.ts";
import { CourseMapScreen } from "../realm/course-map-screen.tsx";

export const Route = createFileRoute("/_app/courses/$courseId/")({
  validateSearch: (search: Record<string, unknown>): { unit?: string; view?: "path" | "list" } => ({
    ...(typeof search.unit === "string" && search.unit.length > 0 && search.unit.length <= 128
      ? { unit: search.unit }
      : {}),
    ...(search.view === "list" ? { view: "list" } : {}),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, params, deps }) => {
    try {
      const course = await context.queryClient.ensureQueryData(
        navigationOptions(context.apiClient, params.courseId),
      );
      const unit = deps.unit ?? course.currentUnitId;
      await context.queryClient.ensureInfiniteQueryData(
        unitsOptions(context.apiClient, params.courseId),
      );
      if (unit)
        await context.queryClient.ensureInfiniteQueryData(
          unitMapOptions(context.apiClient, params.courseId, unit),
        );
    } catch {
      /* The map keeps navigation available while displaying a retry. */
    }
  },
  component: () => (
    <CourseMapScreen
      courseId={Route.useParams().courseId}
      unitId={Route.useSearch().unit}
      view={Route.useSearch().view}
    />
  ),
});
