import { useEffect, useState } from 'react';
import { AFP_ENTIDADES, CARGOS, type AfpEntidad, type Regimen } from '../../../../shared/models/tipos';
import { useDebouncedValue } from '../../../../shared/hooks/useDebouncedValue';
import { EntradaInput } from '../../../../shared/ui/EntradaInput';
import { rangoSalarialInvalido } from '../../../../shared/validators/formularios';
import type { FiltroEmpleados } from '../../domain/empleado.model';

/** Valor del selector unificado de sistema de pensión. */
type PensionFiltro = '' | 'ONP' | 'AFP' | `AFP:${AfpEntidad}`;

function pensionDesdeFiltros(regimen?: Regimen | '', afp?: AfpEntidad | ''): PensionFiltro {
  if (afp && AFP_ENTIDADES.includes(afp)) return `AFP:${afp}`;
  if (regimen === 'ONP') return 'ONP';
  if (regimen === 'AFP') return 'AFP';
  return '';
}

function filtrosDesdePension(pension: PensionFiltro): Pick<FiltroEmpleados, 'regimen' | 'afp'> {
  if (pension === 'ONP') return { regimen: 'ONP' };
  if (pension === 'AFP') return { regimen: 'AFP' };
  if (pension.startsWith('AFP:')) {
    const entidad = pension.slice(4) as AfpEntidad;
    if (AFP_ENTIDADES.includes(entidad)) return { regimen: 'AFP', afp: entidad };
  }
  return {};
}

export function pensionInicialDesdeUrl(regimen?: string | null, afp?: string | null): PensionFiltro {
  const entidad = afp && AFP_ENTIDADES.includes(afp as AfpEntidad) ? (afp as AfpEntidad) : '';
  return pensionDesdeFiltros(
    regimen === 'AFP' || regimen === 'ONP' ? regimen : '',
    entidad,
  );
}

interface EmpleadoFiltrosProps {
  pensionInicial?: PensionFiltro;
  onCambio: (filtros: FiltroEmpleados) => void;
}

export function EmpleadoFiltros({ pensionInicial = '', onCambio }: EmpleadoFiltrosProps) {
  const [cargo, setCargo] = useState('');
  const [pension, setPension] = useState<PensionFiltro>(pensionInicial);
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  useEffect(() => {
    setPension(pensionInicial);
  }, [pensionInicial]);

  const debounced = useDebouncedValue({ cargo, pension, min, max }, 250);
  const rangoInvalido = rangoSalarialInvalido(debounced.min, debounced.max);

  useEffect(() => {
    if (rangoInvalido) return;
    const f: FiltroEmpleados = { ...filtrosDesdePension(debounced.pension) };
    if (debounced.cargo) f.cargo = debounced.cargo;
    const minN = debounced.min !== '' ? Number(debounced.min) : null;
    const maxN = debounced.max !== '' ? Number(debounced.max) : null;
    if (minN !== null && Number.isFinite(minN)) f.min = minN;
    if (maxN !== null && Number.isFinite(maxN)) f.max = maxN;
    onCambio(f);
  }, [debounced, rangoInvalido, onCambio]);

  const limpiar = () => {
    setCargo('');
    setPension('');
    setMin('');
    setMax('');
  };

  return (
    <form className="empleado-filtros row g-2 mb-3" onSubmit={(e) => e.preventDefault()}>
      <div className="col-12 col-md-3">
        <select className="form-select form-select-sm" value={cargo} onChange={(e) => setCargo(e.target.value)} aria-label="Filtrar por cargo">
          <option value="">Todos los cargos</option>
          {CARGOS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="col-12 col-md-3">
        <select
          className="form-select form-select-sm"
          value={pension}
          onChange={(e) => setPension(e.target.value as PensionFiltro)}
          aria-label="Filtrar por sistema de pensión"
        >
          <option value="">Todos los sistemas</option>
          <option value="ONP">ONP</option>
          <option value="AFP">Todas las AFP</option>
          <optgroup label="Por administradora AFP">
            {AFP_ENTIDADES.map((entidad) => (
              <option key={entidad} value={`AFP:${entidad}`}>
                AFP {entidad}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      <div className="col-6 col-md-2">
        <EntradaInput
          tipo="decimal"
          limites={{ max: 1_000_000, decimales: 2 }}
          className={`form-control form-control-sm${rangoInvalido ? ' is-invalid' : ''}`}
          placeholder="Mín"
          value={min}
          onChange={setMin}
          inputMode="decimal"
          autoComplete="off"
          aria-label="Sueldo mínimo"
        />
      </div>
      <div className="col-6 col-md-2">
        <EntradaInput
          tipo="decimal"
          limites={{ max: 1_000_000, decimales: 2 }}
          className={`form-control form-control-sm${rangoInvalido ? ' is-invalid' : ''}`}
          placeholder="Máx"
          value={max}
          onChange={setMax}
          inputMode="decimal"
          autoComplete="off"
          aria-label="Sueldo máximo"
        />
      </div>
      <div className="col-12 col-md-2 d-md-flex align-items-stretch">
        <button type="button" className="btn btn-sm btn-outline-secondary empleado-filtros__limpiar" onClick={limpiar}>
          Limpiar
        </button>
      </div>
      {rangoInvalido ? <div className="invalid-msg">El mínimo no puede ser mayor que el máximo.</div> : null}
    </form>
  );
}
