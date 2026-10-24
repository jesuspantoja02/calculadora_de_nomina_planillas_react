export type TemaApp = 'light' | 'dark';

const THEME_KEY = 'nomina_theme';

export function leerTema(): TemaApp {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function guardarTema(tema: TemaApp): void {
  try {
    localStorage.setItem(THEME_KEY, tema);
  } catch {
    /* ignore */
  }
}

export function aplicarTemaDom(tema: TemaApp): void {
  const root = document.documentElement;
  root.setAttribute('data-theme', tema);
  root.setAttribute('data-bs-theme', tema);
}
