-- Tabela de perfis/usuários (equivale à collection "users" do Mongo).
-- Quando migrar para Supabase Auth, você pode trocar id para:
--   id uuid primary key references auth.users(id) on delete cascade
-- e remover password_hash (a senha fica em auth.users).

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  cpf_hash text,
  password_hash text not null,
  roles text[] not null default '{}',
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE')),
  photo_url text,
  email_verified boolean not null default false,
  last_password_change timestamptz,
  password_reset_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

-- Índices para buscas comuns
create index if not exists idx_profiles_email on public.profiles (email);
create index if not exists idx_profiles_status on public.profiles (status);

-- Comentário: quando usar Supabase Auth, ative RLS e adicione políticas
-- para usuários autenticados (ex.: ler/atualizar só o próprio perfil).
