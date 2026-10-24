import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const SALT_BYTES = 16;
const KEY_BYTES = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_BYTES);
  const hash = scryptSync(password, salt, KEY_BYTES);
  return `scrypt:${salt.toString('base64')}:${hash.toString('base64')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const partes = stored.split(':');
  if (partes.length !== 3 || partes[0] !== 'scrypt') return false;
  const salt = Buffer.from(partes[1]!, 'base64');
  const esperado = Buffer.from(partes[2]!, 'base64');
  const actual = scryptSync(password, salt, esperado.length);
  if (actual.length !== esperado.length) return false;
  return timingSafeEqual(actual, esperado);
}
