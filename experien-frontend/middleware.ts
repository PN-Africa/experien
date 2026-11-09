import { NextResponse, type NextRequest } from "next/server";
import { GUEST_ONLY_PATHS, PROTECTED_PATHS, TOKEN_COOKIE, pathMatches } from "@/lib/auth/constants";

export function middleware(req: NextRequest) {
  // Mock mode has no cookie, so don't lock yourself out while developing.
  if (!process.env.NEXT_PUBLIC_API_BASE_URL) return NextResponse.next();

  const { pathname, search } = req.nextUrl;
  const hasSession = Boolean(req.cookies.get(TOKEN_COOKIE)?.value);

  if (pathMatches(pathname, PROTECTED_PATHS) && !hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    // Your login/register pages read ?redirect= (see safeRedirect in lib/utils/auth.ts)
    url.search = `?redirect=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  if (pathMatches(pathname, GUEST_ONLY_PATHS) && hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/learn/:path*", "/checkout/:path*", "/login", "/register"],
};
