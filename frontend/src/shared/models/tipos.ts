export const CARGOS = ['Desarrollador', 'Diseñador', 'Analista', 'Almacenero', 'Supervisor', 'Administrativo'] as const;
export const AFP_ENTIDADES = ['Integra', 'Prima', 'Profuturo', 'Habitat'] as const;
export type Regimen = 'AFP' | 'ONP';
export type AfpEntidad = (typeof AFP_ENTIDADES)[number];

export interface ApiResponse<T> {
  data: T;
}
