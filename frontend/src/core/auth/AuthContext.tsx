import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ApiError } from '../../shared/infrastructure/http/apiClient';
import { loginApi } from './authApi';
import { borrarSesion, guardarSesion, leerSesion, registrarLectorToken, type RolUsuario } from './authStorage';

export const USUARIO_ADMIN_INICIAL = 'jesus.pantoja';

interface AuthContextValue {
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  rol: RolUsuario | null;
  login: (usuario: string, password: string) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState(() => leerSesion());

  useEffect(() => {
    registrarLectorToken(() => sesion?.token ?? null);
  }, [sesion]);

  const login = useCallback(async (usuario: string, password: string) => {
    try {
      const data = await loginApi(usuario.trim(), password);
      const guardada = { token: data.token, id: data.id, usuario: data.usuario, rol: data.rol };
      guardarSesion(guardada);
      setSesion(guardada);
      return { ok: true as const };
    } catch (error) {
      if (error instanceof ApiError) {
        return { ok: false as const, message: error.message };
      }
      return { ok: false as const, message: 'No se pudo conectar con el servidor. ¿Está encendido el backend?' };
    }
  }, []);

  const logout = useCallback(() => {
    borrarSesion();
    setSesion(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: sesion != null,
      userId: sesion?.id ?? null,
      userEmail: sesion?.usuario ?? null,
      rol: sesion?.rol ?? null,
      login,
      logout,
    }),
    [sesion, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
