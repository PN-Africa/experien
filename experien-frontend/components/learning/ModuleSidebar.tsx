import Link from "next/link";
import type { Course } from "@/types/Course";
import { pad } from "@/lib/utils/learning";

type Props = {
  course: Course;
  statuses: string[]; // "Complete" | "Current" | "Upcoming", one per module
  currentModule: number;
  pct: number;
  onSelect: (moduleIndex: number) => void;
};

export default function ModuleSidebar({ course, statuses, currentModule, pct, onSelect }: Props) {
  return (
    <aside className="rounded-2xl border border-line bg-white p-4 lg:sticky lg:top-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider">Course curriculum</p>
      <p className="mt-2 text-base font-medium">{course.title}</p>

      <ul className="mt-4 space-y-2">
        {course.modules.map((m, i) => (
          <li key={m.id}>
            <button
              type="button"
              onClick={() => onSelect(i)}
              aria-current={i === currentModule}
              className={`w-full rounded-lg px-3 py-2.5 text-left ${
                i === currentModule ? "bg-[#EAF1E8]" : "hover:bg-[#F6F8F3]"
              }`}
            >
              <span className="text-sm font-medium">
                {pad(i + 1)} {m.shortTitle}
              </span>
              <span className="mt-0.5 block text-[11px] text-muted">{statuses[i]}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[11px] text-muted">Course progress</p>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E4E9E2]">
        <div className="h-full rounded-full bg-lime" style={{ width: `${pct}%` }} />
      </div>
      <Link href={`/learn/${course.slug}/progress`} className="mt-4 inline-block text-xs font-medium underline">
        View course progress
      </Link>
    </aside>
  );
}
