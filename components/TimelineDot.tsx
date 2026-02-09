interface TimelineDotProps {
  className?: string;
}

export function TimelineDot({ className = "" }: TimelineDotProps) {
  return (
    <span
      className={`shrink-0 w-3 h-3 rounded-full bg-ivida-red/70 transition-transform duration-200 ease-out group-hover:scale-110 ${className}`}
      aria-hidden
    />
  );
}
