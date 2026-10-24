import type { ResumenDashboard } from './dashboard.model';

export interface DashboardRepository {
  resumen(): Promise<ResumenDashboard>;
}
