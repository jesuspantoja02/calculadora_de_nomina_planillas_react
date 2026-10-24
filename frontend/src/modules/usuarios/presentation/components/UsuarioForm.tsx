import { useCallback, useEffect, useMemo, useState } from 'react';
import { etiquetaRol, type RolUsuario } from '../../../../core/auth/roles';
import { claseValidacion } from '../../../../shared/validators/formularios';
import type { ActualizarUsuarioDto, UsuarioCuenta, UsuarioCuentaDto } from '../../domain/usuario.model';

interface UsuarioFormProps {
  cuenta: UsuarioCuenta | null;
  rolesAsignables: RolUsuario[];
  guardando: boolean;
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

export function UsuarioForm({ cuenta, rolesAsignables, guardando, onGuardar, onCancelar, onLimpiarRef }: UsuarioFormProps) {
  const esNuevo = cuenta == null;
  const rolInicial = rolesAsignables[0] ?? 'usuario';

  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState<RolUsuario>(rolInicial);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const limpiar = useCallback(() => {
    setUsuario('');
    setPassword('');
    setRol(rolInicial);
    setTouched({});
  }, [rolInicial]);

  useEffect(() => {
    onLimpiarRef?.(limpiar);
  }, [onLimpiarRef, limpiar]);

  useEffect(() => {
    if (cuenta) {
      setUsuario(cuenta.usuario);
      setPassword('');
      setRol(cuenta.rol);
      setTouched({});
    } else {
      limpiar();
    }
  }, [cuenta, limpiar]);

  useEffect(() => {
    if (!rolesAsignables.includes(rol)) {
      setRol(rolesAsignables[0] ?? 'usuario');
    }
  }, [rolesAsignables, rol]);

  const usuarioOk = usuarioValido(usuario);
  const passwordOk = passwordValida(password, esNuevo);
  const puedeEnviar = usuarioOk && passwordOk && rolesAsignables.includes(rol);

  const titulo = esNuevo ? 'Nueva cuenta' : 'Editar cuenta';

  const ayudaRol = useMemo(() => {
    if (rolesAsignables.length === 1 && rolesAsignables[0] === 'usuario') {
      return 'Con tu rol solo puedes crear usuarios operativos.';
    }
    return 'Elige el nivel de acceso al sistema.';
  }, [rolesAsignables]);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ usuario: true, password: true, rol: true });
    if (!puedeEnviar) return;

    if (esNuevo) {
      await onGuardar({ usuario: usuario.trim(), password, rol }, true);
    } else {
      const dto: ActualizarUsuarioDto = {};
      if (usuario.trim() !== cuenta!.usuario) dto.usuario = usuario.trim();
      if (password) dto.password = password;
      if (rol !== cuenta!.rol) dto.rol = rol;
      if (Object.keys(dto).length === 0) return;
      await onGuardar(dto, false);
    }
  };

  return (
    <div className="panel reveal-in">
      <div className="panel-head">
        <h2 className="panel-title">{titulo}</h2>
      </div>
      <form className="panel-body" onSubmit={enviar} noValidate>
        <div className="mb-3">
          <label htmlFor="cuenta-usuario">Usuario de acceso</label>
          <input
            id="cuenta-usuario"
            type="text"
            className={`form-control ${claseValidacion(usuarioOk, !usuarioOk, !!touched.usuario, !!touched.usuario)}`}
            autoComplete="off"
            spellCheck={false}
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, usuario: true }))}
            disabled={guardando}
          />
          <small className="text-secondary">Letras, números, punto, guion y guion bajo. Mínimo 3 caracteres.</small>
        </div>

        <div className="mb-3">
          <label htmlFor="cuenta-password">{esNuevo ? 'Contraseña' : 'Nueva contraseña (opcional)'}</label>
          <input
            id="cuenta-password"
            type="password"
            className={`form-control ${claseValidacion(passwordOk, !passwordOk, !!touched.password, !!touched.password)}`}
            autoComplete={esNuevo ? 'new-password' : 'off'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            disabled={guardando}
          />
          {!esNuevo ? <small className="text-secondary">Déjala vacía para no cambiarla.</small> : null}
        </div>

        <div className="mb-4">
          <label htmlFor="cuenta-rol">Rol en el sistema</label>
          <select
            id="cuenta-rol"
            className="form-control"
            value={rol}
            onChange={(e) => setRol(e.target.value as RolUsuario)}
            disabled={guardando || rolesAsignables.length <= 1}
          >
            {rolesAsignables.map((r) => (
              <option key={r} value={r}>{etiquetaRol(r)}</option>
            ))}
          </select>
          <small className="text-secondary">{ayudaRol}</small>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button type="submit" className="btn btn-primary" disabled={guardando || !puedeEnviar}>
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
