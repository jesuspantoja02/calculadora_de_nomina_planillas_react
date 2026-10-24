import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { container } from '../../../../composition/container';
import { useToast } from '../../../../core/notifications/ToastContext';
import { useApiAction } from '../../../../shared/presentation/useApiAction';
import type { FiltroPagos, Pago } from '../../domain/pago.model';

const pagos = container.pagos;

export function useBoletasStore() {
  const toast = useToast();
  const run = useApiAction();

  const [filtros, setFiltros] = useState<FiltroPagos>({});
  const [items, setItems] = useState<Pago[]>([]);
  const [cargando, setCargando] = useState(false);
  const [seleccionada, setSeleccionada] = useState<Pago | null>(null);
  const [version, setVersion] = useState(0);

  const filtrosRef = useRef(filtros);
  filtrosRef.current = filtros;

  useEffect(() => {
    const ctrl = new AbortController();
    setCargando(true);
    pagos
      .listar(filtrosRef.current)
      .then((lista) => {
        if (ctrl.signal.aborted) return;
        setItems(lista);
        setSeleccionada((actual) => (actual && !lista.some((p) => p.id === actual.id) ? null : actual));
      })
      .catch(() => {
        if (!ctrl.signal.aborted) setItems([]);
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setCargando(false);
      });
    return () => ctrl.abort();
  }, [filtros, version]);

  const filtrar = useCallback((f: FiltroPagos) => setFiltros(f), []);

  const eliminar = useCallback(
    async (pago: Pago) => {
      const ok = await run(() => pagos.eliminar(pago.id));
      if (ok) {
        toast.exito('Boleta eliminada.');
        setVersion((v) => v + 1);
      }
    },
    [run, toast],
  );

  return useMemo(
    () => ({ filtros, items, cargando, seleccionada, filtrar, seleccionar: setSeleccionada, eliminar }),
    [filtros, items, cargando, seleccionada, filtrar, eliminar],
  );
}
