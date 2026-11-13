import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import { TOKEN_COOKIE } from "@/lib/auth/constants";

export const metadata: Metadata = { title: "Admin | Experien" };

const ADMIN_ROLE = "admin";

// Asks the backend who the token belongs to. Anything unclear (error, timeout) is treated as "no access".
async function checkAdmin(): Promise<"admin" | "login" | "denied"> {
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) return "admin"; // mock mode: no real login to check
  const token = cookies().get(TOKEN_COOKIE)?.value;
  if (!token) return "login";
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(30000), // Render cold starts can be slow
    });
    if (res.status === 401) return "login";
    if (!res.ok) return "denied";
    const body = await res.json();
    const role = body?.data?.user?.role ?? body?.data?.role;
    return role === ADMIN_ROLE ? "admin" : "denied";
  } catch {
    return "denied";
  }
}

// The backend must also refuse admin endpoints for non-admin tokens: this check only hides the pages.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const access = await checkAdmin();
  if (access === "login") redirect("/login?redirect=/admin");
  if (access === "denied") redirect("/dashboard");
  return <AdminShell>{children}</AdminShell>;
}