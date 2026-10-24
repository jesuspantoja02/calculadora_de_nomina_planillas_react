import type { Boleta, FiltroPagos, Pago, PagoDto } from '../domain/pago.model';
import type { PagosRepository } from '../domain/pagos.repository';

export class PagosService {
  constructor(private readonly repository: PagosRepository) {}

  listar(filtro: FiltroPagos = {}): Promise<Pago[]> {
    return this.repository.listar(filtro);
  }

  simular(dto: PagoDto): Promise<Boleta> {
    return this.repository.simular(dto);
  }

  emitir(dto: PagoDto): Promise<Pago> {
    return this.repository.emitir(dto);
  }

  eliminar(id: string): Promise<true> {
    return this.repository.eliminar(id);
  }
}
