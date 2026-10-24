import { z } from 'zod';
import { ROLES_USUARIO } from '../domain/roles.ts';

const usuarioCampo = z
  .string()
  .trim()
  .min(3, 'El usuario debe tener al menos 3 caracteres.')
  .max(64, 'El usuario no puede superar 64 caracteres.')
  .regex(/^[a-zA-Z0-9._-]+$/, 'Solo letras, números, punto, guion y guion bajo.');

export const passwordCampo = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres.')
  .max(128, 'La contraseña es demasiado larga.');

export const idUsuarioSchema = z.string().uuid();

export const crearUsuarioSchema = z.object({
  usuario: usuarioCampo,
  password: passwordCampo,
  rol: z.enum(ROLES_USUARIO),
});

export const actualizarUsuarioSchema = z
  .object({
    usuario: usuarioCampo.optional(),
    password: passwordCampo.optional(),
    rol: z.enum(ROLES_USUARIO).optional(),
  })
  .refine((v) => v.usuario !== undefined || v.password !== undefined || v.rol !== undefined, {
    message: 'Indica al menos un campo para actualizar.',
  });
