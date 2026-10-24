import type { Request, Response } from 'express';
import type { UsuarioGestionService } from '../application/usuario.service.ts';
import { actualizarUsuarioSchema, crearUsuarioSchema, idUsuarioSchema } from '../application/usuario.dto.ts';

export function crearUsuarioController(servicio: UsuarioGestionService) {
  return {
    listar: async (req: Request, res: Response) => {
      res.json({ data: servicio.listar() });
    },
    rolesAsignables: async (req: Request, res: Response) => {
      res.json({ data: servicio.rolesAsignables(req.auth!) });
    },
    crear: async (req: Request, res: Response) => {
      const data = servicio.crear(req.auth!, crearUsuarioSchema.parse(req.body));
      res.status(201).json({ data });
    },
    actualizar: async (req: Request, res: Response) => {
      const id = idUsuarioSchema.parse(req.params['id']);
      const data = servicio.actualizar(req.auth!, id, actualizarUsuarioSchema.parse(req.body));
      res.json({ data });
    },
    eliminar: async (req: Request, res: Response) => {
      servicio.eliminar(req.auth!, idUsuarioSchema.parse(req.params['id']));
      res.status(204).end();
    },
  };
}
