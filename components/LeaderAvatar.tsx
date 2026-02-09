"use client";

import Image from "next/image";
import { useState } from "react";

export interface Leader {
  name: string;
  role: string;
  image: string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

const AVATAR_SIZE = 40;

export function LeaderAvatar({ name, role, image }: Leader) {
  const [imgError, setImgError] = useState(false);
  const showFallback = imgError;

  return (
    <div className="flex items-center gap-3 shrink-0 min-w-0">
      <div
        className={`relative shrink-0 w-10 h-10 rounded-full border border-ivida-red/30 overflow-hidden flex items-center justify-center ${showFallback ? "bg-[#252525]" : "bg-white/5"}`}
        style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
        aria-hidden
      >
        {!showFallback ? (
          <Image
            src={image}
            alt={name}
            width={AVATAR_SIZE}
            height={AVATAR_SIZE}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <span
            className="text-xs font-medium text-white/80"
            aria-hidden
          >
            {getInitials(name)}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-white font-medium text-[0.9375rem] truncate" style={{ fontWeight: 500 }}>
          {name}
        </p>
        <p className="text-white/50 text-sm truncate">
          {role}
        </p>
      </div>
    </div>
  );
}
