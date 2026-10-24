import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { container } from '../../../../composition/container';
import { useToast } from '../../../../core/notifications/ToastContext';
import { useApiAction } from '../../../../shared/presentation/useApiAction';
import type { Empleado, EmpleadoDto, FiltroEmpleados } from '../../domain/empleado.model';
import { filtrosEmpleadosIguales } from '../../domain/filtrosEmpleados';

const empleados = container.empleados;

export function useEmpleadosStore() {
  const toast = useToast();
  const run = useApiAction();

  const [filtros, setFiltros] = useState<FiltroEmpleados>({});
  const [items, setItems] = useState<Empleado[]>([]);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [editando, setEditando] = useState<Empleado | null>(null);
  const [version, setVersion] = useState(0);

  const filtrosRef = useRef(filtros);
  filtrosRef.current = filtros;

  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const ctrl = new AbortController();
    const mostrarCarga = itemsRef.current.length === 0;
    if (mostrarCarga) setCargando(true);
    empleados
      .listar(filtrosRef.current)
      .then((lista) => {
        if (!ctrl.signal.aborted) setItems(lista);
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setItems([]);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setCargando(false);
      });
    return () => ctrl.abort();
  }, [filtros, version]);

  const filtrar = useCallback(
    (f: FiltroEmpleados) => setFiltros((prev) => (filtrosEmpleadosIguales(prev, f) ? prev : f)),
    [],
  );
  const refrescar = useCallback(() => setVersion((v) => v + 1), []);

  const guardar = useCallback(
    async (dto: EmpleadoDto) => {
      setGuardando(true);
      const actual = editando;
      const accion = actual ? () => empleados.actualizar(actual.id, dto) : () => empleados.crear(dto);
      const e = await run(accion);
      setGuardando(false);
      if (e) {
        toast.exito(actual ? `Empleado «${e.nombre}» actualizado.` : `Empleado «${e.nombre}» registrado.`);
        setEditando(null);
        refrescar();
      }
      return e;
    },
    [editando, run, toast, refrescar],
  );

  const eliminar = useCallback(
    async (empleado: Empleado) => {
      const ok = await run(() => empleados.eliminar(empleado.id));
      if (ok) {
        toast.exito('Empleado eliminado.');
        if (editando?.id === empleado.id) setEditando(null);
        refrescar();
      }
    },
    [run, toast, editando, refrescar],
  );

  return useMemo(
    () => ({
      filtros,
      items,
      cargando,
      guardando,
      editando,
      filtrar,
      editar: setEditando,
      guardar,
      eliminar,
    }),
    [filtros, items, cargando, guardando, editando, filtrar, guardar, eliminar],
  );
}
