import { Router } from 'express';
import type { UsuarioGestionService } from '../application/usuario.service.ts';
import { requiereGestor } from '../../../shared/http/requiere-gestor.ts';
import { crearUsuarioController } from './usuario.controller.ts';

export function crearUsuarioRouter(servicio: UsuarioGestionService): Router {
  const c = crearUsuarioController(servicio);
  const router = Router();
  router.use(requiereGestor());
  router.get('/roles-asignables', c.rolesAsignables);
  router.get('/', c.listar);
  router.post('/', c.crear);
  router.put('/:id', c.actualizar);
  router.delete('/:id', c.eliminar);
  return router;
}
