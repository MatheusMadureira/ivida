import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-server";
import { createServiceRoleClient } from "@/lib/supabase/server";

const SAFE_SELECT =
  "id, name, email, roles, status, photo_url, phone, created_at";

/**
 * GET /api/admin/members — lista/busca membros (somente Admin).
 * Query: q (busca por nome/email), page, limit, count (opcional: "true" para total exato).
 */
export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const rawQ = searchParams.get("q")?.trim() || "";
  const q = rawQ.replace(/'/g, "''").slice(0, 200);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
  const wantCount = searchParams.get("count") === "true" || searchParams.get("count") === "1";
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const supabase = createServiceRoleClient();
  let query = supabase
    .from("profiles_with_roles")
    .select(SAFE_SELECT, wantCount ? { count: "exact" } : undefined)
    .order("name", { ascending: true });

  if (q) {
    // PostgREST usa * no lugar de % em ilike para evitar encoding na URL
    const pattern = `*${q}*`;
    query = query.or(`name.ilike.${pattern},email.ilike.${pattern}`);
  }

  const { data, error, count } = await query.range(from, to);

  if (error) {
    console.error("Erro ao listar membros:", error);
    return NextResponse.json(
      { error: "Erro ao buscar membros." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    members: data ?? [],
    total: wantCount ? (count ?? 0) : undefined,
    page,
    limit,
  });
}
