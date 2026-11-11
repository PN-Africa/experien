import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth/constants";

export const maxDuration = 60; // Render cold starts can be slow

const BACKEND = process.env.BACKEND_URL?.replace(/\/+$/, "");
const AUTH_ENTRY = ["/auth/login", "/auth/register"];

async function handler(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const { path } = params;
  const endpoint = "/" + path.join("/");
  const token = cookies().get(TOKEN_COOKIE)?.value; // Next 14: cookies() is synchronous

  // The backend has no logout endpoint: clearing the cookie is the logout.
  if (endpoint === "/auth/logout") {
    const res = NextResponse.json({ success: true, data: null });
    res.cookies.delete(TOKEN_COOKIE);
    return res;
  }

  if (!BACKEND) {
    return NextResponse.json(
      { success: false, message: "The backend URL is not configured on the server." },
      { status: 500 }
    );
  }

  const hasBody = !["GET", "HEAD"].includes(req.method);
  let upstream: Response;
  try {
    upstream = await fetch(BACKEND + endpoint + req.nextUrl.search, {
      method: req.method,
      headers: {
        Accept: "application/json",
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: hasBody ? await req.text() : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the server." },
      { status: 502 }
    );
  }

  const text = await upstream.text();

  let body: any = null;
  try {
    body = JSON.parse(text);
  } catch {}

  
  let newToken: string | undefined;
  if (upstream.ok && AUTH_ENTRY.includes(endpoint) && body?.data?.token) {
    newToken = body.data.token;
    delete body.data.token;
  }

  const res = NextResponse.json(
    body ?? { success: false, message: "Unexpected response from the server." },
    { status: body ? upstream.status : 502 }
  );

  if (newToken) {
    res.cookies.set(TOKEN_COOKIE, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // match the JWT expiry once the backend dev confirms it
    });
  }

  // Expired or invalid token: drop the cookie so middleware stops treating the user as logged in.
  if (upstream.status === 401 && token && !AUTH_ENTRY.includes(endpoint)) {
    res.cookies.delete(TOKEN_COOKIE);
  }
  return res;
}

export { handler as GET, handler as POST, handler as PUT, handler as PATCH, handler as DELETE };
