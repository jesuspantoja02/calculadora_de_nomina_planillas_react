import { useCallback, useEffect, useRef, useState } from 'react';
import { container } from '../../../../composition/container';
import { useToast } from '../../../../core/notifications/ToastContext';
import { PageHeader } from '../../../../shared/ui/PageHeader';
import { useApiAction } from '../../../../shared/presentation/useApiAction';
import type { Empleado } from '../../../empleados/domain/empleado.model';
import { Boleta } from '../components/Boleta';
import { PagoForm } from '../components/PagoForm';
import type { Boleta as BoletaModel, PagoDto } from '../../domain/pago.model';

export function ProcesarPagoPage() {
  const toast = useToast();
  const run = useApiAction();
  const limpiarFormRef = useRef<(() => void) | null>(null);

  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [vistaPrevia, setVistaPrevia] = useState<BoletaModel | null>(null);
  const [emitida, setEmitida] = useState<BoletaModel | null>(null);
  const [guardando, setGuardando] = useState(false);
  const simSeq = useRef(0);

  useEffect(() => {
    void container.empleados.listar().then(setEmpleados).catch(() => setEmpleados([]));
  }, []);

  const previsualizar = useCallback(
    (dto: PagoDto | null) => {
      if (emitida) return;
      if (!dto) {
        setVistaPrevia(null);
        return;
      }
      const seq = ++simSeq.current;
      void container.pagos
        .simular(dto)
        .then((b) => {
          if (seq === simSeq.current) setVistaPrevia(b);
        })
        .catch(() => {
          if (seq === simSeq.current) setVistaPrevia(null);
        });
    },
    [emitida],
  );

  const emitir = async (dto: PagoDto) => {
    setGuardando(true);
    const pago = await run(() => container.pagos.emitir(dto));
    setGuardando(false);
    if (pago) {
      setEmitida(pago);
      toast.exito(`Boleta emitida para ${pago.nombre}.`);
    }
  };

  const nuevoPago = () => {
    setEmitida(null);
    setVistaPrevia(null);
    simSeq.current++;
    limpiarFormRef.current?.();
  };

  return (
    <>
      <PageHeader
        titulo="Procesar pago"
        descripcion="Calcula y emite la boleta de un empleado. La vista previa se actualiza mientras completas el formulario."
      />

      <div className="row g-4">
        <section className="col-xl-5">
          <PagoForm
            empleados={empleados}
            guardando={guardando}
            onPrevisualizar={previsualizar}
            onEmitir={emitir}
            onLimpiarRef={(fn) => {
              limpiarFormRef.current = fn;
            }}
          />
        </section>

        <section className="col-xl-7">
          {emitida ? (
            <>
              <div className="alert alert-success no-print d-flex justify-content-between align-items-center">
                <span>Boleta emitida y guardada en el historial.</span>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={nuevoPago}>
                  Nuevo pago
                </button>
              </div>
              <Boleta boleta={emitida} />
            </>
          ) : vistaPrevia ? (
            <>
              <div className="alert alert-info no-print">Vista previa — aún no emitida.</div>
              <Boleta boleta={vistaPrevia} mostrarImprimir={false} />
            </>
          ) : (
            <div className="panel empty">Selecciona un empleado para ver la boleta.</div>
          )}
        </section>
      </div>
    </>
  );
}
