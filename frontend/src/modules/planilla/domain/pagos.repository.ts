import type { Boleta, FiltroPagos, Pago, PagoDto } from './pago.model';

export interface PagosRepository {
  listar(filtro?: FiltroPagos): Promise<Pago[]>;
  simular(dto: PagoDto): Promise<Boleta>;
  emitir(dto: PagoDto): Promise<Pago>;
  eliminar(id: string): Promise<true>;
}
