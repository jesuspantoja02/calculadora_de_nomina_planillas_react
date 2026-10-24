import { apiGet } from '../../../shared/infrastructure/http/apiClient';
import type { ResumenDashboard } from '../domain/dashboard.model';
import type { DashboardRepository } from '../domain/dashboard.repository';

export class HttpDashboardRepository implements DashboardRepository {
  resumen(): Promise<ResumenDashboard> {
    return apiGet<ResumenDashboard>('/dashboard');
  }
}
