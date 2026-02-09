interface PageHeroProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHero({ title, subtitle, className = "" }: PageHeroProps) {
  return (
    <header
      className={`text-center max-w-[820px] mx-auto ${className}`}
    >
      <h1 className="text-3xl sm:text-4xl md:text-[2.5rem] font-light text-white tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-base sm:text-lg text-white/70">
          {subtitle}
        </p>
      )}
    </header>
  );
}
