import { etiquetaRol } from '../../../../core/auth/roles';
import { useTheme } from '../../../../core/theme/ThemeContext';
import { iniciales, tintePersona } from '../../../../shared/formatters';
import { Icon } from '../../../../shared/ui/Icon';
import type { UsuarioCuenta } from '../../domain/usuario.model';

interface UsuarioListaProps {
  items: UsuarioCuenta[];
  cargando: boolean;
  editandoId: string | null;
  sesionId: string | null;
  onEditar: (u: UsuarioCuenta) => void;
  onEliminar: (u: UsuarioCuenta) => void;
}

function formatoFecha(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function EstadoLista({ cargando }: { cargando: boolean }) {
  if (cargando) {
    return (
      <div className="empleado-lista-estado" role="status" aria-live="polite" aria-busy="true">
        <div className="empleado-lista-estado__marca" aria-hidden="true">
          <Icon nombre="shield" tamano={22} />
        </div>
        <p className="empleado-lista-estado__titulo">Cargando cuentas</p>
        <p className="empleado-lista-estado__detalle">Consultando usuarios del sistema…</p>
      </div>
    );
  }

  return (
    <div className="empleado-lista-estado empleado-lista-estado--vacio reveal-in" role="status" aria-live="polite">
      <div className="empleado-lista-estado__marca empleado-lista-estado__marca--vacio" aria-hidden="true">
        <Icon nombre="shield" tamano={22} />
      </div>
      <p className="empleado-lista-estado__titulo">Sin cuentas aún</p>
      <p className="empleado-lista-estado__detalle">Crea la primera cuenta con el formulario de la izquierda.</p>
      <a className="empleado-lista-estado__cta" href="#alta-usuario">
        Ir al formulario
      </a>
    </div>
  );
}

export function UsuarioLista({ items, cargando, editandoId, sesionId, onEditar, onEliminar }: UsuarioListaProps) {
  const { tema } = useTheme();

  if (items.length === 0) {
    return <EstadoLista cargando={cargando} />;
  }

  return (
    <div className="empleado-lista" aria-busy={cargando || undefined}>
      {items.map((u) => {
        const tinte = tintePersona(u.usuario, tema);
        const esSesion = u.id === sesionId;
        return (
          <div key={u.id} className={`row-item${u.id === editandoId ? ' selected' : ''}`}>
            <span className="avatar" aria-hidden="true" style={{ background: tinte.fondo, color: tinte.texto }}>
              {iniciales(u.usuario)}
            </span>
            <div className="flex-grow-1 min-w-0">
              <div className="fw-semibold text-truncate">{u.usuario}</div>
              <small className="text-secondary">Alta {formatoFecha(u.creadoEn)}</small>
            </div>
            <div className="text-end">
              <span className={`pill cuenta-rol cuenta-rol--${u.rol}`}>{etiquetaRol(u.rol)}</span>
              {esSesion ? <span className="pill ms-1">Tu sesión</span> : null}
            </div>
            <div className="btn-group btn-group-sm">
              <button type="button" className="btn btn-outline-primary" aria-label={`Editar ${u.usuario}`} onClick={() => onEditar(u)}>
                <Icon nombre="edit" />
              </button>
              <button
                type="button"
                className="btn btn-outline-danger"
                aria-label={`Eliminar ${u.usuario}`}
                onClick={() => onEliminar(u)}
                disabled={esSesion}
                title={esSesion ? 'No puedes eliminar tu propia cuenta' : undefined}
              >
                <Icon nombre="trash" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
