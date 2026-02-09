"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { EditorialCarousel } from "@/components/EditorialCarousel";

const ENDERECO = "R. Frei Veloso, 37 - Dr. Laureano, Duque de Caxias - RJ, 25051-260";
const MAPS_URL = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(ENDERECO);

const KEY_FACTS = [
  { label: "Duração", value: "1 ano", icon: "calendar" },
  { label: "Modalidade", value: "Presencial", icon: "location" },
  { label: "Local", value: "Duque de Caxias, RJ", icon: "pin" },
  { label: "Público-alvo", value: "Quem deseja aprofundar na Palavra e no ministério", icon: "users" },
  { label: "Objetivo", value: "Fundamentar na Palavra e na prática ministerial", icon: "target" },
  { label: "Instituição", value: "IFORTE (instituto da IVIDA)", icon: "building" },
] as const;

const GRADE_FULL = [
  "Introdução a Teologia",
  "Teologia do Antigo Testamento",
  "Teologia do Novo Testamento",
  "Língua Portuguesa",
  "Hebraico Bíblico",
  "Grego Bíblico",
  "Teologia Sistemática",
  "História de Israel",
  "História da Igreja",
];

const PILARES = [
  { title: "Formação sólida e reconhecida", text: "Estrutura pedagógica alinhada ao ministério." },
  { title: "Ensino acessível", text: "Conteúdo claro para crescimento na fé." },
  { title: "Compromisso com o Reino", text: "Foco em discipulado e prática ministerial." },
] as const;

function IconCalendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
function IconPin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function IconUsers(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconTarget(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function IconBuilding(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M8 10h.01M8 14h.01M16 14h.01" />
    </svg>
  );
}
function IconExternal(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}
function IconCheck(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const ICON_MAP = {
  calendar: IconCalendar,
  location: IconPin,
  pin: IconPin,
  users: IconUsers,
  target: IconTarget,
  building: IconBuilding,
} as const;

export default function SobreOCursoPage() {
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setReducedMotion(typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!gradeModalOpen) return;
    previousActiveElement.current = document.activeElement as HTMLElement | null;
    const focusable = modalRef.current?.querySelector<HTMLElement>("button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])");
    focusable?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previousActiveElement.current?.focus();
    };
  }, [gradeModalOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setGradeModalOpen(false);
    }
    if (gradeModalOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [gradeModalOpen]);

  const containerClass = "max-w-6xl mx-auto px-4 sm:px-6";
  const sectionSpacing = "py-16 sm:py-20";

  return (
    <div className="pb-20">
      {/* Hero */}
      <section aria-label="Apresentação do curso" className="iforte-hero pt-20 sm:pt-24 pb-20 sm:pb-24">
        <div className={containerClass}>
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Image
                src="/iforte__2_-removebg-preview.png"
                alt="IFORTE — Instituto de Formação Teológica"
                width={120}
                height={120}
                className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-light tracking-tight text-[var(--iforte-text)]">
              Curso de Teologia
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[var(--iforte-text-muted)]">
              Formação teológica básica pelo <span className="font-semibold text-[var(--iforte-blue)]">IFORTE</span>, instituto da IVIDA.
            </p>
            <div className="mt-5 h-px w-16 mx-auto iforte-divider" aria-hidden />
            <div className="mt-12 sm:mt-14 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link href="/teologia/inscricao" className="iforte-btn-primary">
                Iniciar inscrição
              </Link>
              <button
                type="button"
                onClick={() => setGradeModalOpen(true)}
                className="iforte-btn-secondary"
              >
                Ver grade curricular
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Informações do curso */}
      <section aria-label="Informações do curso" className={sectionSpacing}>
        <div className={containerClass}>
          <h2 className="text-sm font-medium uppercase tracking-[0.1em] mb-6 flex items-center gap-3 text-[var(--iforte-blue)]">
            <span className="h-px w-8 bg-[var(--iforte-border-blue)] rounded-full" aria-hidden />
            Informações do curso
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {KEY_FACTS.map(({ label, value, icon }) => {
              const Icon = ICON_MAP[icon];
              return (
                <div key={label} className="iforte-card">
                  <div className="flex items-start gap-4">
                    <span className="iforte-icon mt-0.5" aria-hidden>{Icon && <Icon />}</span>
                    <div>
                      <h3 className={["iforte-label-caps"].join(" ")}>{label}</h3>
                      <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-[var(--iforte-text)]">{value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-12 sm:mt-16 max-w-prose mx-auto text-center text-[var(--iforte-text-muted)] leading-relaxed text-[0.9375rem] sm:text-base">
            Um ano de fundamentação na Palavra e na prática ministerial, com ensino reconhecido e acessível.
          </p>
        </div>
      </section>

      {/* Galeria do curso */}
      <EditorialCarousel
        fetchUrl="/api/imagens-iforte"
        initialSlides={[]}
        title="Galeria do curso"
        subtitle="Momentos das aulas, comunhão e aprendizado."
        buttonRingClass="focus-visible:ring-[var(--iforte-blue)]"
        containerClassName="max-w-6xl mx-auto px-4 sm:px-6"
      />

      {/* O curso — editorial */}
      <section aria-label="O curso" className={sectionSpacing}>
        <div className={containerClass}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="max-w-[600px] iforte-editorial-block">
              <h2 className="iforte-editorial-title">O curso</h2>
              <p className="mt-6 text-[var(--iforte-text-muted)] leading-[1.7]">
                Até o momento, o curso que aplicamos na IVIDA é um <strong className="text-[var(--iforte-text)]">curso básico de 1 ano</strong>, pelo <strong className="text-[var(--iforte-text)]">IFORTE — Instituto de Formação Teológica</strong>, instituto ligado à e da IVIDA.
              </p>
              <p className="mt-4 text-[var(--iforte-text-muted)] leading-[1.7]">
                A formação acontece em <strong className="text-[var(--iforte-text)]">Duque de Caxias, Rio de Janeiro</strong>, e tem como objetivo fundamentar o estudante na Palavra e na prática ministerial, com ensino acessível e comprometido com o Reino.
              </p>
            </div>
            <div className="iforte-card lg:mt-0">
              <h3 className="text-sm font-medium uppercase tracking-[0.08em] text-[var(--iforte-blue)]">Destaques</h3>
              <ul className="mt-6 space-y-5">
                {PILARES.map(({ title, text }) => (
                  <li key={title} className="iforte-pilar">
                    <span className="iforte-pilar-icon" aria-hidden><IconCheck /></span>
                    <div>
                      <span className="iforte-pilar-title">{title}</span>
                      <p className="mt-0.5 iforte-pilar-text">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* IFORTE */}
      <section aria-label="IFORTE" className={sectionSpacing}>
        <div className={containerClass}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div className="max-w-[600px] iforte-editorial-block">
              <h2 className="iforte-editorial-title">
                <span className="text-[var(--iforte-blue)]">IFORTE</span> — Instituto de Formação Teológica
              </h2>
              <p className="mt-6 text-[var(--iforte-text-muted)] leading-[1.7]">
                O IFORTE é o instituto de formação teológica da IVIDA. A formação é reconhecida e estruturada para quem deseja aprofundar o conhecimento bíblico e teológico, seja para o ministério ou para o crescimento pessoal na fé.
              </p>
            </div>
            <div className="iforte-card lg:mt-0">
              <p className="text-[var(--iforte-text-muted)] text-sm leading-[1.6]">
                As aulas acontecem no mesmo endereço da Igreja IVIDA, em ambiente de comunhão e discipulado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modal grade */}
      {gradeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" aria-modal="true" role="dialog" aria-labelledby="grade-modal-title" onClick={() => setGradeModalOpen(false)}>
          <div ref={modalRef} className={`relative w-full max-w-md iforte-modal-surface overflow-hidden ${reducedMotion ? "" : "animate-card-in"}`} onClick={(e) => e.stopPropagation()}>
            <div className="p-6 sm:p-8">
              <h2 id="grade-modal-title" className="text-xl font-semibold tracking-tight text-[var(--iforte-text)]">Grade curricular completa</h2>
              <ul className="mt-6 space-y-2">
                {GRADE_FULL.map((name, i) => (
                  <li key={name} className="flex items-center gap-3 text-[var(--iforte-text-muted)] text-[0.9375rem]">
                    <span className="text-[var(--iforte-blue)] text-sm font-medium tabular-nums w-6">{i + 1}.</span>
                    {name}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={() => setGradeModalOpen(false)} className="iforte-btn-primary">Fechar</button>
                <Link href="/teologia/inscricao" onClick={() => setGradeModalOpen(false)} className="iforte-btn-secondary">Iniciar inscrição</Link>
              </div>
            </div>
            <button type="button" onClick={() => setGradeModalOpen(false)} className="absolute right-4 top-4 p-2 rounded-lg text-[var(--iforte-text-muted)] hover:text-[var(--iforte-text)] hover:bg-white/10 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--iforte-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--iforte-surface)]" aria-label="Fechar">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      {/* Onde fica */}
      <section aria-label="Local e endereço" className={sectionSpacing}>
        <div className={`${containerClass} flex flex-col items-center`}>
          <div className="iforte-card-location w-full max-w-2xl flex flex-col items-center text-center">
            <div className="flex flex-col items-center">
              <span className="iforte-icon mb-2" aria-hidden><IconPin /></span>
              <h2 className="text-lg font-semibold tracking-tight text-[var(--iforte-text)]">
                Onde fica
              </h2>
              <div className="mt-2 h-px w-6 bg-[var(--iforte-border-blue)] rounded-full mx-auto" aria-hidden />
              <p className="mt-2 text-[var(--iforte-text-muted)] text-sm">
                As aulas acontecem no <strong className="text-[var(--iforte-text)]">mesmo endereço da Igreja IVIDA</strong>.
              </p>
              <address className="mt-4 not-italic text-[var(--iforte-text)]/90 leading-relaxed text-[0.9375rem]">
                R. Frei Veloso, 37 — Dr. Laureano<br />
                Duque de Caxias — RJ · CEP 25051-260
              </address>
              <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center justify-center gap-2 iforte-btn-secondary">
                Ver no Google Maps <IconExternal />
              </a>
            </div>
            <div className="mt-6 pt-6 border-t border-[var(--iforte-border)] w-full">
              <div className="rounded-xl bg-[var(--iforte-bg)] border border-[var(--iforte-border)] h-32 flex items-center justify-center">
                <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="iforte-link text-sm">
                  Abrir no Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section aria-label="Chamada para ação" className={sectionSpacing}>
        <div className={containerClass}>
          <div className="max-w-2xl mx-auto iforte-cta-box">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-[var(--iforte-text)]">Pronto para começar sua formação?</h2>
            <p className="mt-2 text-sm font-medium text-[var(--iforte-blue)]">IFORTE · Formação teológica</p>
            <p className="mt-3 text-sm sm:text-base text-[var(--iforte-text-muted)]">Dê o próximo passo: inscreva-se ou tire suas dúvidas conosco.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link href="/teologia/inscricao" className="iforte-btn-primary">Iniciar inscrição</Link>
              <Link href="/contato" className="iforte-btn-secondary">Tirar dúvidas</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
