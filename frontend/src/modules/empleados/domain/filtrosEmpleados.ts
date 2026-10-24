import type { FiltroEmpleados } from './empleado.model';

export function filtrosEmpleadosIguales(a: FiltroEmpleados, b: FiltroEmpleados): boolean {
  return (
    a.cargo === b.cargo &&
    a.regimen === b.regimen &&
    a.afp === b.afp &&
    a.min === b.min &&
    a.max === b.max
  );
}
