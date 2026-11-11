import Link from "next/link";
import { Pathway } from "./pathways";
import { label, wrap } from "./styles";
import { courseChips } from "@/lib/utils/course";

export default function SelectionSummary({ selected }: { selected: Pathway }) {
  return (
    <section className="bg-[#F5F2E9]">
      <div className={`${wrap} py-14`}>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className={label}>Your selection</p>
            <p className="mt-2 text-2xl font-medium">
              {selected.name} → {selected.pathway}
            </p>
          </div>
          <a
            href="#choose-industry"
            className="rounded-lg border border-ink bg-white px-5 py-2.5 text-sm font-medium hover:bg-ink hover:text-white"
          >
            Change industry
          </a>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-[1.6fr_1fr]">
          {/* Recommended course */}
          <div className="rounded-3xl bg-ink p-7 text-[#F5F2E9] md:p-8">
            <p className={`${label} text-lime`}>Recommended course</p>
            <h3 className="mt-3 text-3xl font-medium">{selected.courseTitle}</h3>
            <p className="mt-4 max-w-2xl text-base leading-snug">{selected.courseSummary}</p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-ink ">
   {courseChips(selected.courses?.[0]).map((t) => (
                <span key={t} className="rounded-xl bg-white px-3 py-1.5">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/courses/${selected.slug}`}
                className="rounded-lg bg-[#B5C35A] px-5 py-3 text-sm font-medium text-ink hover:brightness-95"
              >
                View course details
              </Link>
              <Link
                href={`/industries/${selected.id}`}
                className="rounded-lg bg-white px-5 py-3 text-sm font-medium text-ink hover:bg-white/90"
              >
                Browse all courses
              </Link>
            </div>
          </div>

          {/* Why this industry */}
          <div className="rounded-3xl bg-white p-7">
            <h3 className="text-2xl font-medium">Why {selected.name}?</h3>
            <p className="mt-3 text-sm text-muted">{selected.whyIntro}</p>
            <ul className="mt-5 space-y-3 text-base">
              {selected.why.map((w) => (
                <li key={w} className="flex gap-3">
                  <span>✓</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}