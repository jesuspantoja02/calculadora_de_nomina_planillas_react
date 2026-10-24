import { Navigate, Outlet } from 'react-router-dom';
import { esGestor } from './roles';
import { useAuth } from './AuthContext';

export function RequireGestor() {
  const { rol } = useAuth();

  if (!esGestor(rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
