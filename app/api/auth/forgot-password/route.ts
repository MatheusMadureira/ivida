import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import crypto from "crypto";

/**
 * POST /api/auth/forgot-password
 * Fluxo Supabase Auth: solicita apenas o e-mail e envia o link de reset via Supabase.
 * Não usa código de restauração nem lógica manual no banco.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };
    const emailNorm = email?.trim()?.toLowerCase();

    if (!emailNorm) {
      return NextResponse.json(
        { error: "Informe o e-mail." },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", emailNorm)
      .eq("status", "ACTIVE")
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({
        success: true,
        message:
          "Se existir uma conta com este e-mail, você receberá um link para redefinir a senha.",
      });
    }

    const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 });
    const authUser = list?.users?.find(
      (u) => u.email?.toLowerCase() === emailNorm
    );

    if (!authUser) {
      const tempPassword = crypto.randomBytes(24).toString("base64url");
      const { error: createErr } = await supabase.auth.admin.createUser({
        email: emailNorm,
        password: tempPassword,
        email_confirm: true,
      });
      if (createErr) {
        console.error("[forgot-password] createUser:", createErr.message);
        return NextResponse.json({
          success: true,
          message:
            "Se existir uma conta com este e-mail, você receberá um link para redefinir a senha.",
        });
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "");
    const origin =
      baseUrl ||
      (request.headers.get("x-forwarded-host")
        ? `https://${request.headers.get("x-forwarded-host")}`
        : new URL(request.url).origin);
    const redirectTo = `${origin}/resetar-senha`;

    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
      emailNorm,
      { redirectTo }
    );

    if (resetErr) {
      console.error("[forgot-password] resetPasswordForEmail:", resetErr.message);
    }

    return NextResponse.json({
      success: true,
      message:
        "Se existir uma conta com este e-mail, você receberá um link para redefinir a senha.",
    });
  } catch (err) {
    console.error("[forgot-password] Erro:", err);
    return NextResponse.json(
      { error: "Erro ao processar. Tente novamente." },
      { status: 500 }
    );
  }
}
