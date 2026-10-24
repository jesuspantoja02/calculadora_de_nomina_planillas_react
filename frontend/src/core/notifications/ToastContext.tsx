import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

export interface Toast {
  id: number;
  tipo: 'ok' | 'error';
  texto: string;
}

interface ToastContextValue {
  toasts: Toast[];
  exito: (texto: string) => void;
  error: (texto: string) => void;
  cerrar: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const siguienteId = useRef(0);

  const cerrar = useCallback((id: number) => {
    setToasts((lista) => lista.filter((t) => t.id !== id));
  }, []);

  const agregar = useCallback(
    (tipo: Toast['tipo'], texto: string) => {
      const id = ++siguienteId.current;
      setToasts((lista) => [...lista, { id, tipo, texto }]);
      window.setTimeout(() => cerrar(id), 5000);
    },
    [cerrar],
  );

  const exito = useCallback((texto: string) => agregar('ok', texto), [agregar]);
  const error = useCallback((texto: string) => agregar('error', texto), [agregar]);

  const value = useMemo(() => ({ toasts, exito, error, cerrar }), [toasts, exito, error, cerrar]);

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}

export function ToastContainer() {
  const { toasts, cerrar } = useToast();
  return (
    <div className="toast-stack no-print" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-item ${t.tipo === 'ok' ? 'ok' : 'error'}`} role="status">
          <span>{t.texto}</span>
          <button type="button" aria-label="Cerrar aviso" onClick={() => cerrar(t.id)}>
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
