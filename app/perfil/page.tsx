"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Blobs } from "@/components/Blobs";
import { SiteHeader } from "@/components/SiteHeader";
import { PageTransition } from "@/components/PageTransition";
import { AvatarUpload } from "@/components/area-membros/AvatarUpload";
import { useAuth } from "@/contexts/AuthContext";

function getInitials(name: string | null, email: string): string {
  const trimmed = name?.trim();
  if (trimmed) {
    const parts = trimmed.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    if (parts[0]) return parts[0].slice(0, 2).toUpperCase();
  }
  const beforeAt = email.split("@")[0]?.trim() || "";
  return beforeAt.slice(0, 2).toUpperCase() || "?";
}

export default function PerfilPage() {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user ?? null;
  const loading = auth?.isLoading ?? true;
  const updateUser = auth?.updateUser ?? (() => {});
  const refetch = auth?.refetch ?? (() => Promise.resolve());
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <main
        className="min-h-screen w-full flex flex-col relative overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(40, 38, 38, 0.6) 0%, rgb(22, 21, 21) 45%, rgb(18, 17, 17) 100%)",
        }}
      >
        <Blobs />
        <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]" aria-hidden />
        <SiteHeader />
        <div className="relative z-10 flex-1 flex items-center justify-center py-20">
          <div className="h-8 w-48 rounded-lg bg-white/10 animate-pulse" aria-hidden />
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(40, 38, 38, 0.6) 0%, rgb(22, 21, 21) 45%, rgb(18, 17, 17) 100%)",
      }}
    >
      <Blobs />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]" aria-hidden />
      <SiteHeader />

      <PageTransition>
        <div className="relative z-10 flex-1 px-5 sm:px-6 py-12 sm:py-16 pb-20">
          <div className="max-w-[520px] mx-auto">
            <Link
              href="/area-membros"
              className="inline-flex items-center text-sm text-white/60 hover:text-white/90 mb-8 transition-colors"
            >
              ← Voltar à Área de Membros
            </Link>
            <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
              Editar perfil
            </h1>
            <p className="mt-2 text-white/70 text-sm">
              Atualize seus dados. (Alteração de senha em breve.)
            </p>
            <div className="mt-8 flex flex-col sm:flex-row sm:items-start gap-6">
              <AvatarUpload
                photoUrl={user.photo_url ?? null}
                initials={getInitials(user.name, user.email)}
                onPhotoUpdate={(url) => {
                  updateUser({ photo_url: url });
                }}
                size={96}
              />
              <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-6">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setMessage(null);
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const name = (formData.get("name") as string)?.trim() ?? "";
                    const phone = (formData.get("phone") as string)?.trim() || null;
                    if (!name) {
                      setMessage({ type: "error", text: "Nome é obrigatório." });
                      return;
                    }
                    setSubmitLoading(true);
                    try {
                      const res = await fetch("/api/profile", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({ name, phone }),
                      });
                      const data = await res.json().catch(() => ({}));
                      if (!res.ok) {
                        setMessage({ type: "error", text: data.error ?? "Erro ao salvar." });
                        return;
                      }
                      updateUser({ name, phone: phone ?? undefined });
                      refetch();
                      setMessage({ type: "success", text: "Perfil atualizado." });
                    } finally {
                      setSubmitLoading(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label htmlFor="perfil-name" className="block text-sm font-medium text-white/80 mb-2">
                      Nome
                    </label>
                    <input
                      id="perfil-name"
                      name="name"
                      type="text"
                      defaultValue={user.name ?? ""}
                      placeholder="Seu nome"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="perfil-email" className="block text-sm font-medium text-white/80 mb-2">
                      E-mail
                    </label>
                    <input
                      id="perfil-email"
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 cursor-not-allowed"
                    />
                    <p className="text-xs text-white/50 mt-1">E-mail não pode ser alterado aqui.</p>
                  </div>
                  <div>
                    <label htmlFor="perfil-phone" className="block text-sm font-medium text-white/80 mb-2">
                      Telefone
                    </label>
                    <input
                      id="perfil-phone"
                      name="phone"
                      type="tel"
                      defaultValue={user.phone ?? ""}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red transition-colors"
                    />
                  </div>
                  {message && (
                    <p className={message.type === "success" ? "text-sm text-green-400" : "text-sm text-red-400"}>
                      {message.text}
                    </p>
                  )}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-sm font-medium bg-ivida-red hover:bg-ivida-redhover text-white transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
                    >
                      {submitLoading ? "Salvando..." : "Salvar"}
                    </button>
                    <Link
                      href="/area-membros"
                      className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-sm font-medium border border-white/20 text-white/90 hover:bg-white/5 transition-colors"
                    >
                      Cancelar
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </main>
  );
}
