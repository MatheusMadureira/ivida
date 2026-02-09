"use client";

import Link from "next/link";

export default function ProfessoresPage() {
  return (
    <div className="px-4 sm:px-6 py-12 sm:py-16 pb-20">
      <div className="max-w-[600px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--iforte-text)]">
          Professores
        </h1>
        <div className="mt-3 h-px w-14 bg-[var(--iforte-border-blue)] rounded-full" aria-hidden />
        <p className="mt-4 text-base sm:text-lg text-[var(--iforte-text-muted)]">
          Corpo docente do curso de teologia
        </p>
        <p className="mt-8 text-[var(--iforte-text-muted)] leading-[1.7] mb-8">
          Em breve disponibilizaremos aqui as informações sobre os professores do curso básico de teologia do <span className="font-semibold text-[var(--iforte-blue)]">IFORTE</span>, instituto da IVIDA.
        </p>
        <Link href="/teologia/sobre-o-curso" className="iforte-btn-secondary">
          Voltar para Sobre o Curso
        </Link>
      </div>
    </div>
  );
}
