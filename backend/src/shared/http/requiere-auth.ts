import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.ts';
import type { AuthService } from '../../modules/auth/application/auth.service.ts';

export function requiereAuth(auth: AuthService): RequestHandler {
  return (req, _res, next) => {
    const encabezado = req.headers.authorization;
    if (!encabezado?.startsWith('Bearer ')) {
      next(new AppError(401, 'NO_AUTENTICADO', 'Debes iniciar sesión para continuar.'));
      return;
    }

    const token = encabezado.slice(7).trim();
    if (!token) {
      next(new AppError(401, 'NO_AUTENTICADO', 'Debes iniciar sesión para continuar.'));
      return;
    }

    req.auth = auth.validarToken(token);
    next();
  };
}
