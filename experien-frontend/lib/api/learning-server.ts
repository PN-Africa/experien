// Server-side loaders for the learning screens. They read the login cookie and call the backend directly.
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import type { Course, CourseModule } from "@/types/Course";
import { getCourseBySlug } from "@/lib/mock/Courses";
import { enrolments } from "@/lib/mock/learner";
import { TOKEN_COOKIE } from "@/lib/auth/constants";
import { lessonId } from "@/lib/utils/learning";

// ---- Shapes confirmed from real API responses ----
type ApiLesson = {
  slug: string;
  position: number;
  label: string;
  title: string;
  type: string; // "video" | "reading"
  durationMinutes: number | null;
  completed: boolean;
};

type ApiModule = {
  slug: string;
  title: string;
  summary: string;
  position: number;
  status: string;
  percent: number;
  lessonsCompleted: number;
  lessonsTotal: number;
  lessons: ApiLesson[];
  quiz: {
    questionCount: number;
    passMarkPercent: number;
    submitted: boolean;
    latestScorePercent: number | null;
    passed: boolean | null;
  } | null;
};

type ApiLearning = { course: { slug: string; title: string }; modules: ApiModule[] };

export type ApiLessonDetail = {
  slug: string;
  title: string;
  type: string;
  videoUrl: string | null;
  durationMinutes: number | null;
  content: string | null;
  completed: boolean;
  materials: unknown[]; // shape not seen yet (empty so far)
};

type Res<T> = { state: "ok"; data: T } | { state: "login" | "forbidden" | "notfound" | "error" };

const BACKEND = process.env.BACKEND_URL ?? "";
const live = () => BACKEND !== "" && !!process.env.NEXT_PUBLIC_API_BASE_URL;

async function authedGet<T>(path: string): Promise<Res<T>> {
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) return { state: "login" };
  try {
    const res = await fetch(BACKEND + path, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(30000), // Render cold starts can be slow
    });
    if (res.status === 401) return { state: "login" };
    if (res.status === 403) return { state: "forbidden" };
    if (res.status === 404) return { state: "notfound" };
    const body = await res.json().catch(() => null);
    if (!res.ok || !body?.success) return { state: "error" };
    return { state: "ok", data: body.data as T };
  } catch {
    return { state: "error" };
  }
}

// ---- Course structure -> the Course shape the learning components already use ----
export type LearningData = {
  course: Course;
  completedIds: string[]; // lesson id = `${moduleSlug}-${index}`
  scores: Record<string, number>; // moduleSlug -> latest quiz score %
  lessonSlugs: Record<string, string>; // lesson id -> backend lesson slug
  live: boolean;
};

const capitalise = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function toLearningData(d: ApiLearning): LearningData {
  const completedIds: string[] = [];
  const scores: Record<string, number> = {};
  const lessonSlugs: Record<string, string> = {};

  const modules: CourseModule[] = [...d.modules]
    .sort((a, b) => a.position - b.position)
    .map((m) => {
      const contents = [...m.lessons]
        .sort((a, b) => a.position - b.position)
        .map((l, i) => {
          const id = lessonId(m.slug, i);
          lessonSlugs[id] = l.slug;
          if (l.completed) completedIds.push(id);
          const detail = l.durationMinutes ? ` · ${l.durationMinutes} min` : "";
          return { title: l.title, meta: `${capitalise(l.type)}${detail}` };
        });

      if (m.quiz) {
        const id = lessonId(m.slug, contents.length);
        contents.push({ title: `Module ${m.position} knowledge check`, meta: `Quiz · ${m.quiz.questionCount} questions` });
        if (m.quiz.passed === true) completedIds.push(id);
        if (m.quiz.latestScorePercent !== null) scores[m.slug] = m.quiz.latestScorePercent;
      }

      return { id: m.slug, title: m.title, shortTitle: m.title, summary: m.summary, lessons: m.lessonsTotal, items: [], contents };
    });

  const course: Course = {
    id: d.course.slug,
    slug: d.course.slug,
    title: d.course.title,
    industry: "",
    summary: "",
    overview: "",
    objectives: [],
    duration: "",
    format: "",
    requirements: [],
    price: 0,
    modules,
  };
  return { course, completedIds, scores, lessonSlugs, live: true };
}

// Not logged in -> login. Not enrolled -> course page. Unknown course -> 404.
export async function getLearningCourse(slug: string): Promise<LearningData> {
  if (!live()) {
    const course = getCourseBySlug(slug);
    if (!course) notFound();
    const e = enrolments.find((x) => x.courseSlug === slug);
    return { course, completedIds: e?.completedLessonIds ?? [], scores: e?.quizScores ?? {}, lessonSlugs: {}, live: false };
  }
  const r = await authedGet<ApiLearning>(`/courses/${encodeURIComponent(slug)}/learning`);
  if (r.state !== "ok") {
    if (r.state === "login") redirect(`/login?redirect=${encodeURIComponent(`/learn/${slug}`)}`);
    if (r.state === "forbidden") redirect(`/courses/${slug}`);
    if (r.state === "notfound") notFound();
    throw new Error("We couldn't load your course right now. Please refresh and try again.");
  }
  return toLearningData(r.data);
}

// ---- One lesson ----
export async function getLessonDetail(courseSlug: string, lessonSlug: string): Promise<ApiLessonDetail | null> {
  const r = await authedGet<ApiLessonDetail>(
    `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}`
  );
  return r.state === "ok" ? r.data : null;
}
