import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCpfHash, compareResetCode } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { cpf, email, codigoRestauracao } = body as {
      cpf?: string;
      email?: string;
      codigoRestauracao?: string;
    };

    if (!email?.trim() || !cpf || !codigoRestauracao?.trim()) {
      return NextResponse.json(
        { error: "Preencha todos os campos." },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();
    const { data: user, error } = await supabase
      .from("profiles")
      .select("id, cpf_hash, password_reset_code")
      .eq("email", email.trim().toLowerCase())
      .eq("status", "ACTIVE")
      .single();

    if (error || !user) {
      return NextResponse.json(
        { error: "E-mail, CPF ou código não conferem." },
        { status: 401 }
      );
    }

    const cpfHashStored = user.cpf_hash;
    if (cpfHashStored) {
      const cpfNormalized = String(cpf).replace(/\D/g, "");
      const cpfHashProvided = getCpfHash(cpfNormalized);
      if (cpfHashProvided !== cpfHashStored) {
        return NextResponse.json(
          { error: "E-mail, CPF ou código não conferem." },
          { status: 401 }
        );
      }
    }

    const resetCodeHash = user.password_reset_code;
    if (!resetCodeHash) {
      return NextResponse.json(
        { error: "E-mail, CPF ou código não conferem." },
        { status: 401 }
      );
    }

    const codeValid = await compareResetCode(
      codigoRestauracao.trim(),
      resetCodeHash
    );
    if (!codeValid) {
      return NextResponse.json(
        { error: "E-mail, CPF ou código não conferem." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Erro na validação (esqueci a senha):", err);
    return NextResponse.json(
      { error: "Erro ao validar. Tente novamente." },
      { status: 500 }
    );
  }
}
