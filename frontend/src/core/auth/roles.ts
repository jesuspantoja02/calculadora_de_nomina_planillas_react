export const ROLES_USUARIO = ['admin', 'jefe', 'gerente', 'usuario'] as const;
export type RolUsuario = (typeof ROLES_USUARIO)[number];

export function esGestor(rol: RolUsuario | null | undefined): boolean {
  return rol === 'admin' || rol === 'jefe' || rol === 'gerente';
}

export function esAdmin(rol: RolUsuario | null | undefined): boolean {
  return rol === 'admin';
}

export function etiquetaRol(rol: RolUsuario): string {
  switch (rol) {
    case 'admin':
      return 'Administrador';
    case 'jefe':
      return 'Jefe';
    case 'gerente':
      return 'Gerente';
    case 'usuario':
      return 'Usuario';
  }
}
