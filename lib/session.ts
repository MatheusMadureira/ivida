import * as jose from "jose";

const COOKIE_NAME = "ivida_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ivida-jwt-secret-change-in-production"
);
const EXPIRY = "7d";

export interface SessionPayload {
  sub: string;
  email: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET);
    const sub = payload.sub as string;
    const email = payload.email as string;
    if (!sub || !email) return null;
    return { sub, email };
  } catch {
    return null;
  }
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}

export function sessionCookieOptions(maxAge: number = 60 * 60 * 24 * 7) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
