import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { hashPassword, validatePassword } from "@/lib/auth";

/**
 * POST /api/auth/sync-password
 * Após o usuário redefinir a senha via Supabase Auth (updateUser), sincroniza
 * o hash da nova senha na tabela profiles para o login customizado continuar funcionando.
 * Requer sessão Supabase válida (recovery) no body.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      newPassword,
      access_token,
      refresh_token,
    } = body as {
      newPassword?: string;
      access_token?: string;
      refresh_token?: string;
    };

    if (!newPassword?.trim() || !access_token || !refresh_token) {
      return NextResponse.json(
        { error: "Sessão inválida ou senha ausente." },
        { status: 400 }
      );
    }

    const passwordValidation = validatePassword(newPassword.trim());
    if (!passwordValidation.ok) {
      return NextResponse.json(
        {
          error: `A senha deve ter: ${passwordValidation.errors.join(", ").toLowerCase()}.`,
        },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const { data: sessionData, error: sessionError } = await supabase.auth.setSession(
      { access_token, refresh_token }
    );

    if (sessionError || !sessionData?.user?.email) {
      return NextResponse.json(
        { error: "Sessão inválida ou expirada." },
        { status: 401 }
      );
    }

    const email = sessionData.user.email.trim().toLowerCase();
    const passwordHash = await hashPassword(newPassword.trim());
    const now = new Date().toISOString();

    const service = createServiceRoleClient();
    const { error: updateError } = await service
      .from("profiles")
      .update({
        password_hash: passwordHash,
        last_password_change: now,
        updated_at: now,
      })
      .eq("email", email);

    if (updateError) {
      console.error("[sync-password] update profiles:", updateError);
      return NextResponse.json(
        { error: "Erro ao atualizar senha. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[sync-password] Erro:", err);
    return NextResponse.json(
      { error: "Erro ao atualizar senha. Tente novamente." },
      { status: 500 }
    );
  }
}
