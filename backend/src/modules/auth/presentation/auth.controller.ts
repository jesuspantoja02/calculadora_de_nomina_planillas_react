import type { Request, Response } from 'express';
import type { AuthService } from '../application/auth.service.ts';
import { loginSchema } from '../application/auth.dto.ts';

export function crearAuthController(servicio: AuthService) {
  return {
    login: async (req: Request, res: Response) => {
      const sesion = servicio.iniciarSesion(loginSchema.parse(req.body));
      res.json({ data: sesion });
    },
    yo: async (req: Request, res: Response) => {
      const sesion = req.auth!;
      res.json({ data: { id: sesion.sub, usuario: sesion.usuario, rol: sesion.rol } });
    },
  };
}
