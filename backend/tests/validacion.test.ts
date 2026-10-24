import { test } from 'node:test';
import assert from 'node:assert/strict';
import { empleadoSchema } from '../src/modules/empleados/application/empleado.dto.ts';
import { pagoSchema } from '../src/modules/planilla/application/pago.dto.ts';

const dto = {
  dni: '12345678',
  nombre: 'Juan Perez',
  cargo: 'Analista',
  sueldoBase: 3000,
  regimen: 'AFP',
  afp: 'Integra',
  tieneHijos: false,
  hijos: [],
} as const;

test('Validación (Zod): rechaza DNI inválido, campos extra y sanitiza el nombre', () => {
  assert.equal(empleadoSchema.safeParse({ ...dto, dni: '123' }).success, false);
  assert.equal(empleadoSchema.safeParse({ ...dto, extra: 1 }).success, false);
  assert.equal(empleadoSchema.safeParse({ ...dto, nombre: '<script>' }).success, false);
  const ok = empleadoSchema.parse({ ...dto, nombre: '  Ana   Lopez ' });
  assert.equal(ok.nombre, 'Ana Lopez');
});

test('Validación (Zod): AFP exige administradora', () => {
  assert.equal(empleadoSchema.safeParse({ ...dto, afp: null }).success, false);
  assert.equal(empleadoSchema.safeParse({ ...dto, regimen: 'ONP', afp: 'Integra' }).success, false);
  const onp = empleadoSchema.parse({ ...dto, regimen: 'ONP', afp: null });
  assert.equal(onp.afp, null);
});

test('Validación (Zod): hijos menores y asignación familiar', () => {
  assert.equal(
    empleadoSchema.safeParse({
      ...dto,
      tieneHijos: true,
      hijos: [{ nombre: 'Pedro Lopez', edad: 18 }],
    }).success,
    false,
  );
  assert.equal(
    empleadoSchema.safeParse({
      ...dto,
      tieneHijos: true,
      hijos: [],
    }).success,
    false,
  );
  const ok = empleadoSchema.parse({
    ...dto,
    tieneHijos: true,
    hijos: [{ nombre: 'Maria Lopez', edad: 12 }],
  });
  assert.equal(ok.hijos.length, 1);
  assert.equal(ok.hijos[0]?.edad, 12);
});

test('Validación (Zod): pagos', () => {
  const base = { empleadoId: crypto.randomUUID(), fechaPago: '2026-10-31', modalidad: 'Mensual' };
  assert.equal(pagoSchema.safeParse(base).success, true);
  assert.equal(pagoSchema.safeParse({ ...base, fechaPago: '31/10/2026' }).success, false);
  assert.equal(pagoSchema.safeParse({ ...base, horasExtra25: -1 }).success, false);
  assert.equal(pagoSchema.safeParse({ ...base, modalidad: 'CTS', diasComputables: 31 }).success, false);
  assert.equal(pagoSchema.safeParse({ ...base, modalidad: 'Otra' }).success, false);
});
