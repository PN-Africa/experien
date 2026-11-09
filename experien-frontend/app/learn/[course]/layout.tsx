import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/mock/Courses";
import { enrolments } from "@/lib/mock/learner";
import ProgressProvider from "@/components/learning/ProgressProvider";

export default function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { course: string };
}) {
  if (!getCourseBySlug(params.course)) notFound();
  //  load this learner's real enrolment from the backend.
  const enrolment = enrolments.find((e) => e.courseSlug === params.course);
  return (
    <ProgressProvider
      initialCompleted={enrolment?.completedLessonIds ?? []}
      initialScores={enrolment?.quizScores ?? {}}
    >
      {children}
    </ProgressProvider>
  );
}
