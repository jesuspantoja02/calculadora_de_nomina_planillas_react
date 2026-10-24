import { SISTEMA_LOGO_URL, SISTEMA_NOMBRE, SISTEMA_SUBTITULO } from '../../config/systemBranding';

interface BrandLogoProps {
  /** Lado del isotipo */
  size?: number;
  /** Solo el isotipo o isotipo + texto */
  variant?: 'mark' | 'lockup';
  className?: string;
}

export function BrandLogo({ size = 36, variant = 'mark', className = '' }: BrandLogoProps) {
  const mark = (
    <img
      className={`brand-logo__mark${className ? ` ${className}` : ''}`}
      src={SISTEMA_LOGO_URL}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      aria-hidden={variant === 'lockup'}
    />
  );

  if (variant === 'mark') {
    return (
      <span className="brand-logo brand-logo--mark" role="img" aria-label="Planilla Nómina Perú">
        {mark}
      </span>
    );
  }

  return (
    <span className={`brand-logo brand-logo--lockup${className ? ` ${className}` : ''}`}>
      {mark}
      <span className="brand-logo__text">
        <span className="brand-logo__name">{SISTEMA_NOMBRE}</span>
        <span className="brand-logo__sub">{SISTEMA_SUBTITULO}</span>
      </span>
    </span>
  );
}
