import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth-server";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * PATCH /api/profile — atualiza o próprio perfil (name, phone).
 * Apenas o usuário autenticado pode atualizar seus dados.
 */
export async function PATCH(request: NextRequest) {
  const user = await getSessionUser(request);
  if (!user) {
    return NextResponse.json(
      { error: "Sessão não encontrada. Faça login novamente." },
      { status: 401 }
    );
  }

  let body: { name?: string; phone?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Body JSON inválido." },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (body.name !== undefined) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name) {
      return NextResponse.json(
        { error: "Nome não pode ser vazio." },
        { status: 400 }
      );
    }
    updates.name = name;
  }

  if (body.phone !== undefined) {
    updates.phone =
      body.phone === null || body.phone === ""
        ? null
        : String(body.phone).trim() || null;
  }

  if (Object.keys(updates).length <= 1) {
    return NextResponse.json(
      { error: "Nenhum campo editável enviado." },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id)
    .select("name, phone, updated_at")
    .single();

  if (error) {
    console.error("[profile PATCH] Erro:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar perfil. Tente novamente." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    name: data?.name ?? undefined,
    phone: data?.phone ?? undefined,
    updated_at: data?.updated_at,
  });
}
