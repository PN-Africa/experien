"use client";

import { useAuth } from "./AuthProvider";
import { isMockApi } from "@/lib/api/client";

// Shows the logged-in learner's first name.
// Mock mode: shows `fallback` (the mock learner). Real mode: shows the registered name,
// with a small placeholder while the session loads so the wrong name never flashes.
export default function FirstName({ fallback }: { fallback: string }) {
  const { user, status } = useAuth();

  if (isMockApi) return <>{user ? user.fullName.split(" ")[0] : fallback}</>;

  if (status === "loading") {
    return (
      <span
        aria-hidden
        className="inline-block h-[0.8em] w-24 animate-pulse rounded bg-line align-middle"
      />
    );
  }

  return <>{user ? user.fullName.split(" ")[0] : "there"}</>;
}
