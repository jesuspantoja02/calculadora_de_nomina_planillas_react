import type { AfpEntidad, Regimen } from './models/tipos';

export function etiquetaSistemaPensiones(regimen: Regimen, afp?: AfpEntidad | null): string {
  if (regimen === 'ONP') return 'ONP';
  return afp ? `AFP ${afp}` : 'AFP';
}

/** Colores del gráfico de distribución por administradora. */
export function colorDistribucionPension(id: string): string {
  const map: Record<string, string> = {
    onp: 'var(--chart-onp)',
    'afp-integra': 'var(--chart-afp)',
    'afp-prima': 'var(--chart-afp-prima)',
    'afp-profuturo': '#4f46e5',
    'afp-habitat': 'var(--brand-secondary)',
    'afp-pendiente': '#94a3b8',
  };
  return map[id] ?? 'var(--chart-afp)';
}
