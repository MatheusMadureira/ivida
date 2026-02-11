import type { NextRequest } from "next/server";
import { getSessionCookieName, verifySessionToken } from "@/lib/session";
import { createServiceRoleClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  email: string;
  roles: string[];
};

/**
 * Obtém o usuário da sessão a partir do cookie (id, email, roles).
 * Retorna null se token inválido ou perfil não encontrado.
 */
export async function getSessionUser(
  request: NextRequest
): Promise<SessionUser | null> {
  const token = request.cookies.get(getSessionCookieName())?.value;
  if (!token) return null;

  const payload = await verifySessionToken(token);
  if (!payload) return null;

  try {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("profiles_with_roles")
      .select("roles")
      .eq("id", payload.sub)
      .single();

    const roles = Array.isArray(data?.roles) ? data.roles : [];
    return {
      id: payload.sub,
      email: payload.email,
      roles,
    };
  } catch {
    return null;
  }
}

/**
 * Retorna o usuário da sessão apenas se tiver role "Admin".
 * Use em rotas de administração; se retornar null, responder com 403.
 */
export async function requireAdmin(
  request: NextRequest
): Promise<SessionUser | null> {
  const user = await getSessionUser(request);
  if (!user?.roles?.includes("Admin")) return null;
  return user;
}
