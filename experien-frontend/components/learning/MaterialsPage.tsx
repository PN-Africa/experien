"use client";

import { useState } from "react";
import Link from "next/link";
import type { CourseModule } from "@/types/Course";
import type { Resource } from "@/types/learning";
import { pad } from "@/lib/utils/learning";
import LearnHeader from "./LearnHeader";

type Props = {
  mod: CourseModule;
  moduleIndex: number;
  resources: Resource[];
  backHref: string;
  quizHref: string;
};

const verb: Record<Resource["kind"], string> = { PDF: "Open", Template: "Open", Image: "View", Notes: "Open" };

export default function MaterialsPage({ mod, moduleIndex, resources, backHref, quizHref }: Props) {
  const [selected, setSelected] = useState(0);
  const [zoom, setZoom] = useState(1);
  const r = resources[selected];

  return (
    <div>
      <LearnHeader
        eyebrow={`Module ${pad(moduleIndex + 1)} · Materials`}
        title="Course materials"
        subtitle="Open the PDFs, templates, images and course notes attached to this module."
        chips={[`${resources.length} resources`, "Enrolled access", `Module ${pad(moduleIndex + 1)}`]}
      />

      <section className="bg-[#EAF1E8] text-ink">
        <div className="mx-auto grid max-w-[1400px] items-start gap-5 px-6 py-10 md:px-16 md:py-12 lg:grid-cols-[250px_1fr]">
          <aside className="rounded-2xl border border-line bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider">Module resources</p>
            <ul className="mt-3 space-y-2">
              {resources.map((res, i) => (
                <li key={res.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-current={i === selected}
                    className={`w-full rounded-lg px-3 py-2.5 text-left ${i === selected ? "bg-[#EAF1E8]" : "hover:bg-[#F6F8F3]"}`}
                  >
                    <span className="block text-[10px] uppercase tracking-wider text-muted">{res.kind}</span>
                    <span className="block text-sm font-medium">{res.title}</span>
                    <span className="block text-[11px] text-muted">{i === selected ? "Selected" : verb[res.kind]}</span>
                  </button>
                </li>
              ))}
            </ul>
            <Link href={backHref} className="mt-4 inline-block rounded-lg border border-ink px-3 py-1.5 text-xs font-medium">
              Back to lesson
            </Link>
          </aside>

          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-medium">{r.file}</p>
                <p className="text-[11px] text-muted">
                  {r.kind} · Module {pad(moduleIndex + 1)} · Learner resource
                </p>
              </div>
              <p className="text-[11px] text-muted">Page 1 / —</p>
            </div>

            {/* MOCK document: replace with a real PDF / image viewer later */}
            {r.fileUrl ? (
  <iframe key={r.id} src={r.fileUrl} title={r.file} className="mt-3 h-[600px] w-full rounded-2xl border border-line bg-white" />
) : (
            <div className="mt-3 overflow-auto rounded-2xl border border-line bg-[#F5F2E9] p-6">
              <div style={{ zoom }}>
                <p className="text-[10px] font-semibold uppercase tracking-wider">{r.kind === "Template" ? "Template" : "Project planning notes"}</p>
                <h2 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">{r.heading}</h2>
                <p className="mt-2 max-w-2xl text-sm text-muted">{r.intro}</p>
                <div className="mt-4 h-24 rounded-lg bg-[#E4E9E2] md:h-36" />
                <ol className="mt-4 list-inside list-decimal space-y-2 text-sm">
                  {r.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ol>
              </div>
            </div>

)}
                       <div className="mt-4 flex flex-wrap gap-3">
              {!r.fileUrl && (
                <>
                  <button type="button" onClick={() => setZoom((z) => Math.max(0.8, +(z - 0.1).toFixed(1)))} className="rounded-lg border border-ink bg-white px-4 py-2 text-xs font-medium">
                    Zoom out
                  </button>
                  <button type="button" onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.1).toFixed(1)))} className="rounded-lg border border-ink bg-white px-4 py-2 text-xs font-medium">
                    Zoom in
                  </button>
                </>
              )}
              <Link href={quizHref} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9]">
                Continue to module quiz
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
