import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import { comparePassword } from "@/lib/auth";
import {
  createSessionToken,
  getSessionCookieName,
  sessionCookieOptions,
} from "@/lib/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const users = await getUsersCollection();
    const user = await users.findOne({
      email: email.trim().toLowerCase(),
      status: "ACTIVE",
    });

    if (!user) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const passwordHash = user.passwordHash as string;
    const valid = await comparePassword(password, passwordHash);

    if (!valid) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      sub: String(user._id),
      email: user.email as string,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

    res.cookies.set(getSessionCookieName(), token, sessionCookieOptions());

    return res;
  } catch (err) {
    console.error("Erro no login:", err);
    return NextResponse.json(
      { error: "Erro ao entrar. Tente novamente." },
      { status: 500 }
    );
  }
}
