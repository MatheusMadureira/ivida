import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { compareResetCode, hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, codigoRestauracao, newPassword } = body as {
      email?: string;
      codigoRestauracao?: string;
      newPassword?: string;
    };

    if (!email?.trim() || !codigoRestauracao?.trim() || !newPassword) {
      return NextResponse.json(
        { error: "E-mail, código e nova senha são obrigatórios." },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const { data: user, error: fetchError } = await supabase
      .from("profiles")
      .select("id, password_reset_code")
      .eq("email", email.trim().toLowerCase())
      .eq("status", "ACTIVE")
      .single();

    if (fetchError || !user) {
      return NextResponse.json(
        { error: "Dados inválidos. Refaça a validação." },
        { status: 401 }
      );
    }

    if (!user.password_reset_code) {
      return NextResponse.json(
        { error: "Dados inválidos. Refaça a validação." },
        { status: 401 }
      );
    }

    const codeValid = await compareResetCode(
      codigoRestauracao.trim(),
      user.password_reset_code
    );
    if (!codeValid) {
      return NextResponse.json(
        { error: "Código de restauração inválido ou já utilizado." },
        { status: 401 }
      );
    }

    const passwordHash = await hashPassword(newPassword);
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        password_hash: passwordHash,
        password_reset_code: null,
        last_password_change: now,
        updated_at: now,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Erro ao resetar senha:", updateError);
      return NextResponse.json(
        { error: "Erro ao alterar senha. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Senha alterada. Faça login com a nova senha.",
    });
  } catch (err) {
    console.error("Erro ao resetar senha:", err);
    return NextResponse.json(
      { error: "Erro ao alterar senha. Tente novamente." },
      { status: 500 }
    );
  }
}
