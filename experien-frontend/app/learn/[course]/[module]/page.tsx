import { notFound, redirect } from "next/navigation";
import { getCourseBySlug } from "@/lib/mock/Courses";
import { lessonHref } from "@/lib/utils/learning";

// /learn/[course]/[module] sends the learner to the first item of that module.
export default function ModuleIndex({ params }: { params: { course: string; module: string } }) {
  const course = getCourseBySlug(params.course);
  const mod = course?.modules.find((m) => m.id === params.module);
  if (!course || !mod) notFound();
  redirect(lessonHref(course.slug, mod, 0));
}
