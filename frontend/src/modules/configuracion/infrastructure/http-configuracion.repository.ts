import { apiDelete, apiGet, apiPut } from '../../../shared/infrastructure/http/apiClient';
import type { Configuracion } from '../domain/configuracion.model';
import type { ConfiguracionRepository } from '../domain/configuracion.repository';

export class HttpConfiguracionRepository implements ConfiguracionRepository {
  obtener(): Promise<Configuracion> {
    return apiGet<Configuracion>('/configuracion');
  }

  actualizar(config: Configuracion): Promise<Configuracion> {
    return apiPut<Configuracion>('/configuracion', config);
  }

  reiniciarDatos(): Promise<true> {
    return apiDelete('/datos');
  }
}
