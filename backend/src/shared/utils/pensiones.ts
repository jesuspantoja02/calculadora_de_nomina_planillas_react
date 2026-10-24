import type { AfpEntidad, Regimen } from '../../modules/empleados/domain/empleado.ts';

/** Texto para UI y boletas: ONP o AFP con administradora. */
export function etiquetaSistemaPensiones(regimen: Regimen, afp?: AfpEntidad | null): string {
  if (regimen === 'ONP') return 'ONP';
  return afp ? `AFP ${afp}` : 'AFP';
}
