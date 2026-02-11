"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageTransition } from "@/components/PageTransition";

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

function formatarCPF(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export default function RegisterPage() {
  const router = useRouter();
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [erroSenha, setErroSenha] = useState<string[]>([]);
  const [erroConfirma, setErroConfirma] = useState("");
  const [tocouSenha, setTocouSenha] = useState(false);
  const [tocouConfirma, setTocouConfirma] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroApi, setErroApi] = useState("");
  const [contaCriada, setContaCriada] = useState(false);

  const resultadoSenha = validarSenha(senha);
  const senhasIguais = senha === confirmaSenha && confirmaSenha.length > 0;

  function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCpf(formatarCPF(e.target.value));
  }

  function handleSenhaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSenha(e.target.value);
    setErroSenha(validarSenha(e.target.value).erros);
  }

  function handleConfirmaChange(e: React.ChangeEvent<HTMLInputElement>) {
    setConfirmaSenha(e.target.value);
    setErroConfirma(
      e.target.value && e.target.value !== senha ? "As senhas não coincidem" : ""
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTocouSenha(true);
    setTocouConfirma(true);
    setErroApi("");

    const { ok, erros } = validarSenha(senha);
    setErroSenha(erros);
    const confirmaErro =
      !confirmaSenha || confirmaSenha !== senha
        ? "As senhas não coincidem"
        : "";
    setErroConfirma(confirmaErro);

    if (!ok || confirmaErro) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nomeCompleto.trim(),
          email: email.trim(),
          cpf: cpf.replace(/\D/g, ""),
          password: senha,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErroApi(data.error || "Erro ao criar conta.");
        return;
      }
      setContaCriada(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch {
      setErroApi("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder:text-white/50 focus:outline-none focus:ring-1 transition-colors ";
  const inputBorderClass = "border-white/10 focus:border-ivida-red focus:ring-ivida-red";
  const inputErroClass = "border-red-500/60 focus:border-red-500 focus:ring-red-500/50";

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
          {contaCriada ? (
            <>
              <h2 className="text-xl font-medium text-white text-center mb-4">
                Conta criada
              </h2>
              <p className="text-white/90 text-center text-sm mb-6">
                Redirecionando para o login…
              </p>
              <p className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-white hover:text-white/90 transition-colors underline-offset-2 hover:underline focus:underline"
                >
                  Ir para o login
                </Link>
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-medium text-white text-center mb-8">
                Criar conta
              </h2>
              {erroApi && (
                <p className="mb-4 text-sm text-red-400 text-center bg-red-500/10 rounded-xl py-2 px-3">
                  {erroApi}
                </p>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="nomeCompleto" className="sr-only">
                    Nome completo
                  </label>
                  <input
                    id="nomeCompleto"
                    type="text"
                    placeholder="Nome completo"
                    value={nomeCompleto}
                    onChange={(e) => setNomeCompleto(e.target.value)}
                    required
                    className={`${inputClass} ${inputBorderClass}`}
                    autoComplete="name"
                  />
                </div>
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
                    className={`${inputClass} ${inputBorderClass}`}
                    autoComplete="email"
                  />
                </div>
                <div>
                  <label htmlFor="cpf" className="sr-only">
                    CPF
                  </label>
                  <input
                    id="cpf"
                    type="text"
                    placeholder="CPF (000.000.000-00)"
                    value={cpf}
                    onChange={handleCpfChange}
                    required
                    className={`${inputClass} ${inputBorderClass}`}
                    autoComplete="off"
                    maxLength={14}
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
                    onChange={handleSenhaChange}
                    onBlur={() => setTocouSenha(true)}
                    required
                    className={`${inputClass} ${
                      tocouSenha && !resultadoSenha.ok ? inputErroClass : inputBorderClass
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
                  <label htmlFor="confirmaSenha" className="sr-only">
                    Confirmar senha
                  </label>
                  <input
                    id="confirmaSenha"
                    type="password"
                    placeholder="Confirmar senha"
                    value={confirmaSenha}
                    onChange={handleConfirmaChange}
                    onBlur={() => setTocouConfirma(true)}
                    required
                    className={`${inputClass} ${
                      tocouConfirma && (erroConfirma || (confirmaSenha && !senhasIguais))
                        ? inputErroClass
                        : inputBorderClass
                    }`}
                    autoComplete="new-password"
                  />
                  {tocouConfirma && erroConfirma && (
                    <p className="mt-1.5 text-xs text-red-400">{erroConfirma}</p>
                  )}
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 rounded-xl text-center text-white font-medium text-[15px] bg-ivida-red hover:bg-ivida-redhover focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red focus-visible:ring-offset-2 focus-visible:ring-offset-[#151515] active:scale-[0.99] transition-all duration-200 shadow-[0_2px_12px_rgba(224,32,32,0.25)] hover:shadow-[0_4px_16px_rgba(224,32,32,0.35)] disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {loading ? "Criando conta…" : "Criar conta"}
                  </button>
                </div>
              </form>
              <p className="mt-6 text-center">
                <Link
                  href="/login"
                  className="text-sm text-white hover:text-white/90 transition-colors duration-150 focus:outline-none focus:text-white underline-offset-2 hover:underline focus:underline"
                >
                  Já tenho conta — Entrar
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
      </PageTransition>
    </main>
  );
}
