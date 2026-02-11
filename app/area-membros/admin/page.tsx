"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Blobs } from "@/components/Blobs";
import { SiteHeader } from "@/components/SiteHeader";
import { PageTransition } from "@/components/PageTransition";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES } from "@/lib/constants";

type Member = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  status: string;
  photo_url: string | null;
  phone: string | null;
  created_at: string;
};

export default function AdminPage() {
  const router = useRouter();
  const auth = useAuth();
  const user = auth?.user ?? null;
  const loading = auth?.isLoading ?? true;
  const LIMIT = 20;
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [members, setMembers] = useState<Member[]>([]);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [editing, setEditing] = useState<Member | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const fetchAbortRef = useRef<AbortController | null>(null);

  const fetchMembers = useCallback(async () => {
    fetchAbortRef.current?.abort();
    const controller = new AbortController();
    fetchAbortRef.current = controller;
    const { signal } = controller;

    setFetchLoading(true);
    try {
      const params = new URLSearchParams();
      if (appliedSearch) params.set("q", appliedSearch);
      params.set("page", String(page));
      params.set("limit", String(LIMIT));
      if (appliedSearch) params.set("count", "true");
      const res = await fetch(`/api/admin/members?${params}`, {
        credentials: "include",
        signal,
      });
      if (signal.aborted) return;
      if (res.status === 403) {
        router.replace("/area-membros");
        return;
      }
      if (!res.ok) {
        setMembers([]);
        setTotal(undefined);
        return;
      }
      const data = await res.json();
      if (signal.aborted) return;
      setMembers(data.members ?? []);
      setTotal(data.total !== undefined ? data.total : undefined);
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMembers([]);
      setTotal(undefined);
    } finally {
      if (!signal.aborted) setFetchLoading(false);
    }
  }, [appliedSearch, page, router]);

  const runSearch = useCallback(() => {
    setAppliedSearch(searchInput.trim());
    setPage(1);
  }, [searchInput]);

  const clearSearch = useCallback(() => {
    setSearchInput("");
    setAppliedSearch("");
    setPage(1);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (!loading && user && !user.roles?.includes("Admin")) {
      router.replace("/area-membros");
      return;
    }
    if (user?.roles?.includes("Admin")) {
      fetchMembers();
    }
  }, [loading, user, router, fetchMembers]);

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    setSaveError(null);
    setSaveLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim() ?? "";
    const phone = (formData.get("phone") as string)?.trim() || null;
    const status = (formData.get("status") as string) || "ACTIVE";
    const roles: string[] = [];
    ROLES.forEach((role) => {
      if (formData.get(`role-${role}`)) roles.push(role);
    });
    if (!name) {
      setSaveError("Nome é obrigatório.");
      setSaveLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/admin/members/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, phone, roles, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSaveError(data.error ?? "Erro ao salvar.");
        return;
      }
      setEditing(null);
      fetchMembers();
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading || (!user && !loading)) return null;

  if (!user?.roles?.includes("Admin")) return null;

  return (
    <main
      className="min-h-screen w-full flex flex-col relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 90% 80% at 50% 0%, rgba(40, 38, 38, 0.6) 0%, rgb(22, 21, 21) 45%, rgb(18, 17, 17) 100%)",
      }}
    >
      <Blobs />
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,transparent_60%,rgba(0,0,0,0.15)_100%)]"
        aria-hidden
      />
      <SiteHeader />

      <PageTransition>
        <div className="relative z-10 flex-1 px-5 sm:px-6 py-12 sm:py-16 pb-20 max-w-[1100px] mx-auto w-full">
          <Link
            href="/area-membros"
            className="inline-flex items-center text-sm text-white/60 hover:text-white/90 mb-8 transition-colors"
          >
            ← Voltar à Área de Membros
          </Link>
          <h1 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
            Gerenciar membros
          </h1>
          <p className="mt-2 text-white/70 text-sm">
            Pesquise e edite dados dos membros. Apenas administradores têm acesso.
          </p>

          <form
            className="mt-8 flex flex-wrap items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              runSearch();
            }}
          >
            <label htmlFor="admin-search" className="sr-only">
              Buscar por nome ou e-mail
            </label>
            <input
              id="admin-search"
              type="search"
              placeholder="Buscar por nome ou e-mail..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full max-w-md px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red transition-colors"
            />
            <button
              type="submit"
              disabled={fetchLoading}
              className="inline-flex items-center justify-center py-3 px-5 rounded-xl text-sm font-medium bg-ivida-red hover:bg-ivida-redhover text-white transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50"
            >
              Buscar
            </button>
            {(appliedSearch || searchInput.trim()) ? (
              <button
                type="button"
                onClick={clearSearch}
                className="text-sm text-white/60 hover:text-white transition-colors"
              >
                Limpar
              </button>
            ) : null}
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
            {fetchLoading ? (
              <div className="p-8 text-center text-white/60 text-sm">
                Carregando...
              </div>
            ) : members.length === 0 ? (
              <div className="p-8 text-center text-white/60 text-sm">
                {appliedSearch
                  ? "Nenhum resultado para essa busca."
                  : "Nenhum membro encontrado."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-sm font-medium text-white/80">
                        Nome
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-white/80">
                        E-mail
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-white/80">
                        Telefone
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-white/80">
                        Roles
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-white/80">
                        Status
                      </th>
                      <th className="px-4 py-3 text-sm font-medium text-white/80 min-w-[200px]">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((m) => (
                      <tr
                        key={m.id}
                        className="border-b border-white/5 hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 text-white">{m.name}</td>
                        <td className="px-4 py-3 text-white/80 text-sm">
                          {m.email}
                        </td>
                        <td className="px-4 py-3 text-white/70 text-sm">
                          {m.phone ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-white/70 text-sm">
                          {m.roles?.length ? m.roles.join(", ") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              m.status === "ACTIVE"
                                ? "text-green-400/90 text-sm"
                                : "text-white/50 text-sm"
                            }
                          >
                            {m.status === "ACTIVE" ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap items-center gap-3">
                            <Link
                              href={`/area-membros/admin/membro/${m.id}`}
                              className="text-sm font-medium text-white/80 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50 rounded"
                            >
                              Visualizar perfil
                            </Link>
                            <button
                              type="button"
                              onClick={() => setEditing(m)}
                              className="text-sm font-medium text-ivida-red hover:text-ivida-redhover focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50 rounded"
                            >
                              Editar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {(members.length > 0 || total !== undefined) && (
              <div className="px-4 py-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-sm text-white/50">
                {total !== undefined && (
                  <span>
                    {total} {total === 1 ? "membro" : "membros"}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || fetchLoading}
                    className="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-white/50">Página {page}</span>
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={
                      fetchLoading ||
                      (total !== undefined && page * LIMIT >= total) ||
                      (total === undefined && members.length < LIMIT)
                    }
                    className="px-3 py-1.5 rounded-lg border border-white/20 text-white/80 hover:bg-white/5 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>

      {/* Modal de edição */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
          aria-labelledby="edit-member-title"
        >
          <div className="rounded-2xl border border-white/10 bg-[#1a1919] shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <h2 id="edit-member-title" className="text-lg font-medium text-white">
                Editar membro
              </h2>
              <p className="text-sm text-white/60 mt-1">{editing.email}</p>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  Nome
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  defaultValue={editing.name}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-phone"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  Telefone
                </label>
                <input
                  id="edit-phone"
                  name="phone"
                  type="tel"
                  defaultValue={editing.phone ?? ""}
                  placeholder="(00) 00000-0000"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red"
                />
              </div>
              <div>
                <span className="block text-sm font-medium text-white/80 mb-2">
                  Roles
                </span>
                <div className="flex flex-wrap gap-3">
                  {ROLES.map((role) => (
                    <label
                      key={role}
                      className="inline-flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name={`role-${role}`}
                        defaultChecked={editing.roles?.includes(role)}
                        className="rounded border-white/20 bg-white/5 text-ivida-red focus:ring-ivida-red"
                      />
                      <span className="text-sm text-white/90">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label
                  htmlFor="edit-status"
                  className="block text-sm font-medium text-white/80 mb-2"
                >
                  Status
                </label>
                <select
                  id="edit-status"
                  name="status"
                  defaultValue={editing.status}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-ivida-red focus:ring-1 focus:ring-ivida-red"
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                </select>
              </div>
              {saveError && (
                <p className="text-sm text-red-400">{saveError}</p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-sm font-medium bg-ivida-red hover:bg-ivida-redhover text-white transition-colors disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-ivida-red/50"
                >
                  {saveLoading ? "Salvando..." : "Salvar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setSaveError(null);
                  }}
                  disabled={saveLoading}
                  className="inline-flex items-center justify-center py-2.5 px-5 rounded-xl text-sm font-medium border border-white/20 text-white/90 hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
