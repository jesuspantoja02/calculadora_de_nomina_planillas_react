import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { aplicarTemaDom, guardarTema, leerTema, type TemaApp } from './themeStorage';

interface ThemeContextValue {
  tema: TemaApp;
  alternarTema: (origen?: { x: number; y: number }) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function cambiarTemaConTransicion(siguiente: TemaApp, origen?: { x: number; y: number }) {
  const aplicar = () => {
    guardarTema(siguiente);
    aplicarTemaDom(siguiente);
  };

  const puedeVt =
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    typeof (document as Document & { startViewTransition?: (cb: () => void) => unknown }).startViewTransition ===
      'function';

  if (!puedeVt) {
    aplicar();
    return;
  }

  const root = document.documentElement;
  if (origen) {
    const maxX = Math.max(origen.x, window.innerWidth - origen.x);
    const maxY = Math.max(origen.y, window.innerHeight - origen.y);
    const r = Math.hypot(maxX, maxY);
    root.style.setProperty('--theme-switch-x', `${origen.x}px`);
    root.style.setProperty('--theme-switch-y', `${origen.y}px`);
    root.style.setProperty('--theme-switch-r', `${r}px`);
  }

  const doc = document as Document & { startViewTransition: (cb: () => void) => { finished: Promise<void> } };
  void doc.startViewTransition(() => {
    aplicar();
  }).finished.finally(() => {
    root.style.removeProperty('--theme-switch-x');
    root.style.removeProperty('--theme-switch-y');
    root.style.removeProperty('--theme-switch-r');
  });
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<TemaApp>(() => leerTema());

  useEffect(() => {
    aplicarTemaDom(tema);
  }, [tema]);

  const alternarTema = useCallback((origen?: { x: number; y: number }) => {
    const siguiente: TemaApp = tema === 'light' ? 'dark' : 'light';
    cambiarTemaConTransicion(siguiente, origen);
    setTema(siguiente);
  }, [tema]);

  const value = useMemo(() => ({ tema, alternarTema }), [tema, alternarTema]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
