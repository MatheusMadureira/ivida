import { AccentDivider } from "./AccentDivider";

interface SectionBlockProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionBlock({ title, children, className = "" }: SectionBlockProps) {
  return (
    <section className={className}>
      <h2 className="text-lg font-medium text-ivida-red tracking-tight">
        {title}
      </h2>
      <AccentDivider />
      <div className="mt-6 text-white/80 leading-[1.75] text-left">
        {children}
      </div>
    </section>
  );
}
