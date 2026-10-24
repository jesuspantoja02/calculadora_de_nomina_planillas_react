import { Router } from 'express';
import type { AuthService } from '../application/auth.service.ts';
import { requiereAuth } from '../../../shared/http/requiere-auth.ts';
import { crearAuthController } from './auth.controller.ts';

export function crearAuthRouter(servicio: AuthService) {
  const router = Router();
  const c = crearAuthController(servicio);
  router.post('/login', c.login);
  router.get('/me', requiereAuth(servicio), c.yo);
  router.post('/cambiar-password', requiereAuth(servicio), c.cambiarPassword);
  return router;
}
