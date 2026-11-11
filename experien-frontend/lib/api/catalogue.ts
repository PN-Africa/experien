import type { Course, CourseCard } from "@/types/Course";
import { pathways, type Pathway } from "@/components/industries/pathways";
import { apiFetch, isMockApi } from "./client";

type Money = { amountKobo: number; amount: number; currency: string };

export type ApiCourseCard = {
  id: string;
  slug: string;
  title: string;
  overview: string;
  industry: { slug: string; name: string };
  subIndustry: { slug: string; name: string } | null;
  durationWeeks: number;
  format: string;
  price: Money;
  moduleCount: number;
  lessonCount: number;
  quizCount: number;
};

export type ApiCourseDetail = ApiCourseCard & {
  objectives: string[];
  requirements: string;
  modules: { slug: string; title: string; summary: string; position: number; hasQuiz: boolean; lessonCount: number }[];
};

export type ApiIndustry = {
  id: string;
  slug: string;
  name: string;
  description: string;
  courseCount?: number;
  subIndustries: { id: string; slug: string; name: string; description: string }[];
};


export const toCourseCard = (c: ApiCourseCard): CourseCard => ({
  slug: c.slug,
  title: c.title,
  overview: c.overview,
  industryName: c.industry.name,
  durationWeeks: c.durationWeeks,
  format: c.format,
  price: c.price.amount,
  moduleCount: c.moduleCount,
  lessonCount: c.lessonCount,
});

// Lesson titles are hidden by the backend until enrolment, so each module shows locked placeholders.
export function toCourse(c: ApiCourseDetail): Course {
  const modules = [...c.modules].sort((a, b) => a.position - b.position);
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    industry: c.industry.name,
    summary: c.overview,
    overview: c.overview,
    objectives: c.objectives,
    duration: `${c.durationWeeks} weeks`,
    format: c.format,
    requirements: [c.requirements, "Review the requirements before you enrol."],
    price: c.price.amount,
    modules: modules.map((m) => ({
      id: m.slug,
      title: m.title,
      shortTitle: m.title,
      summary: m.summary,
      lessons: m.lessonCount,
      items: [`${m.lessonCount} lessons`, ...(m.hasQuiz ? ["Module quiz"] : []), "Lesson titles unlock after enrolment"],
      contents: Array.from({ length: m.lessonCount }, (_, i) => ({
        title: `Lesson ${i + 1}`,
        meta: "Unlocks after enrolment",
      })),
    })),
  };
}


export function toPathway(industry: ApiIndustry, courses: ApiCourseCard[]): Pathway {
  const local = pathways.find((p) => p.id === industry.slug);
  const first = courses[0];
  return {
    id: industry.slug,
    name: industry.name,
    blurb: local?.blurb ?? industry.description,
    cardPath: first?.title ?? local?.cardPath ?? industry.name,
    pathway: local?.pathway ?? first?.title ?? industry.name,
    courseTitle: first?.title ?? local?.courseTitle ?? "",
    courseSummary: local?.courseSummary ?? first?.overview ?? industry.description,
    slug: first?.slug ?? local?.slug ?? "",
    whyIntro:
      local?.whyIntro ??
      `The examples and templates in this pathway are framed around ${industry.name.toLowerCase()} project delivery.`,
    why: local?.why ?? [
      "Practical project scenarios",
      "Scope, schedule and risk planning",
      "Templates and module quizzes",
      "Progress tracking",
    ],
    situations: local?.situations ?? `${industry.slug}-project`,
    courses: courses.map(toCourseCard),
  };
}

// Old fixed data, used in mock mode or if the backend can't be reached.
export function staticPathway(p: Pathway): Pathway {
  return {
    ...p,
    courses: [
      {
        slug: p.slug,
        title: p.courseTitle,
        overview: p.courseSummary,
        industryName: p.name,
        durationWeeks: 6,
        format: "Self-paced online",
        price: 75000,
        moduleCount: 4,
        lessonCount: 0,
      },
    ],
  };
}

// ---- Client-side loader (used by the /industries page, goes through the Next proxy) ----
export async function loadPathways(): Promise<Pathway[] | null> {
  if (isMockApi) return null;
  try {
    const [industries, courses] = await Promise.all([
      apiFetch<ApiIndustry[]>("/industries"),
      apiFetch<ApiCourseCard[]>("/courses"),
    ]);
    return industries.map((i) => toPathway(i, courses.filter((c) => c.industry.slug === i.slug)));
  } catch {
    return null; // keep showing the static data
  }
}