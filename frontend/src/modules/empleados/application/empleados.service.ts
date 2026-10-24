import type { Empleado, EmpleadoDto, FiltroEmpleados } from '../domain/empleado.model';
import type { EmpleadosRepository } from '../domain/empleados.repository';

/** Casos de uso del módulo empleados (sin React ni fetch). */
export class EmpleadosService {
  constructor(private readonly repository: EmpleadosRepository) {}

  listar(filtro: FiltroEmpleados = {}): Promise<Empleado[]> {
    return this.repository.listar(filtro);
  }

  crear(dto: EmpleadoDto): Promise<Empleado> {
    return this.repository.crear(dto);
  }

  actualizar(id: string, dto: EmpleadoDto): Promise<Empleado> {
    return this.repository.actualizar(id, dto);
  }

  eliminar(id: string): Promise<true> {
    return this.repository.eliminar(id);
  }
}
