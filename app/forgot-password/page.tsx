"use client";

import Link from "next/link";
import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [mensagem, setMensagem] = useState("");

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red transition-colors";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    setEnviado(false);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErro(data.error || "Erro ao enviar. Tente novamente.");
        return;
      }
      setMensagem(data.message || "Se existir uma conta com este e-mail, você receberá um link para redefinir a senha.");
      setEnviado(true);
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(45, 44, 44, 0.8) 0%, rgb(27, 26, 26) 50%, rgb(38, 36, 36) 100%)",
      }}
    >
      <div
        className="blob-float-1 fixed w-[min(80vw,420px)] h-[min(80vw,420px)] rounded-full pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(224, 32, 32, 0.5) 0%, transparent 65%)",
        }}
        aria-hidden
      />
      <div
        className="blob-float-2 fixed w-[min(80vw,420px)] h-[min(80vw,420px)] rounded-full pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(224, 32, 32, 0.5) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <PageTransition>
      <div className="relative z-10 flex flex-col items-center w-full max-w-[420px]">
        <Link
          href="/"
          className="text-5xl sm:text-6xl md:text-7xl tracking-tight text-ivida-red font-medium text-center mb-3 block hover:opacity-90 transition-opacity"
        >
          IVIDA
        </Link>
        <p className="text-lg sm:text-xl md:text-2xl text-center text-white leading-relaxed max-w-[480px] mx-auto mb-10">
          Igreja Vivendo Intensamente o Discipulado em Amor
        </p>

        <div
          className="w-full rounded-2xl p-10 sm:p-12 animate-card-in opacity-0 bg-white/[0.03] backdrop-blur-md"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
        >
          <h2 className="text-xl font-medium text-white text-center mb-8">
            Esqueci a senha
          </h2>

          {enviado ? (
            <>
              <p className="mb-6 text-sm text-white/90 text-center bg-white/5 rounded-xl py-4 px-3">
                {mensagem}
              </p>
              <p className="text-center text-white/70 text-sm">
                Verifique sua caixa de entrada e o spam. O link expira em algumas horas.
              </p>
            </>
          ) : (
            <>
              {erro && (
                <p className="mb-4 text-sm text-red-400 text-center bg-red-500/10 rounded-xl py-2 px-3">
                  {erro}
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">
                    E-mail
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl text-center text-white font-medium text-[15px] bg-ivida-red hover:bg-ivida-redhover focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red focus-visible:ring-offset-2 focus-visible:ring-offset-[#151515] active:scale-[0.99] transition-all duration-200 shadow-[0_2px_12px_rgba(224,32,32,0.25)] hover:shadow-[0_4px_16px_rgba(224,32,32,0.35)] disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {loading ? "Enviando…" : "Enviar link para redefinir senha"}
                  </button>
                </div>
              </form>
            </>
          )}

          <p className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-white hover:text-white/90 transition-colors duration-150 focus:outline-none focus:text-white underline-offset-2 hover:underline focus:underline"
            >
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
      </PageTransition>
    </main>
  );
}
