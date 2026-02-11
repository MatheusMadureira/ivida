"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { PageTransition } from "@/components/PageTransition";
import { createClient } from "@/lib/supabase/client";

const SENHA_REGRAS = {
  minLength: 8,
  temNumero: /\d/,
  temMaiuscula: /[A-Z]/,
  temMinuscula: /[a-z]/,
  temEspecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
};

function validarSenha(senha: string): { ok: boolean; erros: string[] } {
  const erros: string[] = [];
  if (senha.length < SENHA_REGRAS.minLength)
    erros.push(`Mínimo ${SENHA_REGRAS.minLength} caracteres`);
  if (!SENHA_REGRAS.temNumero.test(senha)) erros.push("Um número");
  if (!SENHA_REGRAS.temMaiuscula.test(senha)) erros.push("Uma letra maiúscula");
  if (!SENHA_REGRAS.temMinuscula.test(senha)) erros.push("Uma letra minúscula");
  if (!SENHA_REGRAS.temEspecial.test(senha))
    erros.push("Um caractere especial (!@#$%...)");
  return { ok: erros.length === 0, erros };
}

function parseHashParams(hash: string): Record<string, string> {
  const params: Record<string, string> = {};
  if (!hash || !hash.startsWith("#")) return params;
  const query = hash.slice(1);
  for (const part of query.split("&")) {
    const [key, value] = part.split("=");
    if (key && value) params[key] = decodeURIComponent(value);
  }
  return params;
}

export default function ResetarSenhaPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaNovaSenha, setConfirmaNovaSenha] = useState("");
  const [erroSenha, setErroSenha] = useState<string[]>([]);
  const [erroConfirma, setErroConfirma] = useState("");
  const [tocouSenha, setTocouSenha] = useState(false);
  const [tocouConfirma, setTocouConfirma] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const params = parseHashParams(hash);
    const { access_token, refresh_token, type } = params;

    if (type !== "recovery" || !access_token || !refresh_token) {
      setReady(true);
      setValidSession(false);
      return;
    }

    const supabase = createClient();
    supabase.auth
      .setSession({ access_token, refresh_token })
      .then(() => {
        setValidSession(true);
        if (typeof window !== "undefined") {
          window.history.replaceState(null, "", window.location.pathname);
        }
      })
      .catch(() => setValidSession(false))
      .finally(() => setReady(true));
  }, []);

  function handleNovaSenhaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNovaSenha(e.target.value);
    setErroSenha(validarSenha(e.target.value).erros);
  }

  function handleConfirmaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmaNovaSenha(e.target.value);
    setErroConfirma(
      e.target.value && e.target.value !== novaSenha
        ? "As senhas não coincidem"
        : ""
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTocouSenha(true);
    setTocouConfirma(true);
    setErro("");

    const { ok, erros } = validarSenha(novaSenha);
    setErroSenha(erros);
    const confirmaErro =
      !confirmaNovaSenha || confirmaNovaSenha !== novaSenha
        ? "As senhas não coincidem"
        : "";
    setErroConfirma(confirmaErro);

    if (!ok || confirmaErro) return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: novaSenha,
      });

      if (updateError) {
        setErro(updateError.message || "Erro ao alterar senha.");
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const access_token = session?.session?.access_token;
      const refresh_token = session?.session?.refresh_token;

      if (access_token && refresh_token) {
        const res = await fetch("/api/auth/sync-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            newPassword: novaSenha,
            access_token,
            refresh_token,
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setErro(data.error || "Erro ao sincronizar senha. Faça login e tente novamente.");
          return;
        }
      }

      router.push("/login");
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red transition-colors";
  const inputErroClass =
    "border-red-500/60 focus:border-red-500 focus:ring-red-500/50";

  if (!ready) {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center p-4"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(45, 44, 44, 0.8) 0%, rgb(27, 26, 26) 50%, rgb(38, 36, 36) 100%)",
        }}
      >
        <p className="text-white/80">Carregando…</p>
      </main>
    );
  }

  if (!validSession) {
    return (
      <main
        className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(45, 44, 44, 0.8) 0%, rgb(27, 26, 26) 50%, rgb(38, 36, 36) 100%)",
        }}
      >
        <div className="relative z-10 flex flex-col items-center w-full max-w-[420px] text-center">
          <Link
            href="/"
            className="text-5xl sm:text-6xl tracking-tight text-ivida-red font-medium mb-6 block hover:opacity-90 transition-opacity"
          >
            IVIDA
          </Link>
          <div
            className="w-full rounded-2xl p-10 sm:p-12 bg-white/[0.03] backdrop-blur-md"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}
          >
            <h2 className="text-xl font-medium text-white mb-4">
              Link inválido ou expirado
            </h2>
            <p className="text-white/80 text-sm mb-6">
              Solicite um novo link em &quot;Esqueci a senha&quot; na página de login.
            </p>
            <Link
              href="/forgot-password"
              className="inline-block w-full py-3.5 px-4 rounded-xl text-center text-white font-medium bg-ivida-red hover:bg-ivida-redhover focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red"
            >
              Esqueci a senha
            </Link>
          </div>
          <p className="mt-6">
            <Link
              href="/login"
              className="text-sm text-white hover:underline"
            >
              Voltar ao login
            </Link>
          </p>
        </div>
      </main>
    );
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
            <h2 className="text-xl font-medium text-white text-center mb-4">
              Nova senha
            </h2>
            <p className="text-white/80 text-sm text-center mb-6">
              Defina uma nova senha para sua conta.
            </p>
            {erro && (
              <p className="mb-4 text-sm text-red-400 text-center bg-red-500/10 rounded-xl py-2 px-3">
                {erro}
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="novaSenha" className="sr-only">
                  Nova senha
                </label>
                <input
                  id="novaSenha"
                  type="password"
                  placeholder="Nova senha"
                  value={novaSenha}
                  onChange={handleNovaSenhaChange}
                  onBlur={() => setTocouSenha(true)}
                  required
                  className={`${inputClass} ${
                    tocouSenha && !validarSenha(novaSenha).ok
                      ? inputErroClass
                      : ""
                  }`}
                  autoComplete="new-password"
                />
                {tocouSenha && erroSenha.length > 0 && (
                  <p className="mt-1.5 text-xs text-red-400">
                    A senha deve ter: {erroSenha.join(", ")}.
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="confirmaNovaSenha" className="sr-only">
                  Confirmar nova senha
                </label>
                <input
                  id="confirmaNovaSenha"
                  type="password"
                  placeholder="Confirmar nova senha"
                  value={confirmaNovaSenha}
                  onChange={handleConfirmaChange}
                  onBlur={() => setTocouConfirma(true)}
                  required
                  className={`${inputClass} ${
                    tocouConfirma && erroConfirma ? inputErroClass : ""
                  }`}
                  autoComplete="new-password"
                />
                {tocouConfirma && erroConfirma && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {erroConfirma}
                  </p>
                )}
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl text-center text-white font-medium text-[15px] bg-ivida-red hover:bg-ivida-redhover focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red focus-visible:ring-offset-2 focus-visible:ring-offset-[#151515] active:scale-[0.99] transition-all duration-200 shadow-[0_2px_12px_rgba(224,32,32,0.25)] hover:shadow-[0_4px_16px_rgba(224,32,32,0.35)] disabled:opacity-60 disabled:pointer-events-none"
                >
                  {loading ? "Alterando…" : "Alterar senha"}
                </button>
              </div>
            </form>

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
