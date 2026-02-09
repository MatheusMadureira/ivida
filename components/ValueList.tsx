interface ValueListProps {
  items: string[];
  variant?: "bullets" | "chips";
  className?: string;
}

export function ValueList({
  items,
  variant = "bullets",
  className = "",
}: ValueListProps) {
  if (variant === "chips") {
    return (
      <ul
        className={`flex flex-wrap gap-2 ${className}`}
        role="list"
      >
        {items.map((item) => (
          <li
            key={item}
            className="px-3 py-1.5 rounded-lg border border-white/10 text-white/80 text-sm leading-snug"
          >
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <ul className={`space-y-2 text-white/80 leading-[1.75] ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span className="text-ivida-red shrink-0 mt-0.5">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
