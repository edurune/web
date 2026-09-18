import { Trans, useLingui } from "@lingui/react/macro";
import { BookOpenIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { useState } from "react";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { LoadMoreButton } from "../ui/primitives/load-more-button.tsx";
import { errorMessage } from "../api/error-messages.ts";
import { Alert } from "../ui/primitives/alert.tsx";
import { Button } from "../ui/primitives/button.tsx";
import { EmptyState } from "../ui/primitives/empty-state.tsx";
import { Field } from "../ui/primitives/field.tsx";
import { Select } from "../ui/primitives/select.tsx";
import { Skeleton } from "../ui/primitives/skeleton.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { borderWidth } from "../ui/tokens/border.stylex.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { CourseCard } from "./course-card.tsx";
import {
  courseAgeBands,
  courseLanguages,
  courseSorts,
  courseSubjects,
  subjectLabels,
  type CourseSearch,
  type CourseSummary,
} from "./course-search.ts";
import { courseLanguageName } from "./course-metadata.tsx";
import { CourseSearchField } from "./course-search-field.tsx";
import { CourseSpotlight } from "./course-spotlight.tsx";

export interface CourseSearchScreenProps {
  courses: CourseSummary[];
  search: CourseSearch;
  learnerAge?: number;
  /** Search becomes available once an account or guest session is established. */
  ready?: boolean;
  loading?: boolean;
  failed?: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
  fetching?: boolean;
  moreFailed?: boolean;
  joiningId?: string;
  joinFailedId?: string;
  error?: unknown;
  moreError?: unknown;
  joinError?: unknown;
  onSearchChange: (search: CourseSearch) => void;
  onJoin: (courseId: string) => void;
  onOpen: (courseId: string) => void;
  onLoadMore: () => void;
  onRetry: () => void;
  style?: StyleXStyles;
}

const styles = stylex.create({
  page: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    minBlockSize: space.none,
    minInlineSize: space.none,
    inlineSize: layout.full,
    backgroundColor: color.surfacePage,
  },
  header: {
    flexShrink: 0,
    minInlineSize: space.none,
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    paddingBlockStart: space.lg,
    paddingBlockEnd: space.sm,
    backgroundColor: color.surfaceRaised,
    borderBlockEndStyle: "solid",
    borderBlockEndWidth: borderWidth.thick,
    borderBlockEndColor: color.borderStrong,
  },
  headerContent: { paddingInline: space.lg },
  filters: { display: "flex", gap: space.sm, paddingBlock: space.xs, paddingInline: space.lg },
  filterControls: {
    display: "flex",
    gap: space.sm,
    paddingBlock: space.sm,
    paddingInline: space.lg,
  },
  filterField: { minInlineSize: "10rem", flexShrink: 0 },
  filter: {
    flexShrink: 0,
    backgroundColor: {
      default: color.surfaceRaised,
      ':is([aria-pressed="true"])': color.accentFill,
    },
    color: color.textPrimary,
  },
  results: { flex: 1, minBlockSize: space.none },
  main: { display: "flex", flexDirection: "column", gap: space.lg, padding: space.lg },
  list: {
    listStyleType: "none",
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    padding: space.none,
    margin: space.none,
  },
  empty: { marginBlock: space.lg, padding: space.lg },
});

function SearchForm({
  query,
  disabled,
  onSearch,
}: {
  query: string;
  disabled: boolean;
  onSearch: (q: string) => void;
}) {
  const [draft, setDraft] = useState(query);
  return (
    <CourseSearchField value={draft} onChange={setDraft} onSubmit={onSearch} disabled={disabled} />
  );
}

export function CourseSearchScreen({
  courses,
  search,
  learnerAge,
  ready = true,
  loading,
  failed,
  hasMore,
  loadingMore,
  fetching,
  moreFailed,
  joiningId,
  joinFailedId,
  error,
  moreError,
  joinError,
  onSearchChange,
  onJoin,
  onOpen,
  onLoadMore,
  onRetry,
  style,
}: CourseSearchScreenProps) {
  const { t, i18n } = useLingui();
  const filtered = Boolean(
    search.q ||
    search.subject ||
    search.language ||
    search.minimumAge !== undefined ||
    search.maximumAge !== undefined,
  );
  const q = search.q;
  const ageBand = courseAgeBands.find(
    (band) => band.minimumAge === search.minimumAge && band.maximumAge === search.maximumAge,
  );
  const ageFilterValue =
    learnerAge !== undefined && search.minimumAge === learnerAge && search.maximumAge === learnerAge
      ? "learner"
      : (ageBand?.value ?? "all");
  const ageOptions = courseAgeBands.map(({ value, minimumAge, maximumAge }) => ({
    value,
    label: maximumAge === 120 ? t`Ages ${minimumAge}+` : t`Ages ${minimumAge}–${maximumAge}`,
  }));
  const empty = !loading && !failed && courses.length === 0;
  const spotlight = !filtered ? courses[0] : undefined;
  const rows = spotlight ? courses.slice(1) : courses;
  return (
    <div {...stylex.props(styles.page, style)}>
      <header {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.headerContent)}>
          <SearchForm
            key={q ?? ""}
            query={q ?? ""}
            disabled={!ready}
            onSearch={(value) => onSearchChange({ ...search, q: value.trim() || undefined })}
          />
        </div>
        <ScrollArea
          orientation="horizontal"
          indicator="fade"
          label={t`Subject`}
          contentStyle={styles.filters}
        >
          <Button
            variant="secondary"
            cue="select"
            disabled={!ready}
            aria-pressed={!search.subject}
            onClick={() => onSearchChange({ ...search, subject: undefined })}
            style={styles.filter}
          >
            <Trans>All</Trans>
          </Button>
          {courseSubjects.map((subject) => (
            <Button
              key={subject}
              variant="secondary"
              cue="select"
              disabled={!ready}
              aria-pressed={search.subject === subject}
              onClick={() => onSearchChange({ ...search, subject })}
              style={styles.filter}
            >
              {t(subjectLabels[subject])}
            </Button>
          ))}
        </ScrollArea>
        <ScrollArea
          orientation="horizontal"
          indicator="fade"
          label={t`Course filters`}
          contentStyle={styles.filterControls}
        >
          <Field label={t`Language`} disabled={!ready} style={styles.filterField}>
            <Select
              value={search.language ?? "all"}
              options={[
                { value: "all", label: t`All languages` },
                ...courseLanguages.map((language) => ({
                  value: language,
                  label: courseLanguageName(language, i18n.locale),
                })),
              ]}
              disabled={!ready}
              onValueChange={(value) =>
                onSearchChange({
                  ...search,
                  language:
                    typeof value === "string" && value !== "all"
                      ? courseLanguages.find((language) => language === value)
                      : undefined,
                })
              }
            />
          </Field>
          <Field label={t`Age`} disabled={!ready} style={styles.filterField}>
            <Select
              value={ageFilterValue}
              options={[
                { value: "all", label: t`All ages` },
                ...(learnerAge === undefined
                  ? []
                  : [{ value: "learner", label: t`My age (${learnerAge})` }]),
                ...ageOptions,
              ]}
              disabled={!ready}
              onValueChange={(value) => {
                const band = courseAgeBands.find((candidate) => candidate.value === value);
                const personalAge = value === "learner" ? learnerAge : undefined;
                onSearchChange({
                  ...search,
                  minimumAge: personalAge ?? band?.minimumAge,
                  maximumAge: personalAge ?? band?.maximumAge,
                });
              }}
            />
          </Field>
          <Field label={t`Sort`} disabled={!ready} style={styles.filterField}>
            <Select
              value={search.sort ?? "recommended"}
              options={[
                { value: "recommended", label: t`Recommended` },
                { value: "title_asc", label: t`Name: A to Z` },
                { value: "title_desc", label: t`Name: Z to A` },
              ]}
              disabled={!ready}
              onValueChange={(value) =>
                onSearchChange({
                  ...search,
                  sort:
                    typeof value === "string"
                      ? courseSorts.find((sort) => sort === value)
                      : undefined,
                })
              }
            />
          </Field>
        </ScrollArea>
      </header>
      <ScrollArea label={t`Courses`} indicator="none" style={styles.results}>
        <main
          aria-label={t`Courses`}
          aria-busy={loading || loadingMore}
          {...stylex.props(styles.main)}
        >
          {q && (
            <Text tone="secondary">
              <Trans>Results for “{q}”</Trans>
            </Text>
          )}
          {loading && (
            <Stack gap="md">
              <Text tone="secondary">
                <Trans>Loading courses…</Trans>
              </Text>
              <Skeleton height={layout.courseLandscape} corner="xl" />
              <Skeleton height={layout.cardSkeleton} corner="lg" />
              <Skeleton height={layout.cardSkeleton} corner="lg" />
            </Stack>
          )}
          {failed && (
            <Alert
              tone="negative"
              title={t`Couldn’t load courses`}
              action={
                <Button variant="secondary" cue="retry" onClick={onRetry}>
                  <Trans>Try again</Trans>
                </Button>
              }
            >
              {t(errorMessage(error))}
            </Alert>
          )}
          {empty && (
            <EmptyState
              icon={filtered ? MagnifyingGlassIcon : BookOpenIcon}
              title={filtered ? t`No courses found` : t`No courses yet`}
              description={
                filtered
                  ? t`Try another search or subject.`
                  : t`Check back soon for something new to learn.`
              }
              action={
                filtered ? (
                  <Button variant="secondary" cue="undo" onClick={() => onSearchChange({})}>
                    <Trans>Clear filters</Trans>
                  </Button>
                ) : undefined
              }
              style={styles.empty}
            />
          )}
          {!loading && spotlight && (
            <CourseSpotlight
              course={spotlight}
              onJoin={onJoin}
              onOpen={onOpen}
              joinError={joinError}
              joining={joiningId === spotlight.id}
              joinDisabled={Boolean(joiningId)}
              joinFailed={joinFailedId === spotlight.id}
            />
          )}
          {!loading && rows.length > 0 && (
            <>
              {spotlight && (
                <Text variant="label">
                  <Trans>More courses</Trans>
                </Text>
              )}
              <ul {...stylex.props(styles.list)}>
                {rows.map((course) => (
                  <li key={course.id}>
                    <CourseCard
                      course={course}
                      onJoin={onJoin}
                      onOpen={onOpen}
                      joinError={joinError}
                      joining={joiningId === course.id}
                      joinDisabled={Boolean(joiningId)}
                      joinFailed={joinFailedId === course.id}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
          {moreFailed && <Alert tone="negative">{t(errorMessage(moreError))}</Alert>}
          {hasMore && !loading && (
            <LoadMoreButton
              autoLoad={!moreFailed && !failed}
              disabled={fetching}
              loading={loadingMore}
              onLoadMore={onLoadMore}
            >
              {moreFailed ? <Trans>Try again</Trans> : <Trans>Load more</Trans>}
            </LoadMoreButton>
          )}
        </main>
      </ScrollArea>
    </div>
  );
}
