import Link from "next/link";
import type { CourseModule } from "@/types/Course";
import { type LessonRef, labelsFor, lessonDetail, lessonType, pad } from "@/lib/utils/learning";

type Props = {
  lesson: LessonRef;
  module: CourseModule;
  isFirst: boolean;
  isComplete: boolean;
  href: string; // page that opens this lesson
  onPrev: () => void;
  onComplete: () => void;
};

export default function LessonViewer({ lesson, module, isFirst, isComplete, href, onPrev, onComplete }: Props) {
  const type = lessonType(lesson.meta);
  const labels = labelsFor(lesson.meta);
  const notes = module.contents.find((c) => lessonType(c.meta) === "Reading");
  const template = module.contents.find((c) => lessonType(c.meta) === "Template");

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
        Module {pad(lesson.moduleIndex + 1)} · Lesson {pad(lesson.lessonIndex + 1)}
      </p>
      <h2 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">{lesson.title}</h2>
      <p className="mt-3 max-w-2xl text-sm text-muted">{module.summary}</p>

      {/* Lesson content */}
      <div className="mt-5 rounded-2xl bg-ink p-5 text-[#F5F2E9]">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-lime">{labels.tag}</p>
        <p className="mt-2 text-xl font-medium">
          {lesson.moduleIndex + 1}.{lesson.lessonIndex + 1} · {lesson.title}
        </p>
        {/* TODO: swap this placeholder for the real VideoPlayer / DocumentViewer / Quiz component */}
        <div className="mt-4 h-44 rounded-xl bg-[#F5F2E9] md:h-56" />
        <div className="mt-3 flex items-center gap-3 text-xs">
          {type === "Video" && (
            <button type="button" className="rounded-full bg-lime px-2.5 py-1 text-[11px] font-medium text-ink">
              ▶ Play
            </button>
          )}
          <span className="text-[#F5F2E9]/70">{lessonDetail(lesson.meta)}</span>
        </div>
      </div>

      {/* Supporting resources */}
      {(notes || template) && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {notes && (
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7C9A2B]">Resource</p>
              <p className="mt-2 text-base font-medium">{notes.title}</p>
              <p className="mt-1 text-xs text-muted">Read the supporting lesson notes before moving on.</p>
              <p className="mt-2 text-[11px] text-muted">PDF</p>
            </div>
          )}
          {template && (
            <div className="rounded-xl border border-line bg-white p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#7C9A2B]">Template</p>
              <p className="mt-2 text-base font-medium">{template.title}</p>
              <p className="mt-1 text-xs text-muted">
                Use the practical template during the lesson.
              </p>
              <p className="mt-2 text-[11px] text-muted">Document</p>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className="rounded-lg border border-ink bg-white px-4 py-2 text-xs font-medium disabled:opacity-50"
        >
          Previous lesson
        </button>
        <Link href={href} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9]">
          {labels.cta}
        </Link>
        <button
          type="button"
          onClick={onComplete}
          className="rounded-lg bg-lime px-4 py-2 text-xs font-medium text-ink hover:brightness-95"
        >
          {isComplete ? "Next lesson" : "Mark complete"}
        </button>
      </div>
    </div>
  );
}
