import type { Configuracion } from '../domain/configuracion.model';
import type { ConfiguracionRepository } from '../domain/configuracion.repository';

export class ConfiguracionService {
  constructor(private readonly repository: ConfiguracionRepository) {}

  obtener(): Promise<Configuracion> {
    return this.repository.obtener();
  }

  actualizar(config: Configuracion): Promise<Configuracion> {
    return this.repository.actualizar(config);
  }

  reiniciarDatos(): Promise<true> {
    return this.repository.reiniciarDatos();
  }
}
