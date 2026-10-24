import { useEffect, useState, type FormEvent } from 'react';
import { container } from '../../../../composition/container';
import { useToast } from '../../../../core/notifications/ToastContext';
import { useApiAction } from '../../../../shared/presentation/useApiAction';
import { CompanyLogo } from '../../../../shared/ui/CompanyLogo';
import { EntradaInput } from '../../../../shared/ui/EntradaInput';
import { PageHeader } from '../../../../shared/ui/PageHeader';
import { claseValidacion } from '../../../../shared/validators/formularios';
import type { Configuracion, TipoComisionAfp } from '../../domain/configuracion.model';

type FormState = Record<keyof Configuracion, string | boolean>;

function desdeConfig(c: Configuracion): FormState {
  return {
    empresaNombre: c.empresaNombre,
    empresaRuc: c.empresaRuc,
    empresaEslogan: c.empresaEslogan ?? '',
    empresaLogoUrl: c.empresaLogoUrl ?? '',
    aporteAfpPct: String(c.aporteAfpPct),
    primaSeguroPct: String(c.primaSeguroPct),
    comisionFlujoPct: String(c.comisionFlujoPct),
    tipoComisionAfp: c.tipoComisionAfp,
    remuneracionMaximaAsegurable: String(c.remuneracionMaximaAsegurable),
    tasaOnp: String(c.tasaOnp),
    tasaEssalud: String(c.tasaEssalud),
    rmv: String(c.rmv),
    uit: String(c.uit),
    adelantoQuincenalPct: String(c.adelantoQuincenalPct),
    aplicarQuintaCategoria: c.aplicarQuintaCategoria,
  };
}

export function ConfiguracionPage() {
  const toast = useToast();
  const run = useApiAction();
  const [form, setForm] = useState<FormState | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    void container.configuracion.obtener().then((c) => setForm(desdeConfig(c)));
  }, []);

  if (!form) {
    return (
      <>
        <PageHeader titulo="Configuración" descripcion="Cargando parámetros…" />
        <div className="panel empty">Cargando…</div>
      </>
    );
  }

  const rucOk = /^\d{11}$/.test(form.empresaRuc as string);
  const nombreOk = (form.empresaNombre as string).length >= 2;
  const n = (k: keyof Configuracion) => Number(form[k]);
  const valid =
    nombreOk &&
    rucOk &&
    [n('aporteAfpPct'), n('primaSeguroPct'), n('comisionFlujoPct'), n('tasaOnp'), n('tasaEssalud'), n('adelantoQuincenalPct')].every(
      (x) => x >= 0 && x <= 100,
    ) &&
    n('remuneracionMaximaAsegurable') >= 0 &&
    n('rmv') >= 0 &&
    n('uit') >= 1;

  const guardar = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    const config: Configuracion = {
      empresaNombre: form.empresaNombre as string,
      empresaRuc: form.empresaRuc as string,
      empresaEslogan: (form.empresaEslogan as string).trim(),
      empresaLogoUrl: form.empresaLogoUrl as string,
      aporteAfpPct: n('aporteAfpPct'),
      primaSeguroPct: n('primaSeguroPct'),
      comisionFlujoPct: n('comisionFlujoPct'),
      tipoComisionAfp: form.tipoComisionAfp as TipoComisionAfp,
      remuneracionMaximaAsegurable: n('remuneracionMaximaAsegurable'),
      tasaOnp: n('tasaOnp'),
      tasaEssalud: n('tasaEssalud'),
      rmv: n('rmv'),
      uit: n('uit'),
      adelantoQuincenalPct: n('adelantoQuincenalPct'),
      aplicarQuintaCategoria: form.aplicarQuintaCategoria as boolean,
    };
    setGuardando(true);
    const ok = await run(() => container.configuracion.actualizar(config));
    setGuardando(false);
    if (ok) toast.exito('Configuración guardada.');
  };

  const reiniciar = async () => {
    if (!confirm('Esto borrará todos los empleados y boletas guardadas. ¿Continuar?')) return;
    const ok = await run(() => container.configuracion.reiniciarDatos());
    if (ok) toast.exito('Datos borrados.');
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => (f ? { ...f, [key]: value } : f));

  const elegirLogo = (file: File | null) => {
    if (!file) return;
    if (!/^image\/(png|jpeg|webp)$/i.test(file.type)) {
      toast.error('Usa una imagen PNG, JPEG o WebP.');
      return;
    }
    if (file.size > 400_000) {
      toast.error('El logo no debe superar 400 KB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = typeof reader.result === 'string' ? reader.result : '';
      set('empresaLogoUrl', data);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <PageHeader
        titulo="Configuración"
        descripcion="Datos de la empresa y parámetros legales que usa cada boleta. Las tasas de AFP son las de la SBS; cámbialas cuando publiquen un devengue nuevo."
      />

      <form className="panel" onSubmit={guardar} noValidate>
        <p className="section-label">Empresa</p>
        <div className="row">
          <div className="col-md-8 mb-3">
            <label className="form-label" htmlFor="empresaNombre">
              Nombre de la empresa
            </label>
            <EntradaInput
              id="empresaNombre"
              tipo="empresa"
              className={`form-control ${claseValidacion(nombreOk, !nombreOk, touched, touched)}`}
              value={form.empresaNombre as string}
              onChange={(v) => set('empresaNombre', v)}
              maxLength={60}
              autoComplete="off"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label" htmlFor="empresaRuc">
              RUC (11 dígitos)
            </label>
            <EntradaInput
              id="empresaRuc"
              tipo="ruc"
              className={`form-control ${claseValidacion(rucOk, !rucOk, touched, touched)}`}
              value={form.empresaRuc as string}
              onChange={(v) => set('empresaRuc', v)}
              maxLength={11}
              inputMode="numeric"
              autoComplete="off"
            />
          </div>
        </div>
        <div className="row align-items-end">
          <div className="col-md-8 mb-3">
            <label className="form-label" htmlFor="empresaEslogan">
              Eslogan de la empresa
            </label>
            <EntradaInput
              id="empresaEslogan"
              tipo="empresa"
              className="form-control"
              value={form.empresaEslogan as string}
              onChange={(v) => set('empresaEslogan', v)}
              maxLength={120}
              autoComplete="off"
              placeholder="Ej. Planillas claras, pagos seguros"
            />
            <small className="text-secondary">Se muestra en el panel de inicio junto al logo.</small>
          </div>
          <div className="col-md-4 mb-3">
            <span className="form-label d-block">Logo de la empresa</span>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <CompanyLogo
                nombre={form.empresaNombre as string}
                logoUrl={form.empresaLogoUrl as string}
                size={56}
              />
              <div className="d-flex flex-column gap-2">
                <label className="btn btn-secondary btn-sm mb-0">
                  Subir imagen
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="visually-hidden"
                    onChange={(e) => {
                      elegirLogo(e.target.files?.[0] ?? null);
                      e.target.value = '';
                    }}
                  />
                </label>
                {(form.empresaLogoUrl as string) ? (
                  <button type="button" className="btn btn-link btn-sm p-0 text-secondary" onClick={() => set('empresaLogoUrl', '')}>
                    Quitar logo
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <p className="section-label">Pensión del trabajador (%)</p>
        <div className="row">
          {(
            [
              ['aporteAfpPct', 'Aporte AFP', 100],
              ['primaSeguroPct', 'Prima de seguro', 100],
              ['comisionFlujoPct', 'Comisión por flujo', 100],
            ] as const
          ).map(([key, label, max]) => (
            <div className="col-md-3 mb-3" key={key}>
              <label className="form-label" htmlFor={key}>
                {label}
              </label>
              <EntradaInput
                id={key}
                tipo="decimal"
                limites={{ max, decimales: 2 }}
                className="form-control"
                value={form[key] as string}
                onChange={(v) => set(key, v)}
                inputMode="decimal"
                autoComplete="off"
              />
            </div>
          ))}
          <div className="col-md-3 mb-3">
            <label className="form-label" htmlFor="tipoComisionAfp">
              Tipo de comisión
            </label>
            <select
              id="tipoComisionAfp"
              className="form-select"
              value={form.tipoComisionAfp as string}
              onChange={(e) => set('tipoComisionAfp', e.target.value as TipoComisionAfp)}
            >
              <option value="flujo">Flujo (se descuenta del sueldo)</option>
              <option value="saldo">Saldo (se cobra al fondo)</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label" htmlFor="remuneracionMaximaAsegurable">
              Remuneración máxima asegurable (S/)
            </label>
            <EntradaInput
              id="remuneracionMaximaAsegurable"
              tipo="decimal"
              limites={{ max: 1_000_000, decimales: 2 }}
              className="form-control"
              value={form.remuneracionMaximaAsegurable as string}
              onChange={(v) => set('remuneracionMaximaAsegurable', v)}
              inputMode="decimal"
              autoComplete="off"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label" htmlFor="tasaOnp">
              ONP
            </label>
            <EntradaInput
              id="tasaOnp"
              tipo="decimal"
              limites={{ max: 100, decimales: 2 }}
              className="form-control"
              value={form.tasaOnp as string}
              onChange={(v) => set('tasaOnp', v)}
              inputMode="decimal"
              autoComplete="off"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label" htmlFor="adelantoQuincenalPct">
              Adelanto quincenal (política de la empresa)
            </label>
            <EntradaInput
              id="adelantoQuincenalPct"
              tipo="decimal"
              limites={{ max: 100, decimales: 2 }}
              className="form-control"
              value={form.adelantoQuincenalPct as string}
              onChange={(v) => set('adelantoQuincenalPct', v)}
              inputMode="decimal"
              autoComplete="off"
            />
          </div>
        </div>

        <p className="section-label">Empleador y parámetros (S/)</p>
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label" htmlFor="tasaEssalud">
              EsSalud del empleador (%)
            </label>
            <EntradaInput
              id="tasaEssalud"
              tipo="decimal"
              limites={{ max: 100, decimales: 2 }}
              className="form-control"
              value={form.tasaEssalud as string}
              onChange={(v) => set('tasaEssalud', v)}
              inputMode="decimal"
              autoComplete="off"
            />
            <div className="form-text">No se descuenta al trabajador. En EPS la bonificación de gratificación usa el 75 % de esta tasa.</div>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label" htmlFor="rmv">
              RMV
            </label>
            <EntradaInput
              id="rmv"
              tipo="decimal"
              limites={{ max: 100_000, decimales: 2 }}
              className="form-control"
              value={form.rmv as string}
              onChange={(v) => set('rmv', v)}
              inputMode="decimal"
              autoComplete="off"
            />
            <div className="form-text">La asignación familiar es el 10 % de este monto (Ley 25129).</div>
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label" htmlFor="uit">
              UIT
            </label>
            <EntradaInput
              id="uit"
              tipo="entero"
              limites={{ min: 1, max: 100_000 }}
              className="form-control"
              value={form.uit as string}
              onChange={(v) => set('uit', v)}
              inputMode="numeric"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="form-check mb-4">
          <input
            id="quinta"
            type="checkbox"
            className="form-check-input"
            checked={form.aplicarQuintaCategoria as boolean}
            onChange={(e) => set('aplicarQuintaCategoria', e.target.checked)}
          />
          <label className="form-check-label" htmlFor="quinta">
            Retener 5.ª categoría en el fin de mes (proyección de remuneración estable)
          </label>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button type="submit" className="btn btn-primary" disabled={!valid || guardando}>
            Guardar configuración
          </button>
          <button type="button" className="btn btn-outline-danger ms-auto" onClick={() => void reiniciar()}>
            Borrar empleados y boletas
          </button>
        </div>
      </form>
    </>
  );
}
