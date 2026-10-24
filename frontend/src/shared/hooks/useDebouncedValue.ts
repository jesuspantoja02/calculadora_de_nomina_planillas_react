import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(valor: T, ms: number): T {
  const [debounced, setDebounced] = useState(valor);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(valor), ms);
    return () => window.clearTimeout(id);
  }, [valor, ms]);
  return debounced;
}
