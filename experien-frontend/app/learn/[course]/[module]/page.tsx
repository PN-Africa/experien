import { notFound, redirect } from "next/navigation";
import { getLearningCourse } from "@/lib/api/learning-server";
import { lessonHref } from "@/lib/utils/learning";

// /learn/[course]/[module] sends the learner to the first item of that module.
export default async function ModuleIndex({ params }: { params: { course: string; module: string } }) {
  const { course } = await getLearningCourse(params.course);
  const mod = course.modules.find((m) => m.id === params.module);
  if (!mod) notFound();
  redirect(lessonHref(course.slug, mod, 0));
}
