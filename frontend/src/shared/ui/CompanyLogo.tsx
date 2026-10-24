function iniciales(nombre: string): string {
  const partes = nombre.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return 'E';
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[1][0]).toUpperCase();
}

interface CompanyLogoProps {
  nombre: string;
  logoUrl?: string;
  size?: number;
  className?: string;
}

/** Logo de la empresa (imagen configurada o monograma profesional). */
export function CompanyLogo({ nombre, logoUrl, size = 96, className = '' }: CompanyLogoProps) {
  const clase = `company-logo${className ? ` ${className}` : ''}`;

  if (logoUrl?.trim()) {
    return (
      <img
        className={clase}
        src={logoUrl.trim()}
        alt={nombre}
        width={size}
        height={size}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`${clase} company-logo--monogram`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      aria-hidden="true"
    >
      {iniciales(nombre)}
    </div>
  );
}
