import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

const PASSWORD_RULES = {
  minLength: 8,
  hasNumber: /\d/,
  hasUpper: /[A-Z]/,
  hasLower: /[a-z]/,
  hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
} as const;

export type PasswordValidation = { ok: boolean; errors: string[] };

/** Valida senha (mesmas regras do front: 8+ chars, número, maiúscula, minúscula, especial). */
export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`Mínimo ${PASSWORD_RULES.minLength} caracteres`);
  }
  if (!PASSWORD_RULES.hasNumber.test(password)) errors.push("Um número");
  if (!PASSWORD_RULES.hasUpper.test(password)) errors.push("Uma letra maiúscula");
  if (!PASSWORD_RULES.hasLower.test(password)) errors.push("Uma letra minúscula");
  if (!PASSWORD_RULES.hasSpecial.test(password)) {
    errors.push("Um caractere especial (!@#$%...)");
  }
  return { ok: errors.length === 0, errors };
}

function getCpfHashSecret(): string {
  const raw = process.env.CPF_HASH_SECRET?.trim();
  if (process.env.NODE_ENV === "production") {
    if (!raw) {
      throw new Error("CPF_HASH_SECRET deve estar definido em produção.");
    }
    return raw;
  }
  return raw || "cpf-hash-dev-only";
}

/** Normaliza CPF (só dígitos, 11 chars) e retorna hash HMAC-SHA256. Não é reversível; serve para buscar no banco. */
export function getCpfHash(plainCpf: string): string {
  const normalized = String(plainCpf).replace(/\D/g, "").slice(0, 11);
  return crypto
    .createHmac("sha256", getCpfHashSecret())
    .update(normalized)
    .digest("hex");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
