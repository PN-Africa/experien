"use client";

import Link from "next/link";
import type { Course } from "@/types/Course";
import {
  completedModuleCount,
  isModuleDone,
  labelsFor,
  lessonHref,
  lessonId,
  lessonType,
  nextLesson,
  pad,
  progressPercent,
} from "@/lib/utils/learning";
import { useProgress } from "./ProgressProvider";

export default function CourseProgress({ course }: { course: Course }) {
  const { completed, scores, lastScore } = useProgress();
  const pct = progressPercent(course, completed);
  const doneModules = completedModuleCount(course, completed);
  const firstDone = course.modules.find((_, i) => isModuleDone(course, i, completed));

  const doneOfType = (types: string[]) =>
    course.modules.flatMap((m) => m.contents.map((c, i) => ({ c, id: lessonId(m.id, i) })))
      .filter(({ c, id }) => types.includes(lessonType(c.meta)) && completed.has(id)).length;

  const stats = [
    ["Modules complete", `${doneModules} / ${course.modules.length}`, firstDone ? `${firstDone.shortTitle} completed` : "None completed yet"],
    ["Lessons watched", String(doneOfType(["Video"])), "Course activity"],
    ["Resources viewed", String(doneOfType(["Reading", "Template"])), "PDFs and templates"],
    ["Quizzes submitted", String(Object.keys(scores).length), lastScore === null ? "No quizzes yet" : `Latest score · ${lastScore}%`],
  ];

  const next = nextLesson(course, completed);
  const nextMod = next ? course.modules[next.moduleIndex] : undefined;

  return (
    <div>
      <section className="bg-white text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-16 md:py-12">
          <p className="text-[11px] font-semibold uppercase tracking-wider">My learning / Progress</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-5xl">Your course progress</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
            See completed modules, current learning activity and the next step in {course.title}.
          </p>
          <p className="mt-4 text-[11px]">Overall course progress · {pct}%</p>
          <div className="mt-1.5 h-1.5 w-full max-w-md overflow-hidden rounded-full bg-[#EAF1E8]">
            <div className="h-full rounded-full bg-lime" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      <section className="bg-[#EAF1E8] text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-16 md:py-12">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([label, value, sub]) => (
              <div key={label} className="rounded-2xl border border-line bg-white p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wider">{label}</p>
                <p className="mt-3 text-2xl font-medium">{value}</p>
                <p className="mt-2 text-[11px] text-muted">{sub}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-line bg-white p-6">
            <p className="text-[10px] font-semibold uppercase tracking-wider">Module breakdown</p>
            <h2 className="mt-2 text-xl font-medium md:text-2xl">Progress by module</h2>
            <ul className="mt-4 space-y-3">
              {course.modules.map((m, i) => {
                const done = m.contents.filter((_, li) => completed.has(lessonId(m.id, li))).length;
                const mp = m.contents.length ? Math.round((done / m.contents.length) * 100) : 0;
                const status = mp === 100 ? "Complete" : mp > 0 ? "In progress" : "Not started";
                return (
                  <li key={m.id} className="rounded-xl border border-line p-4">
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-3">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${mp > 0 ? "bg-lime" : "bg-[#EAF1E8]"}`}>{pad(i + 1)}</span>
                        {m.title}
                      </span>
                      <span className="text-xs text-muted">{status}</span>
                    </div>
                    <p className="mt-3 text-[11px]">Module completion</p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#EAF1E8]">
                      <div className="h-full rounded-full bg-lime" style={{ width: `${mp}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#F5F2E9] p-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider">Continue where you left off</p>
              {next && nextMod ? (
                <>
                  <p className="mt-2 text-lg font-medium">Module {pad(next.moduleIndex + 1)} · {nextMod.shortTitle}</p>
                  <p className="mt-1 text-[11px] text-muted">Next activity: {next.title} · {labelsFor(next.meta).tag}.</p>
                </>
              ) : (
                <p className="mt-2 text-lg font-medium">You have completed every lesson.</p>
              )}
            </div>
            {next && nextMod ? (
              <Link href={lessonHref(course.slug, nextMod, next.lessonIndex)} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9]">
                Continue module {pad(next.moduleIndex + 1)}
              </Link>
            ) : (
              <Link href={`/learn/${course.slug}`} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9]">
                Back to course
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
