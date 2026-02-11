"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { ProfileCard, type MemberUser } from "./ProfileCard";
import { MinistriesCard } from "./MinistriesCard";

const UpcomingEventsCard = dynamic(
  () => import("./UpcomingEventsCard").then((m) => ({ default: m.UpcomingEventsCard })),
  { loading: () => <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-48 animate-pulse" aria-hidden /> }
);

const PrayerRequestsCard = dynamic(
  () => import("./PrayerRequestsCard").then((m) => ({ default: m.PrayerRequestsCard })),
  { loading: () => <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-48 animate-pulse" aria-hidden /> }
);

const CommunitySection = dynamic(
  () => import("./CommunitySection").then((m) => ({ default: m.CommunitySection })),
  { loading: () => <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-32 animate-pulse mt-8" aria-hidden /> }
);

const LeaderScalesCard = dynamic(
  () => import("./LeaderScalesCard").then((m) => ({ default: m.LeaderScalesCard })),
  { loading: () => <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 h-48 animate-pulse" aria-hidden /> }
);

function getFirstName(name: string | null, email: string): string {
  const trimmed = name?.trim();
  if (trimmed) {
    const first = trimmed.split(/\s+/)[0];
    if (first) return first;
  }
  const beforeAt = email.split("@")[0]?.trim() || "";
  const firstPart = beforeAt.split(/[._]/)[0]?.trim() || "";
  return firstPart || "";
}

function getRoleBadge(roles: string[]): string {
  if (roles.includes("Admin")) return "Admin";
  if (roles.includes("Pastor")) return "Pastor";
  if (roles.includes("Seminarista")) return "Seminarista";
  if (roles.includes("Intercesor")) return "Intercesor";
  return "Membro";
}

export function MemberPanel({
  user,
  onPhotoUpdate,
}: {
  user: MemberUser;
  onPhotoUpdate?: (url: string) => void;
}) {
  const firstName = getFirstName(user.name, user.email);
  const greeting =
    firstName.length > 0
      ? `Graça e Paz, ${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}.`
      : "Paz, seja bem-vindo(a).";
  const roles = user.roles ?? [];
  const badge = getRoleBadge(roles);
  const isLeader = roles.includes("Pastor") || roles.includes("Seminarista");
  const isAdmin = roles.includes("Admin");

  return (
    <div className="relative z-10 flex-1 px-5 sm:px-6 py-12 sm:py-16 pb-20 max-w-[1000px] mx-auto w-full">
      {/* Hero */}
      <header className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-12 sm:mb-16">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            {greeting}
          </h1>
          <p className="mt-2 text-base text-white/70">
            Que bom te ver por aqui. Aqui estão seus atalhos e informações da comunidade.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <span className="inline-flex items-center py-1.5 px-3 rounded-full text-xs font-medium bg-ivida-red/15 border border-ivida-red/30 text-ivida-red">
            {badge}
          </span>
          <Link
            href="/perfil"
            className="inline-flex items-center justify-center py-2 px-4 rounded-xl text-sm font-medium border border-white/20 text-white/90 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          >
            Editar perfil
          </Link>
        </div>
      </header>

      {/* Grid 2 col desktop, 1 mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard user={user} onPhotoUpdate={onPhotoUpdate} />
        <MinistriesCard ministries={[]} />
        <UpcomingEventsCard />
        <PrayerRequestsCard
          requests={[]}
          userName={user.name?.trim() || undefined}
        />
        {isLeader && (
          <div className="md:col-span-2">
            <LeaderScalesCard items={[]} />
          </div>
        )}
      </div>

      {isAdmin && (
        <div className="mt-8">
          <Link
            href="/area-membros/admin"
            className="inline-flex items-center text-sm font-medium text-ivida-red hover:text-ivida-redhover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
          >
            Administração →
          </Link>
        </div>
      )}

      <CommunitySection />
    </div>
  );
}
