"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Blobs } from "@/components/Blobs";
import { SiteHeader } from "@/components/SiteHeader";
import { PageTransition } from "@/components/PageTransition";
import { MemberPanel } from "@/components/area-membros";
import type { MemberUser } from "@/components/area-membros";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminViewMemberPage() {
  const params = useParams();
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user ?? null;
  const loading = auth?.isLoading ?? true;
  const id = typeof params?.id === "string" ? params.id : null;
  const [member, setMember] = useState<MemberUser | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (!loading && user && !user.roles?.includes("Admin")) {
      router.replace("/area-membros");
      return;
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!id || !user?.roles?.includes("Admin")) {
      setFetchLoading(false);
      return;
    }
    let cancelled = false;
    setFetchError(null);
    setFetchLoading(true);
    fetch(`/api/admin/members/${encodeURIComponent(id)}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 403) {
          router.replace("/area-membros");
          return;
        }
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setFetchError((data as { error?: string }).error ?? "Perfil não encontrado.");
          setMember(null);
          return;
        }
        setMember(data as MemberUser);
        setFetchError(null);
      })
      .catch(() => {
        if (!cancelled) {
          setFetchError("Erro ao carregar perfil.");
          setMember(null);
        }
      })
      .finally(() => {
        if (!cancelled) setFetchLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, user?.roles, router]);

  if (loading || (!user && !loading)) return null;
  if (!user?.roles?.includes("Admin")) return null;

  return (
    <main
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(40, 38, 38, 0.6) 0%, rgb(22, 21, 21) 45%, rgb(18, 17, 17) 100%)",
      }}
    >
      <Blobs />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]"
        aria-hidden
      />
      <SiteHeader />

      <PageTransition>
        <div className="relative z-10 flex-1 px-5 sm:px-6 py-12 sm:py-16 pb-20 max-w-[1000px] mx-auto w-full">
          <Link
            href="/area-membros/admin"
            className="inline-flex items-center text-sm text-white/60 hover:text-white/90 mb-6 transition-colors"
          >
            ← Voltar à administração
          </Link>

          {fetchLoading ? (
            <div className="py-12 flex items-center justify-center">
              <div className="h-8 w-48 rounded-lg bg-white/10 animate-pulse" aria-hidden />
            </div>
          ) : fetchError ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
              <p className="text-white/80 mb-4">{fetchError}</p>
              <Link
                href="/area-membros/admin"
                className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-sm font-medium bg-ivida-red hover:bg-ivida-redhover text-white transition-colors"
              >
                Voltar à administração
              </Link>
            </div>
          ) : member ? (
            <>
              <div className="mb-6 rounded-xl border border-ivida-red/30 bg-ivida-red/10 px-4 py-3 text-sm text-white/90">
                Visualizando perfil de <strong>{member.name?.trim() || member.email}</strong> (somente leitura).
              </div>
              <MemberPanel user={member} readOnly />
            </>
          ) : null}
        </div>
      </PageTransition>
    </main>
  );
}
