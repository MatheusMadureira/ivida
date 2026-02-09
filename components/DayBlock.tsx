import { EventRow } from "./EventRow";

export interface EventItem {
  horario: string;
  nome: string;
}

interface DayBlockProps {
  dia: string;
  itens: readonly EventItem[];
  isLast?: boolean;
}

export function DayBlock({ dia, itens, isLast = false }: DayBlockProps) {
  return (
    <div
      className={`relative pl-6 sm:pl-8 ${isLast ? "pb-0" : "pb-12"}`}
    >
      {/* Ponto na timeline */}
      <span
        className="absolute left-0 top-[0.45em] w-2 h-2 rounded-full bg-ivida-red/60 -translate-x-1/2"
        aria-hidden
      />
      <h3 className="text-xs font-medium text-white/60 uppercase tracking-[0.2em] mb-5">
        {dia}
      </h3>
      <ul className="space-y-0" role="list">
        {itens.map(({ horario, nome }) => (
          <li key={`${dia}-${horario}-${nome}`}>
            <EventRow horario={horario} nome={nome} />
          </li>
        ))}
      </ul>
    </div>
  );
}
