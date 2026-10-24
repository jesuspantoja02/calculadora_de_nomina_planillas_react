import { useCallback } from 'react';
import { useToast } from '../../core/notifications/ToastContext';
import { ApiError } from '../infrastructure/http/apiClient';

/** Envuelve una promesa de API y muestra el error en un toast. */
export function useApiAction() {
  const toast = useToast();

  return useCallback(
    async <T>(accion: () => Promise<T>): Promise<T | undefined> => {
      try {
        return await accion();
      } catch (e) {
        if (e instanceof ApiError) toast.error(e.message);
        else toast.error('Error inesperado.');
        return undefined;
      }
    },
    [toast],
  );
}
