import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { esAdmin, esGestor, etiquetaRol } from '../auth/roles';
import { ThemeToggle } from '../theme/ThemeToggle';
import { BrandLogo } from '../../shared/ui/BrandLogo';
import { Icon, type NombreIcono } from '../../shared/ui/Icon';
import { ProfileSheet } from './ProfileSheet';

interface ItemNav {
  ruta: string;
  etiqueta: string;
  icono: NombreIcono;
}

const operacion: ItemNav[] = [
  { ruta: '/empleados', etiqueta: 'Empleados', icono: 'users' },
  { ruta: '/planilla/procesar-pago', etiqueta: 'Procesar pago', icono: 'wallet' },
  { ruta: '/planilla/boletas', etiqueta: 'Boletas de pago', icono: 'file' },
  { ruta: '/dashboard', etiqueta: 'Dashboard', icono: 'chart' },
];

const sistemaBase: ItemNav[] = [{ ruta: '/configuracion', etiqueta: 'Configuración', icono: 'sliders' }];

function itemUsuarios(rol: ReturnType<typeof useAuth>['rol']): ItemNav[] {
  if (!esGestor(rol)) return [];
  if (esAdmin(rol)) {
    return [{ ruta: '/usuarios', etiqueta: 'Usuarios del sistema', icono: 'shield' }];
  }
  return [{ ruta: '/usuarios', etiqueta: 'Agregar nuevo usuario', icono: 'user-plus' }];
}

interface SidebarProps {
  abierto: boolean;
  onNavegar: () => void;
}

function irInicio(navigate: ReturnType<typeof useNavigate>, onNavegar: () => void) {
  onNavegar();
  navigate('/');
}

export function Sidebar({ abierto, onNavegar }: SidebarProps) {
  const { logout, userEmail, rol } = useAuth();
  const navigate = useNavigate();
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [navFadeAbajo, setNavFadeAbajo] = useState(false);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const sistema = [...itemUsuarios(rol), ...sistemaBase];

  useEffect(() => {
    const el = navScrollRef.current;
    if (!el) return;

    const actualizarFade = () => {
      const hayMas = el.scrollHeight > el.clientHeight + 2;
      const alFinal = el.scrollTop + el.clientHeight >= el.scrollHeight - 6;
      setNavFadeAbajo(hayMas && !alFinal);
    };

    actualizarFade();
    const observer = new ResizeObserver(actualizarFade);
    observer.observe(el);
    el.addEventListener('scroll', actualizarFade, { passive: true });
    window.addEventListener('resize', actualizarFade);

    return () => {
      observer.disconnect();
      el.removeEventListener('scroll', actualizarFade);
      window.removeEventListener('resize', actualizarFade);
    };
  }, [sistema.length, rol]);

  const cerrarSesion = () => {
    logout();
    onNavegar();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <aside className={`sidebar no-print ${abierto ? 'abierto' : ''}`}>
        <div className="sidebar-brand-row">
          <button
            type="button"
            className="brand brand--home"
            onClick={() => irInicio(navigate, onNavegar)}
            aria-label="Ir al inicio — Planilla Nómina Perú"
          >
            <BrandLogo variant="lockup" size={40} />
          </button>
          <ThemeToggle compact />
        </div>

        <div className={`sidebar-nav-wrap${navFadeAbajo ? ' sidebar-nav-wrap--fade' : ''}`}>
          <div className="sidebar-nav-scroll" ref={navScrollRef}>
          <nav className="nav" aria-label="Navegación principal">
          <div className="nav-group">
            <p className="nav-label">Operación</p>
            <div className="nav-group__items">
              {operacion.map((item) => (
                <NavLink
                  key={item.ruta}
                  to={item.ruta}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  onClick={onNavegar}
                >
                  <span className="nav-icon">
                    <Icon nombre={item.icono} tamano={18} />
                  </span>
                  <span className="nav-item__label">{item.etiqueta}</span>
                </NavLink>
              ))}
            </div>
          </div>

          <div className="nav-divider" role="presentation" aria-hidden="true" />

          <div className="nav-group">
            <p className="nav-label">Sistema</p>
            <div className="nav-group__items">
              {sistema.map((item) => (
                <NavLink
                  key={item.ruta}
                  to={item.ruta}
                  className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                  onClick={onNavegar}
                >
                  <span className="nav-icon">
                    <Icon nombre={item.icono} tamano={18} />
                  </span>
                  <span className="nav-item__label">{item.etiqueta}</span>
                </NavLink>
              ))}
            </div>
          </div>
          </nav>
          </div>
        </div>

        <div className="sidebar-divider" role="presentation" aria-hidden="true" />

        <div className="sidebar-foot">
          {userEmail ? (
            <>
              <button
                type="button"
                className="sidebar-profile-btn"
                onClick={() => setPerfilAbierto(true)}
                aria-label="Ver mi perfil"
              >
                <span className="sidebar-profile-btn__avatar">
                  <Icon nombre="user" tamano={18} />
                </span>
                <span className="sidebar-profile-btn__meta">
                  <span className="sidebar-profile-btn__name">{userEmail}</span>
                  {rol ? <span className={`sidebar-role sidebar-role--${rol}`}>{etiquetaRol(rol)}</span> : null}
                </span>
              </button>
            </>
          ) : null}
          <button type="button" className="sidebar-logout" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
          <span className="sidebar-foot-note">Ley laboral · AFP, ONP, quinta</span>
        </div>
      </aside>

      <ProfileSheet abierto={perfilAbierto} onCerrar={() => setPerfilAbierto(false)} />
    </>
  );
}
