import type { Empleado, EmpleadoDto, FiltroEmpleados } from './empleado.model';

/** Puerto de salida: persistencia de empleados vía API REST. */
export interface EmpleadosRepository {
  listar(filtro?: FiltroEmpleados): Promise<Empleado[]>;
  crear(dto: EmpleadoDto): Promise<Empleado>;
  actualizar(id: string, dto: EmpleadoDto): Promise<Empleado>;
  eliminar(id: string): Promise<true>;
}
