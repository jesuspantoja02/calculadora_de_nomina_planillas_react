import { AFP_ENTIDADES } from '../../../shared/config/catalogos.ts';
import { etiquetaSistemaPensiones } from '../../../shared/utils/pensiones.ts';
import type { ConfiguracionRepository } from '../../configuracion/domain/configuracion.repository.ts';
import type { Empleado } from '../../empleados/domain/empleado.ts';
import type { EmpleadoRepository } from '../../empleados/domain/empleado.repository.ts';
import { estimarMensual, redondear } from '../../planilla/domain/calculo-planilla.ts';
import type { PagoRepository } from '../../planilla/domain/pago.repository.ts';

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

function distribucionDe(filas: Pick<Empleado, 'regimen' | 'afp'>[]): DistribucionPensionItem[] {
  const items: DistribucionPensionItem[] = [];
  const onp = filas.filter((f) => f.regimen === 'ONP').length;
  if (onp > 0) items.push({ id: 'onp', etiqueta: 'ONP', cantidad: onp });

  for (const ent of AFP_ENTIDADES) {
    const n = filas.filter((f) => f.regimen === 'AFP' && f.afp === ent).length;
    if (n > 0) {
      items.push({
        id: `afp-${ent.toLowerCase()}`,
        etiqueta: etiquetaSistemaPensiones('AFP', ent),
        cantidad: n,
      });
    }
  }

  const pendiente = filas.filter((f) => f.regimen === 'AFP' && f.afp == null).length;
  if (pendiente > 0) {
    items.push({ id: 'afp-pendiente', etiqueta: 'AFP (sin administradora)', cantidad: pendiente });
  }

  return items;
}

export class DashboardService {
  #empleados: EmpleadoRepository;
  #pagos: PagoRepository;
  #config: ConfiguracionRepository;

  constructor(empleados: EmpleadoRepository, pagos: PagoRepository, config: ConfiguracionRepository) {
    this.#empleados = empleados;
    this.#pagos = pagos;
    this.#config = config;
  }

  async resumen(): Promise<ResumenDashboard> {
    const [empleados, config, totalBoletas] = await Promise.all([
      this.#empleados.listar({}),
      this.#config.obtener(),
      this.#pagos.contar(),
    ]);
    const filas = empleados.map((e) => ({ ...e, ...estimarMensual(e, config) }));
    const total = filas.length;
    const suma = (fn: (f: (typeof filas)[number]) => number) => redondear(filas.reduce((a, f) => a + fn(f), 0));

    const aEmpleadoConNeto = (f: (typeof filas)[number]): EmpleadoConNeto => {
      const { asignacionFamiliar: _a, bruto: _b, pension: _p, quintaCategoria: _q, essaludEmpleador: _e, total: _t, ...resto } = f;
      return resto;
    };
    const ordenados = [...filas].sort((a, b) => b.neto - a.neto);
    const mayor = ordenados[0];
    const menor = ordenados[ordenados.length - 1];

    return {
      totalEmpleados: total,
      totalBoletas,
      totales: { bruto: suma((f) => f.bruto), descuentos: suma((f) => f.total), neto: suma((f) => f.neto) },
      distribucionPension: distribucionDe(filas),
      mayorSueldo: mayor ? aEmpleadoConNeto(mayor) : null,
      menorSueldo: menor ? aEmpleadoConNeto(menor) : null,
    };
  }
}
