import { obtenerTokenAuth } from '../../../core/auth/authStorage';
import { environment } from '../../../config/environment';
import type { ApiResponse } from '../../models/tipos';

function encabezadosJson(): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const token = obtenerTokenAuth();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function encabezadosAuth(): HeadersInit {
  const token = obtenerTokenAuth();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

interface CuerpoError {
  error?: { message?: string; details?: { campo: string; mensaje: string }[] };
}

export function mensajeDeError(status: number, cuerpo: unknown): string {
  if (status === 0) return 'No se pudo conectar con el servidor. ¿Está encendido el backend?';
  const body = cuerpo as CuerpoError | null;
  const detalles = body?.error?.details;
  if (Array.isArray(detalles) && detalles.length > 0) {
    return detalles.map((d) => `${d.campo}: ${d.mensaje}`).join(' · ');
  }
  return body?.error?.message ?? `Error inesperado (${status}).`;
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function paramsDe(obj: Record<string, string | number | undefined>): string {
  const q = new URLSearchParams();
  for (const [clave, valor] of Object.entries(obj)) {
    if (valor !== undefined && valor !== null && valor !== '') q.set(clave, String(valor));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export async function apiGet<T>(path: string, query: Record<string, string | number | undefined> = {}): Promise<T> {
  const res = await fetch(`${environment.apiUrl}${path}${paramsDe(query)}`, { headers: encabezadosAuth() });
  if (!res.ok) {
    let body: unknown = null;
    try {
      body = await res.json();
    } catch {
      /* cuerpo vacío */
    }
    throw new ApiError(res.status, mensajeDeError(res.status, body));
  }
  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${environment.apiUrl}${path}`, {
    method: 'POST',
    headers: encabezadosJson(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errBody: unknown = null;
    try {
      errBody = await res.json();
    } catch {
      /* cuerpo vacío */
    }
    throw new ApiError(res.status, mensajeDeError(res.status, errBody));
  }
  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}

export async function apiPut<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${environment.apiUrl}${path}`, {
    method: 'PUT',
    headers: encabezadosJson(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let errBody: unknown = null;
    try {
      errBody = await res.json();
    } catch {
      /* cuerpo vacío */
    }
    throw new ApiError(res.status, mensajeDeError(res.status, errBody));
  }
  const json = (await res.json()) as ApiResponse<T>;
  return json.data;
}

export async function apiDelete(path: string): Promise<true> {
  const res = await fetch(`${environment.apiUrl}${path}`, { method: 'DELETE', headers: encabezadosAuth() });
  if (!res.ok && res.status !== 204) {
    let errBody: unknown = null;
    try {
      errBody = await res.json();
    } catch {
      /* cuerpo vacío */
    }
    throw new ApiError(res.status, mensajeDeError(res.status, errBody));
  }
  return true;
}
