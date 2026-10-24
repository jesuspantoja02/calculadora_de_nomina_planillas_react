import type { ReactNode } from 'react';

interface PageHeaderProps {
  titulo: string;
  descripcion?: string;
  acciones?: ReactNode;
}

export function PageHeader({ titulo, descripcion, acciones }: PageHeaderProps) {
  return (
    <header className="page-head">
      <div className="page-head-copy">
        <h1>{titulo}</h1>
        {descripcion ? <p className="lede">{descripcion}</p> : null}
      </div>
      {acciones ? <div className="page-head-actions">{acciones}</div> : null}
    </header>
  );
}
