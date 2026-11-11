import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse } from "@/lib/api/catalogue-server";
import CurriculumHero from "@/components/course/Curriculumhero";
import CurriculumExplorer from "@/components/course/Curriculumexplorer";
import LearningMaterials from "@/components/course/Learningmaterials";
import CurriculumCta from "@/components/course/Curriculumcta";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug)
  return { title: course ? `${course.title} curriculum | Experien` : "Course not found" };
}

export default async function CurriculumPage({ params }: Props) {
  const { slug } = await params;
 const course = await getCourse(slug)
  if (!course) notFound();

  return (
    <div>
      <CurriculumHero course={course} />
      <CurriculumExplorer course={course} />
      <LearningMaterials />
      <CurriculumCta slug={course.slug} />
    </div>
  );
}