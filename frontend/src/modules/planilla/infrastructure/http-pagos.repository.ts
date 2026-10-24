import { apiDelete, apiGet, apiPost } from '../../../shared/infrastructure/http/apiClient';
import type { Boleta, FiltroPagos, Pago, PagoDto } from '../domain/pago.model';
import type { PagosRepository } from '../domain/pagos.repository';

export class HttpPagosRepository implements PagosRepository {
  listar(filtro: FiltroPagos = {}): Promise<Pago[]> {
    return apiGet<Pago[]>('/pagos', filtro as Record<string, string | number | undefined>);
  }

  simular(dto: PagoDto): Promise<Boleta> {
    return apiPost<Boleta>('/pagos/simular', dto);
  }

  emitir(dto: PagoDto): Promise<Pago> {
    return apiPost<Pago>('/pagos', dto);
  }

  eliminar(id: string): Promise<true> {
    return apiDelete(`/pagos/${id}`);
  }
}
