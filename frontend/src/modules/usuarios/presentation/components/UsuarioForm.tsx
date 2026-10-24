import { useCallback, useEffect, useMemo, useState } from 'react';
import { etiquetaRol, type RolUsuario } from '../../../../core/auth/roles';
import { FormFieldStatus } from '../../../../shared/ui/FormFieldStatus';
import { FormSelect } from '../../../../shared/ui/FormSelect';
import { PasswordRevealButton } from '../../../../shared/ui/PasswordRevealButton';
import { claseValidacion } from '../../../../shared/validators/formularios';
import type { ActualizarUsuarioDto, UsuarioCuenta, UsuarioCuentaDto } from '../../domain/usuario.model';

interface UsuarioFormProps {
  cuenta: UsuarioCuenta | null;
  rolesAsignables: RolUsuario[];
  guardando: boolean;
  soloAlta?: boolean;
  onGuardar: (dto: UsuarioCuentaDto | ActualizarUsuarioDto, esNuevo: boolean) => Promise<unknown>;
  onCancelar: () => void;
  onLimpiarRef?: (fn: () => void) => void;
}

const usuarioRegex = /^[a-zA-Z0-9._-]+$/;

function usuarioValido(v: string): boolean {
  const t = v.trim();
  return t.length >= 3 && t.length <= 64 && usuarioRegex.test(t);
}

function passwordValida(v: string, requerida: boolean): boolean {
  if (!requerida && v === '') return true;
  return v.length >= 8 && v.length <= 128;
}

function estadoCampo(ok: boolean, tocado: boolean, valor: string): 'valid' | 'invalid' | 'idle' {
  if (!tocado || valor === '') return 'idle';
  return ok ? 'valid' : 'invalid';
}

export function UsuarioForm({
  cuenta,
  rolesAsignables,
  guardando,
  soloAlta = false,
  onGuardar,
  onCancelar,
  onLimpiarRef,
}: UsuarioFormProps) {
  const esNuevo = cuenta == null || soloAlta;
  const rolInicial = rolesAsignables[0] ?? 'usuario';

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cambioPasswordAbierto, setCambioPasswordAbierto] = useState(false);
  const [rol, setRol] = useState<RolUsuario>(rolInicial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const limpiar = useCallback(() => {
    setUsuario('');
    setPassword('');
    setMostrarPassword(false);
    setCambioPasswordAbierto(false);
    setRol(rolInicial);
    setTouched({});
  }, [rolInicial]);

  useEffect(() => {
    onLimpiarRef?.(limpiar);
  }, [onLimpiarRef, limpiar]);

  useEffect(() => {
    if (cuenta && !soloAlta) {
      setUsuario(cuenta.usuario);
      setPassword('');
      setMostrarPassword(false);
      setCambioPasswordAbierto(false);
      setRol(cuenta.rol);
      setTouched({});
    } else {
      limpiar();
    }
  }, [cuenta, limpiar, soloAlta]);

  useEffect(() => {
    if (!rolesAsignables.includes(rol)) {
      setRol(rolesAsignables[0] ?? 'usuario');
    }
  }, [rolesAsignables, rol]);

  const usuarioOk = usuarioValido(usuario);
  const passwordRequerida = esNuevo || cambioPasswordAbierto;
  const passwordOk = passwordValida(password, passwordRequerida);

  const titulo = esNuevo ? (soloAlta ? 'Nuevo usuario' : 'Nueva cuenta') : 'Editar cuenta';

  const ayudaRol = useMemo(() => {
    if (rolesAsignables.length === 1 && rolesAsignables[0] === 'usuario') {
      return 'Con tu rol solo puedes crear usuarios operativos.';
    }
    if (rolesAsignables.includes('jefe') && !rolesAsignables.includes('admin')) {
      return 'Puedes asignar rol Jefe o Usuario.';
    }
    return 'Elige el nivel de acceso al sistema.';
  }, [rolesAsignables]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ usuario: true, password: passwordRequerida, rol: true });
    if (!usuarioOk || !passwordOk || !rolesAsignables.includes(rol)) return;

    if (esNuevo) {
      await onGuardar({ usuario: usuario.trim(), password, rol }, true);
    } else {
      const dto: ActualizarUsuarioDto = {};
      if (usuario.trim() !== cuenta!.usuario) dto.usuario = usuario.trim();
      if (cambioPasswordAbierto && password) dto.password = password;
      if (rol !== cuenta!.rol) dto.rol = rol;
      if (Object.keys(dto).length === 0) return;
      await onGuardar(dto, false);
    }
  };

  const claseUsuario = `form-control form-control--status-external ${claseValidacion(
    usuarioOk,
    !usuarioOk,
    !!touched.usuario,
    !!touched.usuario,
  )}`;

  const clasePassword = `form-control form-control--status-external ${claseValidacion(
    passwordOk,
    !passwordOk,
    !!touched.password,
    !!touched.password,
  )}`;

  return (
    <div className="panel reveal-in">
      <div className="panel-head">
        <h2 className="panel-title">{titulo}</h2>
      </div>
      <form className="panel-body" onSubmit={enviar} noValidate>
        <div className="mb-3">
          <label htmlFor="cuenta-usuario">Usuario de acceso</label>
          <FormFieldStatus
            estado={estadoCampo(usuarioOk, !!touched.usuario, usuario)}
            mostrar={!!touched.usuario && usuario !== ''}
          >
            <input
              id="cuenta-usuario"
              type="text"
              className={claseUsuario}
              autoComplete="off"
              spellCheck={false}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, usuario: true }))}
              disabled={guardando}
            />
          </FormFieldStatus>
          <small className="text-secondary">Letras, números, punto, guion y guion bajo. Mínimo 3 caracteres.</small>
        </div>

        {esNuevo ? (
          <div className="mb-3">
            <label htmlFor="cuenta-password">Contraseña</label>
            <FormFieldStatus
              estado={estadoCampo(passwordOk, !!touched.password, password)}
              mostrar={!!touched.password && password !== ''}
            >
              <div className="form-secret-wrap">
                <input
                  id="cuenta-password"
                  type={mostrarPassword ? 'text' : 'password'}
                  className={clasePassword}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  disabled={guardando}
                />
                <PasswordRevealButton
                  visible={mostrarPassword}
                  onToggle={() => setMostrarPassword((v) => !v)}
                  className="form-secret-wrap__reveal"
                />
              </div>
            </FormFieldStatus>
          </div>
        ) : (
          <div className="mb-3">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => {
                setCambioPasswordAbierto((v) => !v);
                if (cambioPasswordAbierto) {
                  setPassword('');
                  setTouched((t) => ({ ...t, password: false }));
                }
              }}
              disabled={guardando}
            >
              {cambioPasswordAbierto ? 'Cancelar cambio de contraseña' : 'Cambiar contraseña'}
            </button>
            {cambioPasswordAbierto ? (
              <div className="cuenta-password-panel">
                <label htmlFor="cuenta-password">Nueva contraseña</label>
                <FormFieldStatus
                  estado={estadoCampo(passwordOk, !!touched.password, password)}
                  mostrar={!!touched.password && password !== ''}
                >
                  <div className="form-secret-wrap">
                    <input
                      id="cuenta-password"
                      type={mostrarPassword ? 'text' : 'password'}
                      className={clasePassword}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                      disabled={guardando}
                    />
                    <PasswordRevealButton
                      visible={mostrarPassword}
                      onToggle={() => setMostrarPassword((v) => !v)}
                      className="form-secret-wrap__reveal"
                    />
                  </div>
                </FormFieldStatus>
                <small className="text-secondary">Mínimo 8 caracteres.</small>
              </div>
            ) : null}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="cuenta-rol">Rol en el sistema</label>
          <FormSelect
            id="cuenta-rol"
            value={rol}
            onChange={(e) => setRol(e.target.value as RolUsuario)}
            disabled={guardando || rolesAsignables.length <= 1}
          >
            {rolesAsignables.map((r) => (
              <option key={r} value={r}>{etiquetaRol(r)}</option>
            ))}
          </FormSelect>
          <small className="text-secondary">{ayudaRol}</small>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={guardando || !usuarioOk || !passwordOk || !rolesAsignables.includes(rol)}
          >
            {guardando ? 'Guardando…' : esNuevo ? 'Crear cuenta' : 'Guardar cambios'}
          </button>
          {!esNuevo ? (
            <button type="button" className="btn btn-outline-secondary" onClick={onCancelar} disabled={guardando}>
              Cancelar
            </button>
          ) : null}
        </div>
      </form>
    </div>
  );
}
