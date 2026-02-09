import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase para uso no servidor (API routes, Server Components).
 * Respeita RLS; use quando o contexto do usuário autenticado definir permissões.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY devem estar definidos em .env.local"
    );
  }

  return createSupabaseClient(url, key);
}

/**
 * Cliente com Service Role — ignora RLS. Use apenas no backend (ex.: rotas de auth
 * que leem/escrevem a tabela profiles). Não exponha no frontend.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar definidos em .env.local"
    );
  }

  return createSupabaseClient(url, key, {
    auth: { persistSession: false },
  });
}
