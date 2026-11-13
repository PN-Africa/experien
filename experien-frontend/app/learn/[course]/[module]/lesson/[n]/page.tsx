import { notFound, redirect } from "next/navigation";
import { getLearningCourse, getLessonDetail } from "@/lib/api/learning-server";
import { getLessonContent } from "@/lib/mock/lessonContent";
import { lessonHref, lessonId, lessonType } from "@/lib/utils/learning";
import LessonPage from "@/components/learning/LessonPage";

type Props = { params: { course: string; module: string; n: string } };

export default async function Page({ params }: Props) {
  const { course, lessonSlugs, live } = await getLearningCourse(params.course);
  const moduleIndex = course.modules.findIndex((m) => m.id === params.module);
  const lessonIndex = Number(params.n) - 1;
  if (moduleIndex < 0) notFound();

  const mod = course.modules[moduleIndex];
  const lesson = mod.contents[lessonIndex];
  if (!lesson) notFound();
  // Only video lessons live here; send reading, templates and quizzes to their own pages.
  if (lessonType(lesson.meta) !== "Video") redirect(lessonHref(course.slug, mod, lessonIndex));

  // Keep the mock video and notes for now; real values win as soon as the backend has them.
  const mock = getLessonContent(course, moduleIndex, lessonIndex);
  const lessonSlug = lessonSlugs[lessonId(mod.id, lessonIndex)];
  const detail = live && lessonSlug ? await getLessonDetail(course.slug, lessonSlug) : null;
  const content = {
    ...mock,
    videoUrl: detail?.videoUrl ?? mock.videoUrl,
    detail: detail?.content ?? mock.detail,
  };

  return (
    <LessonPage
      slug={course.slug}
      mod={mod}
      moduleIndex={moduleIndex}
      lessonIndex={lessonIndex}
      content={content}
    />
  );
}
