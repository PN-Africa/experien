import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourseBySlug } from "@/lib/mock/Courses";
import CourseProgress from "@/components/learning/CourseProgress";

type Props = { params: { course: string } };

export function generateMetadata({ params }: Props): Metadata {
  const course = getCourseBySlug(params.course);
  return { title: course ? `Progress: ${course.title} | Experien` : "Course not found" };
}

export default function Page({ params }: Props) {
  const course = getCourseBySlug(params.course);
  if (!course) notFound();
  return <CourseProgress course={course} />;
}
