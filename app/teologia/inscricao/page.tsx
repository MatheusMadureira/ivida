"use client";

import Link from "next/link";

export default function InscricaoPage() {
  return (
    <div className="px-4 sm:px-6 py-12 sm:py-16 pb-20">
      <div className="max-w-[600px] mx-auto">
        <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-[var(--iforte-text)]">
          Inscrição
        </h1>
        <div className="mt-3 h-px w-14 bg-[var(--iforte-border-blue)] rounded-full" aria-hidden />
        <p className="mt-4 text-base sm:text-lg text-[var(--iforte-text-muted)]">
          Como se inscrever no curso de teologia
        </p>
        <p className="mt-8 text-[var(--iforte-text-muted)] leading-[1.7] mb-6">
          Para se inscrever no curso básico de teologia (1 ano, <span className="font-semibold text-[var(--iforte-blue)]">IFORTE</span>), entre em contato conosco. As aulas acontecem no mesmo endereço da Igreja IVIDA, em Duque de Caxias — RJ.
        </p>
        <p className="text-[var(--iforte-text-muted)] leading-[1.7] mb-8">
          Estamos à disposição para tirar dúvidas sobre datas, turmas e documentação.
        </p>
        <Link href="/contato" className="iforte-btn-primary">
          Falar com a IVIDA
        </Link>
      </div>
    </div>
  );
}
