export default function LearnHeader({
  eyebrow,
  title,
  subtitle,
  chips = [],
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  chips?: string[];
  children?: React.ReactNode;
}) {
  return (
    <section className="bg-white text-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-10 md:px-16 md:py-12">
        <p className="text-[11px] font-semibold uppercase tracking-wider">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">{subtitle}</p>
        {chips.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((c) => (
              <span key={c} className="rounded-full bg-[#EAF1E8] px-3 py-1 text-xs font-medium">
                {c}
              </span>
            ))}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
