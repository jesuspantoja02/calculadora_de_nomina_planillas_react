import { resolve } from 'node:path';
import { construirServicios } from '../src/container.ts';
import { asegurarUsuarioAdmin } from '../src/modules/auth/infrastructure/seed-usuarios.ts';
import { abrirBaseDatos } from '../src/shared/infrastructure/sqlite/database.ts';
import type { EmpleadoDto } from '../src/modules/empleados/application/empleado.dto.ts';

const db = abrirBaseDatos(resolve(process.env['DATABASE_FILE'] ?? 'data/nomina.db'));
asegurarUsuarioAdmin(db);
const servicios = construirServicios(db, {
  authSecret: process.env['AUTH_SECRET'] ?? 'dev-nomina-auth-secret-cambiar-en-prod',
  tokenTtlMs: Number(process.env['AUTH_TOKEN_TTL_HOURS'] ?? 12) * 60 * 60 * 1000,
});

const demo: EmpleadoDto[] = [
  {
    dni: '70123456',
    nombre: 'Ana Torres Quispe',
    cargo: 'Desarrollador',
    sueldoBase: 4500,
    regimen: 'AFP',
    afp: 'Prima',
    tieneHijos: true,
    hijos: [{ nombre: 'Sofía Torres', edad: 10 }],
  },
  {
    dni: '45871236',
    nombre: 'Luis Ramos Huamán',
    cargo: 'Almacenero',
    sueldoBase: 1500,
    regimen: 'ONP',
    afp: null,
    tieneHijos: false,
    hijos: [],
  },
  {
    dni: '72654381',
    nombre: 'Carla Vega Soto',
    cargo: 'Analista',
    sueldoBase: 3200,
    regimen: 'AFP',
    afp: 'Habitat',
    tieneHijos: false,
    hijos: [],
  },
];

for (const e of demo) {
  try {
    await servicios.empleados.crear({ ...e });
    console.log(`+ ${e.nombre}`);
  } catch (error) {
    console.log(`= ${e.nombre} (${(error as Error).message})`);
  }
}
db.close();
