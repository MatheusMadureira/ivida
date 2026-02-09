interface EventRowProps {
  horario: string;
  nome: string;
  /** true = conteúdo à esquerda da timeline (nome | horário) */
  mirror?: boolean;
}

export function EventRow({ horario, nome, mirror = false }: EventRowProps) {
  const timeClass =
    "text-xs sm:text-sm font-medium text-ivida-red/90 tabular-nums font-mono shrink-0";

  if (mirror) {
    return (
      <div
        className="grid grid-cols-[1fr_88px] gap-x-3 items-baseline py-3 sm:py-3.5 text-right"
        role="listitem"
      >
        <span className="text-[0.9375rem] sm:text-base font-medium text-white/80 leading-relaxed min-w-0">
          {nome}
        </span>
        <span className={timeClass} aria-label={horario !== "—" ? `Horário: ${horario}` : undefined}>
          {horario}
        </span>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-[88px_1fr] gap-x-3 items-baseline py-3 sm:py-3.5 text-left"
      role="listitem"
    >
      <span className={timeClass} aria-label={horario !== "—" ? `Horário: ${horario}` : undefined}>
        {horario}
      </span>
      <span className="text-[0.9375rem] sm:text-base font-medium text-white/80 leading-relaxed min-w-0">
        {nome}
      </span>
    </div>
  );
}
