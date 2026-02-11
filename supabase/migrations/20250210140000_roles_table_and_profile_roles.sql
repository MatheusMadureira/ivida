-- Tabela de roles (lista fixa; dropdown no Table Editor via FK em profile_roles).
create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);

insert into public.roles (name) values
  ('Admin'),
  ('Membro'),
  ('Pastor'),
  ('Seminarista'),
  ('Intercesor')
on conflict (name) do nothing;

-- Normaliza valores antigos (ADMIN/LEADER) para bater com roles.name.
update public.profiles
set roles = array_replace(array_replace(roles, 'ADMIN', 'Admin'), 'LEADER', 'Pastor')
where roles && array['ADMIN', 'LEADER']::text[] or array_length(roles, 1) > 0;

-- Tabela de junção perfil <-> role (N:N).
create table if not exists public.profile_roles (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  primary key (profile_id, role_id)
);

create index if not exists idx_profile_roles_role_id on public.profile_roles (role_id);

-- Migra dados: cada valor em profiles.roles vira uma linha em profile_roles.
insert into public.profile_roles (profile_id, role_id)
select p.id, r.id
from public.profiles p
cross join lateral unnest(p.roles) as role_name
join public.roles r on r.name = role_name
on conflict (profile_id, role_id) do nothing;

-- Remove coluna antiga.
alter table public.profiles drop column if exists roles;

-- View para manter compatibilidade: perfil + roles como array (leitura).
create or replace view public.profiles_with_roles as
select
  p.id,
  p.name,
  p.email,
  p.cpf_hash,
  p.password_hash,
  p.status,
  p.photo_url,
  p.phone,
  p.email_verified,
  p.last_password_change,
  p.password_reset_code,
  p.created_at,
  p.updated_at,
  p.last_login_at,
  coalesce(array_agg(r.name) filter (where r.id is not null), '{}') as roles
from public.profiles p
left join public.profile_roles pr on p.id = pr.profile_id
left join public.roles r on pr.role_id = r.id
group by p.id;
