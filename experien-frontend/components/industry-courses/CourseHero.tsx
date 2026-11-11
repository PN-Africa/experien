import Link from "next/link";
import { Pathway } from "@/components/industries/pathways";
import { label, wrap } from "@/components/industries/styles";

export default function CourseHero({ selected }: { selected: Pathway }) {
  return (
    <section className="bg-ink text-[#F5F2E9]">
      <div className={`${wrap} grid items-center gap-20 py-12 md:grid-cols-[3fr_1.3fr] md:py-16`}>
        <div>
          <p className={`${label} text-[#D8F36A]`}>
            <Link href="/">Home</Link> / <Link href="/industries">Industries</Link> / {selected.name}
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.25]  md:text-5xl">
            Find the right project-management course for your {selected.name} path.
          </h1>
          <p className="mt-5 max-w-2xl text-base font-extralight  leading-snug">
           Search the course currently available for {selected.name} and review the format, curriculum, practical materials and price before you enrol.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {[selected.name, selected.pathway, "Course available"].map((c) => (
              <span key={c} className="rounded-full bg-[#F5F2E9] text-[#123C35] border border-white/30 px-3 py-1.5">{c}</span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#F5F2E9] p-8 text-ink">
          <p className={label}>Your pathway</p>
          <h2 className="mt-2 text-2xl font-medium">
            {selected.name} → {selected.pathway}
          </h2>
          <p className="mt-3 text-xs leading-5 tracking-wide text-base text-muted">
            Use the filters below to refine the results, then open the course to review its full
            curriculum.
          </p>
        </div>
      </div>
    </section>
  );
}