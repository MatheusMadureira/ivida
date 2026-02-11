import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { put } from "@vercel/blob";
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
 * Upload para Vercel Blob (path: profile-images/{userId}/avatar.{ext}), atualiza profiles.photo_url no Supabase.
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

    const ext = getExtension(mimetype);
    const pathname = `${BLOB_PREFIX}${userId}/avatar.${ext}`;

    const blob = await put(pathname, file, {
      access: "public",
      contentType: mimetype,
      addRandomSuffix: false,
      // Sobrescrever avatar anterior do mesmo usuário
      allowOverwrite: true,
    });

    const supabase = createServiceRoleClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ photo_url: blob.url })
      .eq("id", userId);

    if (updateError) {
      console.error("[upload-avatar] Erro ao atualizar photo_url no Supabase:", updateError);
      return NextResponse.json(
        { error: "Foto enviada, mas não foi possível atualizar seu perfil. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("[upload-avatar] Erro:", err);
    return NextResponse.json(
      { error: "Não foi possível enviar a foto. Tente novamente." },
      { status: 500 }
    );
  }
}
