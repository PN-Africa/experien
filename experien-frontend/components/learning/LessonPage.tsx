"use client";

import Link from "next/link";
import type { CourseModule } from "@/types/Course";
import type { LessonContent } from "@/types/learning";
import { lessonHref, lessonId, lessonType, pad } from "@/lib/utils/learning";
import { useProgress } from "./ProgressProvider";
import LearnHeader from "./LearnHeader";

type Props = {
  slug: string;
  mod: CourseModule;
  moduleIndex: number;
  lessonIndex: number;
  content: LessonContent;
};

// Estimated colour, check against Figma: dark lime button
const LIME_DARK = "#B0C45A";

export default function LessonPage({ slug, mod, moduleIndex, lessonIndex, content }: Props) {
  const { completed, markComplete } = useProgress();
  const lesson = mod.contents[lessonIndex];
  const id = lessonId(mod.id, lessonIndex);
  const done = completed.has(id);
  const total = mod.contents.length;
  const num = `${moduleIndex + 1}.${lessonIndex + 1}`;

  const hasNext = lessonIndex < total - 1;
  const nextType = hasNext ? lessonType(mod.contents[lessonIndex + 1].meta) : "";
  const prevHref = lessonIndex > 0 ? lessonHref(slug, mod, lessonIndex - 1) : `/learn/${slug}`;
  const nextHref = hasNext ? lessonHref(slug, mod, lessonIndex + 1) : `/learn/${slug}`;
  const nextLabel = !hasNext
    ? "Back to course"
    : nextType === "Video"
      ? "Next · Video lesson"
      : nextType === "Quiz"
        ? "Next · Module quiz"
        : "Next · Course resources";

  const rows = [
    ["Module", `${pad(moduleIndex + 1)} · ${mod.shortTitle}`],
    ["Lesson", num],
    ["Duration", content.duration],
    ["Status", done ? "Complete" : "In progress"],
  ];

  return (
    <div>
      <LearnHeader
        eyebrow={`Module ${pad(moduleIndex + 1)} · Video lesson`}
        title={lesson.title}
        subtitle="Watch the lesson, review the supporting notes and move to the next material when complete."
        chips={[`Lesson ${num} of ${total}`]}
      />

      <section className="bg-[#EAF1E8] text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-16 md:py-12">
          <div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {/* MOCK video: swap for a real player when video URLs exist */}
              <div className="rounded-2xl bg-ink p-5 text-[#F5F2E9]">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold uppercase tracking-wider text-lime">
                    Video · {content.duration}
                  </span>
                  <span className="rounded-md bg-[#F5F2E9] px-3 py-1 text-ink">
                    {content.step} · Lesson preview
                  </span>
                </div>
                <p className="mt-4 text-xl font-medium md:text-2xl">{lesson.title}</p>
                {/* <div className="mt-4 flex h-48 items-center justify-center rounded-xl bg-[#F5F2E9] md:h-72">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-lg text-ink">
                    ▶
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime text-[10px] text-ink">
                    ▶
                  </span>
                  <span>00:00 / {content.duration}</span>
                  <span>Volume</span>
                  <span>Fullscreen</span>
                </div> */}

                {content.videoUrl ? (
  <video
    src={content.videoUrl}
    controls
    preload="metadata"
    className="mt-4 aspect-video w-full rounded-xl bg-black"
  />
) : (
  <div className="mt-4 flex h-48 items-center justify-center rounded-xl bg-[#F5F2E9] md:h-72">
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-lime text-lg text-ink">▶</span>
  </div>
)}
              </div>

              <div className="rounded-2xl border border-line bg-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wider">Key takeaway</p>
                <p className="mt-2 text-lg font-medium md:text-xl">{content.takeaway}</p>
                <p className="mt-2 text-sm text-muted">{content.detail}</p>
              </div>
            </div>

            <aside className="rounded-2xl border border-line bg-white p-5">
              <p className="text-lg font-medium">Lesson information</p>
              <dl className="mt-4 space-y-3 text-xs">
                {rows.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3">
                    <dt className="text-muted">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>

              {content.attachments.length > 0 && (
                <>
                  <p className="mt-5 text-[11px] font-semibold uppercase tracking-wider">Attachments</p>
                  <div className="mt-3 space-y-3">
                    {content.attachments.map((a) => (
                      <Link
                        key={a.title}
                        href={`/learn/${slug}/${mod.id}/materials`}
                        className="block rounded-xl border border-line p-4 hover:bg-[#F6F8F3]"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#8FA33A]">{a.kind}</p>
                        <p className="mt-1.5 text-base font-medium">{a.title}</p>
                        <p className="mt-1 text-xs text-muted">{a.description}</p>
                        <p className="mt-2 text-[11px] text-muted">Open resource</p>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              <button
                type="button"
                onClick={() => markComplete(id)}
                disabled={done}
                style={{ backgroundColor: LIME_DARK }}
                className="mt-5 rounded-lg px-4 py-2 text-xs font-medium text-ink hover:brightness-95 disabled:opacity-70"
              >
                {done ? "Lesson completed ✓" : "Mark lesson complete"}
              </button>
            </aside>
          </div>

          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <Link href={prevHref} className="rounded-lg border border-ink bg-white px-4 py-2 text-xs font-medium">
              {lessonIndex > 0 ? "Previous lesson" : "Back to course"}
            </Link>
            <Link href={nextHref} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9]">
              {nextLabel}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
