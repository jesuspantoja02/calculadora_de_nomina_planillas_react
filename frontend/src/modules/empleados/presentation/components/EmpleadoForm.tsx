import { useEffect, useState, type FormEvent } from 'react';
import { AFP_ENTIDADES, CARGOS, type AfpEntidad, type Regimen } from '../../../../shared/models/tipos';
import { Icon } from '../../../../shared/ui/Icon';
import { EntradaInput } from '../../../../shared/ui/EntradaInput';
import { claseValidacion, dniValido, nombreValido } from '../../../../shared/validators/formularios';
import type { Empleado, EmpleadoDto, HijoEmpleado } from '../../domain/empleado.model';

interface EmpleadoFormProps {
  empleado: Empleado | null;
  guardando: boolean;
  onGuardar: (dto: EmpleadoDto) => void;
  onCancelar: () => void;
  onLimpiarRef?: (limpiar: () => void) => void;
}

type HijoForm = {
  id: string;
  nombre: string;
  edad: string;
};

const MSG_EDAD_SIN_ASIGNACION =
  'No aplica asignación familiar: el hijo debe tener menos de 18 años. Corrige la edad o elimina el registro.';

const nuevoHijo = (): HijoForm => ({ id: crypto.randomUUID(), nombre: '', edad: '' });

const aHijosForm = (hijos: HijoEmpleado[]): HijoForm[] =>
  hijos.map((h) => ({ id: crypto.randomUUID(), nombre: h.nombre, edad: String(h.edad) }));

const vacio = () => ({
  dni: '',
  nombre: '',
  cargo: '',
  sueldoBase: '',
  regimen: '' as Regimen | '',
  afp: '' as AfpEntidad | '',
  tieneHijos: false,
  hijos: [] as HijoForm[],
});

const edadNum = (edad: string): number | null => {
  if (edad === '') return null;
  const n = Number(edad);
  return Number.isInteger(n) ? n : null;
};

const hijoSinAsignacion = (h: HijoForm): boolean => {
  const n = edadNum(h.edad);
  return n !== null && n >= 18;
};

const hijoValido = (h: HijoForm): boolean => {
  const n = edadNum(h.edad);
  return nombreValido(h.nombre) && n !== null && n >= 0 && n < 18;
};

export function EmpleadoForm({ empleado, guardando, onGuardar, onCancelar, onLimpiarRef }: EmpleadoFormProps) {
  const [form, setForm] = useState(vacio);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hijosIntento, setHijosIntento] = useState(false);
  const [hijoEntranteId, setHijoEntranteId] = useState<string | null>(null);

  const limpiar = () => {
    setForm(vacio());
    setTouched({});
    setHijosIntento(false);
    setHijoEntranteId(null);
  };

  useEffect(() => {
    onLimpiarRef?.(limpiar);
  }, [onLimpiarRef]);

  useEffect(() => {
    if (!hijoEntranteId) return;
    const t = window.setTimeout(() => setHijoEntranteId(null), 320);
    return () => window.clearTimeout(t);
  }, [hijoEntranteId]);

  useEffect(() => {
    if (empleado) {
      const hijos = empleado.tieneHijos
        ? empleado.hijos?.length
          ? aHijosForm(empleado.hijos)
          : [nuevoHijo()]
        : [];
      setForm({
        dni: empleado.dni,
        nombre: empleado.nombre,
        cargo: empleado.cargo,
        sueldoBase: String(empleado.sueldoBase),
        regimen: empleado.regimen,
        afp: empleado.regimen === 'AFP' && empleado.afp ? empleado.afp : '',
        tieneHijos: empleado.tieneHijos,
        hijos,
      });
      setTouched({});
      setHijosIntento(false);
    } else {
      limpiar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empleado?.id]);

  const sueldoNum = Number(form.sueldoBase);
  const afpOk = form.regimen !== 'AFP' || form.afp !== '';
  const hijosOk =
    !form.tieneHijos || (form.hijos.length > 0 && form.hijos.every(hijoValido) && !form.hijos.some(hijoSinAsignacion));
  const valid =
    dniValido(form.dni) &&
    nombreValido(form.nombre) &&
    form.cargo !== '' &&
    form.regimen !== '' &&
    afpOk &&
    Number.isFinite(sueldoNum) &&
    sueldoNum > 0 &&
    sueldoNum <= 1_000_000 &&
    hijosOk;

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    setHijosIntento(form.tieneHijos);
    const marcas: Record<string, boolean> = {
      dni: true,
      nombre: true,
      cargo: true,
      regimen: true,
      sueldoBase: true,
      afp: true,
    };
    if (form.tieneHijos) {
      for (const h of form.hijos) {
        marcas[`hijo-nombre-${h.id}`] = true;
        marcas[`hijo-edad-${h.id}`] = true;
      }
    }
    setTouched((t) => ({ ...t, ...marcas }));
    if (!valid) return;
    onGuardar({
      dni: form.dni,
      nombre: form.nombre,
      cargo: form.cargo,
      sueldoBase: sueldoNum,
      regimen: form.regimen as Regimen,
      afp: form.regimen === 'AFP' ? (form.afp as AfpEntidad) : null,
      tieneHijos: form.tieneHijos,
      hijos: form.tieneHijos
        ? form.hijos.map((h) => ({ nombre: h.nombre, edad: edadNum(h.edad) ?? 0 }))
        : [],
    });
  };

  const mark = (campo: string) => setTouched((t) => ({ ...t, [campo]: true }));

  const cambiarRegimen = (regimen: Regimen | '') => {
    setForm((f) => ({
      ...f,
      regimen,
      afp: regimen === 'AFP' ? f.afp : '',
    }));
  };

  const toggleHijos = (checked: boolean) => {
    setHijosIntento(false);
    setForm((f) => ({
      ...f,
      tieneHijos: checked,
      hijos: checked ? (f.hijos.length ? f.hijos : [nuevoHijo()]) : [],
    }));
  };

  const actualizarHijo = (id: string, patch: Partial<Pick<HijoForm, 'nombre' | 'edad'>>) => {
    setForm((f) => ({
      ...f,
      hijos: f.hijos.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    }));
  };

  const agregarHijo = () => {
    const hijo = nuevoHijo();
    setHijoEntranteId(hijo.id);
    setForm((f) => ({ ...f, hijos: [...f.hijos, hijo] }));
  };

  const quitarHijo = (id: string) => {
    setForm((f) => {
      if (f.hijos.length <= 1) return f;
      return { ...f, hijos: f.hijos.filter((h) => h.id !== id) };
    });
  };

  return (
    <form className="panel" onSubmit={enviar} noValidate>
      <div className="panel-head">
        <h2 className="panel-title">{empleado ? 'Editar empleado' : 'Registrar empleado'}</h2>
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="dni">
          DNI
        </label>
        <EntradaInput
          id="dni"
          tipo="dni"
          className={`form-control ${claseValidacion(dniValido(form.dni), !dniValido(form.dni), !!touched.dni, !!touched.dni)}`}
          value={form.dni}
          onChange={(dni) => setForm((f) => ({ ...f, dni }))}
          onBlur={() => mark('dni')}
          inputMode="numeric"
          maxLength={8}
          autoComplete="off"
          placeholder="8 dígitos"
        />
        {touched.dni && !dniValido(form.dni) ? <div className="invalid-msg">El DNI debe tener exactamente 8 dígitos.</div> : null}
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="nombre">
          Nombres y apellidos
        </label>
        <EntradaInput
          id="nombre"
          tipo="nombre"
          className={`form-control ${claseValidacion(nombreValido(form.nombre), !nombreValido(form.nombre), !!touched.nombre, !!touched.nombre)}`}
          value={form.nombre}
          onChange={(nombre) => setForm((f) => ({ ...f, nombre }))}
          onBlur={() => mark('nombre')}
          maxLength={60}
          autoComplete="off"
        />
        {touched.nombre && !nombreValido(form.nombre) ? (
          <div className="invalid-msg">Solo letras (3 a 60 caracteres).</div>
        ) : null}
      </div>

      <div className="row">
        <div className="col-sm-6 mb-3">
          <label className="form-label" htmlFor="cargo">
            Cargo
          </label>
          <select
            id="cargo"
            className={`form-select ${form.cargo || !touched.cargo ? '' : 'is-invalid'}`}
            value={form.cargo}
            onChange={(e) => setForm((f) => ({ ...f, cargo: e.target.value }))}
            onBlur={() => mark('cargo')}
          >
            <option value="">Selecciona…</option>
            {CARGOS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="col-sm-6 mb-3">
          <label className="form-label" htmlFor="regimen">
            Sistema de pensiones
          </label>
          <select
            id="regimen"
            className={`form-select ${form.regimen || !touched.regimen ? '' : 'is-invalid'}`}
            value={form.regimen}
            onChange={(e) => cambiarRegimen(e.target.value as Regimen | '')}
            onBlur={() => mark('regimen')}
          >
            <option value="">Selecciona…</option>
            <option value="AFP">AFP</option>
            <option value="ONP">ONP</option>
          </select>
        </div>
      </div>

      <section
        className={`regimen-afp${form.regimen === 'AFP' ? ' regimen-afp--open' : ''}`}
        aria-hidden={form.regimen !== 'AFP'}
        inert={form.regimen !== 'AFP'}
      >
        <div className="regimen-afp__collapse">
          <div className="regimen-afp__inner">
            <h3 className="regimen-afp__title">Administradora de fondos de pensiones</h3>
            <p className="regimen-afp__hint">
              Indica en qué AFP está o estará afiliado el trabajador (supervisadas por la SBS).
            </p>
            <label className="form-label" htmlFor="afp">AFP</label>
            <select
              id="afp"
              className={`form-select ${form.afp || !touched.afp ? '' : 'is-invalid'}`}
              value={form.afp}
              onChange={(e) => setForm((f) => ({ ...f, afp: e.target.value as AfpEntidad | '' }))}
              onBlur={() => mark('afp')}
              disabled={form.regimen !== 'AFP'}
            >
              <option value="">Selecciona la AFP…</option>
              {AFP_ENTIDADES.map((entidad) => (
                <option key={entidad} value={entidad}>
                  AFP {entidad}
                </option>
              ))}
            </select>
            {touched.afp && form.regimen === 'AFP' && !form.afp ? (
              <div className="invalid-msg">Elige la administradora AFP del empleado.</div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="mb-3">
        <label className="form-label" htmlFor="sueldoBase">
          Sueldo básico (S/)
        </label>
        <EntradaInput
          id="sueldoBase"
          tipo="decimal"
          limites={{ max: 1_000_000, decimales: 2 }}
          className={`form-control ${claseValidacion(sueldoNum > 0, !(sueldoNum > 0), !!touched.sueldoBase, !!touched.sueldoBase)}`}
          value={form.sueldoBase}
          onChange={(sueldoBase) => setForm((f) => ({ ...f, sueldoBase }))}
          onBlur={() => mark('sueldoBase')}
          inputMode="decimal"
          autoComplete="off"
        />
        {touched.sueldoBase && !(sueldoNum > 0) ? <div className="invalid-msg">Ingresa un sueldo mayor que 0.</div> : null}
      </div>

      <section
        className={`hijos-asignacion${form.tieneHijos ? ' hijos-asignacion--open' : ''}`}
        aria-labelledby="tieneHijos"
      >
        <div className="hijos-asignacion__toggle">
          <div className="hijos-asignacion__check">
            <input
              id="tieneHijos"
              type="checkbox"
              className="form-check-input hijos-asignacion__input"
              checked={form.tieneHijos}
              onChange={(e) => toggleHijos(e.target.checked)}
            />
            <div className="hijos-asignacion__check-text">
              <label className="hijos-asignacion__label" htmlFor="tieneHijos">
                Tiene hijos menores (asignación familiar)
              </label>
              <p className="hijos-asignacion__hint">
                Registra nombre y edad de cada hijo menor de 18 años para calcular la asignación familiar.
              </p>
            </div>
          </div>
        </div>

        <div className="hijos-asignacion__collapse" aria-hidden={!form.tieneHijos} inert={!form.tieneHijos}>
          <div className="hijos-asignacion__collapse-inner">
            <div className="hijos-asignacion__head">
              <h3 className="hijos-asignacion__head-title">
                Hijos registrados
                <span className="hijos-asignacion__count">{form.hijos.length}</span>
              </h3>
              <button type="button" className="btn btn-sm btn-outline-primary" onClick={agregarHijo}>
                Agregar hijo
              </button>
            </div>

            <ul className="hijos-asignacion__lista">
              {form.hijos.map((h, indice) => {
                const nombreTocado = !!touched[`hijo-nombre-${h.id}`];
                const edadTocada = !!touched[`hijo-edad-${h.id}`];
                const sinAsignacion = hijoSinAsignacion(h);
                const nombreOk = nombreValido(h.nombre);
                const edadN = edadNum(h.edad);
                const edadOk = edadN !== null && edadN >= 0 && edadN < 18;
                const mostrarErrorEdad = (edadTocada || hijosIntento) && sinAsignacion;
                const fichaInvalida = mostrarErrorEdad;

                return (
                  <li
                    key={h.id}
                    className={`hijo-ficha${fichaInvalida ? ' hijo-ficha--invalid' : ''}${h.id === hijoEntranteId ? ' hijo-ficha--enter' : ''}`}
                  >
                    <div className="hijo-ficha__head">
                      <span className="hijo-ficha__index">Hijo {indice + 1}</span>
                      {form.hijos.length > 1 ? (
                        <button
                          type="button"
                          className="hijo-ficha__quitar"
                          aria-label={`Quitar hijo ${indice + 1}`}
                          onClick={() => quitarHijo(h.id)}
                        >
                          <Icon nombre="trash" />
                        </button>
                      ) : null}
                    </div>
                    <div className="row g-2">
                      <div className="col-sm-7">
                        <label className="form-label" htmlFor={`hijo-nombre-${h.id}`}>Nombre</label>
                        <EntradaInput
                          id={`hijo-nombre-${h.id}`}
                          tipo="nombre"
                          className={`form-control ${claseValidacion(nombreOk, !nombreOk, nombreTocado, nombreTocado)}`}
                          value={h.nombre}
                          onChange={(nombre) => actualizarHijo(h.id, { nombre })}
                          onBlur={() => mark(`hijo-nombre-${h.id}`)}
                          maxLength={60}
                          autoComplete="off"
                          placeholder="Nombre completo"
                        />
                        {nombreTocado && !nombreOk ? (
                          <div className="invalid-msg">Solo letras (3 a 60 caracteres).</div>
                        ) : null}
                      </div>
                      <div className="col-sm-5">
                        <label className="form-label" htmlFor={`hijo-edad-${h.id}`}>Edad (años)</label>
                        <EntradaInput
                          id={`hijo-edad-${h.id}`}
                          tipo="entero"
                          limites={{ min: 0, max: 99 }}
                          className={`form-control ${claseValidacion(edadOk && !sinAsignacion, !edadOk || sinAsignacion, edadTocada, edadTocada)}`}
                          value={h.edad}
                          onChange={(edad) => actualizarHijo(h.id, { edad })}
                          onBlur={() => mark(`hijo-edad-${h.id}`)}
                          inputMode="numeric"
                          maxLength={2}
                          autoComplete="off"
                          placeholder="0–17"
                          aria-invalid={mostrarErrorEdad || undefined}
                          aria-describedby={mostrarErrorEdad ? `hijo-edad-msg-${h.id}` : undefined}
                        />
                        {mostrarErrorEdad ? (
                          <div className="invalid-msg" id={`hijo-edad-msg-${h.id}`} role="alert">
                            {MSG_EDAD_SIN_ASIGNACION}
                          </div>
                        ) : (edadTocada || hijosIntento) && h.edad !== '' && !edadOk && !sinAsignacion ? (
                          <div className="invalid-msg">Indica una edad válida menor de 18 años.</div>
                        ) : null}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-primary" disabled={!valid || guardando}>
          {empleado ? 'Guardar cambios' : 'Guardar empleado'}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => (empleado ? onCancelar() : limpiar())}
        >
          {empleado ? 'Cancelar' : 'Limpiar'}
        </button>
      </div>
    </form>
  );
}
