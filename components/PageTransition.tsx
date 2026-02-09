"use client";

/**
 * Wrapper para transição de página: fade + leve slide vertical.
 * Aplicar somente ao conteúdo principal; Header/Nav devem ficar fora.
 * 220ms ease-out; respeita prefers-reduced-motion.
 */
export function PageTransition({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`page-transition ${className}`.trim()}>{children}</div>;
}
