import type { Metadata } from "next";
import { getLearningCourse } from "@/lib/api/learning-server";
import LearningEnvironment from "@/components/learning/LearningEnvironment";

type Props = { params: { course: string } };

export const metadata: Metadata = { title: "Course learning | Experien" };

export default async function LearnPage({ params }: Props) {
  const { course } = await getLearningCourse(params.course);
  return <LearningEnvironment course={course} />;
}
