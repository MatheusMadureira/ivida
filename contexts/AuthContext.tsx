"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";

export type AuthUser = {
  id: string;
  email: string;
  name: string | null;
  roles?: string[];
  photo_url?: string | null;
  phone?: string | null;
};

type MeResponse = { user: AuthUser | null };

type AuthContextValue = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  /** Revalida sessão (útil após login ou logout em outra aba). */
  refetch: () => Promise<void>;
  /** Atualização otimista (ex.: após upload de foto) para evitar refetch. */
  updateUser: (updates: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });
      const data = (await res.json()) as MeResponse;
      const serverUser = data.user ?? null;
      setUser((prev) => {
        if (!serverUser) return null;
        if (!prev) return serverUser;
        const prevPhoto = prev.photo_url ?? "";
        const serverPhoto = serverUser.photo_url ?? "";
        if (prevPhoto.includes("?v=") && serverPhoto !== prevPhoto) {
          return { ...serverUser, photo_url: prevPhoto };
        }
        return serverUser;
      });
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetch("/api/auth/me", { credentials: "include", cache: "no-store" })
      .then((res) => res.json() as Promise<MeResponse>)
      .then((data) => {
        if (cancelled) return;
        const serverUser = data.user ?? null;
        setUser((prev) => {
          if (!serverUser) return null;
          if (!prev) return serverUser;
          const prevPhoto = prev.photo_url ?? "";
          const serverPhoto = serverUser.photo_url ?? "";
          if (prevPhoto.includes("?v=") && serverPhoto !== prevPhoto) {
            return { ...serverUser, photo_url: prevPhoto };
          }
          return serverUser;
        });
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const updateUser = useCallback((updates: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  const value: AuthContextValue = {
    user,
    isLoggedIn: !!user,
    isLoading,
    refetch,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
