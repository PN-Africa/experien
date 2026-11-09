"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { LoginInput, RegisterInput, User } from "@/types/auth";
import * as authApi from "@/lib/api/auth";
import { isMockApi } from "@/lib/api/client";
import { PROTECTED_PATHS, pathMatches } from "@/lib/auth/constants";

type Status = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  user: User | null;
  status: Status;
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>("loading");

  const refresh = useCallback(async () => {
    try {
      const u = await authApi.getCurrentUser();
      setUser(u);
      setStatus(u ? "authenticated" : "unauthenticated");
    } catch {
      // Network error or cold start: don't log an existing user out because of it.
      setStatus((s) => (s === "loading" ? "unauthenticated" : s));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Session gone (expired token, or any 401 from a protected call) while on a protected page:
  // send the learner to log in, and bring them back afterwards.
  useEffect(() => {
    if (isMockApi || status !== "unauthenticated") return;
    if (pathMatches(pathname, PROTECTED_PATHS)) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  // apiFetch fires this on a 401 from a protected (non-auth) call.
  useEffect(() => {
    const onUnauthorized = () => {
      setUser(null);
      setStatus("unauthenticated");
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const u = await authApi.login(input);
    setUser(u);
    setStatus("authenticated");
    return u;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const u = await authApi.register(input);
    setUser(u);
    setStatus("authenticated");
    return u;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => {});
    setUser(null);
    setStatus("unauthenticated");
    router.replace("/login");
    router.refresh();
  }, [router]);

  const value = useMemo(
    () => ({ user, status, login, register, logout, refresh }),
    [user, status, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
