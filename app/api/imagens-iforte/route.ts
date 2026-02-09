import { NextResponse } from "next/server";
import { readdirSync } from "fs";
import path from "path";

const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

function isImage(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return IMAGE_EXT.includes(ext);
}

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "imagens-iforte");
    const files = readdirSync(dir);
    const images = files
      .filter(isImage)
      .sort()
      .map((file) => `/imagens-iforte/${file}`);
    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] });
  }
}
