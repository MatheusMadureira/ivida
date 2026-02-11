import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { hashPassword, getCpfHash, validatePassword } from "@/lib/auth";
import { DEFAULT_ROLE } from "@/lib/constants";
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

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.ok) {
      return NextResponse.json(
        {
          error: `A senha deve ter: ${passwordValidation.errors.join(", ").toLowerCase()}.`,
        },
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

    const { error: authError } = await supabase.auth.admin.createUser({
      email: emailNorm,
      password,
      email_confirm: true,
    });

    if (authError) {
      if (authError.message?.toLowerCase().includes("already been registered")) {
        return NextResponse.json(
          { error: "Já existe uma conta com este e-mail." },
          { status: 409 }
        );
      }
      console.error("Erro ao criar usuário Supabase Auth:", authError);
      return NextResponse.json(
        { error: "Erro ao criar conta. Tente novamente." },
        { status: 500 }
      );
    }

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();
    const newProfile: ProfileInsert = {
      name: name.trim(),
      email: emailNorm,
      cpf_hash: cpf ? getCpfHash(String(cpf).replace(/\D/g, "")) : null,
      password_hash: passwordHash,
      status: "ACTIVE",
      photo_url: null,
      phone: null,
      email_verified: false,
      last_password_change: now,
      created_at: now,
      updated_at: now,
      last_login_at: null,
    };

    const { data: insertedProfile, error: insertError } = await supabase
      .from("profiles")
      .insert(newProfile)
      .select("id")
      .single();

    if (insertError) {
      console.error("Erro no registro:", insertError);
      return NextResponse.json(
        { error: "Erro ao criar conta. Tente novamente." },
        { status: 500 }
      );
    }

    const profileId = insertedProfile?.id;
    if (profileId) {
      const { data: roleRow } = await supabase
        .from("roles")
        .select("id")
        .eq("name", DEFAULT_ROLE)
        .single();
      if (roleRow?.id) {
        await supabase.from("profile_roles").insert({
          profile_id: profileId,
          role_id: roleRow.id,
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Conta criada. Faça login.",
    });
  } catch (err) {
    console.error("Erro no registro:", err);
    return NextResponse.json(
      { error: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    );
  }
}
