import type { RolUsuario } from '../../../core/auth/roles';
import { apiDelete, apiGet, apiPost, apiPut } from '../../../shared/infrastructure/http/apiClient';
import type { ActualizarUsuarioDto, UsuarioCuenta, UsuarioCuentaDto } from '../domain/usuario.model';
import type { UsuariosRepository } from '../domain/usuarios.repository';

export class HttpUsuariosRepository implements UsuariosRepository {
  listar(): Promise<UsuarioCuenta[]> {
    return apiGet<UsuarioCuenta[]>('/usuarios');
  }

  rolesAsignables(): Promise<RolUsuario[]> {
    return apiGet<RolUsuario[]>('/usuarios/roles-asignables');
  }

  crear(dto: UsuarioCuentaDto): Promise<UsuarioCuenta> {
    return apiPost<UsuarioCuenta>('/usuarios', dto);
  }

  actualizar(id: string, dto: ActualizarUsuarioDto): Promise<UsuarioCuenta> {
    return apiPut<UsuarioCuenta>(`/usuarios/${id}`, dto);
  }

  eliminar(id: string): Promise<true> {
    return apiDelete(`/usuarios/${id}`);
  }
}
