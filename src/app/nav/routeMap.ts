/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROUTE MAP - Single Source of Truth for All Routes
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This file documents every route in the navigation manifest and maps it to
 * its corresponding screen component.
 * 
 * Status Legend:
 * - ✅ IMPLEMENTED: Real screen with full functionality
 * - 🚧 STUB: Uses SkeletonStub component (to be replaced with ComingSoon)
 * - ❌ MISSING: No component wired up
 */

import type { Role } from './navManifest';

export interface RouteMapping {
  /** The route path */
  path: string;
  
  /** Display name from navigation */
  label: string;
  
  /** Which domain this belongs to */
  domain: string;
  
  /** Implementation status */
  status: 'implemented' | 'stub' | 'missing';
  
  /** Component name that renders this route */
  component: string;
  
  /** Which roles can access */
  roles: Role[];
  
  /** Short description */
  description?: string;
}

/**
 * Complete route map for all navigation items
 */
export const ROUTE_MAP: RouteMapping[] = [
  // ═══════════════════════════════════════════════════════════════════
  // WORK DOMAIN
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/work/my-work',
    label: 'My Work',
    domain: 'WORK',
    status: 'implemented',
    component: 'W01MyWork',
    roles: ['employee', 'org_admin'],
    description: 'View and manage your assigned work',
  },
  {
    path: '/work/projects',
    label: 'Projects',
    domain: 'WORK',
    status: 'implemented',
    component: 'W02Projects',
    roles: ['org_admin'],
    description: 'Manage organization projects',
  },
  {
    path: '/work/tasks',
    label: 'Tasks',
    domain: 'WORK',
    status: 'implemented',
    component: 'W03Tasks',
    roles: ['org_admin'],
    description: 'Manage tasks across projects',
  },
  {
    path: '/work/milestones',
    label: 'Milestones',
    domain: 'WORK',
    status: 'implemented',
    component: 'W06Milestones',
    roles: ['org_admin'],
    description: 'Track project milestones',
  },
  {
    path: '/work/assignments',
    label: 'Assignments',
    domain: 'WORK',
    status: 'implemented',
    component: 'W04Assignments',
    roles: ['org_admin'],
    description: 'Manage work assignments',
  },
  {
    path: '/work/reports',
    label: 'Work Reports',
    domain: 'WORK',
    status: 'implemented',
    component: 'W05WorkReports',
    roles: ['org_admin'],
    description: 'View work analytics and reports',
  },

  // ═══════════════════════════════════════════════════════════════════
  // PEOPLE DOMAIN
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/people/employees',
    label: 'Employees',
    domain: 'PEOPLE',
    status: 'implemented',
    component: 'P01EmployeeManagement',
    roles: ['org_admin'],
    description: 'Manage employee records and information',
  },
  {
    path: '/people/members',
    label: 'Members',
    domain: 'PEOPLE',
    status: 'implemented',
    component: 'A04Members [Service Layer ✓]',
    roles: ['org_admin'],
    description: 'Manage team members — wired to usePeopleData()',
  },
  {
    path: '/people/departments',
    label: 'Departments',
    domain: 'PEOPLE',
    status: 'implemented',
    component: 'A05Departments',
    roles: ['org_admin'],
    description: 'Manage organizational structure',
  },
  {
    path: '/people/roles-access',
    label: 'Roles & Access',
    domain: 'PEOPLE',
    status: 'implemented',
    component: 'A06RolesAccess',
    roles: ['org_admin'],
    description: 'Configure role-based access control',
  },

  // ═══════════════════════════════════════════════════════════════════
  // TIME DOMAIN
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/time/my-day',
    label: 'My Day',
    domain: 'TIME',
    status: 'implemented',
    component: 'E02MyDay [Service Layer ✓]',
    roles: ['employee'],
    description: 'View your daily schedule and activities — wired to useTimeData()',
  },
  {
    path: '/time/time-logs',
    label: 'Time Logs',
    domain: 'TIME',
    status: 'stub',
    component: 'TimeTracking',
    roles: ['employee', 'org_admin'],
    description: 'Track and review time entries',
  },
  {
    path: '/time/leave',
    label: 'Leave',
    domain: 'TIME',
    status: 'implemented',
    component: 'E05Leave',
    roles: ['employee', 'org_admin'],
    description: 'Request and manage leave',
  },
  {
    path: '/time/my-fines',
    label: 'My Fines',
    domain: 'TIME',
    status: 'implemented',
    component: 'ET01MyFines',
    roles: ['employee'],
    description: 'View your attendance fines',
  },
  {
    path: '/time/corrections',
    label: 'Corrections',
    domain: 'TIME',
    status: 'implemented',
    component: 'A10Corrections',
    roles: ['org_admin'],
    description: 'Review and approve time corrections',
  },
  {
    path: '/time/sessions',
    label: 'Sessions',
    domain: 'TIME',
    status: 'implemented',
    component: 'A07Sessions',
    roles: ['org_admin'],
    description: 'Manage work sessions',
  },
  {
    path: '/time/break-rules',
    label: 'Break Rules',
    domain: 'TIME',
    status: 'implemented',
    component: 'A09BreakRules',
    roles: ['org_admin'],
    description: 'Configure break policies',
  },
  {
    path: '/time/leave-management',
    label: 'Leave Management',
    domain: 'TIME',
    status: 'implemented',
    component: 'A11LeaveManagement [Service Layer ✓]',
    roles: ['org_admin'],
    description: 'Configure leave policies — wired to useTimeData()',
  },
  {
    path: '/time/leave-approvals',
    label: 'Leave Approvals',
    domain: 'TIME',
    status: 'implemented',
    component: 'A12LeaveApprovals [Service Layer ✓]',
    roles: ['org_admin'],
    description: 'Approve or reject leave requests — wired to useTimeData()',
  },
  {
    path: '/time/fines-management',
    label: 'Fines Management',
    domain: 'TIME',
    status: 'implemented',
    component: 'AT01Fines [Service Layer ✓]',
    roles: ['org_admin'],
    description: 'Manage attendance fines — wired to useTimeData()',
  },

  // ═══════════════════════════════════════════════════════════════════
  // FINANCE DOMAIN
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/finance/cockpit',
    label: 'Finance Cockpit',
    domain: 'FINANCE',
    status: 'implemented',
    component: 'FC01FinanceCockpit',
    roles: ['org_admin'],
    description: 'Finance overview dashboard',
  },
  {
    path: '/finance/inbox-approvals',
    label: 'Inbox & Approvals',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceInbox',
    roles: ['org_admin'],
    description: 'Review and approve financial transactions',
  },
  {
    path: '/finance/quick-add',
    label: 'Quick Add',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceQuickAdd',
    roles: ['org_admin'],
    description: 'Quickly add financial transactions',
  },
  {
    path: '/finance/ledger',
    label: 'Ledger',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceLedger',
    roles: ['org_admin'],
    description: 'View general ledger',
  },
  {
    path: '/finance/intelligence',
    label: 'Intelligence',
    domain: 'FINANCE',
    status: 'implemented',
    component: 'FinanceIntelligence',
    roles: ['org_admin'],
    description: 'AI-powered financial insights',
  },
  {
    path: '/finance/accounts-wallets',
    label: 'Accounts & Wallets',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceAccountsWallets',
    roles: ['org_admin'],
    description: 'Manage accounts and wallets',
  },
  {
    path: '/finance/import-center',
    label: 'Import Center',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceImportCenter',
    roles: ['org_admin'],
    description: 'Import financial data',
  },
  {
    path: '/finance/review-decide',
    label: 'Review & Decide',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceReviewDecide',
    roles: ['org_admin'],
    description: 'Review transactions needing decisions',
  },
  {
    path: '/finance/reimbursements',
    label: 'Reimbursements',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceReimbursements',
    roles: ['org_admin'],
    description: 'Process employee reimbursements',
  },
  {
    path: '/finance/payroll-posting',
    label: 'Payroll Posting',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinancePayrollPosting',
    roles: ['org_admin'],
    description: 'Post payroll to ledger',
  },
  {
    path: '/finance/costing-profit',
    label: 'Costing & Profit',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceCostingProfit',
    roles: ['org_admin'],
    description: 'Analyze costs and profitability',
  },
  {
    path: '/finance/reports',
    label: 'Reports',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceReports',
    roles: ['org_admin'],
    description: 'Financial reports and statements',
  },
  {
    path: '/finance/loans-liabilities',
    label: 'Loans & Liabilities',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceLoansLiabilities',
    roles: ['org_admin'],
    description: 'Manage loans and liabilities',
  },
  {
    path: '/finance/team-permissions',
    label: 'Team Permissions',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceTeamPermissions',
    roles: ['org_admin'],
    description: 'Configure finance team access',
  },
  {
    path: '/finance/settings',
    label: 'Finance Settings',
    domain: 'FINANCE',
    status: 'stub',
    component: 'FinanceSettings',
    roles: ['org_admin'],
    description: 'Configure finance module settings',
  },

  // ═══════════════════════════════════════════════════════════════════
  // COMMUNICATION DOMAIN
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/comm/inbox',
    label: 'Inbox',
    domain: 'COMMUNICATION',
    status: 'stub',
    component: 'CommunicateCommunicate',
    roles: ['employee', 'org_admin'],
    description: 'Team communication inbox',
  },
  {
    path: '/comm/chat',
    label: 'Chat',
    domain: 'COMMUNICATION',
    status: 'stub',
    component: 'CommunicateCommunicate',
    roles: ['employee', 'org_admin'],
    description: 'Team chat and messaging',
  },

  // ═══════════════════════════════════════════════════════════════════
  // ANALYTICS DOMAIN
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/analytics/activity',
    label: 'Activity',
    domain: 'ANALYTICS',
    status: 'implemented',
    component: 'A13ActivityOverview [Service Layer ✓]',
    roles: ['employee', 'org_admin'],
    description: 'View activity analytics — wired to useAnalyticsData()',
  },
  {
    path: '/analytics/reports',
    label: 'Reports',
    domain: 'ANALYTICS',
    status: 'implemented',
    component: 'A19Reports [Service Layer ✓]',
    roles: ['org_admin'],
    description: 'Generate and view reports — live KPIs from service layer',
  },

  // ═══════════════════════════════════════════════════════════════════
  // SECURITY & COMPLIANCE DOMAIN
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/security/consent-privacy',
    label: 'Consent & Privacy',
    domain: 'SECURITY',
    status: 'implemented',
    component: 'A20Consent',
    roles: ['org_admin'],
    description: 'Manage consent and privacy settings',
  },
  {
    path: '/security/data-retention',
    label: 'Data Retention',
    domain: 'SECURITY',
    status: 'implemented',
    component: 'A21DataRetention',
    roles: ['org_admin'],
    description: 'Configure data retention policies',
  },
  {
    path: '/security/audit-logs',
    label: 'Audit Logs',
    domain: 'SECURITY',
    status: 'implemented',
    component: 'A22AuditLogs',
    roles: ['org_admin'],
    description: 'View system audit logs',
  },
  {
    path: '/security/security',
    label: 'Security Settings',
    domain: 'SECURITY',
    status: 'implemented',
    component: 'A23Security',
    roles: ['org_admin'],
    description: 'Configure security settings',
  },

  // ═══════════════════════════════════════════════════════════════════
  // PLATFORM DOMAIN
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/platform/settings',
    label: 'Settings',
    domain: 'PLATFORM',
    status: 'stub',
    component: 'PlatformOrgSettings',
    roles: ['org_admin'],
    description: 'Organization settings',
  },
  {
    path: '/platform/billing',
    label: 'Billing',
    domain: 'PLATFORM',
    status: 'implemented',
    component: 'S04PlatformBilling',
    roles: ['org_admin', 'platform_admin'],
    description: 'Manage billing and subscriptions',
  },
  {
    path: '/platform/billing-plans',
    label: 'Billing Plans',
    domain: 'PLATFORM',
    status: 'implemented',
    component: 'A26BillingPlans',
    roles: ['platform_admin'],
    description: 'Manage platform billing plans',
  },

  // ═══════════════════════════════════════════════════════════════════
  // INTEGRATIONS DOMAIN
  // ═══════════════════════════════════════════════════════════════════
  {
    path: '/integrations/list',
    label: 'Integrations',
    domain: 'INTEGRATIONS',
    status: 'implemented',
    component: 'A27Integrations',
    roles: ['org_admin', 'platform_admin'],
    description: 'Manage third-party integrations',
  },
  {
    path: '/integrations/api-docs',
    label: 'API Documentation',
    domain: 'INTEGRATIONS',
    status: 'implemented',
    component: 'A28APIDocs',
    roles: ['org_admin', 'platform_admin'],
    description: 'API documentation and reference',
  },
];

/**
 * Get routes that need ComingSoon page (status: 'stub')
 */
export function getStubRoutes(): RouteMapping[] {
  return ROUTE_MAP.filter(route => route.status === 'stub');
}

/**
 * Get fully implemented routes
 */
export function getImplementedRoutes(): RouteMapping[] {
  return ROUTE_MAP.filter(route => route.status === 'implemented');
}

/**
 * Get route statistics
 */
export function getRouteStats() {
  const total = ROUTE_MAP.length;
  const implemented = ROUTE_MAP.filter(r => r.status === 'implemented').length;
  const stub = ROUTE_MAP.filter(r => r.status === 'stub').length;
  const missing = ROUTE_MAP.filter(r => r.status === 'missing').length;

  return {
    total,
    implemented,
    stub,
    missing,
    implementedPercent: Math.round((implemented / total) * 100),
  };
}