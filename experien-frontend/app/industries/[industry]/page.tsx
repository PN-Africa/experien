import { notFound } from "next/navigation";
import { getPathway } from "@/lib/api/catalogue-server";
import CourseHero from "@/components/industry-courses/CourseHero";
import CourseDiscovery from "@/components/industry-courses/CourseDiscovery";
import CoursePreview from "@/components/industry-courses/CoursePreview";
import CourseExpect from "@/components/industry-courses/CourseExpect";
import CourseCta from "@/components/industry-courses/CourseCta";

export default async function IndustryCoursesPage({ params }: { params: { industry: string } }) {
  const selected = await getPathway(params.industry);
  if (!selected) notFound();

  return (
    <>
      <CourseHero selected={selected} />
      <CourseDiscovery selected={selected} />
      <CoursePreview selected={selected} />
      <CourseExpect selected={selected} />
      <CourseCta selected={selected} />
    </>
  );
}