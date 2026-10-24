import { randomUUID } from 'node:crypto';
import type { Db } from '../../../shared/infrastructure/sqlite/database.ts';
import { hashPassword } from '../../../shared/security/password.ts';
import { SqliteUsuarioRepository } from './sqlite-usuario.repository.ts';

export const USUARIO_ADMIN_INICIAL = 'jesus.pantoja';
const CLAVE_ADMIN_INICIAL = 'P@ntoja10';

/** Crea el administrador por defecto si aún no existe (idempotente). */
export function asegurarUsuarioAdmin(db: Db): void {
  const repo = new SqliteUsuarioRepository(db);
  if (repo.buscarPorUsuario(USUARIO_ADMIN_INICIAL)) return;

  repo.crear({
    id: randomUUID(),
    usuario: USUARIO_ADMIN_INICIAL,
    passwordHash: hashPassword(CLAVE_ADMIN_INICIAL),
    rol: 'admin',
    creadoEn: new Date().toISOString(),
  });
}
