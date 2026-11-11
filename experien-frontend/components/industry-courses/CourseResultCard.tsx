import Link from "next/link";
import { Pathway } from "@/components/industries/pathways";
import { label } from "@/components/industries/styles";
import { courseChips } from "@/lib/utils/course";
import type { CourseCard } from "@/types/Course";

export default function CourseResultCard({ selected, course }: { selected: Pathway; course: CourseCard }) {
  return (
    <div className="grid overflow-hidden rounded-3xl border border-line bg-white md:grid-cols-[1fr_1.5fr]">
      {/* Left dark panel */}
      <div className="flex flex-col justify-between bg-ink p-7 text-[#F5F2E9]">
        <div>
          <p className={`${label} text-lime`}>{selected.name}</p>
          <h3 className="mt-4 text-2xl font-medium leading-snug">
            Build practical project-management skills for {selected.name.toLowerCase()} delivery.
          </h3>
          <p className="mt-4 text-sm text-white/80">Scope · Schedule · Stakeholders · Risk</p>
        </div>
        <span className="mt-6 inline-block w-fit rounded-md bg-lime px-3 py-1.5 text-xs font-semibold text-ink">
          Self-paced
        </span>
      </div>

      {/* Right details */}
      <div className="p-7">
        <p className={`${label} text-[#8FA33A]`}>Recommended course</p>
        <h3 className="mt-2 text-3xl font-medium">{course.title}</h3>
        <p className="mt-3 text-base leading-snug">{course.overview}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {courseChips(course).map((t) => (
            <span key={t} className="rounded-md bg-[#EDF4EC] px-3 py-1.5">{t}</span>
          ))}
        </div>

        <ul className="mt-5 space-y-2 text-sm">
          {[
            "Project scope and stakeholder planning",
            "Scheduling, dependencies and risk",
            "Practical templates and module quizzes",
          ].map((t) => (
            <li key={t} className="flex gap-2"><span>✓</span><span>{t}</span></li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/courses/${course.slug}`} className="rounded-lg bg-[#B5C35A] px-5 py-3 text-sm font-medium text-ink hover:brightness-95">
            View course details
          </Link>
          <Link href={`/courses/${course.slug}#curriculum`} className="rounded-lg border border-ink px-5 py-3 text-sm font-medium hover:bg-ink hover:text-white">
            View curriculum
          </Link>
        </div>
      </div>
    </div>
  );
}