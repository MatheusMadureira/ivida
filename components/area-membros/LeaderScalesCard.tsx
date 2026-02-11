"use client";

// TODO: conectar ao backend — escalas/responsabilidades do líder (ex.: API /api/me/schedules)
const cardClass =
  "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 sm:p-6 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05]";

type ScaleItem = { id: string; title: string; date?: string; role?: string };

export function LeaderScalesCard({ items = [] }: { items?: ScaleItem[] }) {
  const hasItems = items.length > 0;

  return (
    <article className={cardClass}>
      <h3 className="text-lg font-medium text-white">Minhas escalas / Próximas responsabilidades</h3>
      <p className="text-sm text-white/60 mt-1">Suas próximas escalas como líder</p>
      <div className="mt-4">
        {hasItems ? (
          <ul className="space-y-2" role="list">
            {items.map((i) => (
              <li key={i.id} className="flex flex-wrap items-baseline justify-between gap-2 py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-white/90">{i.title}</span>
                {i.date && <span className="text-xs text-white/50">{i.date}</span>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-white/50 italic">
            Nenhuma escala próxima. Quando houver, aparecerão aqui.
          </p>
        )}
      </div>
    </article>
  );
}
