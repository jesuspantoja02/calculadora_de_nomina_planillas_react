import { createHmac, timingSafeEqual } from 'node:crypto';
import { AppError } from '../errors/app-error.ts';
import type { RolUsuario } from '../../modules/auth/domain/roles.ts';
import { ROLES_USUARIO } from '../../modules/auth/domain/roles.ts';

export interface TokenPayload {
  sub: string;
  usuario: string;
  rol: RolUsuario;
  exp: number;
}

function rolValidoEnToken(rol: unknown): rol is RolUsuario {
  return typeof rol === 'string' && (ROLES_USUARIO as readonly string[]).includes(rol);
}

function firmarCuerpo(cuerpo: string, secreto: string): string {
  return createHmac('sha256', secreto).update(cuerpo).digest('base64url');
}

export function crearToken(payload: Omit<TokenPayload, 'exp'>, secreto: string, ttlMs: number): string {
  const cuerpo = Buffer.from(JSON.stringify({ ...payload, exp: Date.now() + ttlMs })).toString('base64url');
  return `${cuerpo}.${firmarCuerpo(cuerpo, secreto)}`;
}

export function verificarToken(token: string, secreto: string): TokenPayload {
  const [cuerpo, firma] = token.split('.');
  if (!cuerpo || !firma) {
    throw new AppError(401, 'TOKEN_INVALIDO', 'Sesión inválida. Vuelve a iniciar sesión.');
  }

  const esperada = firmarCuerpo(cuerpo, secreto);
  const a = Buffer.from(firma);
  const b = Buffer.from(esperada);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new AppError(401, 'TOKEN_INVALIDO', 'Sesión inválida. Vuelve a iniciar sesión.');
  }

  const raw = JSON.parse(Buffer.from(cuerpo, 'base64url').toString('utf8')) as TokenPayload;
  if (typeof raw.exp !== 'number' || raw.exp < Date.now()) {
    throw new AppError(401, 'TOKEN_EXPIRADO', 'Tu sesión expiró. Vuelve a iniciar sesión.');
  }
  if (typeof raw.sub !== 'string' || typeof raw.usuario !== 'string' || !rolValidoEnToken(raw.rol)) {
    throw new AppError(401, 'TOKEN_INVALIDO', 'Sesión inválida. Vuelve a iniciar sesión.');
  }

  return raw;
}
