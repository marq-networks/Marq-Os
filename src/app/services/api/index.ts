/**
 * ═══════════════════════════════════════════════════════════════════════════
 * API SERVICE CLASSES — Barrel Export
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Real HTTP implementations of every service contract.
 * These extend ApiService (fetch wrapper) and implement the same interfaces
 * as the mock provider in ServiceProvider.tsx.
 *
 * SWAPPING MOCK → REAL (one file, ~20% of the work):
 * ─────────────────────────────────────────────────
 * In ServiceProvider.tsx, import these classes and instantiate them
 * instead of the inline mock objects:
 *
 *   import { AuthApiService, PeopleApiService, TimeApiService,
 *            CommunicationApiService, AnalyticsApiService,
 *            NotificationApiService, FinanceApiService } from './api';
 *
 *   const authService         = new AuthApiService();
 *   const peopleService       = new PeopleApiService();
 *   const timeService         = new TimeApiService();
 *   const communicationService= new CommunicationApiService();
 *   const analyticsService    = new AnalyticsApiService();
 *   const notificationService = new NotificationApiService();
 *   const financeService      = new FinanceApiService();
 *
 * Also set API_BASE_URL in config.ts and USE_MOCK_SERVICES = false.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export { AuthApiService }          from './AuthApiService';
export { PeopleApiService }        from './PeopleApiService';
export { TimeApiService }          from './TimeApiService';
export { CommunicationApiService } from './CommunicationApiService';
export { AnalyticsApiService }     from './AnalyticsApiService';
export { NotificationApiService }  from './NotificationApiService';
export { FinanceApiService }       from './FinanceApiService';
export { ExecutionOSApiService }   from './ExecutionOSApiService';