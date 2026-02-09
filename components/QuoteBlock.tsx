interface QuoteBlockProps {
  children: React.ReactNode;
  className?: string;
}

export function QuoteBlock({ children, className = "" }: QuoteBlockProps) {
  return (
    <blockquote
      className={`pl-4 sm:pl-5 border-l-2 border-ivida-red/50 text-white/75 italic text-base sm:text-lg leading-[1.7] ${className}`}
    >
      {children}
    </blockquote>
  );
}
