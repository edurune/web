import { createFileRoute, useRouter } from "@tanstack/react-router";
import { coursesInfiniteOptions } from "../api/course/use-course-queries.ts";
import { CourseSearchPage } from "../course/course-search-page.tsx";
import { CourseSearchScreen } from "../course/course-search-screen.tsx";
import { courseFilters, parseCourseSearch } from "../course/course-search.ts";

export const Route = createFileRoute("/_app/search")({
  validateSearch: parseCourseSearch,
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    // The screen keeps filters usable and offers retry when discovery is unavailable.
    await context.queryClient
      .ensureInfiniteQueryData(coursesInfiniteOptions(context.apiClient, courseFilters(deps)))
      .catch(() => undefined);
  },
  pendingComponent: PendingCourses,
  errorComponent: UnavailableCourses,
  component: Courses,
});

function PendingCourses() {
  return (
    <CourseSearchScreen
      courses={[]}
      search={{}}
      ready={false}
      loading
      onSearchChange={() => {}}
      onJoin={() => {}}
      onOpen={() => {}}
      onLoadMore={() => {}}
      onRetry={() => {}}
    />
  );
}

function UnavailableCourses() {
  const router = useRouter();
  return (
    <CourseSearchScreen
      courses={[]}
      search={{}}
      ready={false}
      failed
      onSearchChange={() => {}}
      onJoin={() => {}}
      onOpen={() => {}}
      onLoadMore={() => {}}
      onRetry={() => {
        void router.invalidate();
      }}
    />
  );
}

function Courses() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <CourseSearchPage
      search={search}
      onSearchChange={(next) => {
        void navigate({ search: next, resetScroll: false });
      }}
    />
  );
}
