// src/utils/password.ts (o data de tu elección)
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10; // puedes ajustar (por ejemplo 12) pero 10 es un valor común

/**
 * Genera un hash a partir de una contraseña en texto plano.
 * Se usa para registrar nuevos usuarios o cambiar contraseñas.
 * @param plainPassword - contraseña en texto plano
 * @returns Promise<string> -> el hash resultante (ej: "$2b$10$...")
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hash = await bcrypt.hash(plainPassword, salt);
  return hash;
};

/**
 * Compara una contraseña en texto plano con un hash.
 * @param plainPassword - contraseña en texto plano (ej: "Miclave123")
 * @param hash - valor hash a comparar (ej: "$2b$10$3nVH...")
 * @returns Promise<boolean> -> true si concuerda, false si no
 */
export const comparePassword = async (
  plainPassword: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hash);
};