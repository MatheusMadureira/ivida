import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSessionCookieName,
  sessionCookieOptions,
  verifySessionToken,
} from "@/lib/session";

const PROTECTED_PREFIXES = ["/dashboard", "/area-membros", "/perfil"] as const;

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set(getSessionCookieName(), "", sessionCookieOptions(0));
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/area-membros",
    "/area-membros/:path*",
    "/perfil",
    "/perfil/:path*",
  ],
};
