import type { RolUsuario } from '../../../core/auth/roles';
import type { ActualizarUsuarioDto, UsuarioCuenta, UsuarioCuentaDto } from './usuario.model';

export interface UsuariosRepository {
  listar(): Promise<UsuarioCuenta[]>;
  rolesAsignables(): Promise<RolUsuario[]>;
  crear(dto: UsuarioCuentaDto): Promise<UsuarioCuenta>;
  actualizar(id: string, dto: ActualizarUsuarioDto): Promise<UsuarioCuenta>;
  eliminar(id: string): Promise<true>;
}
