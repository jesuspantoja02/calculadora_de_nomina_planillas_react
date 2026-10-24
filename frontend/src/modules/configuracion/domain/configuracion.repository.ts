import type { Configuracion } from './configuracion.model';

export interface ConfiguracionRepository {
  obtener(): Promise<Configuracion>;
  actualizar(config: Configuracion): Promise<Configuracion>;
  reiniciarDatos(): Promise<true>;
}
