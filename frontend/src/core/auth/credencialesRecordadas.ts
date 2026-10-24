const CLAVE = 'nomina_login_recordar';

export interface CredencialesRecordadas {
  usuario: string;
  password: string;
}

export function leerCredencialesRecordadas(): CredencialesRecordadas | null {
  try {
    const raw = localStorage.getItem(CLAVE);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<CredencialesRecordadas>;
    if (typeof data.usuario !== 'string' || typeof data.password !== 'string') return null;
    if (!data.usuario || !data.password) return null;
    return { usuario: data.usuario, password: data.password };
  } catch {
    return null;
  }
}

export function guardarCredencialesRecordadas(usuario: string, password: string): void {
  const credenciales: CredencialesRecordadas = { usuario, password };
  localStorage.setItem(CLAVE, JSON.stringify(credenciales));
}

export function borrarCredencialesRecordadas(): void {
  localStorage.removeItem(CLAVE);
}
