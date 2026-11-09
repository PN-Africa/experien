import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/mock/Courses";
import { getQuiz } from "@/lib/mock/lessonContent";
import { lessonId, lessonType } from "@/lib/utils/learning";
import QuizPage from "@/components/learning/QuizPage";

type Props = { params: { course: string; module: string } };

export default function Page({ params }: Props) {
  const course = getCourseBySlug(params.course);
  const moduleIndex = course ? course.modules.findIndex((m) => m.id === params.module) : -1;
  if (!course || moduleIndex < 0) notFound();

  const mod = course.modules[moduleIndex];
  const quizIndex = mod.contents.findIndex((c) => lessonType(c.meta) === "Quiz");
  return (
    <QuizPage
      slug={course.slug}
      mod={mod}
      moduleIndex={moduleIndex}
      questions={getQuiz(mod.id)}
      quizLessonId={quizIndex >= 0 ? lessonId(mod.id, quizIndex) : null}
    />
  );
}
