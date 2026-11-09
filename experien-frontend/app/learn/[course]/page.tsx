import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourseBySlug } from "@/lib/mock/Courses";
import LearningEnvironment from "@/components/learning/LearningEnvironment";

type Props = { params: { course: string } };

export function generateMetadata({ params }: Props): Metadata {
  const course = getCourseBySlug(params.course);
  return { title: course ? `Learn: ${course.title} | Experien` : "Course not found" };
}

export default function LearnPage({ params }: Props) {
  const course = getCourseBySlug(params.course);
  if (!course) notFound();
  // TODO: require login + an active enrolment (otherwise redirect to /checkout/[slug]).
  return <LearningEnvironment course={course} />;
}
