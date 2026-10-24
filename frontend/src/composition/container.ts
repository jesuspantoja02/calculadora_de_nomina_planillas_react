import { ConfiguracionService } from '../modules/configuracion/application/configuracion.service';
import { HttpConfiguracionRepository } from '../modules/configuracion/infrastructure/http-configuracion.repository';
import { DashboardService } from '../modules/dashboard/application/dashboard.service';
import { HttpDashboardRepository } from '../modules/dashboard/infrastructure/http-dashboard.repository';
import { EmpleadosService } from '../modules/empleados/application/empleados.service';
import { HttpEmpleadosRepository } from '../modules/empleados/infrastructure/http-empleados.repository';
import { PagosService } from '../modules/planilla/application/pagos.service';
import { HttpPagosRepository } from '../modules/planilla/infrastructure/http-pagos.repository';
import { UsuariosService } from '../modules/usuarios/application/usuarios.service';
import { HttpUsuariosRepository } from '../modules/usuarios/infrastructure/http-usuarios.repository';

/** Raíz de composición del frontend: único lugar donde se enlazan puertos con adaptadores HTTP. */
const empleadosRepository = new HttpEmpleadosRepository();
const pagosRepository = new HttpPagosRepository();
const dashboardRepository = new HttpDashboardRepository();
const configuracionRepository = new HttpConfiguracionRepository();
const usuariosRepository = new HttpUsuariosRepository();

export const container = {
  empleados: new EmpleadosService(empleadosRepository),
  pagos: new PagosService(pagosRepository),
  dashboard: new DashboardService(dashboardRepository),
  configuracion: new ConfiguracionService(configuracionRepository),
  usuarios: new UsuariosService(usuariosRepository),
} as const;
