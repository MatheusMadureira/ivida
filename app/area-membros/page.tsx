"use client";

import Link from "next/link";
import { Blobs } from "@/components/Blobs";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/PageHero";
import { PageTransition } from "@/components/PageTransition";
import { SectionBlock } from "@/components/SectionBlock";

export default function AreaMembrosPage() {
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
        <div className="relative z-10 flex-1 px-5 sm:px-6 py-12 sm:py-16 pb-20">
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
      </PageTransition>
    </main>
  );
}
