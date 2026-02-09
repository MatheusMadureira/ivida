import bcrypt from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

const CPF_HASH_SECRET =
  process.env.CPF_HASH_SECRET || process.env.MONGO_URI || "cpf-hash-fallback";

/** Normaliza CPF (só dígitos, 11 chars) e retorna hash HMAC-SHA256. Não é reversível; serve para buscar no banco. */
export function getCpfHash(plainCpf: string): string {
  const normalized = String(plainCpf).replace(/\D/g, "").slice(0, 11);
  return crypto
    .createHmac("sha256", CPF_HASH_SECRET)
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

export function generateResetCode(): string {
  return crypto.randomBytes(4).toString("hex").toUpperCase();
}

export async function hashResetCode(code: string): Promise<string> {
  return bcrypt.hash(code, SALT_ROUNDS);
}

export async function compareResetCode(
  plainCode: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plainCode, hash);
}
