import { useLingui } from "@lingui/react/macro";
import { Text } from "../ui/primitives/text.tsx";
import type { CourseSummary } from "./course-search.ts";
import { subjectLabels } from "./course-search.ts";

export function courseLanguageName(language: string, locale: string) {
  return new Intl.DisplayNames([locale], { type: "language" }).of(language) ?? language;
}

export function CourseMetadata({ course }: { course: CourseSummary }) {
  const { t, i18n } = useLingui();
  const minimumAge = course.ageRange.minimum;
  const maximumAge = course.ageRange.maximum;
  return (
    <Text variant="caption" tone="secondary">
      {t(subjectLabels[course.subject])}
      {" · "}
      {courseLanguageName(course.language, i18n.locale)}
      {" · "}
      {t`${minimumAge}–${maximumAge} yrs`}
    </Text>
  );
}
