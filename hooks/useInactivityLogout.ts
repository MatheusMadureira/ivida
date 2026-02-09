"use client";

import { useEffect, useRef, useCallback } from "react";

const INACTIVITY_MS = 10 * 60 * 1000; // 10 minutos

const EVENTS = [
  "mousemove",
  "mousedown",
  "keydown",
  "touchstart",
  "scroll",
  "click",
] as const;

export function useInactivityLogout(inactivityMs: number = INACTIVITY_MS) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const logout = useCallback(() => {
    window.location.href = "/api/auth/logout";
  }, []);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    timeoutRef.current = setTimeout(logout, inactivityMs);
  }, [logout, inactivityMs]);

  useEffect(() => {
    resetTimer();

    for (const event of EVENTS) {
      window.addEventListener(event, resetTimer);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      for (const event of EVENTS) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [resetTimer]);
}
