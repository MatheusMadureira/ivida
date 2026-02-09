import { AccentDivider } from "./AccentDivider";
import { Timeline } from "./Timeline";
import type { EventItem } from "./DayBlock";

export interface DaySchedule {
  dia: string;
  itens: readonly EventItem[];
}

interface ScheduleSectionProps {
  title: string;
  days: readonly DaySchedule[];
  className?: string;
}

export function ScheduleSection({
  title,
  days,
  className = "",
}: ScheduleSectionProps) {
  return (
    <section className={className}>
      <div className="text-center">
        <h2 className="text-lg font-medium text-ivida-red tracking-tight">
          {title}
        </h2>
        <AccentDivider className="mx-auto" />
      </div>
      <Timeline days={days} />
    </section>
  );
}
