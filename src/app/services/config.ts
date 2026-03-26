/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICE CONFIGURATION — Environment & API Settings
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This file controls whether the app uses MOCK or REAL API implementations.
 *
 * TO SWAP TO REAL API:
 *   1. Set USE_MOCK_SERVICES = false
 *   2. Set API_BASE_URL to your production API endpoint
 *   3. Implement real service classes that match the contracts in contracts.ts
 *   4. Update ServiceProvider.tsx to use real implementations
 *
 * The entire swap affects ~20% of the codebase (this file + ServiceProvider).
 * All screen components stay exactly the same.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/** Master switch: true = in-memory mock, false = real API calls */
export const USE_MOCK_SERVICES = true;

/** Base URL for your real API (only used when USE_MOCK_SERVICES = false) */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yourworkos.com/v1';

/** Auth token header name */
export const AUTH_HEADER = 'Authorization';

/** Request timeout in milliseconds */
export const REQUEST_TIMEOUT = 30_000;

/** Default page size for paginated queries */
export const DEFAULT_PAGE_SIZE = 50;

/**
 * Service endpoints (relative to API_BASE_URL).
 * When you build real services, use these paths.
 */
export const ENDPOINTS = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_ME: '/auth/me',
  AUTH_SWITCH_ORG: '/auth/switch-org',

  // People
  EMPLOYEES: '/people/employees',
  DEPARTMENTS: '/people/departments',
  ROLES: '/people/roles',

  // Time
  TIME_SESSIONS: '/time/sessions',
  TIME_CORRECTIONS: '/time/corrections',
  TIME_LEAVE: '/time/leave',
  TIME_LEAVE_BALANCES: '/time/leave-balances',
  TIME_WORKDAY_RULES: '/time/workday-rules',
  TIME_BREAK_RULES: '/time/break-rules',
  TIME_FINES: '/time/fines',

  // Communication
  CHANNELS: '/communication/channels',
  MESSAGES: '/communication/messages',

  // Analytics
  ACTIVITY_LOG: '/analytics/activity-log',
  PRODUCTIVITY: '/analytics/productivity',
  APP_USAGE: '/analytics/app-usage',
  LIVE_ACTIVITY: '/analytics/live',

  // Notifications
  NOTIFICATIONS: '/notifications',

  // Finance (Phase 8)
  PAYROLL_RUNS: '/finance/payroll-runs',
  PAYSLIPS: '/finance/payslips',
  BILLING_INVOICES: '/finance/billing-invoices',
  OFFLINE_SYNC: '/finance/offline-sync',
  SCREENSHOTS: '/finance/screenshots',

  // Finance Extended (Phase 13) — 11 active sub-domain endpoints
  FINANCE_TRANSACTIONS: '/finance/transactions',
  EXPENSE_REPORTS: '/finance/expense-reports',
  REIMBURSEMENTS: '/finance/reimbursements',
  FINANCE_ACCOUNTS: '/finance/accounts',
  LOANS: '/finance/loans',
  FINANCE_REPORTS: '/finance/reports',
  COST_CENTERS: '/finance/cost-centers',
  FINANCE_INBOX: '/finance/inbox',
  FINANCE_IMPORT: '/finance/import',

  // Finance Extended (Phase 14 — gap closure)
  PAYROLL_POSTINGS: '/finance/payroll-postings',   // ← wired: IFinanceService.getPayrollPostings()

  /**
   * PENDING ENDPOINTS — endpoint declared, real backend not yet wired.
   * FC10FinanceIntelligence uses hardcoded AI suggestions (by design for v1).
   * When a real AI/analytics backend is ready, implement:
   *   IFinanceService.getFinanceIntelligenceSummary(): Promise<FinanceIntelligenceSummary>
   */
  FINANCE_INTELLIGENCE: '/finance/intelligence',

  // Execution OS / Work (Phase 12)
  PROJECTS: '/work/projects',
  TASKS: '/work/tasks',
  SPRINTS: '/work/sprints',
  MILESTONES: '/work/milestones',
  ISSUES: '/work/issues',
  TEAM_MEMBERS: '/work/team-members',
  TIME_LOGS: '/work/time-logs',
  TASK_LISTS: '/work/task-lists',

  /**
   * PENDING ENDPOINT — Work reports are currently served by ExecutionOSContext (in-memory).
   * When migrating Work domain to the ServiceRegistry, implement:
   *   IExecutionOSService.getWorkReports(): Promise<PaginatedResponse<WorkReport>>
   * See SWAP_GUIDE.ts Step 4.
   */
  WORK_REPORTS: '/work/reports',
} as const;

/**
 * Helper: build full URL from endpoint
 */
export function buildUrl(endpoint: string, params?: Record<string, string>): string {
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }
  return url;
}

/**
 * Helper: get auth headers (for real API calls)
 */
export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('workos_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { [AUTH_HEADER]: `Bearer ${token}` } : {}),
  };
}