"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageTransition } from "@/components/PageTransition";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: senha }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "E-mail ou senha incorretos.");
        return;
      }
      router.push("/home");
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
      {/* Blobs */}
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
            Entrar
          </h2>

          {erro && (
            <p className="mb-4 text-sm text-red-400 text-center bg-red-500/10 rounded-xl py-2 px-3">
              {erro}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red transition-colors"
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="senha" className="sr-only">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red transition-colors"
                autoComplete="current-password"
              />
            </div>
            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl text-center text-white font-medium text-[15px] bg-ivida-red hover:bg-ivida-redhover focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red focus-visible:ring-offset-2 focus-visible:ring-offset-[#151515] active:scale-[0.99] transition-all duration-200 shadow-[0_2px_12px_rgba(224,32,32,0.25)] hover:shadow-[0_4px_16px_rgba(224,32,32,0.35)] disabled:opacity-60 disabled:pointer-events-none"
              >
                {loading ? "Entrando…" : "Entrar"}
              </button>
            </div>
          </form>

          <p className="mt-5 text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-white/80 hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Esqueci a senha
            </Link>
          </p>

          <p className="mt-6 text-center">
            <Link
              href="/register"
              className="text-sm text-white hover:text-white/90 transition-colors duration-150 focus:outline-none focus:text-white underline-offset-2 hover:underline focus:underline"
            >
              Criar conta
            </Link>
          </p>
        </div>
      </div>
      </PageTransition>
    </main>
  );
}
