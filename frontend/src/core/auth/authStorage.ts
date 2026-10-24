import { ROLES_USUARIO, type RolUsuario } from './roles';

export type { RolUsuario };

const TOKEN_KEY = 'nomina_auth_token';
const USER_KEY = 'nomina_auth_usuario';
const ROL_KEY = 'nomina_auth_rol';
const ID_KEY = 'nomina_auth_id';

export interface SesionGuardada {
  token: string;
  id: string;
  usuario: string;
  rol: RolUsuario;
}

function rolValido(rol: string | null): RolUsuario | null {
  if (!rol) return null;
  return (ROLES_USUARIO as readonly string[]).includes(rol) ? (rol as RolUsuario) : null;
}

export function leerSesion(): SesionGuardada | null {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const usuario = sessionStorage.getItem(USER_KEY);
    const id = sessionStorage.getItem(ID_KEY);
    const rol = rolValido(sessionStorage.getItem(ROL_KEY));
    if (!token || !usuario || !id || !rol) {
      if (token || usuario) borrarSesion();
      return null;
    }
    return { token, id, usuario, rol };
  } catch {
    return null;
  }
}

export function guardarSesion(sesion: SesionGuardada): void {
  sessionStorage.setItem(TOKEN_KEY, sesion.token);
  sessionStorage.setItem(USER_KEY, sesion.usuario);
  sessionStorage.setItem(ROL_KEY, sesion.rol);
  sessionStorage.setItem(ID_KEY, sesion.id);
}

export function borrarSesion(): void {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(ROL_KEY);
  sessionStorage.removeItem(ID_KEY);
}

let lectorToken: () => string | null = () => leerSesion()?.token ?? null;

export function registrarLectorToken(fn: () => string | null): void {
  lectorToken = fn;
}

export function obtenerTokenAuth(): string | null {
  return lectorToken();
}
