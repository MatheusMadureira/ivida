"use client";

import Link from "next/link";

// TODO: conectar ao backend — ministérios vinculados ao usuário (ex.: API /api/me/ministries)
const cardClass =
  "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 sm:p-6 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05]";

type Ministry = { id?: string; name: string; slug?: string };

export function MinistriesCard({ ministries = [] }: { ministries?: Ministry[] }) {
  const hasMinistries = ministries.length > 0;

  return (
    <article className={cardClass}>
      <h3 className="text-lg font-medium text-white">Meus Ministérios</h3>
      <p className="text-sm text-white/60 mt-1">Ministérios em que você participa</p>
      <div className="mt-4">
        {hasMinistries ? (
          <ul className="flex flex-wrap gap-2" role="list">
            {ministries.map((m) => (
              <li key={m.id ?? m.name}>
                <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white/5 border border-white/10 text-sm text-white/90">
                  <span className="w-1.5 h-1.5 rounded-full bg-ivida-red/80" aria-hidden />
                  {m.name}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50 italic">
            Você ainda não está vinculado a um ministério. Fale com a liderança.
          </p>
        )}
        <Link
          href="/ministerios"
          className="inline-flex items-center mt-4 text-sm font-medium text-ivida-red hover:text-ivida-redhover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
        >
          Ver ministérios →
        </Link>
      </div>
    </article>
  );
}
