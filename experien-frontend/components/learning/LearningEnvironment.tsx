"use client";
import { useRouter } from "next/navigation";

import { useMemo, useState } from "react";
import type { Course } from "@/types/Course";
import {
  flattenLessons,
  isModuleDone,
  labelsFor,
  lessonHref,
  pad,
   lessonType,
  progressPercent,
} from "@/lib/utils/learning";
import ModuleSidebar from "./ModuleSidebar";
import LessonViewer from "./LessonViewer";
import { useProgress } from "./ProgressProvider";

export default function LearningEnvironment({ course }: { course: Course }) {
  
  const router = useRouter();
  const lessons = useMemo(() => flattenLessons(course), [course]);
  const { completed, markComplete } = useProgress();
  const [index, setIndex] = useState(() => {
    const first = lessons.findIndex((l) => !completed.has(l.id));
    return first === -1 ? 0 : first;
  });

  const current = lessons[index];
  const mod = course.modules[current.moduleIndex];
  const pct = progressPercent(course, completed);
  const nextOpen = lessons.find((l) => !completed.has(l.id));

  const statuses = course.modules.map((_, i) =>
    isModuleDone(course, i, completed) ? "Complete" : i === current.moduleIndex ? "Current" : "Upcoming"
  );

  function selectModule(mi: number) {
    const inModule = lessons.filter((l) => l.moduleIndex === mi);
    const target = inModule.find((l) => !completed.has(l.id)) ?? inModule[0];
    setIndex(lessons.indexOf(target));
  }
  function handleComplete() {
    // A quiz is finished by submitting it, not by ticking "Mark complete": open the quiz instead.
    if (lessonType(current.meta) === "Quiz") {
      router.push(lessonHref(course.slug, mod, current.lessonIndex));
      return;
    }
    markComplete(current.id);
    if (index < lessons.length - 1) setIndex(index + 1);
  }

  const chips = [
    `${pct}% complete`,
    `Module ${pad(current.moduleIndex + 1)} ${isModuleDone(course, current.moduleIndex, completed) ? "complete" : "in progress"}`,
    nextOpen ? `Next · ${labelsFor(nextOpen.meta).next}` : "Course complete",
  ];

  return (
    <div>
      <section className="bg-white text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-16 md:py-12">
          <p className="text-[11px] font-semibold uppercase tracking-wider">
            My learning / {course.title}
          </p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-5xl">
            Course learning environment
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
            Move through lessons and resources in sequence, complete knowledge checks and track your
            course progress.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c} className="rounded-full bg-[#EAF1E8] px-3 py-1 text-xs font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#EAF1E8] text-ink">
        <div className="mx-auto grid max-w-[1400px] items-start gap-6 px-6 py-10 md:px-16 md:py-12 lg:grid-cols-[250px_1fr]">
          <ModuleSidebar
            course={course}
            statuses={statuses}
            currentModule={current.moduleIndex}
            pct={pct}
            onSelect={selectModule}
          />
          <LessonViewer
            key={current.id}
            lesson={current}
            module={mod}
            isFirst={index === 0}
            isComplete={completed.has(current.id)}
            href={lessonHref(course.slug, mod, current.lessonIndex)}
            onPrev={() => setIndex(index - 1)}
            onComplete={handleComplete}
          />
        </div>
      </section>
    </div>
  );
}
