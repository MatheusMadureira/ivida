"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Blobs } from "@/components/Blobs";
import { SiteHeader } from "@/components/SiteHeader";
import { EditorialCarousel, type CarouselSlide } from "@/components/EditorialCarousel";
import { PageTransition } from "@/components/PageTransition";

const CONTAINER_CLASS = "w-full max-w-[min(1100px,92vw)] mx-auto px-4 sm:px-6";

/** Fallback enquanto a API carrega ou quando não há imagens no Blob (só placeholders para evitar flash de imagem) */
const CAROUSEL_FALLBACK: CarouselSlide[] = [
  { placeholder: true, label: "Galeria" },
  { placeholder: true, label: "Comunhão" },
  { placeholder: true, label: "Eventos" },
];

const ESTA_SEMANA = [
  { dia: "Domingo", nome: "Culto de Louvor e Adoração", horario: "17:30" },
  { dia: "Terça-feira", nome: "Curso de Teologia", horario: "19:00" },
  { dia: "Quarta-feira", nome: "Quarta-feira profética", horario: "19:30" },
];

const ULTIMAS_NOTICIAS = [
  { data: "4 fev", titulo: "Retiro de Carnaval 2026" },
  { data: "28 jan", titulo: "Inscrições abertas para o Curso de Teologia" },
  { data: "15 jan", titulo: "Culto de gratidão e colheita" },
];

function useScrollReveal(threshold = 0.08) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold, rootMargin: "0px 0px -30px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function HomePage() {
  const heroReveal = useScrollReveal(0.2);
  const semanaReveal = useScrollReveal();
  const noticiasReveal = useScrollReveal();
  const conviteReveal = useScrollReveal();

  return (
    <main
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(40, 38, 38, 0.5) 0%, rgb(22, 21, 21) 45%, rgb(18, 17, 17) 100%)",
      }}
    >
      <Blobs />

      {/* Vinheta sutil global */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]" aria-hidden />

      <SiteHeader />

      <PageTransition>
      {/* 1) HERO — simplificado */}
      <section
        ref={heroReveal.ref}
        className={`relative z-10 flex flex-col items-center justify-center text-center pt-20 pb-20 sm:pt-24 sm:pb-28 transition-all duration-700 ease-out ${heroReveal.visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <div className={CONTAINER_CLASS}>
          <h1 className="text-4xl sm:text-5xl md:text-[2.75rem] font-light text-white tracking-tight leading-[1.12]">
            Vivendo intensamente o discipulado em amor.
          </h1>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/cultos-agenda"
              className="w-full sm:w-auto min-w-[200px] py-3.5 px-6 rounded-xl text-center text-white font-medium text-[15px] bg-ivida-red hover:bg-ivida-redhover focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151515] transition-all duration-200 ease-out"
            >
              Ver programação
            </Link>
            <Link href="/sobre-nos" className="text-sm text-white/50 hover:text-white/90 transition-colors duration-200 underline-offset-2 hover:underline">
              Conheça a IVIDA
            </Link>
          </div>
        </div>
      </section>

      {/* 2) CARROSSEL EDITORIAL — 3 imagens visíveis (desktop) / 1 (mobile) */}
      <EditorialCarousel
        fetchUrl="/api/imagens-home"
        initialSlides={CAROUSEL_FALLBACK}
        subtitle="Vida em comunidade, culto e formação."
        buttonRingClass="focus-visible:ring-ivida-red/40"
        containerClassName="w-full max-w-5xl mx-auto px-4 sm:px-6"
      />

      {/* 3) ESTA SEMANA NA IVIDA */}
      <section
        ref={semanaReveal.ref}
        className={`relative z-10 py-16 sm:py-20 border-t border-white/[0.06] transition-all duration-700 ease-out ${semanaReveal.visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <div className={`${CONTAINER_CLASS} flex flex-col items-center`}>
          <h2 className="text-lg font-medium text-white/90 tracking-tight mb-10 text-center">Esta semana na IVIDA</h2>
          <ul className="space-y-0 divide-y divide-white/[0.06] max-w-xl w-full mx-auto">
            {ESTA_SEMANA.map((item) => (
              <li key={item.dia + item.horario}>
                <div className="flex flex-wrap items-baseline justify-between gap-2 py-4 sm:py-5">
                  <div>
                    <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{item.dia}</span>
                    <p className="mt-0.5 text-[0.9375rem] sm:text-base text-white/90 font-medium">{item.nome}</p>
                  </div>
                  <span className="text-sm font-medium text-ivida-red/90 tabular-nums shrink-0">{item.horario}</span>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 text-center">
            <Link href="/cultos-agenda" className="text-sm text-white/50 hover:text-white/80 transition-colors duration-200 underline-offset-2 hover:underline">
              Ver programação completa →
            </Link>
          </div>
        </div>
      </section>

      {/* 4) ÚLTIMAS NOTÍCIAS */}
      <section
        ref={noticiasReveal.ref}
        className={`relative z-10 py-16 sm:py-20 border-t border-white/[0.06] transition-all duration-700 ease-out ${noticiasReveal.visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <div className={CONTAINER_CLASS}>
          <h2 className="text-lg font-medium text-white/90 tracking-tight mb-10">Últimas notícias</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ULTIMAS_NOTICIAS.map((item) => (
              <Link
                key={item.titulo}
                href="/contato"
                className="block p-5 sm:p-6 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.08] transition-all duration-200 ease-out group"
              >
                <span className="text-xs font-medium text-white/40 uppercase tracking-wider">{item.data}</span>
                <p className="mt-2 text-[0.9375rem] sm:text-base text-white/80 font-medium leading-snug group-hover:text-white/90 transition-colors">
                  {item.titulo}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5) CONVITE FINAL */}
      <section
        ref={conviteReveal.ref}
        className={`relative z-10 py-20 sm:py-28 border-t border-white/[0.06] transition-all duration-700 ease-out ${conviteReveal.visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
      >
        <div className={CONTAINER_CLASS}>
          <p className="text-center text-xl sm:text-2xl font-light text-white/95 leading-relaxed">
            Há um lugar para você aqui.
          </p>
          <p className="mt-4 text-center text-sm text-white/50">
            Domingos às 17:30 · Culto de Louvor e Adoração
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/cultos-agenda"
              className="w-full sm:w-auto min-w-[200px] py-3.5 px-6 rounded-xl text-center text-white font-medium text-[15px] bg-ivida-red hover:bg-ivida-redhover transition-colors duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151515]"
            >
              Venha nos visitar
            </Link>
            <Link href="/contato" className="text-sm text-white/50 hover:text-white/90 transition-colors duration-200 underline-offset-2 hover:underline">
              Falar com alguém
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/[0.06] py-8">
        <div className={CONTAINER_CLASS}>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-white/40">
            <Link href="/sobre-nos" className="hover:text-white/70 transition-colors">Sobre Nós</Link>
            <Link href="/cultos-agenda" className="hover:text-white/70 transition-colors">Cultos & Agenda</Link>
            <Link href="/contato" className="hover:text-white/70 transition-colors">Contato</Link>
          </div>
        </div>
      </footer>

      </PageTransition>
    </main>
  );
}
