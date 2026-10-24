import { useEffect, useState, type FormEvent } from 'react';
import { formatoMoneda } from '../../../../shared/formatters';
import { EntradaInput } from '../../../../shared/ui/EntradaInput';
import { claseValidacion } from '../../../../shared/validators/formularios';
import type { Empleado } from '../../../empleados/domain/empleado.model';
import type { Modalidad, PagoDto } from '../../domain/pago.model';

const hoy = (): string => new Date().toISOString().slice(0, 10);

interface PagoFormProps {
  empleados: Empleado[];
  guardando: boolean;
  onPrevisualizar: (dto: PagoDto | null) => void;
  onEmitir: (dto: PagoDto) => void;
  onLimpiarRef?: (limpiar: () => void) => void;
}

export function PagoForm({ empleados, guardando, onPrevisualizar, onEmitir, onLimpiarRef }: PagoFormProps) {
  const [form, setForm] = useState({
    empleadoId: '',
    fechaPago: hoy(),
    modalidad: 'Mensual' as Modalidad,
    horasExtra25: '0',
    horasExtra35: '0',
    horasDescanso: '0',
    minutosTardanza: '0',
    diasFalta: '0',
    mesesComputables: '6',
    diasComputables: '0',
    afiliadoEps: false,
  });
  const [touched, setTouched] = useState(false);

  const dto = (): PagoDto | null => {
    if (!form.empleadoId) return null;
    const nums = {
      horasExtra25: Number(form.horasExtra25),
      horasExtra35: Number(form.horasExtra35),
      horasDescanso: Number(form.horasDescanso),
      minutosTardanza: Number(form.minutosTardanza),
      diasFalta: Number(form.diasFalta),
      mesesComputables: Number(form.mesesComputables),
      diasComputables: Number(form.diasComputables),
    };
    const ok = Object.values(nums).every((n) => Number.isFinite(n) && n >= 0);
    if (!ok || !form.fechaPago) return null;
    return {
      empleadoId: form.empleadoId,
      fechaPago: form.fechaPago,
      modalidad: form.modalidad,
      ...nums,
      afiliadoEps: form.afiliadoEps,
    };
  };

  const valid = dto() !== null;

  useEffect(() => {
    const id = window.setTimeout(() => onPrevisualizar(valid ? dto() : null), 300);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, valid]);

  const limpiar = () => {
    setForm({
      empleadoId: '',
      fechaPago: hoy(),
      modalidad: 'Mensual',
      horasExtra25: '0',
      horasExtra35: '0',
      horasDescanso: '0',
      minutosTardanza: '0',
      diasFalta: '0',
      mesesComputables: '6',
      diasComputables: '0',
      afiliadoEps: false,
    });
    setTouched(false);
  };

  useEffect(() => {
    onLimpiarRef?.(limpiar);
  }, [onLimpiarRef]);

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    const d = dto();
    if (d) onEmitir(d);
  };

  const modalidad = form.modalidad;

  return (
    <form className="panel" onSubmit={enviar} noValidate>
      <div className="panel-head">
        <h2 className="panel-title">Datos del pago</h2>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="empleadoId">
          Empleado
        </label>
        <select
          id="empleadoId"
          className={`form-select ${claseValidacion(!!form.empleadoId, !form.empleadoId, touched, touched)}`}
          value={form.empleadoId}
          onChange={(e) => setForm((f) => ({ ...f, empleadoId: e.target.value }))}
        >
          <option value="">Selecciona un empleado…</option>
          {empleados.map((e) => (
            <option key={e.id} value={e.id}>
              {e.nombre} — {formatoMoneda(e.sueldoBase)}
            </option>
          ))}
        </select>
        {empleados.length === 0 ? <div className="form-text">Primero registra empleados en la sección «Empleados».</div> : null}
      </div>

      <div className="row">
        <div className="col-sm-6 mb-3">
          <label className="form-label" htmlFor="fechaPago">
            Fecha de pago
          </label>
          <input
            id="fechaPago"
            type="date"
            className="form-control"
            value={form.fechaPago}
            onChange={(e) => setForm((f) => ({ ...f, fechaPago: e.target.value }))}
          />
        </div>
        <div className="col-sm-6 mb-3">
          <label className="form-label" htmlFor="modalidad">
            Modalidad
          </label>
          <select
            id="modalidad"
            className="form-select"
            value={form.modalidad}
            onChange={(e) => setForm((f) => ({ ...f, modalidad: e.target.value as Modalidad }))}
          >
            <option value="Mensual">Fin de mes</option>
            <option value="Quincena">Adelanto quincenal</option>
            <option value="Gratificacion">Gratificación (julio / diciembre)</option>
            <option value="CTS">CTS (mayo / noviembre)</option>
          </select>
        </div>
      </div>

      {modalidad === 'Mensual' && (
        <>
          <div className="row">
            <div className="col-sm-4 mb-3">
              <label className="form-label" htmlFor="horasExtra25">
                Horas extra al 25 %
              </label>
              <EntradaInput
                id="horasExtra25"
                tipo="decimal"
                limites={{ max: 200, decimales: 2 }}
                className="form-control"
                value={form.horasExtra25}
                onChange={(horasExtra25) => setForm((f) => ({ ...f, horasExtra25 }))}
                inputMode="decimal"
                autoComplete="off"
              />
            </div>
            <div className="col-sm-4 mb-3">
              <label className="form-label" htmlFor="horasExtra35">
                Horas extra al 35 %
              </label>
              <EntradaInput
                id="horasExtra35"
                tipo="decimal"
                limites={{ max: 200, decimales: 2 }}
                className="form-control"
                value={form.horasExtra35}
                onChange={(horasExtra35) => setForm((f) => ({ ...f, horasExtra35 }))}
                inputMode="decimal"
                autoComplete="off"
              />
            </div>
            <div className="col-sm-4 mb-3">
              <label className="form-label" htmlFor="horasDescanso">
                Horas en descanso o feriado
              </label>
              <EntradaInput
                id="horasDescanso"
                tipo="decimal"
                limites={{ max: 200, decimales: 2 }}
                className="form-control"
                value={form.horasDescanso}
                onChange={(horasDescanso) => setForm((f) => ({ ...f, horasDescanso }))}
                inputMode="decimal"
                autoComplete="off"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label className="form-label" htmlFor="minutosTardanza">
                Minutos de tardanza
              </label>
              <EntradaInput
                id="minutosTardanza"
                tipo="entero"
                limites={{ max: 20_000 }}
                className="form-control"
                value={form.minutosTardanza}
                onChange={(minutosTardanza) => setForm((f) => ({ ...f, minutosTardanza }))}
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
            <div className="col-sm-6 mb-3">
              <label className="form-label" htmlFor="diasFalta">
                Días de falta
              </label>
              <EntradaInput
                id="diasFalta"
                tipo="entero"
                limites={{ max: 31 }}
                className="form-control"
                value={form.diasFalta}
                onChange={(diasFalta) => setForm((f) => ({ ...f, diasFalta }))}
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
          </div>
          <p className="form-text">
            La hora vale sueldo ordinario / 240. Las dos primeras horas del día van al 25 % y desde la tercera al 35 %.
            El descanso o feriado sin sustitutorio lleva sobretasa del 100 %. Tardanzas y faltas se descuentan por minuto y por
            treintavo.
          </p>
        </>
      )}

      {modalidad === 'Gratificacion' && (
        <>
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label className="form-label" htmlFor="mesesComputables">
                Meses completos del semestre (0 a 6)
              </label>
              <EntradaInput
                id="mesesComputables"
                tipo="entero"
                limites={{ max: 6 }}
                className="form-control"
                value={form.mesesComputables}
                onChange={(mesesComputables) => setForm((f) => ({ ...f, mesesComputables }))}
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
            <div className="col-sm-6 mb-3 d-flex align-items-end">
              <div className="form-check mb-2">
                <input
                  id="afiliadoEps"
                  type="checkbox"
                  className="form-check-input"
                  checked={form.afiliadoEps}
                  onChange={(e) => setForm((f) => ({ ...f, afiliadoEps: e.target.checked }))}
                />
                <label className="form-check-label" htmlFor="afiliadoEps">
                  Afiliado a una EPS
                </label>
              </div>
            </div>
          </div>
          <p className="form-text">
            Ley 27735: un sueldo computable por semestre, proporcional a los meses. La bonificación es 9 %, o 6,75 % si está en
            EPS. No tiene descuento de AFP ni ONP.
          </p>
        </>
      )}

      {modalidad === 'CTS' && (
        <>
          <div className="row">
            <div className="col-sm-6 mb-3">
              <label className="form-label" htmlFor="mesesCts">
                Meses completos del semestre (0 a 6)
              </label>
              <EntradaInput
                id="mesesCts"
                tipo="entero"
                limites={{ max: 6 }}
                className="form-control"
                value={form.mesesComputables}
                onChange={(mesesComputables) => setForm((f) => ({ ...f, mesesComputables }))}
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
            <div className="col-sm-6 mb-3">
              <label className="form-label" htmlFor="diasComputables">
                Días del mes incompleto (0 a 30)
              </label>
              <EntradaInput
                id="diasComputables"
                tipo="entero"
                limites={{ max: 30 }}
                className="form-control"
                value={form.diasComputables}
                onChange={(diasComputables) => setForm((f) => ({ ...f, diasComputables }))}
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
          </div>
          <p className="form-text">
            Depósito de mayo (noviembre–abril) o noviembre (mayo–octubre). La remuneración computable suma un sexto de la
            gratificación del semestre. No se descuenta pensión.
          </p>
        </>
      )}

      {modalidad === 'Quincena' && (
        <p className="form-text">
          Adelanto según el porcentaje de la empresa (Configuración). La ley no fija ese porcentaje y este pago no lleva
          descuentos: se regularizan a fin de mes.
        </p>
      )}

      <div className="d-flex gap-2 mt-2">
        <button type="submit" className="btn btn-primary" disabled={!valid || guardando}>
          Procesar y emitir boleta
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={limpiar}>
          Nuevo pago
        </button>
      </div>
    </form>
  );
}
