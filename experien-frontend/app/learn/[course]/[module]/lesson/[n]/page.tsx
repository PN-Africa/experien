import { notFound, redirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/mock/Courses";
import { getLessonContent } from "@/lib/mock/lessonContent";
import { lessonHref, lessonType } from "@/lib/utils/learning";
import LessonPage from "@/components/learning/LessonPage";

type Props = { params: { course: string; module: string; n: string } };

export default function Page({ params }: Props) {
  const course = getCourseBySlug(params.course);
  const moduleIndex = course ? course.modules.findIndex((m) => m.id === params.module) : -1;
  const lessonIndex = Number(params.n) - 1;
  if (!course || moduleIndex < 0) notFound();

  const mod = course.modules[moduleIndex];
  const lesson = mod.contents[lessonIndex];
  if (!lesson) notFound();
  // Only video lessons live here; send reading, templates and quizzes to their own pages.
  if (lessonType(lesson.meta) !== "Video") redirect(lessonHref(course.slug, mod, lessonIndex));

  return (
    <LessonPage
      slug={course.slug}
      mod={mod}
      moduleIndex={moduleIndex}
      lessonIndex={lessonIndex}
      content={getLessonContent(course, moduleIndex, lessonIndex)}
    />
  );
}
