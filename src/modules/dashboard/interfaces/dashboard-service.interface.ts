import { DashboardSummaryResponseDto } from '../dto/dashboard-summary-response.dto';

export const DASHBOARD_SERVICE = Symbol('DASHBOARD_SERVICE');

export interface IDashboardService {
  getSummary(): Promise<DashboardSummaryResponseDto>;
}
