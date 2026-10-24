import type { Modalidad } from '../../modules/planilla/domain/pago.model';

const moneda = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const fecha = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });

const porcentaje = new Intl.NumberFormat('es-PE', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function formatoMoneda(valor: number): string {
  return moneda.format(valor);
}

export function formatoFecha(iso: string): string {
  return fecha.format(new Date(iso + (iso.length === 10 ? 'T12:00:00' : '')));
}

export function formatoPorcentaje(ratio: number): string {
  return porcentaje.format(ratio);
}

export function enmascararDni(dni: string | null | undefined): string {
  const v = dni ?? '';
  return v.length === 8 ? `${v.slice(0, 2)}****${v.slice(-2)}` : v;
}

export function iniciales(valor: string | null | undefined): string {
  return (valor ?? '')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

const HUES_PERSONA = [210, 270, 330, 30, 90, 150, 180, 240];

/** Tinte estable por nombre para avatares (identidad, no dato). */
export function tintePersona(
  nombre: string,
  tema: 'light' | 'dark' = 'light',
): { fondo: string; texto: string } {
  let i = 0;
  for (const c of nombre.trim()) i = (i * 31 + c.charCodeAt(0)) >>> 0;
  const hue = HUES_PERSONA[i % HUES_PERSONA.length];
  if (tema === 'dark') {
    return { fondo: `hsl(${hue} 38% 24%)`, texto: `hsl(${hue} 52% 82%)` };
  }
  return { fondo: `hsl(${hue} 42% 92%)`, texto: `hsl(${hue} 32% 28%)` };
}

export function tituloPalabras(texto: string): string {
  return texto
    .toLowerCase()
    .split(/\s+/)
    .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1) : ''))
    .join(' ');
}

const ETIQUETAS_MODALIDAD: Record<Modalidad, string> = {
  Mensual: 'Pago fin de mes',
  Quincena: 'Adelanto quincenal',
  Gratificacion: 'Gratificación',
  CTS: 'CTS',
};

export function modalidadLabel(valor: Modalidad): string {
  return ETIQUETAS_MODALIDAD[valor] ?? valor;
}
