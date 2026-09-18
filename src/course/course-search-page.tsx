import type { StyleXStyles } from "@stylexjs/stylex";
import { useCoursesInfiniteQuery } from "../api/course/use-course-queries.ts";
import { useJoinCourseMutation } from "../api/course/use-course-mutations.ts";
import { CourseSearchScreen } from "./course-search-screen.tsx";
import { courseFilters, type CourseSearch } from "./course-search.ts";
import { useNavigate } from "@tanstack/react-router";
import { useMeQuery } from "../api/user/use-user-queries.ts";

export function CourseSearchPage({
  search,
  onSearchChange,
  style,
}: {
  search: CourseSearch;
  onSearchChange: (search: CourseSearch) => void;
  style?: StyleXStyles;
}) {
  const courses = useCoursesInfiniteQuery(courseFilters(search));
  const user = useMeQuery();
  const birthYear = user.data?.birthYear;
  const join = useJoinCourseMutation();
  const navigate = useNavigate();
  const openRealm = (courseId: string) => {
    void navigate({ to: "/courses/$courseId", params: { courseId } });
  };
  const joiningId = join.isPending ? join.variables?.path.courseId : undefined;
  const joinFailedId = join.isError ? join.variables?.path.courseId : undefined;
  return (
    <CourseSearchScreen
      style={style}
      search={search}
      learnerAge={
        birthYear === null || birthYear === undefined
          ? undefined
          : new Date().getFullYear() - birthYear
      }
      courses={courses.data?.pages.flatMap((page) => page.items) ?? []}
      loading={courses.isPending}
      failed={courses.isError && !courses.isFetchNextPageError}
      hasMore={courses.hasNextPage}
      loadingMore={courses.isFetchingNextPage}
      fetching={courses.isFetching}
      moreFailed={courses.isFetchNextPageError}
      joiningId={joiningId}
      joinFailedId={joinFailedId}
      error={courses.error}
      moreError={courses.error}
      joinError={join.error}
      onSearchChange={onSearchChange}
      onJoin={(courseId) =>
        join.mutate(
          { path: { courseId }, body: {} },
          { onSuccess: (enrollment) => openRealm(enrollment.courseId) },
        )
      }
      onOpen={openRealm}
      onLoadMore={() => {
        if (!courses.isFetching) void courses.fetchNextPage({ cancelRefetch: false });
      }}
      onRetry={() => {
        void courses.refetch();
      }}
    />
  );
}
