export const DNI_REGEX = /^\d{8}$/;
export const NOMBRE_REGEX = /^[\p{L}][\p{L} .'-]{2,59}$/u;

const aNumero = (valor: unknown): number | null => {
  if (valor === null || valor === undefined || valor === '') return null;
  const n = Number(valor);
  return Number.isFinite(n) ? n : null;
};

/** Validación de grupo: el mínimo no puede superar al máximo. */
export function rangoSalarialInvalido(min: unknown, max: unknown): boolean {
  const minN = aNumero(min);
  const maxN = aNumero(max);
  return minN !== null && maxN !== null && minN > maxN;
}

export type TipoEntrada = 'dni' | 'ruc' | 'nombre' | 'empresa' | 'busqueda' | 'decimal' | 'entero';

export interface LimitesEntrada {
  max?: number;
  decimales?: number;
  min?: number;
}

const TEXTO: Record<'nombre' | 'empresa' | 'busqueda', RegExp> = {
  nombre: /^$|^[\p{L}][\p{L} .'-]*$/u,
  empresa: /^$|^[\p{L}\p{N}][\p{L}\p{N} .,&'-]*$/u,
  busqueda: /^[\p{L}\p{N} ]*$/u,
};

export function entradaValida(tipo: TipoEntrada, valor: string, limites: LimitesEntrada = {}): boolean {
  if (valor === '') return true;
  if (tipo === 'dni') return /^\d{1,8}$/.test(valor);
  if (tipo === 'ruc') return /^\d{1,11}$/.test(valor);
  if (tipo === 'nombre' || tipo === 'empresa' || tipo === 'busqueda') {
    return valor.length <= 60 && TEXTO[tipo].test(valor);
  }
  const decimales = limites.decimales ?? (tipo === 'entero' ? 0 : 2);
  const patron = decimales === 0 ? /^\d+$/ : new RegExp(`^\\d+(\\.\\d{0,${decimales}})?$|^\\d+\\.$`);
  if (!patron.test(valor) || valor === '.') return false;
  if (valor.endsWith('.')) return true;
  const n = Number(valor);
  if (!Number.isFinite(n)) return false;
  if (limites.min !== undefined && n < limites.min) return false;
  if (limites.max !== undefined && n > limites.max) return false;
  return true;
}

export function filtrarEntrada(tipo: TipoEntrada, valor: string, limites: LimitesEntrada = {}): string {
  let out = '';
  for (const ch of valor.replace(/,/g, '.')) {
    const next = out + ch;
    if (entradaValida(tipo, next, limites)) out = next;
  }
  return out;
}

export function claseValidacion(valid: boolean, invalid: boolean, touched: boolean, dirty: boolean): string {
  if (invalid && (touched || dirty)) return 'is-invalid';
  if (valid && dirty) return 'is-valid';
  return '';
}

export function dniValido(dni: string): boolean {
  return DNI_REGEX.test(dni);
}

export function nombreValido(nombre: string): boolean {
  return NOMBRE_REGEX.test(nombre);
}
