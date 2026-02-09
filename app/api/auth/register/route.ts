import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  hashPassword,
  generateResetCode,
  hashResetCode,
  getCpfHash,
} from "@/lib/auth";
import type { ProfileInsert } from "@/types/user";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, cpf, password } = body as {
      name?: string;
      email?: string;
      cpf?: string;
      password?: string;
    };

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const emailNorm = email.trim().toLowerCase();

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", emailNorm)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma conta com este e-mail." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const resetCodePlain = generateResetCode();
    const passwordResetCodeHash = await hashResetCode(resetCodePlain);

    const now = new Date().toISOString();
    const newProfile: ProfileInsert = {
      name: name.trim(),
      email: emailNorm,
      cpf_hash: cpf ? getCpfHash(String(cpf).replace(/\D/g, "")) : null,
      password_hash: passwordHash,
      roles: [],
      status: "ACTIVE",
      photo_url: null,
      email_verified: false,
      last_password_change: now,
      password_reset_code: passwordResetCodeHash,
      created_at: now,
      updated_at: now,
      last_login_at: null,
    };

    const { error: insertError } = await supabase
      .from("profiles")
      .insert(newProfile);

    if (insertError) {
      console.error("Erro no registro:", insertError);
      return NextResponse.json(
        { error: "Erro ao criar conta. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      resetCode: resetCodePlain,
      message:
        "Conta criada. Guarde o código de restauração em local seguro para recuperar a senha se necessário.",
    });
  } catch (err) {
    console.error("Erro no registro:", err);
    return NextResponse.json(
      { error: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    );
  }
}
