/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TIME API SERVICE — Real HTTP Implementation
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Concrete implementation of ITimeService using real HTTP calls.
 *
 * TO ACTIVATE: In ServiceProvider.tsx replace mock timeService with:
 *   const timeService = new TimeApiService();
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { ApiService } from '../ApiService';
import type { ITimeService } from '../contracts';
import type {
  TimeSession, TimeCorrection, LeaveRequest, LeaveBalance,
  WorkdayRule, BreakRule, Fine,
  QueryParams, PaginatedResponse,
} from '../types';
import { ENDPOINTS } from '../config';

export class TimeApiService extends ApiService implements ITimeService {
  // ─── Sessions ────────────────────────────────────────────────────────────

  async getSessions(params?: QueryParams): Promise<PaginatedResponse<TimeSession>> {
    return this.get<PaginatedResponse<TimeSession>>(ENDPOINTS.TIME_SESSIONS, params as any);
  }

  async getSessionById(id: string): Promise<TimeSession> {
    return this.get<TimeSession>(`${ENDPOINTS.TIME_SESSIONS}/${id}`);
  }

  async clockIn(employeeId: string): Promise<TimeSession> {
    return this.post<TimeSession>(`${ENDPOINTS.TIME_SESSIONS}/clock-in`, { employeeId });
  }

  async clockOut(sessionId: string): Promise<TimeSession> {
    return this.patch<TimeSession>(`${ENDPOINTS.TIME_SESSIONS}/${sessionId}/clock-out`);
  }

  async getActiveSession(employeeId: string): Promise<TimeSession | null> {
    try {
      return await this.get<TimeSession>(
        `${ENDPOINTS.TIME_SESSIONS}/active`,
        { employeeId } as any,
      );
    } catch {
      return null;
    }
  }

  // ─── Corrections ─────────────────────────────────────────────────────────

  async getCorrections(params?: QueryParams): Promise<PaginatedResponse<TimeCorrection>> {
    return this.get<PaginatedResponse<TimeCorrection>>(ENDPOINTS.TIME_CORRECTIONS, params as any);
  }

  async submitCorrection(
    data: Omit<TimeCorrection, 'id' | 'status' | 'submittedAt'>,
  ): Promise<TimeCorrection> {
    return this.post<TimeCorrection>(ENDPOINTS.TIME_CORRECTIONS, data);
  }

  async approveCorrection(id: string, reviewedBy: string): Promise<TimeCorrection> {
    return this.patch<TimeCorrection>(`${ENDPOINTS.TIME_CORRECTIONS}/${id}/approve`, {
      reviewedBy,
    });
  }

  async rejectCorrection(
    id: string,
    reviewedBy: string,
    reason: string,
  ): Promise<TimeCorrection> {
    return this.patch<TimeCorrection>(`${ENDPOINTS.TIME_CORRECTIONS}/${id}/reject`, {
      reviewedBy,
      reason,
    });
  }

  // ─── Leave ───────────────────────────────────────────────────────────────

  async getLeaveRequests(params?: QueryParams): Promise<PaginatedResponse<LeaveRequest>> {
    return this.get<PaginatedResponse<LeaveRequest>>(ENDPOINTS.TIME_LEAVE, params as any);
  }

  async getLeaveRequestById(id: string): Promise<LeaveRequest> {
    return this.get<LeaveRequest>(`${ENDPOINTS.TIME_LEAVE}/${id}`);
  }

  async submitLeaveRequest(
    data: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>,
  ): Promise<LeaveRequest> {
    return this.post<LeaveRequest>(ENDPOINTS.TIME_LEAVE, data);
  }

  async approveLeaveRequest(id: string, approvedBy: string): Promise<LeaveRequest> {
    return this.patch<LeaveRequest>(`${ENDPOINTS.TIME_LEAVE}/${id}/approve`, { approvedBy });
  }

  async rejectLeaveRequest(id: string, reason: string): Promise<LeaveRequest> {
    return this.patch<LeaveRequest>(`${ENDPOINTS.TIME_LEAVE}/${id}/reject`, { reason });
  }

  async cancelLeaveRequest(id: string): Promise<LeaveRequest> {
    return this.patch<LeaveRequest>(`${ENDPOINTS.TIME_LEAVE}/${id}/cancel`);
  }

  async getLeaveBalances(employeeId: string): Promise<LeaveBalance[]> {
    return this.get<LeaveBalance[]>(ENDPOINTS.TIME_LEAVE_BALANCES, { employeeId } as any);
  }

  // ─── Workday Rules ───────────────────────────────────────────────────────

  async getWorkdayRules(): Promise<WorkdayRule[]> {
    return this.get<WorkdayRule[]>(ENDPOINTS.TIME_WORKDAY_RULES);
  }

  async createWorkdayRule(data: Omit<WorkdayRule, 'id'>): Promise<WorkdayRule> {
    return this.post<WorkdayRule>(ENDPOINTS.TIME_WORKDAY_RULES, data);
  }

  async updateWorkdayRule(id: string, data: Partial<WorkdayRule>): Promise<WorkdayRule> {
    return this.patch<WorkdayRule>(`${ENDPOINTS.TIME_WORKDAY_RULES}/${id}`, data);
  }

  async deleteWorkdayRule(id: string): Promise<void> {
    return this.delete(`${ENDPOINTS.TIME_WORKDAY_RULES}/${id}`);
  }

  // ─── Break Rules ─────────────────────────────────────────────────────────

  async getBreakRules(): Promise<BreakRule[]> {
    return this.get<BreakRule[]>(ENDPOINTS.TIME_BREAK_RULES);
  }

  async createBreakRule(data: Omit<BreakRule, 'id'>): Promise<BreakRule> {
    return this.post<BreakRule>(ENDPOINTS.TIME_BREAK_RULES, data);
  }

  async updateBreakRule(id: string, data: Partial<BreakRule>): Promise<BreakRule> {
    return this.patch<BreakRule>(`${ENDPOINTS.TIME_BREAK_RULES}/${id}`, data);
  }

  async deleteBreakRule(id: string): Promise<void> {
    return this.delete(`${ENDPOINTS.TIME_BREAK_RULES}/${id}`);
  }

  // ─── Fines ───────────────────────────────────────────────────────────────

  async getFines(params?: QueryParams): Promise<PaginatedResponse<Fine>> {
    return this.get<PaginatedResponse<Fine>>(ENDPOINTS.TIME_FINES, params as any);
  }

  async getFineById(id: string): Promise<Fine> {
    return this.get<Fine>(`${ENDPOINTS.TIME_FINES}/${id}`);
  }

  async createFine(data: Omit<Fine, 'id' | 'issuedAt'>): Promise<Fine> {
    return this.post<Fine>(ENDPOINTS.TIME_FINES, data);
  }

  async updateFine(id: string, data: Partial<Fine>): Promise<Fine> {
    return this.patch<Fine>(`${ENDPOINTS.TIME_FINES}/${id}`, data);
  }

  async waiveFine(id: string, waivedBy: string, reason: string): Promise<Fine> {
    return this.patch<Fine>(`${ENDPOINTS.TIME_FINES}/${id}/waive`, { waivedBy, reason });
  }

  async getMyFines(employeeId: string): Promise<Fine[]> {
    return this.get<Fine[]>(ENDPOINTS.TIME_FINES, { employeeId, pageSize: 500 } as any);
  }
}
