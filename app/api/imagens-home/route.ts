import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

/**
 * Prefixos a tentar (pathname pode vir com ou sem o nome do store no Vercel).
 * Ex.: "images-homepage/foto.jpg" ou "ivida-images/images-homepage/foto.jpg"
 */
const BLOB_PREFIXES = ["images-homepage/", "ivida-images/images-homepage/"] as const;
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

function isImagePath(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  if (lower.endsWith("/")) return false;
  return IMAGE_EXT.some((ext) => lower.endsWith(ext));
}

export const revalidate = 60;

export async function GET() {
  const allImages: string[] = [];

  for (const prefix of BLOB_PREFIXES) {
    try {
      const { blobs } = await list({ prefix, limit: 200 });
      const urls = blobs
        .filter((b) => b.pathname.startsWith(prefix) && isImagePath(b.pathname))
        .map((b) => b.url);
      allImages.push(...urls);
      if (allImages.length > 0) break; // já encontrou imagens
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[imagens-home] Blob list failed for prefix", prefix, err);
      }
    }
  }

  const images = Array.from(new Set(allImages)); // remove duplicatas se ambos prefixos retornaram
  const res = NextResponse.json({ images });
  res.headers.set(
    "Cache-Control",
    "public, s-maxage=60, stale-while-revalidate=120"
  );
  return res;
}
