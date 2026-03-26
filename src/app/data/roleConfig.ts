/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROLE CONFIGURATION - SINGLE SOURCE OF TRUTH
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This is the ONLY file that defines role-based navigation and routing.
 * All sidebar items, allowed routes, and default landings come from here.
 * 
 * Based on: WorkOS Skeleton v1 (LOCKED) + Navigation Skeleton Core
 */

export type RoleKey = 'employee' | 'org_admin' | 'platform_admin';

export interface DomainNavItem {
  id: string;
  label: string;
  icon?: string;
  path?: string;
  badge?: number;
  children?: ChildNavItem[];
}

export interface ChildNavItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  badge?: number;
}

export interface RoleConfig {
  label: string;
  basePath: string;
  defaultRoute: string;
  allowedPrefixes: string[];
  sidebar: DomainNavItem[];
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ROLE CONFIGURATION MAP
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const roleConfig: Record<RoleKey, RoleConfig> = {
  /**
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * EMPLOYEE — Personal Workspace
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   */
  employee: {
    label: 'Employee',
    basePath: '/employee',
    defaultRoute: '/work/my-work',
    allowedPrefixes: ['/employee', '/work', '/time', '/money', '/communicate', '/activity'],
    sidebar: [
      {
        id: 'execution-os',
        label: 'EXECUTION OS',
        children: [
          { id: 'my-work', label: 'My Work', path: '/work/my-work', badge: 3 },
          { id: 'projects', label: 'Projects', path: '/work/projects' },
          { id: 'tasks', label: 'Tasks', path: '/work/tasks' },
          { id: 'milestones', label: 'Milestones', path: '/work/milestones' },
          { id: 'assignments', label: 'Assignments', path: '/work/assignments' },
          { id: 'calendar', label: 'Calendar', path: '/work/calendar' },
          { id: 'email', label: 'Email', path: '/work/email' },
          { id: 'reports', label: 'Reports', path: '/work/reports' },
        ],
      },
      {
        id: 'my-workspace',
        label: 'MY WORKSPACE',
        children: [
          { id: 'dashboard', label: 'Dashboard', path: '/employee/dashboard' },
          { id: 'my-day', label: 'My Day', path: '/employee/my-day' },
          { id: 'my-activity', label: 'My Activity', path: '/employee/my-activity' },
          { id: 'communicate', label: 'Messages', path: '/employee/communicate', badge: 12 },
        ],
      },
      {
        id: 'time',
        label: 'TIME',
        children: [
          { id: 'time-logs', label: 'Time Logs', path: '/employee/time-logs' },
          { id: 'leave', label: 'Leave Requests', path: '/employee/leave' },
          { id: 'my-fines', label: 'My Fines', path: '/employee/my-fines' },
        ],
      },
      {
        id: 'money',
        label: 'MY MONEY',
        children: [
          { id: 'money-dashboard', label: 'Dashboard', path: '/employee/money/dashboard', badge: 3 },
          { id: 'submit-expense', label: 'Submit Expense', path: '/employee/money/submit-expense' },
          { id: 'my-submissions', label: 'My Submissions', path: '/employee/money/my-submissions' },
          { id: 'payslips', label: 'Payslips', path: '/employee/money/payslips-history' },
        ],
      },
      {
        id: 'activity',
        label: 'MY ACTIVITY',
        children: [
          { id: 'activity-overview', label: 'Overview', path: '/employee/activity-overview' },
          { id: 'analytics', label: 'Analytics', path: '/employee/analytics' },
        ],
      },
      {
        id: 'personal',
        label: 'PERSONAL',
        children: [
          { id: 'profile', label: 'Profile', path: '/employee/profile' },
          { id: 'notifications', label: 'Notifications', path: '/employee/notifications', badge: 5 },
        ],
      },
    ],
  },

  /**
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * ORG ADMIN — Control Center
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   */
  org_admin: {
    label: 'Org Admin',
    basePath: '/org',
    defaultRoute: '/org/admin/dashboard',  // Start with admin dashboard
    allowedPrefixes: ['/org', '/admin', '/work', '/people', '/time', '/finance', '/communication', '/activity', '/analytics', '/security', '/platform', '/integrations', '/diagnostics', '/analysis'],
    sidebar: [
      // ═══════════════════════════════════════════════════════════════
      // ADMIN HOME
      // ═══════════════════════════════════════════════════════════════
      {
        id: 'admin-home',
        label: 'ADMIN',
        children: [
          { id: 'admin-dashboard', label: 'Dashboard', path: '/org/admin/dashboard' },
          { id: 'live-activity', label: 'Live Activity', path: '/admin/live-activity' },
        ],
      },
      
      // ═══════════════════════════════════════════════════════════════
      // EXECUTION OS - Work Management
      // ═══════════════════════════════════════════════════════════════
      {
        id: 'execution-os',
        label: 'EXECUTION OS',
        children: [
          { id: 'my-work', label: 'My Work', path: '/work/my-work', badge: 3 },
          { id: 'projects', label: 'Projects', path: '/work/projects' },
          { id: 'tasks', label: 'Tasks', path: '/work/tasks' },
          { id: 'milestones', label: 'Milestones', path: '/work/milestones' },
          { id: 'assignments', label: 'Assignments', path: '/work/assignments' },
          { id: 'work-reports', label: 'Reports', path: '/work/reports' },
        ],
      },
      
      // ═══════════════════════════════════════════════════════════════
      // ORGANIZATION OS - People & Structure
      // ═══════════════════════════════════════════════════════════════
      {
        id: 'organization-os',
        label: 'ORGANIZATION OS',
        children: [
          { id: 'employees', label: 'Employees', path: '/people/employees' },
          { id: 'members', label: 'Members', path: '/people/members' },
          { id: 'departments', label: 'Departments', path: '/people/departments' },
          { id: 'roles-access', label: 'Roles & Access', path: '/people/roles-access' },
        ],
      },
      
      // ═══════════════════════════════════════════════════════════════
      // TIME TRACKING - Time Management & Attendance
      // ═══════════════════════════════════════════════════════════════
      {
        id: 'time-tracking',
        label: 'TIME TRACKING',
        children: [
          { id: 'time-logs', label: 'Time Logs', path: '/time/time-logs' },
          { id: 'leave', label: 'Leave', path: '/time/leave' },
          { id: 'corrections', label: 'Corrections', path: '/time/corrections', badge: 3 },
          { id: 'sessions', label: 'Sessions', path: '/time/sessions' },
          { id: 'break-rules', label: 'Break Rules', path: '/time/break-rules' },
          { id: 'workday-rules', label: 'Workday Rules', path: '/time/workday-rules' },
          { id: 'leave-management', label: 'Leave Management', path: '/time/leave-management' },
          { id: 'leave-approvals', label: 'Leave Approvals', path: '/time/leave-approvals', badge: 7 },
          { id: 'fines', label: 'Fines', path: '/time/fines' },
          { id: 'offline-sync', label: 'Offline Sync', path: '/time/offline-sync' },
        ],
      },
      
      // ═══════════════════════════════════════════════════════════════
      // BUSINESS OS (FINANCE) - Complete Finance Management
      // ═══════════════════════════════════════════════════════════════
      {
        id: 'business-os-finance',
        label: 'BUSINESS OS (FINANCE)',
        children: [
          { id: 'finance-cockpit', label: 'Finance Cockpit', path: '/org/finance/cockpit' },
          { id: 'finance-inbox', label: 'Inbox', path: '/org/finance/inbox', badge: 12 },
          { id: 'inbox-approvals', label: 'Inbox & Approvals', path: '/org/finance/inbox' },
          { id: 'quick-add', label: 'Quick Add', path: '/org/finance/quick-add' },
          { id: 'ledger', label: 'Ledger', path: '/org/finance/ledger-control' },
          { id: 'intelligence', label: 'Intelligence', path: '/org/finance/transactions' },
          { id: 'accounts-wallets', label: 'Accounts & Wallets', path: '/org/finance/accounts' },
          { id: 'import-center', label: 'Import Center', path: '/org/finance/import' },
          { id: 'review-decide', label: 'Review & Decide', path: '/org/finance/review' },
          { id: 'reimbursements', label: 'Reimbursements', path: '/org/finance/reimbursements' },
          { id: 'payroll-posting', label: 'Payroll Posting', path: '/org/finance/payroll-posting' },
          { id: 'costing-profit', label: 'Costing & Profit', path: '/org/finance/costing-profit' },
          { id: 'finance-reports', label: 'Reports', path: '/org/finance/reports' },
          { id: 'loans-liabilities', label: 'Loans & Liabilities', path: '/org/finance/loans' },
          { id: 'team-permissions', label: 'Team Permissions', path: '/org/finance/team-permissions' },
          { id: 'finance-settings', label: 'Settings', path: '/org/finance/settings' },
        ],
      },
      
      // ═══════════════════════════════════════════════════════════════
      // COMMUNICATION - Team Messaging & Collaboration
      // ═══════════════════════════════════════════════════════════════
      {
        id: 'communication',
        label: 'COMMUNICATION',
        children: [
          { id: 'team-hub', label: 'Team Hub', path: '/communication/team-hub' },
          { id: 'conversations', label: 'Conversations', path: '/communication/conversations', badge: 12 },
          { id: 'channels', label: 'Channels', path: '/communication/channels' },
        ],
      },
      
      // ═══════════════════════════════════════════════════════════════
      // INTELLIGENCE OS - Analytics & Insights
      // ═══════════════════════════════════════════════════════════════
      {
        id: 'intelligence-os',
        label: 'INTELLIGENCE OS',
        children: [
          { id: 'live-activity', label: 'Live Activity', path: '/analytics/live-activity' },
          { id: 'reports', label: 'Reports', path: '/analytics/reports' },
          { id: 'analytics', label: 'Analytics', path: '/analytics/analytics' },
          { id: 'activity-overview', label: 'Activity Overview', path: '/analytics/activity-overview' },
          { id: 'input-counters', label: 'Input Counters', path: '/analytics/input-counters' },
          { id: 'screenshot-review', label: 'Screenshot Review', path: '/analytics/screenshot-review' },
          { id: 'app-reports', label: 'App Reports', path: '/analytics/app-reports' },
        ],
      },
      
      // ═══════════════════════════════════════════════════════════════
      // SECURITY & COMPLIANCE - Data Protection & Audit
      // ═══════════════════════════════════════════════════════════════
      {
        id: 'security-compliance',
        label: 'SECURITY & COMPLIANCE',
        children: [
          { id: 'consent-privacy', label: 'Consent & Privacy', path: '/security/consent-privacy' },
          { id: 'data-retention', label: 'Data Retention', path: '/security/data-retention' },
          { id: 'audit-logs', label: 'Audit Logs', path: '/security/audit-logs' },
          { id: 'security', label: 'Security', path: '/security/security' },
        ],
      },
      
      // ═══════════════════════════════════════════════════════════════
      // PLATFORM OS - Platform Configuration
      // ═══════════════════════════════════════════════════════════════
      {
        id: 'platform-os',
        label: 'PLATFORM OS',
        children: [
          { id: 'org-settings', label: 'Settings', path: '/platform/org-settings' },
          { id: 'billing', label: 'Billing', path: '/platform/billing' },
        ],
      },
      
      // ═══════════════════════════════════════════════════════════════
      // INTEGRATIONS - External Connections
      // ═══════════════════════════════════════════════════════════════
      {
        id: 'integrations',
        label: 'INTEGRATIONS',
        children: [
          { id: 'integrations-list', label: 'Integrations', path: '/integrations/integrations' },
          { id: 'api-docs', label: 'API Docs', path: '/integrations/api-docs' },
        ],
      },
    ],
  },

  /**
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   * PLATFORM ADMIN — Platform Console
   * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   */
  platform_admin: {
    label: 'Platform Admin',
    basePath: '/platform',
    defaultRoute: '/super/console',
    allowedPrefixes: ['/platform', '/super', '/integrations'],
    sidebar: [
      {
        id: 'platform-home',
        label: 'PLATFORM',
        children: [
          { id: 'console', label: 'Platform Console', path: '/super/console' },
          { id: 'calendar', label: 'Calendar', path: '/super/calendar' },
        ],
      },
      {
        id: 'platform-os',
        label: 'PLATFORM OS',
        children: [
          { id: 'organizations', label: 'Organizations', path: '/super/organizations' },
          { id: 'org-detail', label: 'Org Detail', path: '/super/org-detail' },
          { id: 'platform-billing', label: 'Platform Billing', path: '/platform/billing' },
          { id: 'seat-sales', label: 'Seat Sales', path: '/super/seat-sales' },
          { id: 'global-policies', label: 'Global Policies', path: '/super/policies' },
          { id: 'system-health', label: 'System Health', path: '/super/health' },
          { id: 'platform-admins', label: 'Platform Admins', path: '/super/admins' },
        ],
      },
      {
        id: 'finance-os',
        label: 'FINANCE',
        children: [
          { id: 'finance-console', label: 'Finance Platform', path: '/platform/finance-console' },
        ],
      },
      {
        id: 'security-os',
        label: 'SECURITY OS',
        children: [
          { id: 'global-audit-logs', label: 'Global Audit Logs', path: '/super/audit-logs' },
        ],
      },
      {
        id: 'platform-settings',
        label: 'SETTINGS',
        children: [
          { id: 'platform-settings', label: 'Platform Settings', path: '/platform/platform-settings' },
          { id: 'billing-plans', label: 'Billing Plans', path: '/platform/billing-plans' },
        ],
      },
      {
        id: 'integrations-os',
        label: 'INTEGRATIONS',
        children: [
          { id: 'integrations-list', label: 'Integrations', path: '/integrations/list' },
          { id: 'api-docs', label: 'API Documentation', path: '/integrations/api-docs' },
        ],
      },
    ],
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * HELPER FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Check if a path is allowed for a given role
 */
export function isPathAllowedForRole(path: string, role: RoleKey): boolean {
  const config = roleConfig[role];
  return config.allowedPrefixes.some(prefix => path.startsWith(prefix));
}

/**
 * Get the default route for a role
 */
export function getDefaultRouteForRole(role: RoleKey): string {
  return roleConfig[role].defaultRoute;
}

/**
 * Get sidebar items for a role
 */
export function getSidebarForRole(role: RoleKey): DomainNavItem[] {
  return roleConfig[role].sidebar;
}

/**
 * Get all allowed paths for a role (flattened)
 */
export function getAllowedPathsForRole(role: RoleKey): string[] {
  const config = roleConfig[role];
  const paths: string[] = [];
  
  config.sidebar.forEach(domain => {
    if (domain.path) paths.push(domain.path);
    domain.children?.forEach(child => {
      if (child.path) paths.push(child.path);
    });
  });
  
  return paths;
}