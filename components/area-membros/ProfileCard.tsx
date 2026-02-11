"use client";

import Link from "next/link";
import { useInactivity } from "@/contexts/InactivityContext";
import { AvatarUpload } from "./AvatarUpload";

export type MemberUser = {
  id: string;
  email: string;
  name: string | null;
  photo_url?: string | null;
  roles?: string[];
};

function getInitials(name: string | null, email: string): string {
  const trimmed = name?.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
  }
  const beforeAt = email.split("@")[0]?.trim() || "";
  return beforeAt.slice(0, 2).toUpperCase() || "?";
}


const cardClass =
  "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 sm:p-6 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05]";

export function ProfileCard({
  user,
  onPhotoUpdate,
}: {
  user: MemberUser;
  onPhotoUpdate?: (url: string) => void;
}) {
  const inactivity = useInactivity();
  const displayName = user.name?.trim() || user.email;
  const initials = getInitials(user.name, user.email);

  function handleLogout() {
    inactivity?.clearTimeoutState();
    window.location.href = "/api/auth/logout";
  }

  return (
    <article className={cardClass}>
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <AvatarUpload
          photoUrl={user.photo_url ?? null}
          initials={initials}
          onPhotoUpdate={onPhotoUpdate ?? (() => {})}
          size={64}
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-medium text-white truncate">{displayName}</h3>
          <p className="text-sm text-white/60 mt-0.5 truncate">{user.email}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/perfil"
              className="inline-flex items-center justify-center py-2 px-4 rounded-xl text-sm font-medium border border-white/20 text-white/90 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
            >
              Editar perfil
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center py-2 px-4 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
