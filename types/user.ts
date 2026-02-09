/** Linha da tabela public.profiles no Supabase (snake_case). */
export interface ProfileRow {
  id: string;
  name: string;
  email: string;
  cpf_hash: string | null;
  password_hash: string;
  roles: string[];
  status: "ACTIVE" | "INACTIVE";
  photo_url: string | null;
  email_verified: boolean;
  last_password_change: string | null;
  password_reset_code: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
}

/** Payload para inserir novo perfil (id e timestamps opcionais). */
export type ProfileInsert = Omit<ProfileRow, "id"> & {
  id?: string;
};
