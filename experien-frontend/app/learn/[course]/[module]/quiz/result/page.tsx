import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/mock/Courses";
import { getQuiz } from "@/lib/mock/lessonContent";
import { lessonHref, lessonType } from "@/lib/utils/learning";
import QuizResult from "@/components/learning/QuizResult";

type Props = { params: { course: string; module: string } };

export default function Page({ params }: Props) {
  const course = getCourseBySlug(params.course);
  const moduleIndex = course ? course.modules.findIndex((m) => m.id === params.module) : -1;
  if (!course || moduleIndex < 0) notFound();

  const mod = course.modules[moduleIndex];
  const questions = getQuiz(mod.id);
  // MOCK: each question points back at a lesson of this module 
  const lessons = mod.contents.map((c, i) => ({ c, i })).filter(({ c }) => lessonType(c.meta) !== "Quiz");
  const reviews = questions.map((_, qi) => {
    const { i } = lessons[qi % lessons.length];
    return { label: `Review lesson ${moduleIndex + 1}.${i + 1}`, href: lessonHref(course.slug, mod, i) };
  });

  return (
    <QuizResult
      slug={course.slug}
      mod={mod}
      moduleIndex={moduleIndex}
      questions={questions}
      reviews={reviews}
    />
  );
}
