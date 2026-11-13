import { notFound } from "next/navigation";
import { getLearningCourse } from "@/lib/api/learning-server";
import { getResources } from "@/lib/mock/lessonContent";
import { lessonHref, lessonType } from "@/lib/utils/learning";
import MaterialsPage from "@/components/learning/MaterialsPage";

type Props = { params: { course: string; module: string } };

export default async function Page({ params }: Props) {
  const { course } = await getLearningCourse(params.course);
  const moduleIndex = course.modules.findIndex((m) => m.id === params.module);
  if (moduleIndex < 0) notFound();

  const mod = course.modules[moduleIndex];
  const video = mod.contents.findIndex((c) => lessonType(c.meta) === "Video");
  const resources = getResources(course, moduleIndex); // mock notes and PDF for now

  return (
    <MaterialsPage
      mod={mod}
      moduleIndex={moduleIndex}
      resources={resources}
      backHref={lessonHref(course.slug, mod, Math.max(video, 0))}
      quizHref={`/learn/${course.slug}/${mod.id}/quiz`}
    />
  );
}
