import type { RolUsuario, Usuario } from './usuario.ts';

export interface CrearUsuarioInput {
  id: string;
  usuario: string;
  passwordHash: string;
  rol: RolUsuario;
  creadoEn: string;
}

export interface ActualizarUsuarioInput {
  usuario?: string;
  passwordHash?: string;
  rol?: RolUsuario;
}

export interface UsuarioRepository {
  buscarPorUsuario(usuario: string): Usuario | null;
  buscarPorId(id: string): Usuario | null;
  listar(): Usuario[];
  crear(input: CrearUsuarioInput): Usuario;
  actualizar(id: string, input: ActualizarUsuarioInput): Usuario;
  eliminar(id: string): void;
  contarPorRol(rol: RolUsuario): number;
}
