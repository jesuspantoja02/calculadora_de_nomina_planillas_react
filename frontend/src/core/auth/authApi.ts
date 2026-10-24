import { apiPost } from '../../shared/infrastructure/http/apiClient';
import type { RolUsuario } from './roles';

export interface SesionApi {
  token: string;
  id: string;
  usuario: string;
  rol: RolUsuario;
}

export async function loginApi(usuario: string, password: string): Promise<SesionApi> {
  return apiPost<SesionApi>('/auth/login', { usuario, password });
}
