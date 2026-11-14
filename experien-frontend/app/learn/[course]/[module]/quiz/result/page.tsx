import { notFound } from "next/navigation";
import { getLearningCourse, getLiveQuiz } from "@/lib/api/learning-server";
import { getQuiz } from "@/lib/mock/lessonContent";
import { lessonHref, lessonId, lessonType } from "@/lib/utils/learning";
import QuizResult from "@/components/learning/QuizResult";

type Props = { params: { course: string; module: string } };

export default async function Page({ params }: Props) {
  const { course, live, lessonSlugs } = await getLearningCourse(params.course);
  const moduleIndex = course.modules.findIndex((m) => m.id === params.module);
  if (moduleIndex < 0) notFound();

  const mod = course.modules[moduleIndex];
  const questions = live ? await getLiveQuiz(course.slug, mod.id) : getQuiz(mod.id);

  // Mock mode: each question points back at a lesson of this module
  const lessons = mod.contents.map((c, i) => ({ c, i })).filter(({ c }) => lessonType(c.meta) !== "Quiz");
  const reviews = questions.map((_, qi) => {
    const { i } = lessons[qi % lessons.length];
    return { label: `Review lesson ${moduleIndex + 1}.${i + 1}`, href: lessonHref(course.slug, mod, i) };
  });

  // Real backend: lesson slug -> link, so "Review lesson 2.2" opens the right lesson
  const slugHrefs: Record<string, string> = {};
  mod.contents.forEach((_, i) => {
    const s = lessonSlugs[lessonId(mod.id, i)];
    if (s) slugHrefs[s] = lessonHref(course.slug, mod, i);
  });

  return (
    <QuizResult
      slug={course.slug}
      mod={mod}
      moduleIndex={moduleIndex}
      questions={questions}
      reviews={reviews}
      slugHrefs={slugHrefs}
    />
  );
}
