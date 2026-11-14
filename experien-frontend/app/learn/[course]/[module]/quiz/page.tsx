import { notFound } from "next/navigation";
import { getLearningCourse, getLiveQuiz } from "@/lib/api/learning-server";
import { getQuiz } from "@/lib/mock/lessonContent";
import { lessonId, lessonType } from "@/lib/utils/learning";
import QuizPage from "@/components/learning/QuizPage";

type Props = { params: { course: string; module: string } };

export default async function Page({ params }: Props) {
  const { course, live } = await getLearningCourse(params.course);
  const moduleIndex = course.modules.findIndex((m) => m.id === params.module);
  if (moduleIndex < 0) notFound();

  const mod = course.modules[moduleIndex];
  const quizIndex = mod.contents.findIndex((c) => lessonType(c.meta) === "Quiz");
  const questions = live ? await getLiveQuiz(course.slug, mod.id) : getQuiz(mod.id);

  return (
    <QuizPage
      slug={course.slug}
      mod={mod}
      moduleIndex={moduleIndex}
      questions={questions}
      quizLessonId={quizIndex >= 0 ? lessonId(mod.id, quizIndex) : null}
    />
  );
}
