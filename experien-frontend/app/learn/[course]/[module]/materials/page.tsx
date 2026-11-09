import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/mock/Courses";
import { getResources } from "@/lib/mock/lessonContent";
import { lessonHref, lessonType } from "@/lib/utils/learning";
import MaterialsPage from "@/components/learning/MaterialsPage";

type Props = { params: { course: string; module: string } };

export default function Page({ params }: Props) {
  const course = getCourseBySlug(params.course);
  const moduleIndex = course ? course.modules.findIndex((m) => m.id === params.module) : -1;
  if (!course || moduleIndex < 0) notFound();

  const mod = course.modules[moduleIndex];
  const video = mod.contents.findIndex((c) => lessonType(c.meta) === "Video");
  return (
    <MaterialsPage
      mod={mod}
      moduleIndex={moduleIndex}
      resources={getResources(course, moduleIndex)}
      backHref={lessonHref(course.slug, mod, Math.max(video, 0))}
      quizHref={`/learn/${course.slug}/${mod.id}/quiz`}
    />
  );
}
