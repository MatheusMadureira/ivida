/** Roles disponíveis no sistema (valor armazenado no banco = rótulo de exibição). */
export const ROLES = [
  "Admin",
  "Membro",
  "Pastor",
  "Seminarista",
  "Intercesor",
] as const;

export type Role = (typeof ROLES)[number];

/** Role padrão para novos usuários no registro. */
export const DEFAULT_ROLE: Role = "Membro";

/** Verifica se um valor é uma role válida. */
export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}
