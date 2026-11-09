"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


const nav = [
  { label: "Overview", href: null },
  { label: "Industries", href: null },
  { label: "Courses", href: "/admin/courses" },
  { label: "Quizzes", href: null },
  { label: "Enrolments", href: "/admin/enrolments" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="flex h-14 items-center justify-between border-b border-line bg-white px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-wide">EXPERIEN ADMIN</span>
          <span className="rounded-full bg-[#EAF1E8] px-2.5 py-0.5 text-[10px]">Internal</span>
        </div>
        {/*  show the signed-in admin's name once the backend returns the role */}
        <span className="text-xs">Admin account</span>
      </header>
      <div className="flex flex-1 flex-col md:flex-row">
        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto bg-ink p-3 md:w-60 md:flex-col md:p-4">
          {nav.map((item) => {
            const active = item.href !== null && pathname.startsWith(item.href);
            const base = "block whitespace-nowrap rounded-lg px-3 py-2 text-sm";
            return item.href ? (
              <Link key={item.label} href={item.href} aria-current={active ? "page" : undefined} className={`${base} ${active ? "bg-lime font-medium text-ink" : "text-white/80 hover:bg-white/10"}`}>
                {item.label}
              </Link>
            ) : (
              <span key={item.label} title="Coming soon" className={`${base} text-white/40`}>
                {item.label}
              </span>
            );
          })}
        </nav>
        <div className="min-w-0 flex-1 p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
