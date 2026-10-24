import { useRef } from 'react';
import { useTheme } from './ThemeContext';

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { tema, alternarTema } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);

  const onClick = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    const origen = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    alternarTema(origen);
  };

  const esOscuro = tema === 'dark';
  const etiqueta = esOscuro ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

  return (
    <button
      ref={btnRef}
      type="button"
      className={`theme-toggle${compact ? ' theme-toggle--compact' : ''}`}
      onClick={onClick}
      aria-label={etiqueta}
      title={etiqueta}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className={`theme-toggle__thumb${esOscuro ? ' theme-toggle__thumb--dark' : ''}`}>
          <svg className="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
          <svg className="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        </span>
      </span>
      {!compact ? <span className="theme-toggle__label">{esOscuro ? 'Modo claro' : 'Modo oscuro'}</span> : null}
    </button>
  );
}
