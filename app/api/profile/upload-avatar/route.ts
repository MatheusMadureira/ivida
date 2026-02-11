import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { put, del, list } from "@vercel/blob";
import { getSessionCookieName, verifySessionToken } from "@/lib/session";
import { createServiceRoleClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB — obrigatório
const ALLOWED_MIMETYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const BLOB_PREFIX = "profile-images/";

function getExtension(mimetype: string): string {
  if (mimetype === "image/jpeg") return "jpg";
  if (mimetype === "image/png") return "png";
  if (mimetype === "image/webp") return "webp";
  return "jpg";
}

/**
 * POST /api/profile/upload-avatar
 * Recebe multipart/form-data com campo "file" (imagem).
 * Valida tamanho <= 2MB e tipo (jpeg, png, webp) no servidor.
 * Upload para Vercel Blob (path único: profile-images/{userId}/avatar-{timestamp}.{ext}),
 * atualiza profiles.photo_url no Supabase e remove o avatar anterior do Blob.
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get(getSessionCookieName())?.value;
    if (!token) {
      return NextResponse.json({ error: "Sessão não encontrada. Faça login novamente." }, { status: 401 });
    }

    const payload = await verifySessionToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Sessão inválida ou expirada. Faça login novamente." }, { status: 401 });
    }

    const userId = payload.sub;

    if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
      return NextResponse.json(
        { error: "Upload de foto temporariamente indisponível. Tente mais tarde." },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado. Selecione uma imagem (JPEG, PNG ou WebP)." },
        { status: 400 }
      );
    }

    // Validação obrigatória no backend (nunca confiar só no frontend)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "A imagem deve ter no máximo 2MB. Escolha uma foto menor." },
        { status: 400 }
      );
    }

    const mimetype = file.type?.toLowerCase() ?? "";
    if (!ALLOWED_MIMETYPES.includes(mimetype as (typeof ALLOWED_MIMETYPES)[number])) {
      return NextResponse.json(
        { error: "Tipo de arquivo não permitido. Use apenas JPEG, PNG ou WebP." },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // 1) Buscar e salvar a URL antiga ANTES do upload (preservada para exclusão do blob após update)
    const { data: profileData } = await supabase
      .from("profiles")
      .select("photo_url")
      .eq("id", userId)
      .single();
    const oldPhotoUrl = profileData?.photo_url ?? null;

    // 2) Upload do novo avatar (path único)
    const ext = getExtension(mimetype);
    const ts = Date.now();
    const blobPath = `${BLOB_PREFIX}${userId}/avatar-${ts}.${ext}`;

    const blob = await put(blobPath, file, {
      access: "public",
      contentType: mimetype,
      addRandomSuffix: false,
    });

    // 3) Update do Supabase com a URL nova
    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({ photo_url: blob.url })
      .eq("id", userId)
      .select("photo_url")
      .single();

    if (updateError) {
      console.error("[upload-avatar] Erro ao atualizar photo_url no Supabase:", updateError);
      return NextResponse.json(
        { error: "Foto enviada, mas não foi possível atualizar seu perfil. Tente novamente." },
        { status: 500 }
      );
    }

    // 4) Deletar o blob antigo usando oldPhotoUrl (apenas após update OK)
    let deleteStatus: "success" | "skipped" | "error" = "skipped";
    const canDelete =
      oldPhotoUrl != null &&
      oldPhotoUrl.trim() !== "" &&
      oldPhotoUrl !== blob.url &&
      oldPhotoUrl.includes("/profile-images/");

    if (canDelete) {
      try {
        const old = new URL(oldPhotoUrl);
        old.search = "";
        await del(old.toString());
        deleteStatus = "success";
      } catch (delErr) {
        deleteStatus = "error";
        console.warn("[upload-avatar] Delete blob antigo (apenas log):", delErr);
      }
    }

    // MUDANÇA 2: listar prefixo do usuário e apagar todos exceto o blob atual
    let deletedCount = 0;
    const userPrefix = `${BLOB_PREFIX}${userId}/`;
    try {
      const { blobs } = await list({ prefix: userPrefix, limit: 100 });
      const currentUrl = blob.url;
      const toDelete = blobs
        .filter((b) => b.pathname.startsWith(userPrefix) && b.url !== currentUrl)
        .map((b) => b.url);
      if (toDelete.length > 0) {
        await del(toDelete);
        deletedCount = toDelete.length;
      }
    } catch (listErr) {
      console.warn("[upload-avatar] List/delete cleanup (apenas log):", listErr);
    }

    if (process.env.NODE_ENV === "development") {
      console.info("[upload-avatar]", {
        userId,
        oldPhotoUrl,
        blobPath,
        "blob.url": blob.url,
        deleteStatus,
      });
    }

    const responseUrl = data?.photo_url ?? blob.url;
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json({
        url: responseUrl,
        deleteStatus,
        deletedCount,
      });
    }
    return NextResponse.json({ url: responseUrl });
  } catch (err) {
    console.error("[upload-avatar] Erro:", err);
    return NextResponse.json(
      { error: "Não foi possível enviar a foto. Tente novamente." },
      { status: 500 }
    );
  }
}
