"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LogoutButton, LogoutButtonDrawer } from "@/components/LogoutButton";

/** Slot do header (desktop): mostra "Sair" só quando o usuário está logado. */
export function AuthLogoutSlot() {
  const auth = useAuth();
  if (!auth?.user) return null;
  return <LogoutButton />;
}

/** Slot do drawer (mobile): mostra "Sair" só quando o usuário está logado. */
export function AuthLogoutSlotDrawer({ onClose }: { onClose: () => void }) {
  const auth = useAuth();
  if (!auth?.user) return null;
  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <LogoutButtonDrawer onClose={onClose} />
    </div>
  );
}
