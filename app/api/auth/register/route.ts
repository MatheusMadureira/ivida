import { NextResponse } from "next/server";
import { getUsersCollection } from "@/lib/db";
import {
  hashPassword,
  generateResetCode,
  hashResetCode,
  getCpfHash,
} from "@/lib/auth";
import type { User } from "@/types/user";

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

    const users = await getUsersCollection();

    const existing = await users.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "Já existe uma conta com este e-mail." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const resetCodePlain = generateResetCode();
    const passwordResetCodeHash = await hashResetCode(resetCodePlain);

    const now = new Date();
    const newUser: User = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      ...(cpf ? { cpfHash: getCpfHash(String(cpf).replace(/\D/g, "")) } : {}),
      passwordHash,
      roles: [],
      status: "ACTIVE",
      profile: { photoUrl: null },
      security: {
        emailVerified: false,
        lastPasswordChange: now,
        passwordResetCode: passwordResetCodeHash,
      },
      timestamps: {
        createdAt: now,
        updatedAt: now,
        lastLoginAt: null,
      },
    };

    await users.insertOne(newUser);

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
