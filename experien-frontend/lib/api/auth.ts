import type { LoginInput, RegisterInput, User } from "@/types/auth";
import { ApiError, apiFetch, isMockApi } from "./client";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- Mock-mode session (so reloads keep you "logged in" while the backend isn't connected) ----
const MOCK_KEY = "experien_mock_user";
function saveMockUser(u: User) {
  try { localStorage.setItem(MOCK_KEY, JSON.stringify(u)); } catch {}
}
function readMockUser(): User | null {
  try {
    const raw = localStorage.getItem(MOCK_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}
function clearMockUser() {
  try { localStorage.removeItem(MOCK_KEY); } catch {}
}

// ---- Real backend shape: user has id, name, email. Our User type uses fullName. ----
type ApiUser = { id: string; name: string; email: string; [k: string]: unknown };
const toUser = (u: ApiUser): User =>
  ({ ...(u as object), id: u.id, fullName: u.name, email: u.email }) as User;

export async function login(input: LoginInput): Promise<User> {
  if (isMockApi) {
    await wait(600);
    const u: User = { id: "mock-user", fullName: "Amaka Chukwu", email: input.email };
    saveMockUser(u);
    return u;
  }
  const data = await apiFetch<{ user: ApiUser }>("/auth/login", {
    method: "POST",
    json: { email: input.email, password: input.password },
  });
  return toUser(data.user);
}

export async function register(input: RegisterInput): Promise<User> {
  if (isMockApi) {
    await wait(600);
    const u: User = { id: "mock-user", fullName: input.fullName, email: input.email };
    saveMockUser(u);
    return u;
  }
  // Confirm-password and the terms checkbox are frontend-only, so they are not sent.
  const data = await apiFetch<{ user: ApiUser }>("/auth/register", {
    method: "POST",
    json: { name: input.fullName, email: input.email, password: input.password },
  });
  return toUser(data.user);
}

// The backend has no logout endpoint. The Next proxy clears the cookie.
export async function logout(): Promise<void> {
  if (isMockApi) {
    clearMockUser();
    return;
  }
  await apiFetch("/auth/logout", { method: "POST" });
}

// Returns the logged-in user, or null when there is no valid session.
export async function getCurrentUser(): Promise<User | null> {
  if (isMockApi) return readMockUser();
  try {
    const data = await apiFetch<{ user: ApiUser } | ApiUser>("/auth/me");
    const u = "user" in data ? data.user : data; // unknown whether /me returns { user } or the user itself
    return toUser(u as ApiUser);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null;
    throw err;
  }
}

// ---- Not in the backend yet (no endpoints in the docs). Keep on mock behaviour for now. ----

// Should always succeed for the learner, whether or not the email has an account.
export async function requestPasswordReset(input: { email: string }): Promise<void> {
  if (isMockApi) {
    await wait(600);
    return;
  }
  await apiFetch("/auth/forgot-password", { method: "POST", json: input });
}

// `token` comes from the reset link in the email: /reset-password?token=...
export async function resetPassword(input: { token: string; password: string }): Promise<void> {
  if (isMockApi) {
    await wait(600);
    return;
  }
  await apiFetch("/auth/reset-password", { method: "POST", json: input });
}

export async function verifyEmail(input: { email: string; code: string }): Promise<void> {
  if (isMockApi) {
    await wait(600);
    // any code works except 000000, so you can test the error state.
    if (input.code === "000000") throw new ApiError("That code is incorrect or has expired.", 400);
    return;
  }
  await apiFetch("/auth/verify-email", { method: "POST", json: input });
}

export async function resendVerification(input: { email: string }): Promise<void> {
  if (isMockApi) {
    await wait(400);
    return;
  }
  await apiFetch("/auth/resend-verification", { method: "POST", json: input });
}
