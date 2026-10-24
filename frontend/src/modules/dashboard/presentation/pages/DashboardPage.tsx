import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../../core/theme/ThemeContext';
import { container } from '../../../../composition/container';
import { PageHeader } from '../../../../shared/ui/PageHeader';
import { CompositionBars } from '../../../../shared/ui/charts/CompositionBars';
import { DonutChart } from '../../../../shared/ui/charts/DonutChart';
import { estilosAvatarTinte, formatoMoneda, iniciales, tituloPalabras, tintePersona } from '../../../../shared/formatters';
import { colorDistribucionPension, etiquetaSistemaPensiones } from '../../../../shared/pensiones';
import type { ResumenDashboard } from '../../domain/dashboard.model';

export function DashboardPage() {
  const { tema } = useTheme();
  const [resumen, setResumen] = useState<ResumenDashboard | null>(null);

  useEffect(() => {
    void container.dashboard.resumen().then(setResumen).catch(() => setResumen(null));
  }, []);

  if (!resumen) {
    return (
      <>
        <PageHeader
          titulo="Dashboard"
          descripcion="Estimación del mes: sueldo y asignación familiar, menos pensión (ONP o AFP por administradora) y quinta categoría si aplica. EsSalud no se descuenta al trabajador."
        />
        <div className="panel empty">Cargando resumen…</div>
      </>
    );
  }

  const r = resumen;

  return (
    <>
      <PageHeader
        titulo="Dashboard"
        descripcion="Estimación del mes: sueldo y asignación familiar, menos pensión (ONP o AFP por administradora) y quinta categoría si aplica. EsSalud no se descuenta al trabajador."
        acciones={
          <Link className="btn btn-primary" to="/planilla/procesar-pago">
            Procesar pago
          </Link>
        }
      />

      <div className="kpi-grid">
        <div className="panel kpi-card">
          <div className="kpi-label">Total bruto registrado</div>
          <div className="kpi-value money">{formatoMoneda(r.totales.bruto)}</div>
          <p className="kpi-note">{r.totalEmpleados} empleados en planilla</p>
        </div>
        <div className="panel kpi-card">
          <div className="kpi-label">Total descuentos</div>
          <div className="kpi-value money">{formatoMoneda(r.totales.descuentos)}</div>
          <p className="kpi-note">Pensión y quinta categoría estimadas</p>
        </div>
        <div className="panel kpi-card">
          <div className="kpi-label">Total neto estimado</div>
          <div className="kpi-value money accent-hue">{formatoMoneda(r.totales.neto)}</div>
          <p className="kpi-note">EsSalud a cargo del empleador</p>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-4">
          <div className="panel h-100 chart-panel">
            <h2 className="panel-title mb-3">
              Sistemas de pensión <span className="count">{r.totalEmpleados}</span>
            </h2>
            <div className="chart-panel__body">
              <DonutChart
                segmentos={r.distribucionPension.map((seg) => ({
                  id: seg.id,
                  etiqueta: seg.etiqueta,
                  valor: seg.cantidad,
                  color: colorDistribucionPension(seg.id),
                }))}
                centro={{ titulo: String(r.totalEmpleados), subtitulo: 'empleados' }}
              />
            </div>
            <div className="chart-panel__links">
              <Link to="/empleados">Ver plantilla</Link>
              <Link to="/empleados?regimen=ONP">Solo ONP</Link>
              <Link to="/empleados?regimen=AFP">Todas las AFP</Link>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="panel h-100 chart-panel">
            <h2 className="panel-title mb-3">Composición del mes</h2>
            <CompositionBars
              barras={[
                {
                  id: 'bruto',
                  etiqueta: 'Bruto registrado',
                  valor: r.totales.bruto,
                  color: 'var(--chart-bruto)',
                  formato: formatoMoneda,
                },
                {
                  id: 'desc',
                  etiqueta: 'Descuentos estimados',
                  valor: r.totales.descuentos,
                  color: 'var(--chart-descuento)',
                  formato: formatoMoneda,
                },
                {
                  id: 'neto',
                  etiqueta: 'Neto estimado',
                  valor: r.totales.neto,
                  color: 'var(--chart-neto)',
                  formato: formatoMoneda,
                },
              ]}
            />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="dashboard-extremos h-100">
            <div className="panel">
              <div className="kpi-label mb-2">Mayor sueldo neto</div>
              {r.mayorSueldo ? (
                <>
                  <div className="d-flex align-items-center gap-2 min-w-0">
                    <span
                      className="avatar flex-shrink-0"
                      style={estilosAvatarTinte(tintePersona(r.mayorSueldo.nombre, tema))}
                    >
                      {iniciales(r.mayorSueldo.nombre)}
                    </span>
                    <div className="min-w-0 dashboard-persona-meta">
                      <div className="fw-semibold text-truncate">{tituloPalabras(r.mayorSueldo.nombre)}</div>
                      <small className="text-secondary">
                        {r.mayorSueldo.cargo} · {etiquetaSistemaPensiones(r.mayorSueldo.regimen, r.mayorSueldo.afp)}
                      </small>
                    </div>
                  </div>
                  <div className="kpi-value money mt-2 dashboard-extremo-monto">{formatoMoneda(r.mayorSueldo.neto)}</div>
                </>
              ) : (
                <p className="text-secondary mb-0">Sin datos todavía.</p>
              )}
            </div>

            <div className="panel">
              <div className="kpi-label mb-2">Menor sueldo neto</div>
              {r.menorSueldo ? (
                <>
                  <div className="d-flex align-items-center gap-2 min-w-0">
                    <span
                      className="avatar flex-shrink-0"
                      style={estilosAvatarTinte(tintePersona(r.menorSueldo.nombre, tema))}
                    >
                      {iniciales(r.menorSueldo.nombre)}
                    </span>
                    <div className="min-w-0 dashboard-persona-meta">
                      <div className="fw-semibold text-truncate">{tituloPalabras(r.menorSueldo.nombre)}</div>
                      <small className="text-secondary">
                        {r.menorSueldo.cargo} · {etiquetaSistemaPensiones(r.menorSueldo.regimen, r.menorSueldo.afp)}
                      </small>
                    </div>
                  </div>
                  <div className="kpi-value money mt-2 dashboard-extremo-monto">{formatoMoneda(r.menorSueldo.neto)}</div>
                </>
              ) : (
                <p className="text-secondary mb-0">Sin datos todavía.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-secondary small mt-3 mb-0">
        Boletas emitidas: <span className="fig-tabular">{r.totalBoletas}</span>. Los totales estiman el mes con sueldo y asignación
        familiar, menos la pensión y la quinta categoría.
      </p>
    </>
  );
}
