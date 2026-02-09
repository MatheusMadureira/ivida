"use client";

import { EventRow } from "./EventRow";
import { TimelineDot } from "./TimelineDot";
import type { EventItem } from "./DayBlock";

interface TimelineItemProps {
  dia: string;
  itens: readonly EventItem[];
  side: "left" | "right";
  isFirst?: boolean;
  isLast?: boolean;
  isVisible?: boolean;
}

export function TimelineItem({
  dia,
  itens,
  side,
  isLast = false,
  isVisible = false,
}: TimelineItemProps) {
  const mirror = side === "left";

  return (
    <>
      {/* Mobile: linha central, conteúdo centralizado abaixo */}
      <div
        className={`lg:hidden flex flex-col items-center pb-10 transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        }`}
      >
        <div className="relative flex flex-col items-center shrink-0">
          <TimelineDot className="mt-1.5" />
          {!isLast && (
            <span
              className="absolute left-1/2 top-6 -translate-x-px w-px h-6 bg-white/[0.08]"
              aria-hidden
            />
          )}
        </div>
        <div className="w-full max-w-[320px] mx-auto mt-4 text-center">
          <h3 className="text-xs font-medium text-white/50 uppercase tracking-[0.2em]">
            {dia}
          </h3>
          <ul className="space-y-0 w-full mt-4" role="list">
            {itens.map(({ horario, nome }) => (
              <li key={`${dia}-${horario}-${nome}`}>
                <EventRow horario={horario} nome={nome} mirror={false} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Desktop: grid 3 colunas — alternância esquerda/direita, hover e glow */}
      <div
        className={`hidden lg:grid lg:grid-cols-[1fr_80px_1fr] lg:gap-0 lg:w-full lg:py-14 group transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        } ${isLast ? "lg:pb-0" : ""}`}
      >
        {/* Linha 1: título do dia + dot (mesma altura) */}
        <div className="flex items-center justify-end pr-0 min-h-[2rem]">
          {side === "left" && (
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-[0.2em] group-hover:text-white/70 transition-colors duration-200">
              {dia}
            </h3>
          )}
        </div>
        <div className="relative flex items-center justify-center min-h-[2rem]">
          {/* Glow na linha central ao hover */}
          <span
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-16 bg-ivida-red/25 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none"
            aria-hidden
          />
          <TimelineDot />
        </div>
        <div className="flex items-center justify-start pl-0 min-h-[2rem]">
          {side === "right" && (
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-[0.2em] group-hover:text-white/70 transition-colors duration-200">
              {dia}
            </h3>
          )}
        </div>

        {/* Linha 2: lista de eventos + fundo sutil no hover */}
        <div className="flex justify-end pt-4 pr-0">
          {side === "left" && (
            <div className="w-full max-w-[460px] text-right">
              <ul className="space-y-0 w-full" role="list">
                {itens.map(({ horario, nome }) => (
                  <li key={`${dia}-${horario}-${nome}`}>
                    <EventRow horario={horario} nome={nome} mirror={true} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="pt-4" />
        <div className="flex justify-start pt-4 pl-0">
          {side === "right" && (
            <div className="w-full max-w-[460px] text-left">
              <ul className="space-y-0 w-full" role="list">
                {itens.map(({ horario, nome }) => (
                  <li key={`${dia}-${horario}-${nome}`}>
                    <EventRow horario={horario} nome={nome} mirror={false} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
