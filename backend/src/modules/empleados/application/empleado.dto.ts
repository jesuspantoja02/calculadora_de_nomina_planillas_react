import { z } from 'zod';
import { AFP_ENTIDADES, CARGOS } from '../../../shared/config/catalogos.ts';
import { sanitizarTexto } from '../../../shared/utils/sanitize.ts';

export const idSchema = z.uuid({ message: 'El id debe ser un UUID válido.' });

const nombrePersonaSchema = z
  .string()
  .refine((s) => !/[\u0000-\u001F\u007F<>`]/.test(s), 'El nombre contiene caracteres no permitidos.')
  .transform(sanitizarTexto)
  .pipe(z.string().regex(/^[\p{L}][\p{L} .'-]{2,59}$/u, 'El nombre solo admite letras (3 a 60 caracteres).'));

export const hijoSchema = z.object({
  nombre: nombrePersonaSchema,
  edad: z
    .number()
    .int('La edad debe ser un número entero.')
    .min(0, 'La edad no puede ser negativa.')
    .max(17, 'Solo menores de 18 años califican para asignación familiar.'),
});

export const empleadoSchema = z
  .strictObject({
    dni: z.string().regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos.'),
    nombre: nombrePersonaSchema,
    cargo: z.enum(CARGOS),
    sueldoBase: z.number().finite().positive('El sueldo debe ser mayor que 0.').max(1_000_000),
    regimen: z.enum(['AFP', 'ONP']),
    afp: z.enum(AFP_ENTIDADES).nullable().default(null),
    tieneHijos: z.boolean().default(false),
    hijos: z.array(hijoSchema).max(15).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.regimen === 'AFP' && data.afp === null) {
      ctx.addIssue({
        code: 'custom',
        message: 'Selecciona la administradora AFP del trabajador.',
        path: ['afp'],
      });
    }
    if (data.regimen === 'ONP' && data.afp !== null) {
      ctx.addIssue({
        code: 'custom',
        message: 'La administradora AFP solo aplica cuando el régimen es AFP.',
        path: ['afp'],
      });
    }
    if (!data.tieneHijos) return;
    if (data.hijos.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Registra al menos un hijo menor de edad para la asignación familiar.',
        path: ['hijos'],
      });
    }
  });

export type EmpleadoDto = z.infer<typeof empleadoSchema>;
export type HijoDto = z.infer<typeof hijoSchema>;

export const filtroEmpleadosSchema = z.strictObject({
  cargo: z.string().max(40).optional(),
  regimen: z.enum(['AFP', 'ONP']).optional(),
  afp: z.enum(AFP_ENTIDADES).optional(),
  min: z.coerce.number().min(0).optional(),
  max: z.coerce.number().min(0).optional(),
});
