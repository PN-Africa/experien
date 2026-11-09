
import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-ink text-[#F5F2E9]">
      <div className="mx-auto grid max-w-[1400px] items-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-16 md:py-14">
        {/* Left: text */}
        <div>
          <p className="max-w-[300px] text-sm font-semibold uppercase leading-snug tracking-wider text-lime">
            Project management · Industry-focused
          </p>

          <h1 className="mt-5 text-4xl font-medium leading-[1.2] tracking-tight md:text-5xl">
            Learn project management in the language of your industry.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-snug md:text-xl">
            Practical courses for technology, construction and manufacturing professionals who
            want to plan and deliver projects with confidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/industries"
              className="rounded-xl bg-lime px-5 py-3 text-sm font-medium text-ink hover:brightness-95"
            >
              Explore industries
            </Link>

            <Link
              href="/industries"
              className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-ink hover:bg-white/90"
            >
              View courses
            </Link>
          </div>
        </div>

        {/* Right: featured course card */}
        <Link
          href="/courses/it-project-management"
          className="block rounded-[2rem] bg-[#F5F2E9] p-6 text-ink transition hover:-translate-y-1 md:p-7"
        >
          <p className="w-24 text-xs font-semibold uppercase leading-tight tracking-wider">
            Featured course
          </p>

          <h2 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">
            IT Project Management
          </h2>

          <p className="mt-2 text-sm text-muted">
            6 weeks · Self-paced online · ₦75,000
          </p>

          {/* Course details */}
          <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-[#315A50]">
            {["4 modules", "18 lessons", "4 quizzes"].map((t) => (
              <span
                key={t}
                className="rounded-full bg-[#EAF1E8] px-3 py-1.5"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Dashboard preview */}
          <div className="mt-4 rounded-2xl bg-[#EDF4EC] p-3">
            {/* Project overview and metrics */}
            <div className="grid grid-cols-[1.8fr_0.7fr_0.7fr_0.7fr] gap-2">

              {/* Project card */}
              <div className="min-w-0 rounded-xl border border-[#DDE6DC] bg-white p-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-[10px] font-medium">
                    CRM rollout
                  </p>

                  <span className="shrink-0 rounded-md bg-[#EAF3EC] px-1.5 py-1 text-[8px] text-[#315A50]">
                    On track
                  </span>
                </div>

                <p className="mt-1 text-[9px] text-muted">
                  Sample project
                </p>

                <div className="mt-2 flex justify-between gap-1 text-[9px] text-ink">
                  <span>12 teams</span>
                  <span>6 weeks</span>
                </div>
              </div>

              {/* Progress */}
              <div className="min-w-0 rounded-xl border border-[#DDE6DC] bg-white p-2">
                <p className="text-[9px] text-muted">Progress</p>
                <p className="mt-1 text-xs font-medium">68%</p>

                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#E4E9E2]">
                  <div className="h-full w-[68%] rounded-full bg-lime" />
                </div>
              </div>

              {/* Tasks */}
              <div className="min-w-0 rounded-xl border border-[#DDE6DC] bg-white p-2">
                <p className="text-[9px] text-muted">Tasks</p>
                <p className="mt-1 text-xs font-medium">17/25</p>
              </div>

              {/* Risk */}
              <div className="min-w-0 rounded-xl border border-[#DDE6DC] bg-white p-2">
                <p className="text-[9px] text-muted">Risk</p>
                <p className="mt-1 text-xs font-medium">Low</p>
              </div>
            </div>

            {/* Project task timeline */}
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { number: "01", task: "Define scope" },
                { number: "02", task: "Plan timeline" },
                { number: "03", task: "Track progress" },
              ].map((item) => (
                <div
                  key={item.number}
                  className="flex min-w-0 items-center gap-2 rounded-lg bg-[#F5F2E9] px-2 py-2"
                >
                  <span className="shrink-0 text-[9px] text-muted">
                    {item.number}
                  </span>

                  <span className="truncate text-[9px] font-medium">
                    {item.task}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
