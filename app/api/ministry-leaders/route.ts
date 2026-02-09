import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { readdir, stat } from "fs/promises";
import path from "path";

/**
 * Prefixos a tentar no Vercel Blob. O pathname pode vir com ou sem o nome da store:
 * - "ministries-images/intercession-leader/foto.jpg"
 * - "ivida-images/ministries-images/intercession-leader/foto.jpg"
 */
const BLOB_PREFIXES = ["ministries-images/", "ivida-images/ministries-images/"] as const;
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

function isImageFile(filename: string): boolean {
  return IMAGE_EXT.some((e) => filename.toLowerCase().endsWith(e));
}

/**
 * Mapeia nomes de pastas do Blob para os slugs da página.
 * Ex.: youth-leader → youth, mans-images → men, worship'-leader → worship
 */
const FOLDER_TO_SLUG: Record<string, string> = {
  "kids-leader": "kids",
  "youth-leader": "youth",
  "worship-leader": "worship",
  "worship'-leader": "worship",
  "intercession-leader": "intercession",
  "men-leader": "men",
  "mans-images": "men",
  "women-leader": "women",
  "womans-image": "women",
  "family-leader": "family",
  "family-image": "family",
  "media-leader": "media",
  "media-image": "media",
};

/** pathname = ".../intercession-leader/foto.jpg" → slug "intercession" (após o prefixo) */
function slugFromBlobPath(pathname: string, prefix: string): string | null {
  if (!pathname.startsWith(prefix)) return null;
  const after = pathname.slice(prefix.length);
  const parts = after.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const folder = parts[0];
  if (!isImageFile(parts[parts.length - 1])) return null;
  const slug = FOLDER_TO_SLUG[folder.toLowerCase()] ?? (folder.toLowerCase().endsWith("-leader") ? folder.slice(0, -"-leader".length) : null);
  return slug ?? null;
}

/**
 * Para cada pasta public/ministries-image/*-leader/, usa a primeira imagem encontrada (qualquer nome).
 * Só preenche slugs que ainda não tenham URL (Blob tem prioridade).
 */
async function fillFromPublicFolder(leaderImages: Record<string, string>): Promise<void> {
  const publicDir = path.join(process.cwd(), "public", "ministries-image");
  let dirs: string[];
  try {
    dirs = await readdir(publicDir);
  } catch {
    return;
  }
  for (const dir of dirs) {
    if (!dir.endsWith("-leader")) continue;
    const slug = dir.slice(0, -"-leader".length);
    if (leaderImages[slug]) continue;
    const folderPath = path.join(publicDir, dir);
    let st: Awaited<ReturnType<typeof stat>>;
    try {
      st = await stat(folderPath);
    } catch {
      continue;
    }
    if (!st.isDirectory()) continue;
    let files: string[];
    try {
      files = await readdir(folderPath);
    } catch {
      continue;
    }
    const firstImage = files.find(isImageFile);
    if (firstImage) {
      leaderImages[slug] =
        "/ministries-image/" + dir + "/" + encodeURIComponent(firstImage);
    }
  }
}

/**
 * Lista imagens no Blob (primeira por pasta) e em public/ministries-image/*-leader/ (primeira por pasta).
 * Nomes dos ficheiros são livres (ex.: nome da pessoa).
 */
export const revalidate = 60;

export async function GET() {
  const leaderImages: Record<string, string> = {};

  try {
    for (const prefix of BLOB_PREFIXES) {
      const { blobs } = await list({ prefix, limit: 200 });
      for (const b of blobs) {
        const slug = slugFromBlobPath(b.pathname, prefix);
        if (slug && !leaderImages[slug]) leaderImages[slug] = b.url;
      }
      if (Object.keys(leaderImages).length > 0) break; // já temos resultados
    }
  } catch {
    // Blob não configurado ou erro de rede
  }

  await fillFromPublicFolder(leaderImages);

  const res = NextResponse.json({ leaderImages });
  res.headers.set(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=120"
  );
  return res;
}
