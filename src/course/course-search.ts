import { msg } from "@lingui/core/macro";
import type { CourseFilters } from "../api/course/use-course-queries.ts";
import type { GetApiCoursesResponse } from "../api/generated/types.gen.ts";

export type CourseSummary = GetApiCoursesResponse["items"][number];
export type CourseSubject = CourseSummary["subject"];
export type CourseSearch = Pick<
  CourseFilters,
  "q" | "subject" | "language" | "minimumAge" | "maximumAge" | "sort"
>;

export const subjectLabels = {
  arts_humanities: msg`Arts and humanities`,
  business: msg`Business`,
  computer_science: msg`Computer science`,
  economics_finance: msg`Economics and finance`,
  engineering: msg`Engineering`,
  health_medicine: msg`Health and medicine`,
  language_arts: msg`Language arts`,
  languages: msg`Languages`,
  life_skills: msg`Life skills`,
  math: msg`Math`,
  science: msg`Science`,
  social_sciences: msg`Social sciences`,
  test_preparation: msg`Test preparation`,
  other: msg`Other`,
} satisfies Record<CourseSubject, ReturnType<typeof msg>>;

export const courseSubjects = Object.keys(subjectLabels) as CourseSubject[];
export const courseLanguages = [
  "en",
  "vi",
  "es",
  "fr",
  "de",
  "zh",
  "ja",
  "ko",
  "pt",
  "hi",
  "ar",
] as const;
export const courseSorts = ["recommended", "title_asc", "title_desc"] as const;
export const courseAgeBands = [
  { value: "0-5", minimumAge: 0, maximumAge: 5 },
  { value: "6-8", minimumAge: 6, maximumAge: 8 },
  { value: "9-12", minimumAge: 9, maximumAge: 12 },
  { value: "13-17", minimumAge: 13, maximumAge: 17 },
  { value: "18-120", minimumAge: 18, maximumAge: 120 },
] as const;
export const courseSearchLimit = 200;

const optionalInteger = (value: unknown) => {
  const parsed = typeof value === "string" || typeof value === "number" ? Number(value) : NaN;
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 120 ? parsed : undefined;
};

export function parseCourseSearch(search: Record<string, unknown>): CourseSearch {
  const subject = courseSubjects.find((value) => value === search.subject);
  const language = courseLanguages.find((value) => value === search.language);
  const sort = courseSorts.find((value) => value === search.sort);
  const minimumAge = optionalInteger(search.minimumAge);
  const maximumAge = optionalInteger(search.maximumAge);
  const q = typeof search.q === "string" ? search.q.slice(0, courseSearchLimit).trim() : "";
  return minimumAge === undefined || maximumAge === undefined || minimumAge > maximumAge
    ? { q: q || undefined, subject, language, sort }
    : { q: q || undefined, subject, language, minimumAge, maximumAge, sort };
}

export function courseFilters(search: CourseSearch): CourseFilters {
  return { ...search, limit: 20 };
}
