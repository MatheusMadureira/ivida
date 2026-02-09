"use client";

/** Posições fixas dos blobs no background (em % da viewport) */
const BLOB_1 = { left: -8, top: -8 };
const BLOB_2 = { right: -8, bottom: -8 };

const BLOB_STYLES = {
  ivida: "radial-gradient(circle, rgba(224, 32, 32, 0.5) 0%, transparent 65%)",
  iforte: "radial-gradient(circle, rgba(42, 90, 160, 0.4) 0%, transparent 65%)",
} as const;

export function Blobs({ theme = "ivida" }: { theme?: "ivida" | "iforte" }) {
  const gradient = BLOB_STYLES[theme];
  return (
    <>
      <div
        className="fixed w-[min(80vw,420px)] h-[min(80vw,420px)] rounded-full pointer-events-none blur-3xl"
        style={{
          left: `${BLOB_1.left}%`,
          top: `${BLOB_1.top}%`,
          background: gradient,
        }}
        aria-hidden
      />
      <div
        className="fixed w-[min(80vw,420px)] h-[min(80vw,420px)] rounded-full pointer-events-none blur-3xl"
        style={{
          right: `${BLOB_2.right}%`,
          bottom: `${BLOB_2.bottom}%`,
          background: gradient,
        }}
        aria-hidden
      />
    </>
  );
}
