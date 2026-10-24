import type { ResumenDashboard } from '../domain/dashboard.model';
import type { DashboardRepository } from '../domain/dashboard.repository';

export class DashboardService {
  constructor(private readonly repository: DashboardRepository) {}

  resumen(): Promise<ResumenDashboard> {
    return this.repository.resumen();
  }
}
