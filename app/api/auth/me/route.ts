import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookieName, verifySessionToken } from "@/lib/session";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * GET /api/auth/me — retorna o usuário atual se a sessão for válida (id, email, name).
 * Usado no header (botão Sair) e na Home (saudação personalizada).
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const payload = await verifySessionToken(token);
  if (!payload) {
    return NextResponse.json({ user: null });
  }

  let name: string | null = null;
  let roles: string[] = [];
  let photo_url: string | null = null;
  let phone: string | null = null;
  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("profiles_with_roles")
      .select("name, roles, photo_url, phone")
      .eq("id", payload.sub)
      .single();
    name = data?.name ?? null;
    roles = Array.isArray(data?.roles) ? data.roles : [];
    photo_url = data?.photo_url ?? null;
    phone = data?.phone ?? null;
  } catch {
    // ignora erro de rede/banco; retorna sem dados extras
  }

  return NextResponse.json({
    user: { id: payload.sub, email: payload.email, name, roles, photo_url, phone },
  });
}
