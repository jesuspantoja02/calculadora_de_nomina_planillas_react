import { useCallback, type InputHTMLAttributes } from 'react';
import { filtrarEntrada, entradaValida, type LimitesEntrada, type TipoEntrada } from '../validators/formularios';

interface EntradaInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  tipo: TipoEntrada;
  value: string;
  onChange: (valor: string) => void;
  limites?: LimitesEntrada;
}

/** Impide escribir o pegar un valor que no corresponde al campo (equivalente a la directiva appEntrada). */
export function EntradaInput({ tipo, value, onChange, limites = {}, ...rest }: EntradaInputProps) {
  const limpiar = useCallback(
    (raw: string) => filtrarEntrada(tipo, raw, limites),
    [tipo, limites],
  );

  const onBeforeInput = (event: React.FormEvent<HTMLInputElement> & { nativeEvent: InputEvent }) => {
    const ie = event.nativeEvent;
    const inputType = ie.inputType ?? '';
    if (inputType.startsWith('delete') || inputType === 'historyUndo' || inputType === 'historyRedo') return;
    if (ie.data == null) return;

    const data = ie.data.replace(/,/g, '.');
    const el = event.currentTarget;
    let start = el.value.length;
    let end = start;
    try {
      if (el.selectionStart != null) {
        start = el.selectionStart;
        end = el.selectionEnd ?? start;
      }
    } catch {
      /* type="number" */
    }
    const next = el.value.slice(0, start) + data + el.value.slice(end);
    if (entradaValida(tipo, next, limites)) {
      if (data !== ie.data) {
        event.preventDefault();
        onChange(next);
      }
      return;
    }
    event.preventDefault();
    if (inputType === 'insertFromPaste' || inputType === 'insertFromDrop') {
      onChange(limpiar(next));
    }
  };

  return (
    <input
      {...rest}
      value={value}
      onBeforeInput={onBeforeInput}
      onChange={(e) => {
        const limpio = limpiar(e.target.value);
        if (limpio !== value) onChange(limpio);
      }}
    />
  );
}
