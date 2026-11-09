export const naira = (n: number | null) => (n === null ? "—" : `₦${n.toLocaleString("en-NG")}`);

export function AdminHeader({ crumb, title, subtitle }: { crumb: string; title: string; subtitle: string }) {
  return (
    <header>
      <p className="text-[11px] font-semibold uppercase tracking-wider">{crumb}</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-3 max-w-3xl text-sm text-muted md:text-base">{subtitle}</p>
    </header>
  );
}

export function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider">{label}</p>
      <p className="mt-3 text-2xl font-medium">{value}</p>
      <p className="mt-2 text-[11px] text-muted">{sub}</p>
    </div>
  );
}

export function Pill({ children, tone = "green" }: { children: React.ReactNode; tone?: "green" | "cream" }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] ${tone === "green" ? "bg-[#EAF1E8]" : "bg-[#F5F2E9]"}`}>
      {children}
    </span>
  );
}
