"use client";

import Link from "next/link";
import Image from "next/image";
import { Blobs } from "@/components/Blobs";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/PageHero";
import { PageTransition } from "@/components/PageTransition";
import { SectionBlock } from "@/components/SectionBlock";
import { QuoteBlock } from "@/components/QuoteBlock";

const VALORES_CHIPS = ["Amor", "Discipulado", "Comunhão", "Serviço", "Palavra"];

function IconTarget(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconEye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconSparkles(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
  );
}
function IconAward(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
function IconGraduationCap(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
function IconBrain(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z" />
    </svg>
  );
}

export default function SobreNosPage() {
  return (
    <main
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(40, 38, 38, 0.6) 0%, rgb(22, 21, 21) 45%, rgb(18, 17, 17) 100%)",
      }}
    >
      <Blobs />

      {/* Vinheta sutil global */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]" aria-hidden />

      <SiteHeader />

      <PageTransition>
      <div className="relative z-10 flex-1 px-5 sm:px-6 py-12 sm:py-16 pb-20">
        <div className="max-w-[820px] mx-auto">
          <PageHero
            title="Sobre Nós"
            subtitle="Igreja Vivendo Intensamente o Discipulado em Amor"
            className="mb-16 sm:mb-20"
          />

          <SectionBlock title="Quem somos" className="mb-16 sm:mb-20">
            <p>
              A IVIDA é uma comunidade de fé que busca viver o discipulado de forma
              intensa e amorosa. Acreditamos em uma igreja acolhedora, onde cada
              pessoa é valorizada e incentivada a crescer na fé e no relacionamento
              com Deus e com o próximo.
            </p>
          </SectionBlock>

          <QuoteBlock className="mb-16 sm:mb-20">
            &ldquo;Amai-vos cordialmente uns aos outros com amor fraternal.&rdquo;
            <cite className="not-italic text-white/60 text-sm block mt-2">
              — Romanos 12.10
            </cite>
          </QuoteBlock>

          {/* Missão, Visão e Valores — grid de cards */}
          <section className="py-16 mb-16 sm:mb-20" aria-labelledby="missao-visao-valores-heading">
            <div className="max-w-6xl mx-auto">
              <h2 id="missao-visao-valores-heading" className="text-xl font-semibold text-white tracking-tight mb-10">
                Missão, Visão e Valores
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <article
                className="p-6 sm:p-7 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg transition-all duration-200 hover:border-red-500/40 hover:bg-white/[0.07] focus-within:ring-2 focus-within:ring-red-500/40 focus-within:ring-offset-2 focus-within:ring-offset-[#121212]"
                tabIndex={0}
              >
                <div className="text-ivida-red/80 mb-4" aria-hidden>
                  <IconTarget className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  Missão
                </h3>
                <div className="w-7 h-0.5 bg-ivida-red/80 rounded-full mt-2 mb-4" aria-hidden />
                <p className="text-white/70 leading-relaxed text-[0.97rem]">
                  Proclamar o Evangelho e discipular pessoas para que vivam o amor de
                  Cristo em seu dia a dia, transformando famílias e a sociedade por
                  meio do serviço, da comunhão e da Palavra.
                </p>
              </article>
              <article
                className="p-6 sm:p-7 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg transition-all duration-200 hover:border-red-500/40 hover:bg-white/[0.07] focus-within:ring-2 focus-within:ring-red-500/40 focus-within:ring-offset-2 focus-within:ring-offset-[#121212]"
                tabIndex={0}
              >
                <div className="text-ivida-red/80 mb-4" aria-hidden>
                  <IconEye className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  Visão
                </h3>
                <div className="w-7 h-0.5 bg-ivida-red/80 rounded-full mt-2 mb-4" aria-hidden />
                <p className="text-white/70 leading-relaxed text-[0.97rem]">
                  Ser uma igreja relevante e referência em discipulado e amor prático,
                  onde cada membro é discípulo e faz discípulos, multiplicando o
                  impacto do Reino de Deus.
                </p>
              </article>
              <article
                className="p-6 sm:p-7 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-lg transition-all duration-200 hover:border-red-500/40 hover:bg-white/[0.07] focus-within:ring-2 focus-within:ring-red-500/40 focus-within:ring-offset-2 focus-within:ring-offset-[#121212] md:col-span-2 lg:col-span-1"
                tabIndex={0}
              >
                <div className="text-ivida-red/80 mb-4" aria-hidden>
                  <IconSparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight">
                  Valores
                </h3>
                <div className="w-8 h-0.5 bg-ivida-red/80 rounded-full mt-2 mb-4" aria-hidden />
                <div className="flex flex-wrap gap-2 mt-2">
                  {VALORES_CHIPS.map((v) => (
                    <span
                      key={v}
                      className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm transition-colors hover:bg-white/10 hover:border-white/20"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </article>
              </div>
            </div>
          </section>

          {/* Nosso pastor — 2 colunas */}
          <section className="mb-16 sm:mb-20 py-16 border-t border-white/[0.06]" aria-labelledby="nosso-pastor-heading">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 id="nosso-pastor-heading" className="text-xl font-semibold text-white tracking-tight mb-10">
                Nosso pastor
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                <div className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 shadow-lg focus-within:ring-2 focus-within:ring-red-500/40 focus-within:ring-offset-2 focus-within:ring-offset-[#121212] transition-all duration-200 hover:border-white/20">
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full border border-white/10 overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
                      <Image
                        src="/pastoreduardo.png"
                        alt="Pastor Carlos Eduardo Baptista"
                        width={208}
                        height={208}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm">
                        <IconAward className="w-4 h-4 text-ivida-red/80 shrink-0" />
                        10+ anos de pastorado
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm">
                        <IconGraduationCap className="w-4 h-4 text-ivida-red/80 shrink-0" />
                        Teologia (Faculdade Metodista)
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/80 text-sm">
                        <IconBrain className="w-4 h-4 text-ivida-red/80 shrink-0" />
                        Psicologia (em formação)
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
                    Pastor Carlos Eduardo Baptista
                  </h3>
                  <p className="text-white/70 leading-relaxed text-sm mb-5">
                    Liderança, discipulado e cuidado pastoral no dia a dia da igreja.
                  </p>
                  <p className="text-white/70 leading-relaxed mb-5">
                    O Pastor Carlos Eduardo Baptista lidera a IVIDA com dedicação e
                    sensibilidade, unindo formação teológica sólida e o desejo contínuo
                    de acolher e cuidar das pessoas. Formado em Teologia pela Faculdade
                    Metodista, ele traz para o ministério mais de dez anos de pastorado,
                    marcados por pregação fiel à Palavra, acompanhamento pastoral e
                    compromisso com o discipulado.
                  </p>
                  <p className="text-white/70 leading-relaxed mb-8">
                    Em paralelo, está em formação em Psicologia, buscando integrar fé e
                    cuidado com a saúde emocional e mental da comunidade. Para nós, ele é
                    não apenas um líder espiritual, mas alguém que encarna o amor e o
                    serviço que pregamos.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/contato"
                      className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-sm font-medium border border-ivida-red/40 text-white/90 hover:bg-ivida-red/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                    >
                      Fale com o pastor
                    </Link>
                    <Link
                      href="/contato#oracao"
                      className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-sm font-medium border border-white/20 text-white/70 hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                    >
                      Pedir oração
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      </PageTransition>
    </main>
  );
}
