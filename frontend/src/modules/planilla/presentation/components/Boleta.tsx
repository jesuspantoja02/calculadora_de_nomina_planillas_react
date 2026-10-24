import {
  enmascararDni,
  formatoFecha,
  formatoMoneda,
  formatoPorcentaje,
  iniciales,
  modalidadLabel,
} from '../../../../shared/formatters';
import { etiquetaSistemaPensiones } from '../../../../shared/pensiones';
import { Icon } from '../../../../shared/ui/Icon';
import type { Boleta as BoletaModel } from '../../domain/pago.model';

interface BoletaProps {
  boleta: BoletaModel;
  mostrarImprimir?: boolean;
}

export function Boleta({ boleta: b, mostrarImprimir = true }: BoletaProps) {
  const pension = etiquetaSistemaPensiones(b.regimen, b.afp);

  return (
    <div className="print-area">
      <article className="boleta panel">
        <div className="d-flex align-items-center gap-3 pb-3 mb-3 border-bottom" style={{ borderColor: 'var(--border)' }}>
          <span className="brand-mark" aria-hidden="true">
            {iniciales(b.empresaNombre)}
          </span>
          <div>
            <div className="fw-bold">{b.empresaNombre}</div>
            <small className="text-secondary">RUC {b.empresaRuc}</small>
          </div>
        </div>

        <span className="badge text-bg-warning mb-3">
          {modalidadLabel(b.modalidad)} · {formatoFecha(b.fechaPago)}
        </span>

        <p className="section-label">Empleado</p>
        <div className="linea">
          <span>Nombre</span>
          <span>{b.nombre.toUpperCase()}</span>
        </div>
        <div className="linea">
          <span>DNI</span>
          <span>{enmascararDni(b.dni)}</span>
        </div>
        <div className="linea">
          <span>Cargo</span>
          <span>{b.cargo}</span>
        </div>
        <div className="linea">
          <span>Sistema de pensiones</span>
          <span>{pension}</span>
        </div>

        {b.modalidad === 'Quincena' && (
          <>
            <p className="section-label">Adelanto quincenal</p>
            <div className="linea">
              <span>Sueldo básico</span>
              <span>{formatoMoneda(b.sueldoBase)}</span>
            </div>
            <p className="small text-secondary mb-0">Sin descuentos de ley: se regulariza en el pago de fin de mes.</p>
          </>
        )}

        {b.modalidad === 'Gratificacion' && (
          <>
            <p className="section-label">Ingresos</p>
            <div className="linea">
              <span>Sueldo básico</span>
              <span>{formatoMoneda(b.sueldoBase)}</span>
            </div>
            {b.asignacionFamiliar > 0 ? (
              <div className="linea">
                <span>Asignación familiar</span>
                <span>{formatoMoneda(b.asignacionFamiliar)}</span>
              </div>
            ) : null}
            <div className="linea">
              <span>Gratificación ({b.mesesComputables} meses)</span>
              <span>{formatoMoneda(b.gratificacion)}</span>
            </div>
            <div className="linea">
              <span>Bonificación extraordinaria</span>
              <span>{formatoMoneda(b.bonificacionExtraordinaria)}</span>
            </div>
            <p className="small text-secondary mb-0">Exonerada de AFP y ONP. La bonificación no es renta de quinta categoría.</p>
          </>
        )}

        {b.modalidad === 'CTS' && (
          <>
            <p className="section-label">Depósito</p>
            <div className="linea">
              <span>Sueldo básico</span>
              <span>{formatoMoneda(b.sueldoBase)}</span>
            </div>
            {b.asignacionFamiliar > 0 ? (
              <div className="linea">
                <span>Asignación familiar</span>
                <span>{formatoMoneda(b.asignacionFamiliar)}</span>
              </div>
            ) : null}
            <div className="linea">
              <span>Sexto de la gratificación</span>
              <span>{formatoMoneda(b.gratificacion / 6)}</span>
            </div>
            <div className="linea">
              <span>Remuneración computable</span>
              <span>{formatoMoneda(b.remuneracionComputable)}</span>
            </div>
            <div className="linea">
              <span>
                Tiempo ({b.mesesComputables} meses y {b.diasComputables} días)
              </span>
              <span>{formatoMoneda(b.cts)}</span>
            </div>
            <p className="small text-secondary mb-0">Se deposita en la cuenta CTS. No es un pago de sueldo ni tiene descuento de pensión.</p>
          </>
        )}

        {b.modalidad === 'Mensual' && (
          <>
            <p className="section-label">Ingresos</p>
            <div className="linea">
              <span>Sueldo básico</span>
              <span>{formatoMoneda(b.sueldoBase)}</span>
            </div>
            {b.asignacionFamiliar > 0 ? (
              <div className="linea">
                <span>Asignación familiar</span>
                <span>{formatoMoneda(b.asignacionFamiliar)}</span>
              </div>
            ) : null}
            {b.pagoHoras25 > 0 ? (
              <div className="linea">
                <span>Horas extra 25 % ({b.horasExtra25} h)</span>
                <span>{formatoMoneda(b.pagoHoras25)}</span>
              </div>
            ) : null}
            {b.pagoHoras35 > 0 ? (
              <div className="linea">
                <span>Horas extra 35 % ({b.horasExtra35} h)</span>
                <span>{formatoMoneda(b.pagoHoras35)}</span>
              </div>
            ) : null}
            {b.pagoDescanso > 0 ? (
              <div className="linea">
                <span>Descanso o feriado ({b.horasDescanso} h)</span>
                <span>{formatoMoneda(b.pagoDescanso)}</span>
              </div>
            ) : null}
            {!b.pagoHoras25 && !b.pagoHoras35 && !b.pagoDescanso && b.ingresoExtra > 0 ? (
              <div className="linea">
                <span>Horas extra ({b.horasExtra} h)</span>
                <span>{formatoMoneda(b.ingresoExtra)}</span>
              </div>
            ) : null}
            <div className="linea fw-bold">
              <span>Sueldo bruto</span>
              <span>{formatoMoneda(b.bruto)}</span>
            </div>

            <p className="section-label">Descuentos</p>
            <div className="linea descuento">
              <span>Adelanto quincenal</span>
              <span>{formatoMoneda(b.adelanto)}</span>
            </div>
            {b.regimen === 'AFP' && b.aporteAfp != null ? (
              <>
                <div className="linea descuento">
                  <span>Aporte obligatorio ({pension})</span>
                  <span>{formatoMoneda(b.aporteAfp)}</span>
                </div>
                <div className="linea descuento">
                  <span>Prima de seguro ({pension})</span>
                  <span>{formatoMoneda(b.primaSeguro)}</span>
                </div>
                {b.comisionAfp > 0 ? (
                  <div className="linea descuento">
                    <span>Comisión ({pension})</span>
                    <span>{formatoMoneda(b.comisionAfp)}</span>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="linea descuento">
                <span>
                  {pension} ({formatoPorcentaje(b.tasaPension / 100)})
                </span>
                <span>{formatoMoneda(b.pension)}</span>
              </div>
            )}
            {b.descuentoTardanza > 0 ? (
              <div className="linea descuento">
                <span>Tardanzas ({b.minutosTardanza} min)</span>
                <span>{formatoMoneda(b.descuentoTardanza)}</span>
              </div>
            ) : null}
            {b.descuentoFalta > 0 ? (
              <div className="linea descuento">
                <span>Faltas ({b.diasFalta} días)</span>
                <span>{formatoMoneda(b.descuentoFalta)}</span>
              </div>
            ) : null}
            {!b.descuentoTardanza && !b.descuentoFalta && b.tardanzas > 0 ? (
              <div className="linea descuento">
                <span>Tardanzas / faltas</span>
                <span>{formatoMoneda(b.tardanzas)}</span>
              </div>
            ) : null}
            {b.quintaCategoria > 0 ? (
              <div className="linea descuento">
                <span>Retención 5.ª categoría</span>
                <span>{formatoMoneda(b.quintaCategoria)}</span>
              </div>
            ) : null}
            {b.essaludEmpleador > 0 ? (
              <p className="small text-secondary mb-0">
                EsSalud del empleador: {formatoMoneda(b.essaludEmpleador)}. No se descuenta al trabajador.
              </p>
            ) : null}
          </>
        )}

        <div className="neto">
          <span>
            {b.modalidad === 'Quincena' ? 'Adelanto a pagar' : b.modalidad === 'CTS' ? 'CTS a depositar' : 'Neto a pagar'}
          </span>
          <span>{formatoMoneda(b.neto)}</span>
        </div>

        {mostrarImprimir ? (
          <button type="button" className="btn btn-outline-primary mt-3 no-print d-inline-flex align-items-center gap-2" onClick={() => window.print()}>
            <Icon nombre="print" /> Imprimir boleta
          </button>
        ) : null}
      </article>
    </div>
  );
}
