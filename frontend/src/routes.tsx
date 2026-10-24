import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from './core/auth/RequireAuth';
import { RequireGestor } from './core/auth/RequireGestor';
import { Shell } from './core/layout/Shell';
import { LoginPage } from './core/pages/LoginPage';
import { NotFoundPage } from './core/pages/NotFoundPage';

const EmpleadosPage = lazy(() =>
  import('./modules/empleados/presentation/pages/EmpleadosPage').then((m) => ({ default: m.EmpleadosPage })),
);
const ProcesarPagoPage = lazy(() =>
  import('./modules/planilla/presentation/pages/ProcesarPagoPage').then((m) => ({ default: m.ProcesarPagoPage })),
);
const BoletasPage = lazy(() =>
  import('./modules/planilla/presentation/pages/BoletasPage').then((m) => ({ default: m.BoletasPage })),
);
const DashboardPage = lazy(() =>
  import('./modules/dashboard/presentation/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })),
);
const ConfiguracionPage = lazy(() =>
  import('./modules/configuracion/presentation/pages/ConfiguracionPage').then((m) => ({ default: m.ConfiguracionPage })),
);
const UsuariosPage = lazy(() =>
  import('./modules/usuarios/presentation/pages/UsuariosPage').then((m) => ({ default: m.UsuariosPage })),
);

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <RequireAuth />,
    children: [
      {
        element: <Shell />,
        children: [
          { index: true, element: null },
          { path: 'empleados', element: <EmpleadosPage /> },
          { path: 'planilla/procesar-pago', element: <ProcesarPagoPage /> },
          { path: 'planilla/boletas', element: <BoletasPage /> },
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'configuracion', element: <ConfiguracionPage /> },
          {
            element: <RequireGestor />,
            children: [{ path: 'usuarios', element: <UsuariosPage /> }],
          },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
]);
