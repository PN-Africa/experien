import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse } from "@/lib/api/catalogue-server";
import CourseHero from "@/components/course/CourseHero";
import CourseOverview from "@/components/course/Courseoverview";
import CurriculumPreview from "@/components/course/Curriculumpreview";
import EnrolInfo from "@/components/course/Enrolinfo";
import EnrolCta from "@/components/course/Enrolcta";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
 const course = await getCourse(slug)
  return { title: course ? `${course.title} | Experien` : "Course not found" };
}

export default async function CourseDetailsPage({ params }: Props) {
  const { slug } = await params;
const course = await getCourse(slug)
  if (!course) notFound();

  return (
    <main>
      <CourseHero course={course} />
      <CourseOverview course={course} />
      <CurriculumPreview modules={course.modules} slug={course.slug} />
      <EnrolInfo requirements={course.requirements} />
      <EnrolCta title={course.title} slug={course.slug} />
    </main>
  );
}