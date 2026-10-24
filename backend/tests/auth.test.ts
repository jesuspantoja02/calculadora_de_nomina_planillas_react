import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirServicios } from '../src/container.ts';
import { asegurarUsuarioAdmin, USUARIO_ADMIN_INICIAL } from '../src/modules/auth/infrastructure/seed-usuarios.ts';
import { abrirBaseDatos } from '../src/shared/infrastructure/sqlite/database.ts';
import { AppError } from '../src/shared/errors/app-error.ts';

const opcionesAuth = { authSecret: 'test-secret-min-16-chars', tokenTtlMs: 3_600_000 };

test('login admin y rechazo de credenciales inválidas', () => {
  const db = abrirBaseDatos(':memory:');
  asegurarUsuarioAdmin(db);
  const { auth } = construirServicios(db, opcionesAuth);

  const sesion = auth.iniciarSesion({ usuario: USUARIO_ADMIN_INICIAL, password: 'P@ntoja10' });
  assert.equal(sesion.usuario, USUARIO_ADMIN_INICIAL);
  assert.equal(sesion.rol, 'admin');
  assert.ok(sesion.id.length > 10);
  assert.ok(sesion.token.length > 20);

  const payload = auth.validarToken(sesion.token);
  assert.equal(payload.usuario, USUARIO_ADMIN_INICIAL);

  assert.throws(
    () => auth.iniciarSesion({ usuario: USUARIO_ADMIN_INICIAL, password: 'incorrecta' }),
    (e) => e instanceof AppError && e.status === 401,
  );

  db.close();
});
