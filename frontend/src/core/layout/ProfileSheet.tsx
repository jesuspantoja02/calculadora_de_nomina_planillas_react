import { useCallback, useEffect, useState } from 'react';
import { cambiarPasswordApi, fetchPerfilApi, type PerfilApi } from '../auth/authApi';
import { etiquetaRol } from '../auth/roles';
import { useToast } from '../notifications/ToastContext';
import { FormFieldStatus } from '../../shared/ui/FormFieldStatus';
import { Icon } from '../../shared/ui/Icon';
import { PasswordRevealButton } from '../../shared/ui/PasswordRevealButton';
import { claseValidacion } from '../../shared/validators/formularios';
import { useApiAction } from '../../shared/presentation/useApiAction';

interface ProfileSheetProps {
  abierto: boolean;
  onCerrar: () => void;
}

function passwordValida(v: string): boolean {
  return v.length >= 8 && v.length <= 128;
}

function fechaLegible(iso: string): string {
  try {
    return new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function ProfileSheet({ abierto, onCerrar }: ProfileSheetProps) {
  const toast = useToast();
  const run = useApiAction();

  const [perfil, setPerfil] = useState<PerfilApi | null>(null);
  const [cargando, setCargando] = useState(false);
  const [panelPassword, setPanelPassword] = useState(false);
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [guardando, setGuardando] = useState(false);

  const limpiarPassword = useCallback(() => {
    setPasswordActual('');
    setPasswordNueva('');
    setMostrarActual(false);
    setMostrarNueva(false);
    setTouched({});
  }, []);

  useEffect(() => {
    if (!abierto) {
      setPanelPassword(false);
      limpiarPassword();
      return;
    }
    setCargando(true);
    fetchPerfilApi()
      .then(setPerfil)
      .catch(() => setPerfil(null))
      .finally(() => setCargando(false));
  }, [abierto, limpiarPassword]);

  const cerrarTodo = () => {
    onCerrar();
    setPanelPassword(false);
    limpiarPassword();
  };

  const actualOk = passwordActual.length > 0;
  const nuevaOk = passwordValida(passwordNueva);
  const puedeGuardarPassword = actualOk && nuevaOk;

  const guardarPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ actual: true, nueva: true });
    if (!puedeGuardarPassword) return;
    setGuardando(true);
    const ok = await run(async () => {
      await cambiarPasswordApi(passwordActual, passwordNueva);
      return true;
    });
    setGuardando(false);
    if (ok) {
      toast.exito('Contraseña actualizada correctamente.');
      limpiarPassword();
      setPanelPassword(false);
    }
  };

  const estadoCampo = (ok: boolean, tocado: boolean, valor: string): 'valid' | 'invalid' | 'idle' => {
    if (!tocado || valor === '') return 'idle';
    return ok ? 'valid' : 'invalid';
  };

  return (
    <>
      <div
        className={`profile-sheet-backdrop no-print${abierto ? ' profile-sheet-backdrop--open' : ''}`}
        onClick={cerrarTodo}
        role="presentation"
      />
      <aside
        className={`profile-sheet no-print${abierto ? ' profile-sheet--open' : ''}${panelPassword ? ' profile-sheet--password-open' : ''}`}
        aria-hidden={!abierto}
        aria-label="Mi perfil"
      >
        <div className="profile-sheet__main">
          <header className="profile-sheet__head">
            <h2 className="panel-title mb-0">Mi perfil</h2>
            <button type="button" className="profile-sheet__close" onClick={cerrarTodo} aria-label="Cerrar">
              <Icon nombre="x" tamano={20} />
            </button>
          </header>
          <div className="profile-sheet__body">
            {cargando ? <p className="text-secondary">Cargando perfil…</p> : null}
            {!cargando && perfil ? (
              <>
                <div className="profile-sheet__hero">
                  <div className="profile-sheet__hero-avatar">
                    <Icon nombre="user" tamano={32} />
                  </div>
                  <div>
                    <p className="mb-0 fw-semibold">{perfil.usuario}</p>
                    <span className={`pill cuenta-rol cuenta-rol--${perfil.rol}`}>{etiquetaRol(perfil.rol)}</span>
                  </div>
                </div>
                <dl className="profile-sheet__dl">
                  <div className="profile-sheet__row">
                    <dt>Usuario de acceso</dt>
                    <dd>{perfil.usuario}</dd>
                  </div>
                  <div className="profile-sheet__row">
                    <dt>Contraseña</dt>
                    <dd>
                      <span className="profile-sheet__secret">••••••••</span>
                    </dd>
                  </div>
                  <div className="profile-sheet__row">
                    <dt>Cuenta creada</dt>
                    <dd>{fechaLegible(perfil.creadoEn)}</dd>
                  </div>
                </dl>
                <p className="profile-sheet__note">
                  Por seguridad, la contraseña no se muestra en pantalla. Usa el botón inferior para cambiarla.
                </p>
                <button
                  type="button"
                  className="btn btn-outline-primary w-100 mt-3"
                  onClick={() => setPanelPassword((v) => !v)}
                >
                  {panelPassword ? 'Ocultar cambio de contraseña' : 'Cambiar contraseña'}
                </button>
              </>
            ) : null}
          </div>
        </div>

        <div className="profile-sheet__password" aria-hidden={!panelPassword}>
          <div className="profile-sheet__password-inner">
            <h3 className="h6 mb-3">Nueva contraseña</h3>
            <form onSubmit={guardarPassword} noValidate>
              <div className="mb-3">
                <label htmlFor="perfil-password-actual">Contraseña actual</label>
                <FormFieldStatus
                  estado={estadoCampo(actualOk, !!touched.actual, passwordActual)}
                  mostrar={!!touched.actual && passwordActual !== ''}
                >
                  <div className="form-secret-wrap">
                    <input
                      id="perfil-password-actual"
                      type={mostrarActual ? 'text' : 'password'}
                      className={`form-control form-control--status-external ${claseValidacion(actualOk, !actualOk, !!touched.actual, !!touched.actual)}`}
                      value={passwordActual}
                      onChange={(e) => setPasswordActual(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, actual: true }))}
                      autoComplete="current-password"
                      disabled={guardando}
                    />
                    <PasswordRevealButton
                      visible={mostrarActual}
                      onToggle={() => setMostrarActual((v) => !v)}
                      className="form-secret-wrap__reveal"
                    />
                  </div>
                </FormFieldStatus>
              </div>
              <div className="mb-4">
                <label htmlFor="perfil-password-nueva">Contraseña nueva</label>
                <FormFieldStatus
                  estado={estadoCampo(nuevaOk, !!touched.nueva, passwordNueva)}
                  mostrar={!!touched.nueva && passwordNueva !== ''}
                >
                  <div className="form-secret-wrap">
                    <input
                      id="perfil-password-nueva"
                      type={mostrarNueva ? 'text' : 'password'}
                      className={`form-control form-control--status-external ${claseValidacion(nuevaOk, !nuevaOk, !!touched.nueva, !!touched.nueva)}`}
                      value={passwordNueva}
                      onChange={(e) => setPasswordNueva(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, nueva: true }))}
                      autoComplete="new-password"
                      disabled={guardando}
                    />
                    <PasswordRevealButton
                      visible={mostrarNueva}
                      onToggle={() => setMostrarNueva((v) => !v)}
                      className="form-secret-wrap__reveal"
                    />
                  </div>
                </FormFieldStatus>
                <small className="text-secondary">Mínimo 8 caracteres.</small>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={guardando || !puedeGuardarPassword}>
                {guardando ? 'Guardando…' : 'Actualizar contraseña'}
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
