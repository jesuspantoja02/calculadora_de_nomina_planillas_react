import type { RolUsuario } from '../../../core/auth/roles';
import type { ActualizarUsuarioDto, UsuarioCuenta, UsuarioCuentaDto } from '../domain/usuario.model';
import type { UsuariosRepository } from '../domain/usuarios.repository';

export class UsuariosService {
  #repo: UsuariosRepository;

  constructor(repo: UsuariosRepository) {
    this.#repo = repo;
  }

  listar(): Promise<UsuarioCuenta[]> {
    return this.#repo.listar();
  }

  rolesAsignables(): Promise<RolUsuario[]> {
    return this.#repo.rolesAsignables();
  }

  crear(dto: UsuarioCuentaDto): Promise<UsuarioCuenta> {
    return this.#repo.crear(dto);
  }

  actualizar(id: string, dto: ActualizarUsuarioDto): Promise<UsuarioCuenta> {
    return this.#repo.actualizar(id, dto);
  }

  eliminar(id: string): Promise<true> {
    return this.#repo.eliminar(id);
  }
}
