interface BarraComposicion {
  id: string;
  etiqueta: string;
  valor: number;
  color: string;
  formato: (n: number) => string;
}

interface CompositionBarsProps {
  barras: BarraComposicion[];
  maximo?: number;
}

export function CompositionBars({ barras, maximo }: CompositionBarsProps) {
  const max = maximo ?? Math.max(...barras.map((b) => b.valor), 1);

  return (
    <div className="chart-composition" role="img" aria-label="Composición de montos">
      {barras.map((b) => {
        const pct = Math.min(100, (b.valor / max) * 100);
        return (
          <div className="chart-composition__row" key={b.id}>
            <div className="chart-composition__meta">
              <span className="chart-composition__label">{b.etiqueta}</span>
              <span className="chart-composition__value fig-tabular money">{b.formato(b.valor)}</span>
            </div>
            <div className="chart-composition__track">
              <div
                className="chart-composition__fill"
                style={{ width: `${pct}%`, background: b.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
