import { getLearningCourse } from "@/lib/api/learning-server";
import ProgressProvider from "@/components/learning/ProgressProvider";

export default async function LearnLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { course: string };
}) {
  const data = await getLearningCourse(params.course);
  return (
    <ProgressProvider
      initialCompleted={data.completedIds}
      initialScores={data.scores}
      courseSlug={data.live ? data.course.slug : undefined}
      lessonSlugs={data.lessonSlugs}
    >
      {children}
    </ProgressProvider>
  );
}
