"use client";

import { useRef, useEffect, useState } from "react";
import { TimelineItem } from "./TimelineItem";
import type { EventItem } from "./DayBlock";

interface DaySchedule {
  dia: string;
  itens: readonly EventItem[];
}

interface TimelineProps {
  days: readonly DaySchedule[];
  className?: string;
}

export function Timeline({ days, className = "" }: TimelineProps) {
  const [visibleIndexes, setVisibleIndexes] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = (entry.target as HTMLElement).getAttribute("data-timeline-index");
          if (entry.isIntersecting && idx != null) {
            const index = parseInt(idx, 10);
            setVisibleIndexes((prev) => new Set(prev).add(index));
          }
        });
      },
      { rootMargin: "0px 0px -40px 0px", threshold: 0.1 }
    );
    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [days.length]);

  return (
    <div className={`relative mt-10 ${className}`}>
      {/* Linha vertical central — eixo fixo */}
      <span
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-px bg-white/[0.08] hidden lg:block"
        aria-hidden
      />
      <div className="relative space-y-0">
        {days.map((block, index) => (
          <div
            key={block.dia}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            data-timeline-index={index}
          >
            <TimelineItem
              dia={block.dia}
              itens={block.itens}
              side={index % 2 === 0 ? "left" : "right"}
              isLast={index === days.length - 1}
              isVisible={visibleIndexes.has(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
