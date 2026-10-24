import { useEffect, useState } from 'react';
import { enmascararDni, formatoFecha, formatoMoneda, modalidadLabel } from '../../../../shared/formatters';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import { EntradaInput } from '../../../../shared/ui/EntradaInput';
import { Icon } from '../../../../shared/ui/Icon';
import { PageHeader } from '../../../../shared/ui/PageHeader';
import { Boleta } from '../components/Boleta';
import type { Pago } from '../../domain/pago.model';
import { useBoletasStore } from '../hooks/useBoletasStore';

export function BoletasPage() {
  const store = useBoletasStore();
  const [fecha, setFecha] = useState('');
  const [q, setQ] = useState('');
  const debounced = useDebouncedValue({ fecha, q }, 250);

  const { filtrar } = store;

  useEffect(() => {
    const f: { fecha?: string; q?: string } = {};
    if (debounced.fecha) f.fecha = debounced.fecha;
    if (debounced.q) f.q = debounced.q;
    filtrar(f);
  }, [debounced, filtrar]);

  const eliminar = (p: Pago) => {
    if (confirm(`¿Eliminar la boleta de ${p.nombre}?`)) void store.eliminar(p);
  };

  return (
    <>
      <PageHeader titulo="Boletas de pago" descripcion="Historial de boletas emitidas. Filtra por fecha, nombre o DNI." />

      <form className="panel mb-4" onSubmit={(e) => e.preventDefault()}>
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label" htmlFor="fecha">
              Fecha de pago
            </label>
            <input id="fecha" type="date" className="form-control" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="q">
              Nombre o DNI
            </label>
            <EntradaInput
              id="q"
              tipo="busqueda"
              className="form-control"
              value={q}
              onChange={setQ}
              maxLength={60}
              placeholder="Buscar…"
              autoComplete="off"
            />
          </div>
          <div className="col-md-3">
            <button
              type="button"
              className="btn btn-outline-secondary w-100"
              onClick={() => {
                setFecha('');
                setQ('');
              }}
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </form>

      <div className="row g-4">
        <section className="col-xl-5">
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">
                Boletas emitidas <span className="count">{store.items.length}</span>
              </h2>
            </div>
            {store.items.length === 0 ? (
              <p className="empty">No hay boletas que coincidan con los filtros.</p>
            ) : (
              store.items.map((p) => (
                <div
                  key={p.id}
                  className={`row-item clickable${store.seleccionada?.id === p.id ? ' selected' : ''}`}
                  onClick={() => store.seleccionar(p)}
                  onKeyDown={(e) => e.key === 'Enter' && store.seleccionar(p)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="flex-grow-1 min-w-0">
                    <div className="fw-semibold text-truncate">{p.nombre}</div>
                    <small className="text-secondary">
                      DNI {enmascararDni(p.dni)} · {formatoFecha(p.fechaPago)}
                    </small>
                  </div>
                  <div className="text-end">
                    <div className="fw-semibold">{formatoMoneda(p.neto)}</div>
                    <span className="badge text-bg-secondary">{modalidadLabel(p.modalidad)}</span>
                  </div>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    aria-label={`Eliminar boleta de ${p.nombre}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      eliminar(p);
                    }}
                  >
                    <Icon nombre="trash" />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="col-xl-7">
          {store.seleccionada ? (
            <Boleta boleta={store.seleccionada} />
          ) : (
            <div className="panel empty">Selecciona una boleta de la lista para verla.</div>
          )}
        </section>
      </div>
    </>
  );
}
