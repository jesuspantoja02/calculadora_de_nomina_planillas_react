import { useCallback, useRef } from 'react';
import { useAuth } from '../../../../core/auth/AuthContext';
import { PageHeader } from '../../../../shared/ui/PageHeader';
import { UsuarioForm } from '../components/UsuarioForm';
import { UsuarioLista } from '../components/UsuarioLista';
import type { UsuarioCuenta } from '../../domain/usuario.model';
import { useUsuariosStore } from '../hooks/useUsuariosStore';

export function UsuariosPage() {
  const store = useUsuariosStore();
  const { userId } = useAuth();
  const limpiarFormRef = useRef<(() => void) | null>(null);

  const onGuardar = useCallback(
    async (dto: Parameters<typeof store.guardar>[0], esNuevo: boolean) => {
      const ok = await store.guardar(dto, esNuevo);
      if (ok && esNuevo) limpiarFormRef.current?.();
    },
    [store],
  );

  const onEliminar = (u: UsuarioCuenta) => {
    if (confirm(`¿Eliminar la cuenta «${u.usuario}»? No podrá volver a iniciar sesión.`)) void store.eliminar(u);
  };

  return (
    <>
      <PageHeader
        titulo="Usuarios del sistema"
        descripcion="Cuentas con acceso a planilla, empleados y configuración según su rol."
        acciones={
          <a className="btn btn-primary" href="#alta-usuario">
            Nueva cuenta
          </a>
        }
      />

      <div className="row g-4">
        <section className="col-xl-5" id="alta-usuario">
          <UsuarioForm
            cuenta={store.editando}
            rolesAsignables={store.rolesAsignables}
            guardando={store.guardando}
            onGuardar={onGuardar}
            onCancelar={() => store.editar(null)}
            onLimpiarRef={(fn) => {
              limpiarFormRef.current = fn;
            }}
          />
        </section>

        <section className="col-xl-7">
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">
                Cuentas activas <span className="count">{store.items.length}</span>
              </h2>
            </div>
            <UsuarioLista
              items={store.items}
              cargando={store.cargando}
              editandoId={store.editando?.id ?? null}
              sesionId={userId}
              onEditar={store.editar}
              onEliminar={onEliminar}
            />
          </div>
        </section>
      </div>
    </>
  );
}
