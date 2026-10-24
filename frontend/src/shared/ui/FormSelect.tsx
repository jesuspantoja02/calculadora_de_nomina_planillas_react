import type { SelectHTMLAttributes } from 'react';
import { Icon } from './Icon';

type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function FormSelect({ className = '', children, ...rest }: FormSelectProps) {
  return (
    <div className="form-select-wrap">
      <select className={`form-control form-select-wrap__select ${className}`.trim()} {...rest}>
        {children}
      </select>
      <span className="form-select-wrap__chevron" aria-hidden="true">
        <Icon nombre="chevron-down" tamano={18} />
      </span>
    </div>
  );
}
