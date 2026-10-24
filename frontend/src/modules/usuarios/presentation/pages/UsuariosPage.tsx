import { useCallback, useRef } from 'react';
import { useAuth } from '../../../../core/auth/AuthContext';
import { esAdmin } from '../../../../core/auth/roles';
import { PageHeader } from '../../../../shared/ui/PageHeader';
import { UsuarioForm } from '../components/UsuarioForm';
import { UsuarioLista } from '../components/UsuarioLista';
import type { UsuarioCuenta } from '../../domain/usuario.model';
import { useUsuariosStore } from '../hooks/useUsuariosStore';

export function UsuariosPage() {
  const { rol, userId } = useAuth();
  const admin = esAdmin(rol);
  const store = useUsuariosStore(admin);
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

  const titulo = admin ? 'Usuarios del sistema' : 'Agregar nuevo usuario';
  const descripcion = admin
    ? 'Cuentas con acceso a planilla, empleados y configuración según su rol.'
    : 'Registra una cuenta nueva con el rol permitido para tu perfil. No verás el listado de cuentas existentes.';

  return (
    <>
      <PageHeader
        titulo={titulo}
        descripcion={descripcion}
        acciones={
          admin ? (
            <a className="btn btn-primary" href="#alta-usuario">
              Nueva cuenta
            </a>
          ) : undefined
        }
      />

      <div className={`row g-4${admin ? '' : ' justify-content-center'}`}>
        <section className={admin ? 'col-xl-5' : 'col-lg-6 usuarios-solo-alta'} id="alta-usuario">
          <UsuarioForm
            cuenta={admin ? store.editando : null}
            rolesAsignables={store.rolesAsignables}
            guardando={store.guardando}
            soloAlta={!admin}
            onGuardar={onGuardar}
            onCancelar={() => store.editar(null)}
            onLimpiarRef={(fn) => {
              limpiarFormRef.current = fn;
            }}
          />
        </section>

        {admin ? (
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
        ) : null}
      </div>
    </>
  );
}
