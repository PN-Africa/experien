
"use client";

import { usePathname } from "next/navigation";

export default function PageShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Admin pages have their own shell (sidebar + top bar) and no page padding.
  if (pathname.startsWith("/admin")) return <main className="flex-1">{children}</main>;

  const fullWidth =
    pathname === "/" ||
    pathname.startsWith("/industries") ||
    pathname.startsWith("/courses") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/verify-email");

  if (fullWidth) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
      {children}
    </main>
  );
}
