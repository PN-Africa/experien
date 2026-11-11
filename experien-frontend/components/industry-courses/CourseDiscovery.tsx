"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pathway, pathways } from "@/components/industries/pathways";
import { label, wrap } from "@/components/industries/styles";
import CourseResultCard from "./CourseResultCard";

const field = "mt-1 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm";

export default function CourseDiscovery({ selected }: { selected: Pathway }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

   const q = search.trim().toLowerCase();
  const visible = (selected.courses ?? []).filter((c) => q === "" || c.title.toLowerCase().includes(q));

  return (
    <section className="bg-white">
      <div className={`${wrap} py-14`}>
        <p className={label}>Course discovery</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-medium leading-tight tracking-tight md:text-4xl">
          Browse the course available for your selected industry.
        </h2>
        <p className="mt-4 text-base font-extralight">
          Your industry selection is already applied. Refine the result by course path or training format.
        </p>

        {/* Applied filters */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span>Applied filters:</span>
            {[selected.name, selected.pathway, "Self-paced online"].map((f) => (
              <span key={f} className="rounded-full bg-[#EDF4EC] px-3 py-1.5">{f} ×</span>
            ))}
          </div>
          <button
            onClick={() => setSearch("")}
            className="rounded-lg border border-[#123C35] p-4 text-xs font-semibold hover:bg-[#F5F2E9]"
          >
            Reset filters
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[300px_1fr]">
          {/* Refine panel */}
          <aside className="rounded-2xl bg-[#EDF4EC] p-4">
            <h3 className="text-xl font-medium">Refine results</h3>
            <p className="mt-1 text-xs text-muted">Filters reflect the current MVP catalogue.</p>

            <label className="mt-5 block text-xs font-medium ">
              Search
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses"
                className={field}
              />
            </label>

            <label className="mt-4 block text-xs font-medium ">
              Industry
              <select
                value={selected.id}
                onChange={(e) => router.push(`/industries/${e.target.value}`)}
                className={field}
              >
                {pathways.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-xs font-medium ">
              Course path
              <select className={field} defaultValue={selected.pathway}>
                <option>{selected.pathway}</option>
              </select>
            </label>

            <label className="mt-4 block text-xs font-medium ">
              Training format
              <select className={field} defaultValue="Self-paced online">
                <option>Self-paced online</option>
              </select>
            </label>

            <Link
              href="/industries"
              className="mt-6 block rounded-lg bg-white border border-ink px-4 py-2.5 text-center text-sm font-medium hover:bg-ink hover:text-white"
            >
              Back to industries
            </Link>
          </aside>

          {/* Results */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-lg font-medium">
                  {visible.length} {visible.length === 1 ? "course" : "courses"} available
                </p>
                <p className="text-sm text-muted">{selected.name} · {selected.pathway}</p>
              </div>
              <span className="rounded-lg bg-[#EDF5ED] px-3 py-1 text-xs">Best match</span>
            </div>

                        <div className="mt-4 space-y-4">
              {visible.length > 0 ? (
                visible.map((c) => <CourseResultCard key={c.slug} selected={selected} course={c} />)
              ) : (
                <p className="rounded-2xl border border-line p-8 text-center text-sm text-muted">
                  No courses match your search. Click Reset filters.
                </p>
              )}
            </div>

            <p className="mt-4 text-xs text-muted">
              {selected.name} currently has {(selected.courses ?? []).length}{" "}
              {(selected.courses ?? []).length === 1 ? "course" : "courses"}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}