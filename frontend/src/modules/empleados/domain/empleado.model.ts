import type { AfpEntidad, Regimen } from '../../../shared/models/tipos';

export interface HijoEmpleado {
  nombre: string;
  edad: number;
}

export interface Empleado {
  id: string;
  dni: string;
  nombre: string;
  cargo: string;
  sueldoBase: number;
  regimen: Regimen;
  afp: AfpEntidad | null;
  tieneHijos: boolean;
  hijos: HijoEmpleado[];
  creadoEn: string;
  actualizadoEn: string;
}

export type EmpleadoDto = Pick<
  Empleado,
  'dni' | 'nombre' | 'cargo' | 'sueldoBase' | 'regimen' | 'afp' | 'tieneHijos' | 'hijos'
>;

export interface FiltroEmpleados {
  cargo?: string;
  regimen?: Regimen;
  afp?: AfpEntidad;
  min?: number;
  max?: number;
}
