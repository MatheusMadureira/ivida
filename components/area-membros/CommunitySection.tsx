"use client";

import Link from "next/link";

// TODO: Avisos — conectar ao backend (ex.: /api/announcements). Materiais — rotas existentes ou placeholders.
const MOCK_AVISOS = [
  { id: "1", title: "Retiro de Carnaval 2026", date: "4 fev" },
  { id: "2", title: "Inscrições abertas para o Curso de Teologia", date: "28 jan" },
  { id: "3", title: "Culto de gratidão e colheita", date: "15 jan" },
];

const cardClass =
  "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 sm:p-6 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05]";

// Rotas existentes no projeto: /ministerios, /cultos-agenda, /teologia (IFORTE). Devocionais, Estudos, Louvores, Fotos não existem — placeholders ou ocultar.
const MATERIALS = [
  { label: "Devocionais", href: "#", placeholder: true },
  { label: "Estudos", href: "#", placeholder: true },
  { label: "Louvores", href: "/cultos-agenda", placeholder: false },
  { label: "Fotos", href: "#", placeholder: true },
  { label: "IFORTE", href: "/teologia", placeholder: false },
] as const;

export function CommunitySection({ avisos = MOCK_AVISOS }: { avisos?: typeof MOCK_AVISOS }) {
  return (
    <section className="mt-16 sm:mt-20">
      <h2 className="text-xl font-medium text-white text-center mb-10">Comunidade</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <article className={cardClass}>
          <h3 className="text-lg font-medium text-white">Avisos da Igreja</h3>
          <ul className="mt-4 space-y-2" role="list">
            {avisos.slice(0, 3).map((a) => (
              <li key={a.id}>
                <span className="text-xs text-white/50">{a.date}</span>
                <p className="text-sm text-white/90 mt-0.5">{a.title}</p>
              </li>
            ))}
          </ul>
          {/* TODO: rota "Ver todos" quando existir página de avisos */}
          <Link
            href="/contato"
            className="inline-flex items-center mt-4 text-sm font-medium text-ivida-red hover:text-ivida-redhover transition-colors"
          >
            Ver todos →
          </Link>
        </article>

        <article className={cardClass}>
          <h3 className="text-lg font-medium text-white">Materiais & Recursos</h3>
          <ul className="mt-4 flex flex-wrap gap-2" role="list">
            {MATERIALS.map((m) =>
              m.placeholder ? (
                <li key={m.label}>
                  <span className="inline-flex py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/50 cursor-default">
                    {m.label} <span className="ml-1 text-white/40">(em breve)</span>
                  </span>
                </li>
              ) : (
                <li key={m.label}>
                  <Link
                    href={m.href}
                    className="inline-flex py-2 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/90 hover:bg-white/10 hover:border-white/15 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                  >
                    {m.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </article>
      </div>
    </section>
  );
}
