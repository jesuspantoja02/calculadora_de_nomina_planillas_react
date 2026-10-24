interface SegmentoDonut {
  id: string;
  etiqueta: string;
  valor: number;
  color: string;
}

interface DonutChartProps {
  segmentos: SegmentoDonut[];
  /** Texto central (ej. total) */
  centro?: { titulo: string; subtitulo?: string };
  tamano?: number;
}

export function DonutChart({ segmentos, centro, tamano = 168 }: DonutChartProps) {
  const total = segmentos.reduce((s, x) => s + Math.max(0, x.valor), 0);
  const radio = 42;
  const circ = 2 * Math.PI * radio;
  let offset = 0;

  const arcos =
    total <= 0
      ? [{ id: 'empty', dash: circ, gap: 0, color: 'var(--raised)', offset: 0 }]
      : segmentos.map((seg) => {
          const frac = seg.valor / total;
          const dash = frac * circ;
          const arc = { id: seg.id, dash, gap: circ - dash, color: seg.color, offset };
          offset -= dash;
          return arc;
        });

  return (
    <div className="chart-donut" style={{ maxWidth: tamano }}>
      <div className="chart-donut__figure">
        <svg viewBox="0 0 100 100" className="chart-donut__svg" role="img" aria-label="Gráfico circular">
          <circle cx="50" cy="50" r={radio} className="chart-donut__ring" />
          {arcos.map((a) => (
            <circle
              key={a.id}
              cx="50"
              cy="50"
              r={radio}
              className="chart-donut__segment"
              stroke={a.color}
              strokeDasharray={`${a.dash} ${a.gap}`}
              strokeDashoffset={a.offset}
            />
          ))}
        </svg>
        {centro ? (
          <div className="chart-donut__center">
            <span className="chart-donut__center-title">{centro.titulo}</span>
            {centro.subtitulo ? <span className="chart-donut__center-sub">{centro.subtitulo}</span> : null}
          </div>
        ) : null}
      </div>
      <ul className="chart-donut__legend">
        {segmentos.map((s) => (
          <li key={s.id}>
            <span className="chart-donut__swatch" style={{ background: s.color }} />
            <span className="chart-donut__legend-label">{s.etiqueta}</span>
            <span className="chart-donut__legend-value fig-tabular">
              {total > 0 ? `${Math.round((s.valor / total) * 100)}%` : '—'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
