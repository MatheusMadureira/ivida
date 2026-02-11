"use client";

import { useState, useCallback } from "react";

// TODO: conectar ao backend — listar e enviar pedidos de oração (ex.: API /api/prayer-requests)
type PrayerItem = { id: string; message: string; createdAt?: string };

const cardClass =
  "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-5 sm:p-6 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05]";

export function PrayerRequestsCard({
  requests = [],
  userName = "",
  onSend,
}: {
  requests?: PrayerItem[];
  userName?: string;
  onSend?: (message: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = message.trim();
      if (!trimmed) return;
      setSending(true);
      try {
        if (onSend) {
          onSend(trimmed);
        } else {
          // TODO: substituir por chamada à API quando existir backend de pedidos de oração
          console.log("[PrayerRequestsCard] Pedido de oração (TODO backend):", { userName, message: trimmed });
        }
        setMessage("");
        setModalOpen(false);
      } finally {
        setSending(false);
      }
    },
    [message, onSend, userName]
  );

  return (
    <>
      <article className={cardClass}>
        <h3 className="text-lg font-medium text-white">Pedidos de Oração</h3>
        <p className="text-sm text-white/60 mt-1">Envie seu pedido e acompanhe os últimos</p>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="mt-4 inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-sm font-medium bg-ivida-red hover:bg-ivida-redhover text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
        >
          Enviar pedido
        </button>
        <div className="mt-4">
          {requests.length > 0 ? (
            <ul className="space-y-2" role="list">
              {requests.slice(0, 3).map((r) => (
                <li key={r.id} className="text-sm text-white/70 py-2 border-b border-white/5 last:border-0">
                  {r.message}
                  {r.createdAt && (
                    <span className="block text-xs text-white/40 mt-1">{r.createdAt}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-white/50 italic">Nenhum pedido enviado ainda.</p>
          )}
        </div>
      </article>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          aria-labelledby="prayer-modal-title"
          onClick={() => !sending && setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141414] shadow-xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="prayer-modal-title" className="text-lg font-medium text-white">
              Enviar pedido de oração
            </h2>
            <p className="text-sm text-white/60 mt-1">
              {userName ? `Enviando como ${userName}.` : "Seu pedido será encaminhado à liderança."}
            </p>
            <form onSubmit={handleSubmit} className="mt-6">
              <label htmlFor="prayer-message" className="block text-sm font-medium text-white/80 mb-2">
                Mensagem
              </label>
              <textarea
                id="prayer-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva seu pedido de oração..."
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red transition-colors resize-none"
                required
              />
              <div className="mt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => !sending && setModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl text-sm font-medium border border-white/20 text-white/90 hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  className="py-2.5 px-4 rounded-xl text-sm font-medium bg-ivida-red hover:bg-ivida-redhover text-white disabled:opacity-50 disabled:pointer-events-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141414]"
                >
                  {sending ? "Enviando…" : "Enviar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
