"use client";

import { useEffect } from "react";

/** SVG simples de relógio/timeout (embutido, sem dependência externa) */
function TimeoutIllustration() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      className="w-24 h-24 sm:w-28 sm:h-28 mx-auto text-white/20"
      aria-hidden
    >
      <circle
        cx="60"
        cy="60"
        r="52"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="8 6"
      />
      <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line
        x1="60"
        y1="60"
        x2="60"
        y2="28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="60"
        y1="60"
        x2="84"
        y2="52"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="60" r="4" fill="currentColor" />
    </svg>
  );
}

type TimeoutModalProps = {
  onClose: () => void;
  /** Texto do tempo de inatividade (ex.: "10 segundos" ou "10 minutos"). Se não informado, usa "10 minutos". */
  durationLabel?: string;
};

export function TimeoutModal({ onClose, durationLabel = "10 minutos" }: TimeoutModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeout-modal-title"
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a]/95 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <TimeoutIllustration />
        </div>
        <h2
          id="timeout-modal-title"
          className="text-xl sm:text-2xl font-semibold text-white text-center mb-2"
        >
          Sessão expirada
        </h2>
        <p className="text-white/70 text-center text-sm sm:text-base mb-8">
          Você ficou {durationLabel} sem atividade. Por segurança, desconectamos sua conta.
        </p>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center py-3 px-8 rounded-xl text-white font-medium bg-ivida-red hover:bg-ivida-redhover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#1a1a1a]"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
