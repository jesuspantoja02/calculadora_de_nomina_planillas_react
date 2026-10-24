import { apiDelete, apiGet, apiPost, apiPut } from '../../../shared/infrastructure/http/apiClient';
import type { Empleado, EmpleadoDto, FiltroEmpleados } from '../domain/empleado.model';
import type { EmpleadosRepository } from '../domain/empleados.repository';

/** Adaptador HTTP que implementa el puerto EmpleadosRepository (Fetch API). */
export class HttpEmpleadosRepository implements EmpleadosRepository {
  listar(filtro: FiltroEmpleados = {}): Promise<Empleado[]> {
    return apiGet<Empleado[]>('/empleados', filtro as Record<string, string | number | undefined>);
  }

  crear(dto: EmpleadoDto): Promise<Empleado> {
    return apiPost<Empleado>('/empleados', dto);
  }

  actualizar(id: string, dto: EmpleadoDto): Promise<Empleado> {
    return apiPut<Empleado>(`/empleados/${id}`, dto);
  }

  eliminar(id: string): Promise<true> {
    return apiDelete(`/empleados/${id}`);
  }
}
