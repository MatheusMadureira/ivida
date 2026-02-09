import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
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

    const supabase = createServiceRoleClient();
    const { data: user, error } = await supabase
      .from("profiles")
      .select("id, name, email, password_hash")
      .eq("email", email.trim().toLowerCase())
      .eq("status", "ACTIVE")
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const now = new Date().toISOString();
    await supabase
      .from("profiles")
      .update({ last_login_at: now, updated_at: now })
      .eq("id", user.id);

    const token = await createSessionToken({
      sub: user.id,
      email: user.email,
    });

    const res = NextResponse.json({
      success: true,
      user: {
        id: user.id,
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
