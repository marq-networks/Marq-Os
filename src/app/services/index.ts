/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICE LAYER — Public API
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Single import point for the entire service layer.
 *
 * Usage in components:
 *   import { useServices, usePeopleData } from '../services';
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Provider
export { ServiceProvider, useServices } from './ServiceProvider';

// Convenience hooks (direct service access)
export {
  useAuthService,
  usePeopleService,
  useTimeService,
  useCommunicationService,
  useAnalyticsService,
  useNotificationService,
  useFinanceService,
} from './ServiceProvider';

// Domain hooks (state-managed, recommended for screens)
export {
  usePeopleData,
  useTimeData,
  useCommunicationData,
  useNotificationData,
  useAnalyticsData,
  useFinanceData,
} from './hooks';

// Config
export { USE_MOCK_SERVICES, API_BASE_URL, ENDPOINTS, buildUrl } from './config';

// API base class (for building real implementations)
export { ApiService } from './ApiService';

// Real API service classes (drop-in replacements for mock provider)
export {
  AuthApiService,
  PeopleApiService,
  TimeApiService,
  CommunicationApiService,
  AnalyticsApiService,
  NotificationApiService,
  FinanceApiService,
  ExecutionOSApiService,
} from './api';

// Types (re-export everything for easy access)
export type * from './types';

// Contracts (for type-only imports)
export type {
  IAuthService,
  IPeopleService,
  ITimeService,
  ICommunicationService,
  IAnalyticsService,
  INotificationService,
  IFinanceService,
  IExecutionOSService,
  ServiceRegistry,
} from './contracts';