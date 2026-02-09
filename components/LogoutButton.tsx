"use client";

function handleLogout() {
  window.location.href = "/api/auth/logout";
}

const baseClass =
  "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]";

/** Botão de logout para o header (desktop) */
export function LogoutButton() {
  return (
    <button
      type="button"
      onClick={handleLogout}
      className={`${baseClass} px-3 py-2 text-[0.97rem] rounded-lg text-white/90 hover:text-white hover:bg-white/5`}
    >
      Sair
    </button>
  );
}

/** Link estilo drawer para o menu mobile */
export function LogoutButtonDrawer({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        onClose();
        handleLogout();
      }}
      className="block w-full text-left px-4 py-3 min-h-[44px] flex items-center rounded-xl text-[1rem] text-white/90 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-[#111]"
    >
      Sair
    </button>
  );
}
