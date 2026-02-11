-- Índice em profiles(name) para ordenação e buscas na listagem de membros (admin).
create index if not exists idx_profiles_name on public.profiles (name);
