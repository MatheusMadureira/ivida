"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Blobs } from "@/components/Blobs";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/PageHero";
import { PageTransition } from "@/components/PageTransition";
import { SectionBlock } from "@/components/SectionBlock";
import { MemberPanel } from "@/components/area-membros";
import type { MemberUser } from "@/components/area-membros";
import { useAuth } from "@/contexts/AuthContext";

function MemberPanelSkeleton() {
  return (
    <div className="relative z-10 flex-1 px-5 sm:px-6 py-12 sm:py-16 pb-20 max-w-[1000px] mx-auto w-full animate-pulse">
      <div className="h-8 w-64 rounded bg-white/10 mb-2" />
      <div className="h-4 w-96 max-w-full rounded bg-white/10 mb-12" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 h-48 rounded-lg bg-white/5" />
        ))}
      </div>
    </div>
  );
}

export default function AreaMembrosPage() {
  const auth = useAuth();
  const user = auth?.user ?? null;
  const loading = auth?.isLoading ?? true;
  const updateUser = auth?.updateUser ?? (() => {});
  const [showPanel, setShowPanel] = useState(false);

  // Transição suave ao exibir o painel (após carregar user)
  useEffect(() => {
    if (!loading && user) {
      const t = setTimeout(() => setShowPanel(true), 50);
      return () => clearTimeout(t);
    } else {
      setShowPanel(false);
    }
  }, [loading, user]);

  const isLoggedIn = !!user;

  return (
    <main
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(40, 38, 38, 0.6) 0%, rgb(22, 21, 21) 45%, rgb(18, 17, 17) 100%)",
      }}
    >
      <Blobs />

      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]" aria-hidden />

      <SiteHeader />

      <PageTransition>
        {loading ? (
          <MemberPanelSkeleton />
        ) : isLoggedIn ? (
          <div
            className="transition-opacity duration-200 ease-out"
            style={{ opacity: showPanel ? 1 : 0 }}
          >
            {user ? (
              <MemberPanel
                user={user as MemberUser}
                onPhotoUpdate={(url) => {
                  updateUser({ photo_url: url });
                }}
              />
            ) : null}
          </div>
        ) : (
          <div
            className="relative z-10 flex-1 px-5 sm:px-6 py-12 sm:py-16 pb-20 transition-opacity duration-200"
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            <div className="max-w-[820px] mx-auto">
              <PageHero
                title="Área de Membros"
                subtitle="Conteúdo exclusivo para membros da IVIDA"
                className="mb-16 sm:mb-20"
              />

              <SectionBlock title="Acesso à área restrita" className="mb-16 sm:mb-20">
                <p className="mb-6">
                  A Área de Membros é um espaço exclusivo para quem faz parte da família IVIDA.
                  Faça login para acessar conteúdos, avisos e recursos disponíveis apenas para membros.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center py-3 px-6 rounded-xl text-white font-medium bg-ivida-red hover:bg-ivida-redhover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                  >
                    Entrar
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center py-3 px-6 rounded-xl text-sm font-medium border border-white/20 text-white/90 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                  >
                    Criar conta
                  </Link>
                </div>
              </SectionBlock>

              <SectionBlock title="Ainda não é membro?">
                <p>
                  Se você deseja fazer parte da família IVIDA, participe dos nossos cultos e
                  eventos. Estamos em Duque de Caxias, RJ. Entre em contato ou venha nos
                  visitar aos domingos às 17:30.
                </p>
                <Link
                  href="/contato"
                  className="inline-block mt-4 text-ivida-red hover:text-ivida-redhover font-medium transition-colors underline-offset-2 hover:underline"
                >
                  Fale conosco →
                </Link>
              </SectionBlock>
            </div>
          </div>
        )}
      </PageTransition>
    </main>
  );
}
