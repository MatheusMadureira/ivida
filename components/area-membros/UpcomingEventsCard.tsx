"use client";

import Link from "next/link";

// TODO: conectar ao backend — próximos eventos do usuário (ex.: API /api/me/events ou feed de cultos/agenda)
const MOCK_EVENTS = [
  { id: "1", date: "Dom, 15 fev", name: "Culto de Louvor e Adoração", time: "17:30" },
  { id: "2", date: "Ter, 17 fev", name: "Curso de Teologia", time: "19:00" },
  { id: "3", date: "Qua, 18 fev", name: "Quarta-feira profética", time: "19:30" },
];

const cardClass =
  "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 sm:p-6 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05]";

export function UpcomingEventsCard({ events = MOCK_EVENTS }: { events?: typeof MOCK_EVENTS }) {
  const list = events.length > 0 ? events : [];

  return (
    <article className={cardClass}>
      <h3 className="text-lg font-medium text-white">Próximos Encontros</h3>
      <p className="text-sm text-white/60 mt-1">Próximos eventos e cultos</p>
      <ul className="mt-4 space-y-3" role="list">
        {list.length === 0 ? (
          <li className="text-sm text-white/50 italic">Nenhum evento próximo.</li>
        ) : (
          list.slice(0, 3).map((ev) => (
            <li key={ev.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2 border-b border-white/5 last:border-0">
              <div className="min-w-0">
                <span className="text-xs text-white/50">{ev.date}</span>
                <p className="text-sm font-medium text-white/90 mt-0.5">{ev.name}</p>
              </div>
              <span className="text-xs font-medium text-ivida-red/90 tabular-nums shrink-0">{ev.time}</span>
            </li>
          ))
        )}
      </ul>
      <Link
        href="/cultos-agenda"
        className="inline-flex items-center mt-4 text-sm font-medium text-ivida-red hover:text-ivida-redhover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
      >
        Ver agenda completa →
      </Link>
    </article>
  );
}
