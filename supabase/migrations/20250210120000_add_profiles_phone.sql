-- Campo opcional de telefone para perfis (editável pelo admin e pelo próprio usuário).
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text;
