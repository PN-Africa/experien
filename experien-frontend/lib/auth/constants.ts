export const TOKEN_COOKIE = "experien_token";

// Pages that need a login. Used by middleware.ts and AuthProvider.
export const PROTECTED_PATHS = ["/dashboard", "/learn", "/checkout", "/admin"];

// Pages a logged-in learner shouldn't see.
export const GUEST_ONLY_PATHS = ["/login", "/register"];

export const pathMatches = (path: string, bases: string[]) =>
  bases.some((b) => path === b || path.startsWith(b + "/"));
