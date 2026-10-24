import { AppError } from '../../../shared/errors/app-error.ts';
import { hashPassword, verifyPassword } from '../../../shared/security/password.ts';
import { crearToken, verificarToken, type TokenPayload } from '../../../shared/security/token.ts';
import type { RolUsuario } from '../domain/roles.ts';
import type { UsuarioRepository } from '../domain/usuario.repository.ts';
import type { cambiarPasswordSchema, loginSchema } from './auth.dto.ts';
import type { z } from 'zod';

export interface SesionDto {
  token: string;
  id: string;
  usuario: string;
  rol: RolUsuario;
}

export interface PerfilDto {
  id: string;
  usuario: string;
  rol: RolUsuario;
  creadoEn: string;
}

export class AuthService {
  #usuarios: UsuarioRepository;
  #authSecret: string;
  #tokenTtlMs: number;

  constructor(usuarios: UsuarioRepository, authSecret: string, tokenTtlMs: number) {
    this.#usuarios = usuarios;
    this.#authSecret = authSecret;
    this.#tokenTtlMs = tokenTtlMs;
  }

  iniciarSesion(credenciales: z.infer<typeof loginSchema>): SesionDto {
    const registro = this.#usuarios.buscarPorUsuario(credenciales.usuario);
    if (!registro || !verifyPassword(credenciales.password, registro.passwordHash)) {
      throw new AppError(401, 'CREDENCIALES_INVALIDAS', 'Usuario o contraseña incorrectos.');
    }

    const token = crearToken(
      { sub: registro.id, usuario: registro.usuario, rol: registro.rol },
      this.#authSecret,
      this.#tokenTtlMs,
    );

    return { token, id: registro.id, usuario: registro.usuario, rol: registro.rol };
  }

  validarToken(token: string): TokenPayload {
    return verificarToken(token, this.#authSecret);
  }

  sesionDesdeToken(token: string): SesionDto {
    const payload = this.validarToken(token);
    return { token, id: payload.sub, usuario: payload.usuario, rol: payload.rol };
  }

  perfil(payload: TokenPayload): PerfilDto {
    const registro = this.#usuarios.buscarPorId(payload.sub);
    if (!registro) {
      throw new AppError(404, 'NO_ENCONTRADO', 'Usuario no encontrado.');
    }
    return { id: registro.id, usuario: registro.usuario, rol: registro.rol, creadoEn: registro.creadoEn };
  }

  cambiarPassword(payload: TokenPayload, body: z.infer<typeof cambiarPasswordSchema>): void {
    const registro = this.#usuarios.buscarPorId(payload.sub);
    if (!registro) {
      throw new AppError(404, 'NO_ENCONTRADO', 'Usuario no encontrado.');
    }
    if (!verifyPassword(body.passwordActual, registro.passwordHash)) {
      throw new AppError(401, 'PASSWORD_ACTUAL_INVALIDA', 'La contraseña actual no es correcta.');
    }
    this.#usuarios.actualizar(payload.sub, { passwordHash: hashPassword(body.passwordNueva) });
  }
}
