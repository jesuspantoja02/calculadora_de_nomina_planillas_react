import { Router } from 'express';
import type { UsuarioGestionService } from '../application/usuario.service.ts';
import { requiereAdmin } from '../../../shared/http/requiere-admin.ts';
import { requiereGestor } from '../../../shared/http/requiere-gestor.ts';
import { crearUsuarioController } from './usuario.controller.ts';

export function crearUsuarioRouter(servicio: UsuarioGestionService): Router {
  const c = crearUsuarioController(servicio);
  const router = Router();
  router.use(requiereGestor());
  const soloAdmin = requiereAdmin();
  router.get('/roles-asignables', c.rolesAsignables);
  router.post('/', c.crear);
  router.get('/', soloAdmin, c.listar);
  router.put('/:id', soloAdmin, c.actualizar);
  router.delete('/:id', soloAdmin, c.eliminar);
  return router;
}
