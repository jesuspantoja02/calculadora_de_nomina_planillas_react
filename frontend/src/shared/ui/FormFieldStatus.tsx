import type { ReactNode } from 'react';
import { Icon } from './Icon';

export type EstadoCampo = 'valid' | 'invalid' | 'idle';

interface FormFieldStatusProps {
  children: ReactNode;
  estado: EstadoCampo;
  mostrar: boolean;
}

export function FormFieldStatus({ children, estado, mostrar }: FormFieldStatusProps) {
  const feedback = mostrar && estado !== 'idle';

  return (
    <div className={`form-field-status${feedback ? ' form-field-status--open' : ''}`}>
      <div className="form-field-status__control">{children}</div>
      {feedback ? (
        <span
          className={`form-field-status__badge form-field-status__badge--${estado}`}
          aria-hidden="true"
        >
          <Icon nombre={estado === 'valid' ? 'check' : 'alert'} tamano={18} />
        </span>
      ) : null}
    </div>
  );
}
