-- Extensão para busca por similaridade/substring (ILIKE '%...%').
create extension if not exists pg_trgm;

-- Índices GIN para buscas rápidas por nome e email na listagem de membros.
create index if not exists idx_profiles_name_trgm on public.profiles using gin (name gin_trgm_ops);
create index if not exists idx_profiles_email_trgm on public.profiles using gin (email gin_trgm_ops);
