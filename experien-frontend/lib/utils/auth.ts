// Only allow redirects to pages on this site (stops /login?redirect=https://evil.com).
export function safeRedirect(path: string | undefined, fallback = "/dashboard") {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return fallback;
  }
  return path;
}

export const isEmail = (value: string) => /^\S+@\S+\.\S+$/.test(value);

// At least 8 characters, with letters and numbers
export const isStrongPassword = (value: string) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value);

// The backend has no email-verification endpoint and logs the learner in on register,
// so signup goes straight to the app. Set back to true if the backend adds verification.
export const REQUIRE_EMAIL_VERIFICATION = false;
