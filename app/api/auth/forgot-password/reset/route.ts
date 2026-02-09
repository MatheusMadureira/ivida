import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
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

    const users = await getUsersCollection();
    const user = await users.findOne({
      email: email.trim().toLowerCase(),
      status: "ACTIVE",
    });

    if (!user) {
      return NextResponse.json(
        { error: "Dados inválidos. Refaça a validação." },
        { status: 401 }
      );
    }

    const security = user.security as { passwordResetCode?: string | null } | undefined;
    const resetCodeHash = security?.passwordResetCode;
    if (!resetCodeHash) {
      return NextResponse.json(
        { error: "Dados inválidos. Refaça a validação." },
        { status: 401 }
      );
    }

    const codeValid = await compareResetCode(
      codigoRestauracao.trim(),
      resetCodeHash
    );
    if (!codeValid) {
      return NextResponse.json(
        { error: "Código de restauração inválido ou já utilizado." },
        { status: 401 }
      );
    }

    const passwordHash = await hashPassword(newPassword);
    const now = new Date();

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordHash,
          "security.passwordResetCode": null,
          "security.lastPasswordChange": now,
          "timestamps.updatedAt": now,
        },
      }
    );

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
