import { useTheme } from '../../../../core/theme/ThemeContext';
import {
  enmascararDni,
  estilosAvatarTinte,
  formatoMoneda,
  iniciales,
  tituloPalabras,
  tintePersona,
} from '../../../../shared/formatters';
import { etiquetaSistemaPensiones } from '../../../../shared/pensiones';
import { Icon } from '../../../../shared/ui/Icon';
import type { Empleado } from '../../domain/empleado.model';

interface EmpleadoListaProps {
  items: Empleado[];
  cargando: boolean;
  editandoId: string | null;
  onEditar: (e: Empleado) => void;
  onEliminar: (e: Empleado) => void;
}

function EstadoLista({ cargando }: { cargando: boolean }) {
  if (cargando) {
    return (
      <div className="empleado-lista-estado" role="status" aria-live="polite" aria-busy="true">
        <div className="empleado-lista-estado__marca" aria-hidden="true">
          <Icon nombre="users" tamano={22} />
        </div>
        <p className="empleado-lista-estado__titulo">Cargando personal</p>
        <p className="empleado-lista-estado__detalle">Consultando el registro…</p>
      </div>
    );
  }

  return (
    <div className="empleado-lista-estado empleado-lista-estado--vacio reveal-in" role="status" aria-live="polite">
      <div className="empleado-lista-estado__marca empleado-lista-estado__marca--vacio" aria-hidden="true">
        <Icon nombre="users" tamano={22} />
      </div>
      <p className="empleado-lista-estado__titulo">Sin coincidencias</p>
      <p className="empleado-lista-estado__detalle">
        No hay empleados que coincidan con los filtros actuales. Registra el primero con el formulario de la izquierda.
      </p>
      <a className="empleado-lista-estado__cta" href="#alta-empleado">
        Ir al formulario de alta
      </a>
    </div>
  );
}

export function EmpleadoLista({ items, cargando, editandoId, onEditar, onEliminar }: EmpleadoListaProps) {
  const { tema } = useTheme();

  if (items.length === 0) {
    return <EstadoLista cargando={cargando} />;
  }

  return (
    <div className="empleado-lista" aria-busy={cargando || undefined}>
      {items.map((e) => {
        const tinte = tintePersona(e.nombre, tema);
        return (
          <div key={e.id} className={`row-item${e.id === editandoId ? ' selected' : ''}`}>
            <span
              className="avatar"
              aria-hidden="true"
              style={estilosAvatarTinte(tinte)}
            >
              {iniciales(e.nombre)}
            </span>
            <div className="flex-grow-1 min-w-0">
              <div className="fw-semibold text-truncate">{tituloPalabras(e.nombre)}</div>
              <small className="text-secondary">
                {e.cargo} · DNI {enmascararDni(e.dni)}
              </small>
            </div>
            <div className="text-end">
              <div className="fw-semibold fig-tabular" style={{ fontFamily: 'var(--mono)', fontWeight: 500 }}>
                {formatoMoneda(e.sueldoBase)}
              </div>
              <span className="pill">{etiquetaSistemaPensiones(e.regimen, e.afp)}</span>
              {e.tieneHijos ? (
                <span className="pill ms-1" title="Hijos registrados para asignación familiar">
                  Hijos menores: {e.hijos?.length ?? 0}
                </span>
              ) : null}
            </div>
            <div className="btn-group btn-group-sm">
              <button type="button" className="btn btn-outline-primary" aria-label={`Editar ${e.nombre}`} onClick={() => onEditar(e)}>
                <Icon nombre="edit" />
              </button>
              <button type="button" className="btn btn-outline-danger" aria-label={`Eliminar ${e.nombre}`} onClick={() => onEliminar(e)}>
                <Icon nombre="trash" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
