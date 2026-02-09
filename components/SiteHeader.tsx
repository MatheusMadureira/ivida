"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";

const linkBase =
  "px-3 py-2 text-[0.97rem] rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]";
const linkActive =
  "text-accent-primary font-medium bg-accent-muted border border-accent-border";
const linkInactive = "text-white/90 hover:text-white hover:bg-white/5";

function navLink(path: string, label: string, currentPath: string) {
  const active = currentPath === path;
  return (
    <Link
      href={path}
      className={`${linkBase} ${active ? linkActive : linkInactive}`}
    >
      {label}
    </Link>
  );
}

/** Link para o drawer mobile: altura mínima 44px, destaque quando ativo */
function drawerLink(
  path: string,
  label: string,
  pathname: string,
  onClose: () => void,
  forceActive?: boolean
) {
  const active = forceActive ?? pathname === path;
  return (
    <Link
      href={path}
      onClick={onClose}
      className={`block w-full text-left px-4 py-3 min-h-[44px] flex items-center rounded-xl text-[1rem] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] ${active ? "text-accent-primary font-medium bg-accent-muted border border-accent-border" : "text-white/90 hover:text-white hover:bg-white/5"}`}
    >
      {label}
    </Link>
  );
}

export function SiteHeader({
  left,
  right,
}: {
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  const pathname = usePathname() ?? "";
  const isTeologia = pathname.startsWith("/teologia");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  // Travar scroll do body quando o drawer está aberto
  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMenuOpen]);

  // Foco no botão fechar ao abrir o drawer
  useEffect(() => {
    if (isMenuOpen) {
      closeButtonRef.current?.focus();
    }
  }, [isMenuOpen]);

  // Fechar ao pressionar ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    if (isMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isMenuOpen, closeMenu]);

  const defaultLeft = (
    <Link
      href="/home"
      className="shrink-0 opacity-90 hover:opacity-100 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded text-2xl sm:text-3xl tracking-tight text-ivida-red font-medium"
    >
      IVIDA
    </Link>
  );

  return (
    <>
      <header
        className="relative z-50 px-4 py-4 sm:px-6 sm:py-5 border-b border-white/[0.08] backdrop-blur-md"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.45)" }}
      >
        {/* Mobile: logo à esquerda + hamburger à direita */}
        <div className="flex md:hidden items-center justify-between w-full min-h-[44px]">
          <div className="flex justify-start min-w-0">{left ?? defaultLeft}</div>
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Abrir menu"
            className="p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Desktop: grid com menu centralizado */}
        <div className="hidden md:grid grid-cols-[1fr_auto_1fr] items-center gap-4 w-full">
          <div className="flex justify-start min-w-0">{left ?? defaultLeft}</div>
          <nav
            className="flex flex-wrap items-center justify-center gap-1 sm:gap-2"
            aria-label="Menu principal"
          >
            {navLink("/home", "Home", pathname)}
            {navLink("/sobre-nos", "Sobre Nós", pathname)}
            {navLink("/cultos-agenda", "Cultos & Agenda", pathname)}
            {navLink("/area-membros", "Área de Membros", pathname)}
            <div className="relative group">
              <span
                className={`inline-flex items-center ${linkBase} cursor-default ${
                  isTeologia ? linkActive : linkInactive
                }`}
              >
                Teologia
              </span>
              <div className="absolute left-0 top-full pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-[100]">
                <div className="min-w-[180px] py-2 bg-[#0d0d0d] border border-white/10 rounded-xl shadow-xl shadow-black/50">
                  <Link
                    href="/teologia/sobre-o-curso"
                    className="block px-4 py-2.5 text-[0.97rem] text-white/90 hover:text-white hover:bg-white/5 transition-colors rounded-lg mx-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]"
                  >
                    Sobre o Curso
                  </Link>
                  <Link
                    href="/teologia/grade-curricular"
                    className="block px-4 py-2.5 text-[0.97rem] text-white/90 hover:text-white hover:bg-white/5 transition-colors rounded-lg mx-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]"
                  >
                    Grade Curricular
                  </Link>
                  <Link
                    href="/teologia/professores"
                    className="block px-4 py-2.5 text-[0.97rem] text-white/90 hover:text-white hover:bg-white/5 transition-colors rounded-lg mx-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]"
                  >
                    Professores
                  </Link>
                  <Link
                    href="/teologia/inscricao"
                    className="block px-4 py-2.5 text-[0.97rem] text-white/90 hover:text-white hover:bg-white/5 transition-colors rounded-lg mx-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0d]"
                  >
                    Inscrição
                  </Link>
                </div>
              </div>
            </div>
            {navLink("/ministerios", "Ministérios", pathname)}
            {navLink("/contato", "Contato", pathname)}
          </nav>
          <div className="flex justify-end min-w-0">{right ?? null}</div>
        </div>
      </header>

      {/* Overlay + Drawer mobile */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        ref={drawerRef}
        className={`fixed inset-0 z-[100] md:hidden transition-[visibility,opacity] duration-300 ease-out ${
          isMenuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Backdrop: clique fora fecha; blur leve */}
        <div
          role="presentation"
          onClick={closeMenu}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        />

        {/* Painel do drawer: slide da direita */}
        <div
          className={`absolute top-0 right-0 h-full w-full max-w-[320px] bg-[#111] border-l border-white/10 rounded-l-2xl shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <span className="text-sm font-medium text-white/70">Menu</span>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeMenu}
              aria-label="Fechar menu"
              className="p-2 rounded-lg text-white/90 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#111] min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-1"
            aria-label="Navegação"
          >
            {drawerLink("/home", "Home", pathname, closeMenu)}
            {drawerLink("/sobre-nos", "Sobre Nós", pathname, closeMenu)}
            {drawerLink("/cultos-agenda", "Cultos & Agenda", pathname, closeMenu)}
            {drawerLink("/area-membros", "Área de Membros", pathname, closeMenu)}
            {drawerLink("/teologia", "Teologia", pathname, closeMenu, isTeologia)}
            {drawerLink("/teologia/sobre-o-curso", "Sobre o Curso", pathname, closeMenu)}
            {drawerLink("/teologia/grade-curricular", "Grade Curricular", pathname, closeMenu)}
            {drawerLink("/teologia/professores", "Professores", pathname, closeMenu)}
            {drawerLink("/teologia/inscricao", "Inscrição", pathname, closeMenu)}
            {drawerLink("/ministerios", "Ministérios", pathname, closeMenu)}
            {drawerLink("/contato", "Contato", pathname, closeMenu)}
          </nav>
        </div>
      </div>
    </>
  );
}

/** Logo IFORTE para uso no layout de teologia */
export function TeologiaLogo() {
  return (
    <Link
      href="/teologia"
      className="shrink-0 opacity-90 hover:opacity-100 transition-opacity duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212] rounded"
    >
      <Image
        src="/iforte-removebg-preview.png"
        alt="IFORTE"
        width={190}
        height={90}
        className="h-10 sm:h-12 w-auto object-contain"
        priority
      />
    </Link>
  );
}
