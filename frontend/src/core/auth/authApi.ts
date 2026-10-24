import { ApiError, apiGet, apiPost, mensajeDeError } from '../../shared/infrastructure/http/apiClient';
import { environment } from '../../config/environment';
import { obtenerTokenAuth } from './authStorage';
import type { RolUsuario } from './roles';

export interface SesionApi {
  token: string;
  id: string;
  usuario: string;
  rol: RolUsuario;
}

export interface PerfilApi {
  id: string;
  usuario: string;
  rol: RolUsuario;
  creadoEn: string;
}

export async function loginApi(usuario: string, password: string): Promise<SesionApi> {
  return apiPost<SesionApi>('/auth/login', { usuario, password });
}

export async function fetchPerfilApi(): Promise<PerfilApi> {
  return apiGet<PerfilApi>('/auth/me');
}

export async function cambiarPasswordApi(passwordActual: string, passwordNueva: string): Promise<void> {
  const token = obtenerTokenAuth();
  const res = await fetch(`${environment.apiUrl}/auth/cambiar-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ passwordActual, passwordNueva }),
  });
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* vacío */
    }
    throw new ApiError(res.status, mensajeDeError(res.status, body));
  }
}
