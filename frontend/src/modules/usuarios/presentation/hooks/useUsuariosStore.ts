import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { container } from '../../../../composition/container';
import { useToast } from '../../../../core/notifications/ToastContext';
import type { RolUsuario } from '../../../../core/auth/roles';
import { useApiAction } from '../../../../shared/presentation/useApiAction';
import type { ActualizarUsuarioDto, UsuarioCuenta, UsuarioCuentaDto } from '../../domain/usuario.model';

const usuarios = container.usuarios;

export function useUsuariosStore(esAdministrador: boolean) {
  const toast = useToast();
  const run = useApiAction();

  const [items, setItems] = useState<UsuarioCuenta[]>([]);
  const [rolesAsignables, setRolesAsignables] = useState<RolUsuario[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState<UsuarioCuenta | null>(null);
  const [version, setVersion] = useState(0);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const ctrl = new AbortController();
    const mostrarCarga = itemsRef.current.length === 0;
    if (mostrarCarga) setCargando(true);

    const promesa = esAdministrador
      ? Promise.all([usuarios.listar(), usuarios.rolesAsignables()])
      : usuarios.rolesAsignables().then((roles) => [[], roles] as [UsuarioCuenta[], RolUsuario[]]);

    promesa
      .then(([lista, roles]) => {
        if (!ctrl.signal.aborted) {
          setItems(lista);
          setRolesAsignables(roles);
        }
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setItems([]);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setCargando(false);
      });

    return () => ctrl.abort();
  }, [version, esAdministrador]);

  const refrescar = useCallback(() => setVersion((v) => v + 1), []);

  const guardar = useCallback(
    async (dto: UsuarioCuentaDto | ActualizarUsuarioDto, esNuevo: boolean) => {
      setGuardando(true);
      const actual = editando;
      const accion = esNuevo
        ? () => usuarios.crear(dto as UsuarioCuentaDto)
        : () => usuarios.actualizar(actual!.id, dto as ActualizarUsuarioDto);
      const u = await run(accion);
      setGuardando(false);
      if (u) {
        toast.exito(esNuevo ? `Cuenta «${u.usuario}» creada.` : `Cuenta «${u.usuario}» actualizada.`);
        setEditando(null);
        refrescar();
      }
      return u;
    },
    [editando, run, toast, refrescar],
  );

  const eliminar = useCallback(
    async (cuenta: UsuarioCuenta) => {
      const ok = await run(() => usuarios.eliminar(cuenta.id));
      if (ok) {
        toast.exito('Cuenta eliminada.');
        if (editando?.id === cuenta.id) setEditando(null);
        refrescar();
      }
    },
    [run, toast, editando, refrescar],
  );

  return useMemo(
    () => ({
      items,
      rolesAsignables,
      cargando,
      guardando,
      editando,
      editar: setEditando,
      guardar,
      eliminar,
    }),
    [items, rolesAsignables, cargando, guardando, editando, guardar, eliminar],
  );
}
