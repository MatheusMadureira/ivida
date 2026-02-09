interface AccentDividerProps {
  className?: string;
}

export function AccentDivider({ className = "" }: AccentDividerProps) {
  return (
    <hr
      className={`border-0 h-px bg-ivida-red/60 mt-2 mb-0 w-12 ${className}`}
      aria-hidden
    />
  );
}
