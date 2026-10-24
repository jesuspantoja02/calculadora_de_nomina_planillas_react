import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.ts';

/** Exige sesión válida (req.auth) y rol administrador. */
export function requiereAdmin(): RequestHandler {
  return (req, _res, next) => {
    const auth = req.auth;
    if (!auth) {
      next(new AppError(401, 'NO_AUTENTICADO', 'Debes iniciar sesión para continuar.'));
      return;
    }
    if (auth.rol !== 'admin') {
      next(new AppError(403, 'SIN_PERMISO', 'Solo un administrador puede realizar esta acción.'));
      return;
    }
    next();
  };
}
