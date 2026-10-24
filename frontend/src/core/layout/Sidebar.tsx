import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { esGestor, etiquetaRol } from '../auth/roles';
import { ThemeToggle } from '../theme/ThemeToggle';
import { BrandLogo } from '../../shared/ui/BrandLogo';
import { Icon, type NombreIcono } from '../../shared/ui/Icon';

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
const sistemaGestor: ItemNav[] = [{ ruta: '/usuarios', etiqueta: 'Usuarios del sistema', icono: 'shield' }];

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
  const sistema = esGestor(rol) ? [...sistemaGestor, ...sistemaBase] : sistemaBase;

  const cerrarSesion = () => {
    logout();
    onNavegar();
    navigate('/login', { replace: true });
  };

  return (
    <aside className={`sidebar no-print ${abierto ? 'abierto' : ''}`}>
      <button
        type="button"
        className="brand brand--home"
        onClick={() => irInicio(navigate, onNavegar)}
        aria-label="Ir al inicio — Planilla Nómina Perú"
      >
        <BrandLogo variant="lockup" size={40} />
      </button>

      <div className="sidebar-nav-wrap">
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
                {item.etiqueta}
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
                {item.etiqueta}
              </NavLink>
            ))}
          </div>
        </div>
        </nav>
      </div>

      <div className="sidebar-divider" role="presentation" aria-hidden="true" />

      <div className="sidebar-foot">
        <ThemeToggle />
        {userEmail ? (
          <div className="sidebar-session">
            <span className="sidebar-user" title={userEmail}>{userEmail}</span>
            {rol ? <span className={`sidebar-role sidebar-role--${rol}`}>{etiquetaRol(rol)}</span> : null}
          </div>
        ) : null}
        <button type="button" className="sidebar-logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
        <span className="sidebar-foot-note">Ley laboral · AFP, ONP, quinta</span>
      </div>
    </aside>
  );
}
