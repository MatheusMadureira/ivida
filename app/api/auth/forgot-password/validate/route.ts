import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
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

    const users = await getUsersCollection();
    const user = await users.findOne({
      email: email.trim().toLowerCase(),
      status: "ACTIVE",
    });

    if (!user) {
      return NextResponse.json(
        { error: "E-mail, CPF ou código não conferem." },
        { status: 401 }
      );
    }

    const cpfNormalized = String(cpf).replace(/\D/g, "");
    const cpfHashStored = user.cpfHash as string | undefined;
    if (cpfHashStored) {
      const cpfHashProvided = getCpfHash(cpfNormalized);
      if (cpfHashProvided !== cpfHashStored) {
        return NextResponse.json(
          { error: "E-mail, CPF ou código não conferem." },
          { status: 401 }
        );
      }
    }

    const security = user.security as { passwordResetCode?: string | null } | undefined;
    const resetCodeHash = security?.passwordResetCode;
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
