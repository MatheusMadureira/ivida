"use client";

import { useEffect, useState } from "react";
import { LogoutButton, LogoutButtonDrawer } from "@/components/LogoutButton";

type MeResponse = { user: { id: string; email: string } | null };

/** Slot do header (desktop): mostra "Sair" só quando o usuário está logado. */
export function AuthLogoutSlot() {
  const [user, setUser] = useState<MeResponse["user"]>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json() as Promise<MeResponse>)
      .then((data) => {
        setUser(data.user ?? null);
        setDone(true);
      })
      .catch(() => {
        setDone(true);
      });
  }, []);

  if (!done || !user) return null;
  return <LogoutButton />;
}

/** Slot do drawer (mobile): mostra "Sair" só quando o usuário está logado. */
export function AuthLogoutSlotDrawer({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<MeResponse["user"]>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json() as Promise<MeResponse>)
      .then((data) => {
        setUser(data.user ?? null);
        setDone(true);
      })
      .catch(() => {
        setDone(true);
      });
  }, []);

  if (!done || !user) return null;
  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <LogoutButtonDrawer onClose={onClose} />
    </div>
  );
}
