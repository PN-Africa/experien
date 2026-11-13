import type { Metadata } from "next";
import { getLearningCourse } from "@/lib/api/learning-server";
import CourseProgress from "@/components/learning/CourseProgress";

type Props = { params: { course: string } };

export const metadata: Metadata = { title: "Course progress | Experien" };

export default async function Page({ params }: Props) {
  const { course } = await getLearningCourse(params.course);
  return <CourseProgress course={course} />;
}
