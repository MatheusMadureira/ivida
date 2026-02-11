"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import { TimeoutModal } from "@/components/TimeoutModal";

const AREA_MEMBROS_PATH = "/area-membros";

/** Se NEXT_PUBLIC_INACTIVITY_MS estiver definida, usa esse valor (ex.: 10000 = 10s para testar). Se estiver comentada/ausente, sempre 10 minutos. */
function getInactivityMs(): number {
  if (typeof process === "undefined") return 10 * 60 * 1000;
  const env = process.env.NEXT_PUBLIC_INACTIVITY_MS;
  if (env != null && env !== "") return Number(env) || 10 * 60 * 1000;
  return 10 * 60 * 1000;
}

/** Converte ms em texto legível para a mensagem do modal (ex.: "10 segundos", "10 minutos"). */
function inactivityDurationLabel(ms: number): string {
  if (ms >= 60_000) {
    const min = Math.round(ms / 60_000);
    return min === 1 ? "1 minuto" : `${min} minutos`;
  }
  const sec = Math.round(ms / 1000);
  return sec === 1 ? "1 segundo" : `${sec} segundos`;
}

type InactivityContextValue = {
  /** Limpa o estado de timeout (evita mostrar modal após logout manual) */
  clearTimeoutState: () => void;
  /** Deve ser chamado antes de redirecionar para logout (limpa estado + redirect) */
  performLogout: () => void;
};

const InactivityContext = createContext<InactivityContextValue | null>(null);

export function useInactivity() {
  const ctx = useContext(InactivityContext);
  return ctx;
}

export function InactivityProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const auth = useAuth();
  const isLoggedIn = !!auth?.user;
  const refetchAuth = auth?.refetch ?? (async () => {});
  const [timeoutHappened, setTimeoutHappened] = useState(false);

  const clearTimeoutState = useCallback(() => {
    setTimeoutHappened(false);
  }, []);

  const performLogout = useCallback(() => {
    clearTimeoutState();
    window.location.href = "/api/auth/logout";
  }, [clearTimeoutState]);

  useInactivityLogout({
    inactivityMs: getInactivityMs(),
    enabled: isLoggedIn,
    onExpire: async (expiredPathname) => {
      await fetch("/api/auth/logout?no_redirect=1", { credentials: "include" });
      await refetchAuth();
      if (expiredPathname === AREA_MEMBROS_PATH) {
        setTimeoutHappened(true);
      }
    },
  });

  const handleTimeoutModalClose = useCallback(() => {
    clearTimeoutState();
    window.location.href = "/area-membros";
  }, [clearTimeoutState]);

  const showTimeoutModal =
    timeoutHappened && pathname === AREA_MEMBROS_PATH;

  const value: InactivityContextValue = {
    clearTimeoutState,
    performLogout,
  };

  return (
    <InactivityContext.Provider value={value}>
      {children}
      {showTimeoutModal && (
        <TimeoutModal
          durationLabel={inactivityDurationLabel(getInactivityMs())}
          onClose={handleTimeoutModalClose}
        />
      )}
    </InactivityContext.Provider>
  );
}
