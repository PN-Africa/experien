import type { Course, CourseModule, ModuleContent } from "@/types/Course";

export type LessonRef = {
  id: string;
  moduleIndex: number;
  lessonIndex: number;
  title: string;
  meta: string; // e.g. "Video · 12 min"
};

export const pad = (n: number) => String(n).padStart(2, "0");
export const lessonId = (moduleId: string, lessonIndex: number) => `${moduleId}-${lessonIndex}`;

// "Video · 12 min" -> "Video" / "12 min"
export const lessonType = (meta: string) => meta.split(" · ")[0];
export const lessonDetail = (meta: string) => meta.split(" · ")[1] ?? "";

const labels: Record<string, { tag: string; cta: string; next: string }> = {
  Video: { tag: "Video lesson", cta: "Open video lesson", next: "Video lesson" },
  Reading: { tag: "Reading", cta: "Open document", next: "Reading" },
  Template: { tag: "Template", cta: "Open template", next: "Template" },
  Quiz: { tag: "Knowledge check", cta: "Start knowledge check", next: "Knowledge check" },
};
export const labelsFor = (meta: string) =>
  labels[lessonType(meta)] ?? { tag: "Lesson", cta: "Open lesson", next: "Lesson" };

export function flattenLessons(course: Course): LessonRef[] {
  return course.modules.flatMap((m, mi) =>
    m.contents.map((c, li) => ({
      id: lessonId(m.id, li),
      moduleIndex: mi,
      lessonIndex: li,
      title: c.title,
      meta: c.meta,
    }))
  );
}

export function progressPercent(course: Course, completed: Set<string>) {
  const lessons = flattenLessons(course);
  if (lessons.length === 0) return 0;
  return Math.round((lessons.filter((l) => completed.has(l.id)).length / lessons.length) * 100);
}

export const nextLesson = (course: Course, completed: Set<string>) =>
  flattenLessons(course).find((l) => !completed.has(l.id));

export function isModuleDone(course: Course, moduleIndex: number, completed: Set<string>) {
  const m = course.modules[moduleIndex];
  return m.contents.length > 0 && m.contents.every((_, i) => completed.has(lessonId(m.id, i)));
}

export const completedModuleCount = (course: Course, completed: Set<string>) =>
  course.modules.filter((_, i) => isModuleDone(course, i, completed)).length;

// First unfinished reading/template in a module (shown as "Next up")
export function pickResource(
  course: Course,
  moduleIndex: number,
  completed: Set<string>
): ModuleContent | undefined {
  const m = course.modules[moduleIndex];
  return m.contents.find(
    (c, i) =>
      !completed.has(lessonId(m.id, i)) && ["Template", "Reading"].includes(lessonType(c.meta))
  );
}

export const pickQuiz = (course: Course, moduleIndex: number) =>
  course.modules[moduleIndex].contents.find((c) => lessonType(c.meta) === "Quiz");

// Where a lesson opens: videos have their own page, quizzes too, readings and templates share "materials".
export function lessonHref(slug: string, mod: CourseModule, index: number) {
  const base = `/learn/${slug}/${mod.id}`;
  const type = lessonType(mod.contents[index]?.meta ?? "");
  if (type === "Video") return `${base}/lesson/${index + 1}`;
  if (type === "Quiz") return `${base}/quiz`;
  return `${base}/materials`;
}

export const PASS_MARK = 70; // percent needed to pass a module quiz (our default, confirm with the team)
