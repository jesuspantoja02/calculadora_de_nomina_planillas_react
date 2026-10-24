import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.ts';
import { esGestor } from '../../modules/auth/domain/roles.ts';

/** Exige sesión válida (req.auth) y rol admin, jefe o gerente. */
export function requiereGestor(): RequestHandler {
  return (req, _res, next) => {
    const auth = req.auth;
    if (!auth) {
      next(new AppError(401, 'NO_AUTENTICADO', 'Debes iniciar sesión para continuar.'));
      return;
    }
    if (!esGestor(auth.rol)) {
      next(new AppError(403, 'SIN_PERMISO', 'No tienes permiso para gestionar usuarios del sistema.'));
      return;
    }
    next();
  };
}
