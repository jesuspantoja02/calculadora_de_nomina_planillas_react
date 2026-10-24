import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Icon } from '../../shared/ui/Icon';
import { WelcomePanel } from './WelcomePanel';
import { Sidebar } from './Sidebar';

export function Shell() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();
  const enCartilla = location.pathname === '/';

  return (
    <div className="shell">
      <button type="button" className="menu-btn no-print" aria-label="Abrir menú" onClick={() => setMenuAbierto(true)}>
        <Icon nombre="menu" tamano={20} />
      </button>
      <div
        className={`sidebar-backdrop no-print${menuAbierto ? ' abierto' : ''}`}
        onClick={() => setMenuAbierto(false)}
        onKeyDown={undefined}
        role="presentation"
      />

      <Sidebar abierto={menuAbierto} onNavegar={() => setMenuAbierto(false)} />

      <main className={`main${enCartilla ? ' main--cartilla' : ''}`}>
        {enCartilla ? (
          <WelcomePanel />
        ) : (
          <div className="view">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}
