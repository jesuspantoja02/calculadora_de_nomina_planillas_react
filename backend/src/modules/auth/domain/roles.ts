export const ROLES_USUARIO = ['admin', 'jefe', 'gerente', 'usuario'] as const;
export type RolUsuario = (typeof ROLES_USUARIO)[number];

export const ROLES_GESTOR: readonly RolUsuario[] = ['admin', 'jefe', 'gerente'];

export function esGestor(rol: RolUsuario): boolean {
  return rol === 'admin' || rol === 'jefe' || rol === 'gerente';
}

/** Quién puede asignar cada rol al crear o editar cuentas. */
export function puedeAsignarRol(actor: RolUsuario, objetivo: RolUsuario): boolean {
  if (actor === 'admin') return true;
  if (actor === 'gerente') return objetivo === 'jefe' || objetivo === 'usuario';
  if (actor === 'jefe') return objetivo === 'usuario';
  return false;
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
