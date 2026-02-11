import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getSessionCookieName,
  sessionCookieOptions,
} from "@/lib/session";

export async function GET(request: NextRequest) {
  const noRedirect = request.nextUrl.searchParams.get("no_redirect") === "1";

  if (noRedirect) {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(getSessionCookieName(), "", sessionCookieOptions(0));
    return res;
  }

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  const res = NextResponse.redirect(url);
  res.cookies.set(getSessionCookieName(), "", sessionCookieOptions(0));
  return res;
}
