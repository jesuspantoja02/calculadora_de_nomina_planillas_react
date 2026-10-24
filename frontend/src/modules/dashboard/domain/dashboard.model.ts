import type { Empleado } from '../../empleados/domain/empleado.model';

export type EmpleadoConNeto = Empleado & { neto: number };

export interface DistribucionPensionItem {
  id: string;
  etiqueta: string;
  cantidad: number;
}

export interface ResumenDashboard {
  totalEmpleados: number;
  totalBoletas: number;
  totales: { bruto: number; descuentos: number; neto: number };
  distribucionPension: DistribucionPensionItem[];
  mayorSueldo: EmpleadoConNeto | null;
  menorSueldo: EmpleadoConNeto | null;
}
