import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth-server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { isRole } from "@/lib/constants";

const SAFE_SELECT =
  "id, name, email, roles, status, photo_url, phone, created_at, updated_at";

const STATUSES = ["ACTIVE", "INACTIVE"] as const;

/**
 * PATCH /api/admin/members/[id] — atualiza perfil (somente Admin).
 * Body: name?, phone?, roles?, status?
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "ID obrigatório." }, { status: 400 });
  }

  let body: {
    name?: string;
    phone?: string | null;
    roles?: string[];
    status?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON inválido." }, { status: 400 });
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

  if (body.roles !== undefined) {
    if (!Array.isArray(body.roles)) {
      return NextResponse.json(
        { error: "roles deve ser um array." },
        { status: 400 }
      );
    }
    const roleNames = body.roles.filter((r): r is string => typeof r === "string");
    if (roleNames.some((r) => !isRole(r))) {
      return NextResponse.json(
        { error: "Uma ou mais roles inválidas." },
        { status: 400 }
      );
    }
    // roles são gravadas em profile_roles, não em profiles
  }

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status as (typeof STATUSES)[number])) {
      return NextResponse.json(
        { error: "status deve ser ACTIVE ou INACTIVE." },
        { status: 400 }
      );
    }
    updates.status = body.status;
  }

  const hasProfileUpdates = Object.keys(updates).length > 1;
  const hasRolesUpdate = body.roles !== undefined;
  if (!hasProfileUpdates && !hasRolesUpdate) {
    return NextResponse.json(
      { error: "Nenhum campo editável enviado." },
      { status: 400 }
    );
  }

  const supabase = createServiceRoleClient();

  if (hasProfileUpdates) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", id);

    if (updateError) {
      if (updateError.code === "PGRST116") {
        return NextResponse.json({ error: "Perfil não encontrado." }, { status: 404 });
      }
      console.error("Erro ao atualizar perfil:", updateError);
      return NextResponse.json(
        { error: "Erro ao atualizar perfil." },
        { status: 500 }
      );
    }
  }

  if (hasRolesUpdate) {
    const roleNames = body.roles!.filter((r): r is string => typeof r === "string");
    const { data: roleRows } = await supabase
      .from("roles")
      .select("id, name")
      .in("name", roleNames);
    const nameToId = new Map((roleRows ?? []).map((r) => [r.name, r.id]));

    await supabase.from("profile_roles").delete().eq("profile_id", id);

    if (roleNames.length > 0) {
      const profileRoles = roleNames
        .map((name) => ({ profile_id: id, role_id: nameToId.get(name) }))
        .filter((row): row is { profile_id: string; role_id: string } => !!row.role_id);
      if (profileRoles.length > 0) {
        const { error: prError } = await supabase.from("profile_roles").insert(profileRoles);
        if (prError) {
          console.error("Erro ao atualizar roles do perfil:", prError);
          return NextResponse.json(
            { error: "Erro ao atualizar roles." },
            { status: 500 }
          );
        }
      }
    }
  }

  const { data, error } = await supabase
    .from("profiles_with_roles")
    .select(SAFE_SELECT)
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "Perfil não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
