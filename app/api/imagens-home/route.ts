import { NextResponse } from "next/server";
import { list } from "@vercel/blob";

const BLOB_PREFIX = "images-homepage/";
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

function isImagePath(pathname: string): boolean {
  const lower = pathname.toLowerCase();
  if (lower.endsWith("/")) return false; // ignora entrada de pasta
  return IMAGE_EXT.some((ext) => lower.endsWith(ext));
}

/**
 * Stale-while-revalidate: resposta em cache por 60s; após isso serve cache e revalida no Blob em background.
 * Novas imagens no Blob passam a aparecer após a revalidação.
 */
export const revalidate = 60;

export async function GET() {
  try {
    const { blobs } = await list({
      prefix: BLOB_PREFIX,
      limit: 200,
    });
    const images = blobs
      .filter((b) => b.pathname.startsWith(BLOB_PREFIX) && isImagePath(b.pathname))
      .map((b) => b.url);
    const res = NextResponse.json({ images });
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=120"
    );
    return res;
  } catch (err) {
    return NextResponse.json({ images: [] });
  }
}
