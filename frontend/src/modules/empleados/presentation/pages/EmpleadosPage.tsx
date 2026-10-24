import { useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../../../../shared/ui/PageHeader';
import { EmpleadoFiltros, pensionInicialDesdeUrl } from '../components/EmpleadoFiltros';
import { EmpleadoForm } from '../components/EmpleadoForm';
import { EmpleadoLista } from '../components/EmpleadoLista';
import type { Empleado } from '../../domain/empleado.model';
import { useEmpleadosStore } from '../hooks/useEmpleadosStore';

export function EmpleadosPage() {
  const store = useEmpleadosStore();
  const [params] = useSearchParams();
  const limpiarFormRef = useRef<(() => void) | null>(null);
  const pensionInicial = pensionInicialDesdeUrl(params.get('regimen'), params.get('afp'));

  const onGuardar = useCallback(
    async (dto: Parameters<typeof store.guardar>[0]) => {
      const ok = await store.guardar(dto);
      if (ok) limpiarFormRef.current?.();
    },
    [store],
  );

  const onEliminar = (e: Empleado) => {
    if (confirm(`¿Eliminar a ${e.nombre}? Sus boletas emitidas se conservan.`)) void store.eliminar(e);
  };

  return (
    <>
      <PageHeader
        titulo="Empleados"
        descripcion="Alta de personal y lista de trabajadores registrados."
        acciones={
          <a className="btn btn-primary" href="#alta-empleado">
            Nuevo empleado
          </a>
        }
      />

      <div className="row g-4">
        <section className="col-xl-5" id="alta-empleado">
          <EmpleadoForm
            empleado={store.editando}
            guardando={store.guardando}
            onGuardar={onGuardar}
            onCancelar={() => store.editar(null)}
            onLimpiarRef={(fn) => {
              limpiarFormRef.current = fn;
            }}
          />
        </section>

        <section className="col-xl-7">
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">
                Empleados registrados <span className="count">{store.items.length}</span>
              </h2>
            </div>
            <EmpleadoFiltros pensionInicial={pensionInicial} onCambio={store.filtrar} />
            <EmpleadoLista
              items={store.items}
              cargando={store.cargando}
              editandoId={store.editando?.id ?? null}
              onEditar={store.editar}
              onEliminar={onEliminar}
            />
          </div>
        </section>
      </div>
    </>
  );
}
