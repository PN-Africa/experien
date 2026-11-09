"use client";

import { usePathname } from "next/navigation";

// Hides the public navbar and footer on /admin pages, which have their own shell.
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return pathname.startsWith("/admin") ? null : <>{children}</>;
}
