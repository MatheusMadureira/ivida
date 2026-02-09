"use client";

import Image from "next/image";
import { useState } from "react";

const AVATAR_SIZE = 44;

function getMinistryInitials(titulo: string): string {
  const parts = titulo.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return titulo.slice(0, 2).toUpperCase() || "?";
}

export interface LeaderBadgeProps {
  /** URL da foto do líder (Vercel Blob). Se vazia, exibe fallback com iniciais do ministério. */
  leaderImageUrl: string;
  /** Nome do líder (opcional) */
  leaderName?: string | null;
  /** Título do ministério (para fallback com iniciais) */
  ministryTitle: string;
}

export function LeaderBadge({
  leaderImageUrl,
  leaderName,
  ministryTitle,
}: LeaderBadgeProps) {
  const [imgError, setImgError] = useState(false);
  const hasValidUrl = Boolean(leaderImageUrl?.trim());
  const showFallback = imgError || !hasValidUrl;
  const initials = getMinistryInitials(ministryTitle);
  const displayName = leaderName?.trim() || "Líder do Ministério";

  return (
    <div className="flex items-center gap-3 shrink-0 min-w-0">
      <div
        className={`
          relative shrink-0 rounded-full overflow-hidden flex items-center justify-center
          border border-ivida-red/25
          shadow-[0_0_12px_rgba(224,32,32,0.08)]
          ${showFallback ? "bg-[#252525]" : "bg-white/5"}
        `}
        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
        aria-hidden
      >
        {!showFallback ? (
          <Image
            src={leaderImageUrl}
            alt={leaderName ? `${leaderName}, Líder do Ministério` : `Líder do ministério ${ministryTitle}`}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className="text-sm font-semibold text-white/80"
            aria-hidden
          >
            {initials}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p
          className={`font-medium text-[0.9375rem] truncate ${
            leaderName ? "text-white" : "text-white/70"
          }`}
          style={{ fontWeight: 500 }}
        >
          {displayName}
        </p>
        {leaderName && (
          <p className="text-white/50 text-sm truncate">
            Líder do Ministério
          </p>
        )}
      </div>
    </div>
  );
}
