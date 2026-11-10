import FirstName from "@/components/auth/FirstName";

export type Stat = { label: string; value: string; sub: string };

export default function DashboardHero({ firstName, stats }: { firstName: string; stats: Stat[] }) {
  return (
    <section className="bg-white text-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-16 md:py-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider">My learning</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-5xl">Welcome back, <FirstName fallback={firstName} />.</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">
          Continue your active course, review your progress and open the next learning activity.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-line p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted">{s.label}</p>
              <p className="mt-2 text-2xl font-medium">{s.value}</p>
              <p className="mt-1 text-[11px] text-muted">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
