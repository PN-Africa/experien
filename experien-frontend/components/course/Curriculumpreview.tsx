"use client";

import { useState } from "react";
import Link from "next/link";
import type { CourseModule } from "@/types/Course";

export default function CurriculumPreview({ modules, slug }: { modules: CourseModule[]; slug: string }) {
  const [open, setOpen] = useState<Set<number>>(new Set([0]));
  const totalLessons = modules.reduce((n, m) => n + m.lessons, 0);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section id="curriculum" className="bg-[#EAF1E8] text-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-16 md:py-14">
        <p className="text-xs font-semibold uppercase tracking-wider">Curriculum preview</p>
        <h2 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">
          {modules.length}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Review the learning sequence before you enrol. Each module combines lessons, practical
          resources and a short knowledge check.
        </p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
          <ul className="space-y-3">
            {modules.map((m, i) => {
              const isOpen = open.has(i);
              return (
                <li key={m.id} className="rounded-xl border border-line bg-white">
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    aria-controls={`module-${m.id}`}
                    className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
                  >
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-lime/70 text-[10px] font-semibold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-sm font-medium">{m.title}</span>
                    <span className="text-xs text-muted">{m.lessons} lessons</span>
                  </button>
                  {isOpen && (
                    <ul
                      id={`module-${m.id}`}
                      className="space-y-2 border-t border-line px-4 py-3 text-xs text-muted"
                    >
                      {m.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <aside className="rounded-2xl bg-ink p-6 text-[#F5F2E9]">
            <p className="text-xs font-semibold uppercase tracking-wider text-lime">Course structure</p>
            <h3 className="mt-3 text-2xl font-medium leading-snug">
              {totalLessons} lessons across {modules.length} modules
            </h3>
            <p className="mt-3 text-sm text-[#F5F2E9]/70">
              Video lessons, PDFs, reusable templates and module quizzes are included in the
              learning path.
            </p>
            <Link
              href={`/courses/${slug}/curriculum`}
              className="mt-5 inline-block rounded-lg bg-lime px-4 py-2 text-sm font-medium text-ink hover:brightness-95"
            >
              View full curriculum
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}