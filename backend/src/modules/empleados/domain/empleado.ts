export type Regimen = 'AFP' | 'ONP';

export type AfpEntidad = 'Integra' | 'Prima' | 'Profuturo' | 'Habitat';

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

export interface FiltroEmpleados {
  cargo?: string | undefined;
  regimen?: Regimen | undefined;
  afp?: AfpEntidad | undefined;
  min?: number | undefined;
  max?: number | undefined;
}
