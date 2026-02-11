"use client";

import { useEffect, useRef, useCallback } from "react";

/** Se NEXT_PUBLIC_INACTIVITY_MS estiver definida, usa esse valor. Se estiver comentada/ausente, sempre 10 minutos. */
function getDefaultInactivityMs(): number {
  if (typeof process === "undefined") return 10 * 60 * 1000;
  const env = process.env.NEXT_PUBLIC_INACTIVITY_MS;
  if (env != null && env !== "") return Number(env) || 10 * 60 * 1000;
  return 10 * 60 * 1000;
}
const INACTIVITY_MS_DEFAULT = getDefaultInactivityMs();

const MOUSE_THROTTLE_MS = 1000;

const EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "click",
] as const;

export type InactivityLogoutOptions = {
  /** Tempo em ms sem atividade para disparar logout (default: 10 min ou NEXT_PUBLIC_INACTIVITY_MS) */
  inactivityMs?: number;
  /** Chamado quando o tempo expira; pathname atual para decidir modal vs silencioso */
  onExpire: (pathname: string) => void;
  /** Se false, o timer não é iniciado/reiniciado (ex.: usuário deslogado) */
  enabled: boolean;
};

export function useInactivityLogout({
  inactivityMs = INACTIVITY_MS_DEFAULT,
  onExpire,
  enabled,
}: InactivityLogoutOptions) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastMouseResetRef = useRef<number>(0);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  const resetTimer = useCallback(() => {
    if (!enabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      const pathname = typeof window !== "undefined" ? window.location.pathname : "";
      onExpireRef.current(pathname);
    }, inactivityMs);
  }, [enabled, inactivityMs]);

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    resetTimer();

    const handleActivity = (e: Event) => {
      const type = e.type as (typeof EVENTS)[number];
      const now = Date.now();
      if (type === "mousemove") {
        if (now - lastMouseResetRef.current < MOUSE_THROTTLE_MS) return;
        lastMouseResetRef.current = now;
      }
      resetTimer();
    };

    for (const event of EVENTS) {
      window.addEventListener(event, handleActivity);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      for (const event of EVENTS) {
        window.removeEventListener(event, handleActivity);
      }
    };
  }, [enabled, resetTimer]);
}
