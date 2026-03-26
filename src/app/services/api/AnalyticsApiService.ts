/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ANALYTICS API SERVICE — Real HTTP Implementation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Concrete implementation of IAnalyticsService using real HTTP calls.
 *
 * TO ACTIVATE: In ServiceProvider.tsx replace mock analyticsService with:
 *   const analyticsService = new AnalyticsApiService();
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ApiService } from '../ApiService';
import type { IAnalyticsService } from '../contracts';
import type {
  ActivityLogEntry, ProductivityMetric, AppUsageReport,
  QueryParams, PaginatedResponse,
} from '../types';
import { ENDPOINTS } from '../config';

export class AnalyticsApiService extends ApiService implements IAnalyticsService {
  async getActivityLog(
    params?: QueryParams,
  ): Promise<PaginatedResponse<ActivityLogEntry>> {
    return this.get<PaginatedResponse<ActivityLogEntry>>(
      ENDPOINTS.ACTIVITY_LOG,
      params as any,
    );
  }

  async getProductivityMetrics(
    dateFrom: string,
    dateTo: string,
    departmentId?: string,
  ): Promise<ProductivityMetric[]> {
    return this.get<ProductivityMetric[]>(ENDPOINTS.PRODUCTIVITY, {
      dateFrom,
      dateTo,
      ...(departmentId ? { departmentId } : {}),
    } as any);
  }

  async getAppUsageReports(
    dateFrom: string,
    dateTo: string,
  ): Promise<AppUsageReport[]> {
    return this.get<AppUsageReport[]>(ENDPOINTS.APP_USAGE, {
      dateFrom,
      dateTo,
    } as any);
  }

  async getLiveActivity(): Promise<{
    activeUsers: number;
    totalUsers: number;
    byDepartment: Record<string, number>;
    recentActions: ActivityLogEntry[];
  }> {
    return this.get(ENDPOINTS.LIVE_ACTIVITY);
  }
}
