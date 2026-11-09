"use client";

import { useCallback, useState } from "react";
import { getAdminCourses } from "@/lib/api/admin";
import { useLoad } from "./useLoad";
import { AdminHeader, Pill, StatCard, naira } from "./AdminUi";

const FILTERS = ["All courses", "Published", "Draft"] as const;
const LIME_DARK = "#B0C45A"; 
export default function AdminCourses() {
  const load = useCallback(() => getAdminCourses(), []);
  const { data: courses, error, loading } = useLoad(load);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All courses");
  const [picked, setPicked] = useState<string | null>(null);
  const [note, setNote] = useState("");

  if (loading) return <p className="text-sm text-muted">Loading courses…</p>;
  if (error || !courses) return <p role="alert" className="text-sm text-red-700">{error ?? "Could not load courses."}</p>;

  const shown = courses.filter((c) => filter === "All courses" || c.status === filter);
  const selected = courses.find((c) => c.id === picked) ?? courses[0];
  if (!selected) return <p className="text-sm text-muted">No courses yet.</p>;

  const industries = Array.from(new Set(courses.map((c) => c.industry.split(" / ")[0])));
  const drafts = courses.reduce((n, c) => n + c.draftChanges, 0);
  const soon = (what: string) => setNote(`${what} will be connected to the backend.`);

  return (
    <div className="space-y-5">
      <AdminHeader
        crumb="Admin / Courses"
        title="Course and content management"
        subtitle="Manage industry paths, course details, modules, learning materials, quizzes, pricing and publishing status."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published courses" value={String(courses.filter((c) => c.status === "Published").length)} sub="Across supported industries" />
        <StatCard label="Industries" value={String(industries.length)} sub={industries.join(" · ")} />
        <StatCard label="Draft changes" value={String(drafts)} sub="Needs review" />
        <StatCard label="Course price" value={naira(selected.price)} sub={selected.title} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} aria-pressed={filter === f} className={`rounded-full px-3 py-1 text-[11px] ${filter === f ? "bg-lime" : "bg-[#EAF1E8]"}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => soon("Add industry")} className="rounded-lg border border-ink bg-white px-4 py-2 text-xs font-medium">Add industry</button>
          <button type="button" onClick={() => soon("Create course")} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9]">Create course</button>
        </div>
      </div>
      {note && <p role="status" className="text-xs text-muted">{note}</p>}

      <section className="rounded-2xl border border-line bg-white p-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider">Courses</p>
        <ul className="mt-3 space-y-3">
          {shown.map((c) => (
            <li key={c.id} className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4 ${c.id === selected.id ? "border-ink" : "border-line"}`}>
              <div>
                <p className="text-sm font-medium">{c.title}</p>
                <p className="text-[11px] text-muted">{c.industry}</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span>{naira(c.price)}</span>
                <Pill tone={c.status === "Published" ? "green" : "cream"}>{c.status}</Pill>
                <button type="button" onClick={() => setPicked(c.id)} className="rounded-lg border border-ink px-4 py-2 font-medium">Manage</button>
              </div>
            </li>
          ))}
          {shown.length === 0 && <li className="text-sm text-muted">No {filter.toLowerCase()} yet.</li>}
        </ul>
      </section>

      <div className="grid items-start gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-2xl border border-line bg-white p-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider">{selected.title}</p>
          <h2 className="mt-2 text-2xl font-medium">Curriculum editor</h2>
          <p className="mt-1 text-xs text-muted">Add, reorder and update modules, lessons, materials and knowledge checks.</p>
          <ul className="mt-4 space-y-3">
            {selected.modules.map((m, i) => (
              <li key={m.id} className="flex items-center justify-between rounded-lg bg-[#EAF1E8] px-4 py-3 text-sm">
                <span className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime text-[10px]">{String(i + 1).padStart(2, "0")}</span>
                  {m.title}
                </span>
                <span className="text-xs text-muted">{m.lessonCount} lessons</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={() => soon("Add module")} className="rounded-lg border border-ink bg-white px-4 py-2 text-xs font-medium">Add module</button>
            <button type="button" onClick={() => soon("Saving course changes")} className="rounded-lg bg-ink px-4 py-2 text-xs font-medium text-[#F5F2E9]">Save course changes</button>
          </div>
        </section>

        <aside className="rounded-2xl bg-[#F5F2E9] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider">Publishing</p>
          <h2 className="mt-2 text-xl font-medium">Course settings</h2>
          <dl className="mt-4 space-y-3 text-xs">
            {[["Status", selected.status], ["Duration", selected.duration], ["Format", selected.format], ["Price", naira(selected.price)]].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[11px] text-muted">Changes to course content should be reviewed before publishing.</p>
          <button type="button" onClick={() => soon("Publishing")} style={{ backgroundColor: LIME_DARK }} className="mt-4 rounded-lg px-4 py-2 text-xs font-medium text-ink">
            Publish updates
          </button>
        </aside>
      </div>
    </div>
  );
}
