import type { RolUsuario } from '../../../core/auth/roles';

export interface UsuarioCuenta {
  id: string;
  usuario: string;
  rol: RolUsuario;
  creadoEn: string;
}

export interface UsuarioCuentaDto {
  usuario: string;
  password: string;
  rol: RolUsuario;
}

export interface ActualizarUsuarioDto {
  usuario?: string;
  password?: string;
  rol?: RolUsuario;
}
