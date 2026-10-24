import type { Request, Response } from 'express';
import type { AuthService } from '../application/auth.service.ts';
import { cambiarPasswordSchema, loginSchema } from '../application/auth.dto.ts';

export function crearAuthController(servicio: AuthService) {
  return {
    login: async (req: Request, res: Response) => {
      const sesion = servicio.iniciarSesion(loginSchema.parse(req.body));
      res.json({ data: sesion });
    },
    yo: async (req: Request, res: Response) => {
      res.json({ data: servicio.perfil(req.auth!) });
    },
    cambiarPassword: async (req: Request, res: Response) => {
      servicio.cambiarPassword(req.auth!, cambiarPasswordSchema.parse(req.body));
      res.status(204).end();
    },
  };
}
