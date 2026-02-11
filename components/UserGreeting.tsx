"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

/** Extrai o primeiro nome: primeira palavra de full_name ou parte do email antes do @. */
function getFirstName(name: string | null, email: string): string {
  const trimmed = name?.trim();
  if (trimmed) {
    const first = trimmed.split(/\s+/)[0];
    if (first) return first;
  }
  const beforeAt = email.split("@")[0]?.trim() || "";
  const firstPart = beforeAt.split(/[._]/)[0]?.trim() || "você";
  return firstPart || "você";
}

/**
 * Eyebrow text: "Olá, {PrimeiroNome}. Que bom ter você aqui."
 * Só renderiza quando o usuário está logado; usa AuthContext.
 * Sem pill/caixa/fundo; detalhe em vermelho (ponto) antes do texto.
 */
export function UserGreeting() {
  const auth = useAuth();
  const user = auth?.user ?? null;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!user) return;
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(t);
  }, [user]);

  if (!user) return null;

  const firstName = getFirstName(user.name, user.email);
  const firstNameCapitalized =
    firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  const text = `Olá, ${firstNameCapitalized}, que bom ter você aqui.`;

  return (
    <p
      className={`mb-[14px] sm:mb-[18px] flex items-center justify-center gap-2.5 text-[13px] sm:text-[14px] md:text-[15px] font-medium tracking-[0.08em] text-white/75 transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-ivida-red" />
      <span>{text}</span>
    </p>
  );
}

/*
  TEST PLAN — UserGreeting (eyebrow text)

  1. Deslogado
     - Abrir /home sem sessão.
     - Esperado: nada renderizado; H1 "Vivendo intensamente…" é o primeiro conteúdo do Hero.
     - Desktop e mobile: mesmo comportamento.

  2. Logado (com nome)
     - Login com usuário que tem "name" (ex.: "Maria Silva").
     - Em /home: "Olá, Maria, que bom ter você aqui." com pequeno ponto vermelho à esquerda.

  3. Logado (só email)
     - name vazio, email joao.ferreira@email.com.
     - Esperado: "Olá, Joao, que bom ter você aqui." (fallback email antes do @).

  4. Responsivo
     - Desktop: texto 15px, margin-bottom 14–18px antes do H1.
     - Mobile: texto 13px, centralizado; H1 mantém destaque.
*/
