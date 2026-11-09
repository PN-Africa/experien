// The single API client. Every request goes through apiFetch so the base URL,
// headers and error handling live in one place.
// Backend responses are { success: true, data } or { success: false, message, errors? }.

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

// No base URL set = mock mode, so the api functions return mock responses.
export const isMockApi = BASE_URL === "";

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

// Backend sends errors: [{ field, message }]. Also handles { field: message } and { field: [messages] }.
function normalizeErrors(errors: unknown): Record<string, string> | undefined {
  if (!errors) return undefined;
  const out: Record<string, string> = {};
  if (Array.isArray(errors)) {
    for (const e of errors) {
      const key = e?.field ?? e?.path ?? e?.param;
      if (key && e?.message && !out[key]) out[key] = e.message;
    }
  } else if (typeof errors === "object") {
    for (const [k, v] of Object.entries(errors as Record<string, unknown>)) {
      out[k] = Array.isArray(v) ? String(v[0]) : String(v);
    }
  }
  return Object.keys(out).length ? out : undefined;
}

type Options = Omit<RequestInit, "body"> & { json?: unknown };

export async function apiFetch<T>(path: string, options: Options = {}): Promise<T> {
  const { json, headers, ...rest } = options;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: {
        Accept: "application/json",
        ...(json !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: json !== undefined ? JSON.stringify(json) : undefined,
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection and try again.", 0);
  }

  const body = await res.json().catch(() => null);

  if (!res.ok || body?.success === false) {
    // A 401 on a protected (non-auth) call means the session is gone.
    // /auth/* calls handle their own 401s (wrong password, or "no session" from /auth/me on a public page).
    if (res.status === 401 && typeof window !== "undefined" && !path.startsWith("/auth/")) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    throw new ApiError(
      body?.message ?? "Something went wrong. Please try again.",
      res.status,
      normalizeErrors(body?.errors)
    );
  }

  return body.data as T;
}
