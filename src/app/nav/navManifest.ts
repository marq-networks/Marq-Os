/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION MANIFEST - SINGLE SOURCE OF TRUTH
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { 
  Home, 
  CheckSquare, 
  MessageSquare, 
  Wallet, 
  Calendar, 
  Activity, 
  Clock, 
  Umbrella, 
  BarChart3, 
  DollarSign, 
  Bell, 
  User,
  Briefcase,
  Users,
  Target,
  UserCheck,
  PieChart,
  AlertTriangle,
  Settings,
  Shield,
  FileText,
  Building,
  Database,
  Key,
  GitBranch,
  Link,
  CreditCard,
  Layers,
  Inbox,
  Plus,
  List,
  Upload,
  GanttChart,
  Receipt,
  Send,
  TrendingUp,
  FileSpreadsheet,
  Banknote,
  UserCog,
  Zap,
  Lock,
  Globe,
  Plug,
  Mail // Add Mail icon for email integration
} from 'lucide-react';

export type Role = 'employee' | 'org_admin' | 'platform_admin';

export type DomainKey = 
  | 'work' 
  | 'people' 
  | 'time' 
  | 'finance' 
  | 'communication' 
  | 'analytics' 
  | 'security_compliance' 
  | 'platform' 
  | 'integrations';

export interface NavItem {
  key: string;
  label: string;
  icon?: any;
  path?: string;
  badge?: number;
  children?: NavItem[];
  roles: Role[];
}

export const NAV_MANIFEST: NavItem[] = [
  // ========================================================================
  // EMPLOYEE FLAT NAVIGATION - Simple, non-nested structure
  // ========================================================================
  {
    key: 'employee-dashboard',
    label: 'Dashboard',
    path: '/employee/dashboard',
    roles: ['employee'],
    icon: Home
  },
  // ========================================================================
  // EMPLOYEE EXECUTION OS - Work Management (Employee-scoped)
  // ========================================================================
  // NOTE: "My Work" lives inside this group (emp-work-my-work → /work/my-work).
  // The former top-level duplicate (employee-my-work → /employee/my-work) was
  // removed in Phase 14 gap closure to eliminate dual nav entries for the same screen.
  {
    key: 'employee-execution-os',
    label: 'Execution OS',
    roles: ['employee'],
    icon: Briefcase,
    children: [
      { key: 'emp-work-my-work', label: 'My Work', path: '/work/my-work', roles: ['employee'], badge: 3, icon: CheckSquare },
      { key: 'emp-work-projects', label: 'Projects', path: '/work/projects', roles: ['employee'], icon: Briefcase },
      { key: 'emp-work-tasks', label: 'Tasks', path: '/work/tasks', roles: ['employee'], icon: CheckSquare },
      { key: 'emp-work-milestones', label: 'Milestones', path: '/work/milestones', roles: ['employee'], icon: Target },
      { key: 'emp-work-assignments', label: 'Assignments', path: '/work/assignments', roles: ['employee'], icon: UserCheck },
      { key: 'emp-work-calendar', label: 'Calendar', path: '/work/calendar', roles: ['employee'], icon: Calendar },
      { key: 'emp-work-email', label: 'Email', path: '/work/email', roles: ['employee'], icon: Mail },
      { key: 'emp-work-reports', label: 'Reports', path: '/work/reports', roles: ['employee'], icon: FileSpreadsheet },
    ],
  },
  {
    key: 'employee-communicate',
    label: 'Communicate',
    path: '/employee/communicate',
    roles: ['employee'],
    badge: 12,
    icon: MessageSquare,
    children: [
      {
        key: 'employee-team-hub',
        label: 'Team Hub',
        path: '/employee/team-hub',
        roles: ['employee'],
        icon: Users
      },
      {
        key: 'employee-communicate-home',
        label: 'Conversations',
        path: '/employee/communicate',
        roles: ['employee'],
        badge: 12,
        icon: MessageSquare
      }
    ]
  },
  {
    key: 'employee-my-money',
    label: 'My Money',
    path: '/employee/money/dashboard',
    roles: ['employee'],
    badge: 3,
    icon: Wallet
  },
  {
    key: 'employee-calendar',
    label: 'Calendar',
    path: '/employee/calendar',
    roles: ['employee'],
    icon: Calendar
  },
  {
    key: 'employee-my-day',
    label: 'My Day',
    path: '/employee/my-day',
    roles: ['employee'],
    icon: Calendar
  },
  {
    key: 'employee-my-activity',
    label: 'My Activity',
    path: '/employee/my-activity',
    roles: ['employee'],
    icon: Activity
  },
  {
    key: 'employee-time-logs',
    label: 'Time Logs',
    path: '/employee/time-logs',
    roles: ['employee'],
    icon: Clock
  },
  {
    key: 'employee-leave',
    label: 'Leave',
    path: '/employee/leave',
    roles: ['employee'],
    icon: Umbrella
  },
  {
    key: 'employee-activity-overview',
    label: 'Activity Overview',
    path: '/employee/activity-overview',
    roles: ['employee'],
    icon: BarChart3
  },
  {
    key: 'employee-analytics',
    label: 'Analytics',
    path: '/employee/analytics',
    roles: ['employee'],
    icon: BarChart3
  },
  {
    key: 'employee-my-earnings',
    label: 'My Earnings',
    path: '/employee/earnings',
    roles: ['employee'],
    icon: DollarSign
  },
  {
    key: 'employee-notifications',
    label: 'Notifications',
    path: '/employee/notifications',
    roles: ['employee'],
    badge: 5,
    icon: Bell
  },
  {
    key: 'employee-profile',
    label: 'Profile',
    path: '/employee/profile',
    roles: ['employee'],
    icon: User
  },
  
  // ========================================================================
  // PLATFORM ADMIN FLAT NAVIGATION - Simple, non-nested structure
  // ========================================================================
  {
    key: 'platform-console',
    label: 'Console',
    path: '/super/console',
    roles: ['platform_admin'],
    icon: Layers
  },
  {
    key: 'platform-calendar',
    label: 'Calendar',
    path: '/super/calendar',
    roles: ['platform_admin'],
    icon: Calendar
  },
  {
    key: 'platform-organizations',
    label: 'Organizations',
    path: '/super/organizations',
    roles: ['platform_admin'],
    icon: Building
  },
  {
    key: 'platform-org-detail',
    label: 'Org Detail',
    path: '/super/org-detail',
    roles: ['platform_admin'],
    icon: FileText
  },
  {
    key: 'platform-finance-console',
    label: 'Finance Platform',
    path: '/platform/finance-console',
    roles: ['platform_admin'],
    icon: CreditCard
  },
  {
    key: 'platform-billing',
    label: 'Platform Billing',
    path: '/platform/billing',
    roles: ['platform_admin'],
    icon: CreditCard
  },
  {
    key: 'platform-global-policies',
    label: 'Global Policies',
    path: '/super/policies',
    roles: ['platform_admin'],
    icon: Shield
  },
  {
    key: 'platform-system-health',
    label: 'System Health',
    path: '/super/health',
    roles: ['platform_admin'],
    icon: Activity
  },
  {
    key: 'platform-audit-logs',
    label: 'Global Audit Logs',
    path: '/super/audit-logs',
    roles: ['platform_admin'],
    icon: FileText
  },
  {
    key: 'platform-admins',
    label: 'Platform Admins',
    path: '/super/admins',
    roles: ['platform_admin'],
    icon: UserCog
  },
  {
    key: 'platform-seat-sales',
    label: 'Seat Sales',
    path: '/super/seat-sales',
    roles: ['platform_admin'],
    icon: DollarSign
  },
  
  // ========================================================================
  // ORG ADMIN DOMAIN-BASED NAVIGATION - Nested structure with domains
  // ========================================================================
  {
    key: 'admin',
    label: 'ADMIN',
    roles: ['org_admin'],
    children: [
      { key: 'admin-dashboard', label: 'Dashboard', path: '/org/admin/dashboard', roles: ['org_admin'], icon: Home },
      { key: 'admin-live-activity', label: 'Live Activity', path: '/admin/live-activity', roles: ['org_admin'], icon: Activity },
    ],
  },
  {
    key: 'work',
    label: 'EXECUTION OS',
    roles: ['org_admin'],
    children: [
      { key: 'work-my-work', label: 'My Work', path: '/work/my-work', roles: ['org_admin'], badge: 3, icon: CheckSquare },
      { key: 'work-projects', label: 'Projects', path: '/work/projects', roles: ['org_admin'], icon: Briefcase },
      { key: 'work-tasks', label: 'Tasks', path: '/work/tasks', roles: ['org_admin'], icon: CheckSquare },
      { key: 'work-milestones', label: 'Milestones', path: '/work/milestones', roles: ['org_admin'], icon: Target },
      { key: 'work-assignments', label: 'Assignments', path: '/work/assignments', roles: ['org_admin'], icon: UserCheck },
      { key: 'work-calendar', label: 'Calendar', path: '/work/calendar', roles: ['org_admin'], icon: Calendar },
      { key: 'work-email', label: 'Email', path: '/work/email', roles: ['org_admin'], icon: Mail },
      { key: 'work-reports', label: 'Reports', path: '/work/reports', roles: ['org_admin'], icon: FileSpreadsheet },
    ],
  },
  {
    key: 'people',
    label: 'ORGANIZATION OS',
    roles: ['org_admin'],
    children: [
      { key: 'people-employees', label: 'Employees', path: '/people/employees', roles: ['org_admin'], icon: Users },
      { key: 'people-members', label: 'Members', path: '/people/members', roles: ['org_admin'], icon: Users },
      { key: 'people-departments', label: 'Departments', path: '/people/departments', roles: ['org_admin'], icon: Building },
      { key: 'people-roles-access', label: 'Roles & Access', path: '/people/roles-access', roles: ['org_admin'], icon: Key },
    ],
  },
  {
    key: 'time',
    label: 'TIME OS',
    roles: ['org_admin'],
    children: [
      { key: 'time-tracking', label: 'Tracking', path: '/time/tracking', roles: ['org_admin'], icon: Clock },
      { key: 'time-sessions', label: 'Sessions', path: '/time/sessions', roles: ['org_admin'], icon: Clock },
      { key: 'time-corrections', label: 'Corrections', path: '/time/corrections', roles: ['org_admin'], icon: Clock },
      { key: 'time-workday-rules', label: 'Workday Rules', path: '/time/workday-rules', roles: ['org_admin'], icon: Clock },
      { key: 'time-break-rules', label: 'Break Rules', path: '/time/break-rules', roles: ['org_admin'], icon: Clock },
      { key: 'time-leave-management', label: 'Leave Management', path: '/time/leave-management', roles: ['org_admin'], icon: Umbrella },
      { key: 'time-leave-approvals', label: 'Leave Approvals', path: '/time/leave-approvals', roles: ['org_admin'], icon: Umbrella },
      { key: 'time-fines', label: 'Fines', path: '/time/fines', roles: ['org_admin'], icon: AlertTriangle },
      { key: 'time-my-fines', label: 'My Fines', path: '/time/my-fines', roles: ['org_admin'], icon: AlertTriangle },
      { key: 'time-input-counters', label: 'Input Counters', path: '/time/input-counters', roles: ['org_admin'], icon: List },
      { key: 'time-screenshot-review', label: 'Screenshot Review', path: '/time/screenshot-review', roles: ['org_admin'], icon: FileText },
      { key: 'time-offline-sync', label: 'Offline Sync', path: '/time/offline-sync', roles: ['org_admin'], icon: Upload },
    ],
  },
  {
    key: 'finance',
    label: 'FINANCE CORPORATE',
    roles: ['org_admin'],
    children: [
      { key: 'finance-cockpit', label: 'Finance Cockpit', path: '/org/finance/cockpit', roles: ['org_admin'], icon: Home },
      { key: 'finance-inbox-approvals', label: 'Approvals', path: '/org/finance/inbox', roles: ['org_admin'], badge: 3, icon: Inbox },
      { key: 'finance-quick-add', label: 'Quick Add', path: '/org/finance/quick-add', roles: ['org_admin'], icon: Plus },
      { key: 'finance-ledger', label: 'Ledger', path: '/org/finance/ledger-control', roles: ['org_admin'], icon: Database },
      { key: 'finance-intelligence', label: 'Intelligence', path: '/org/finance/intelligence', roles: ['org_admin'], icon: PieChart },
      { key: 'finance-accounts-wallets', label: 'Accounts & Wallets', path: '/org/finance/accounts', roles: ['org_admin'], icon: CreditCard },
      { key: 'finance-import-center', label: 'Import Center', path: '/org/finance/import', roles: ['org_admin'], icon: Upload },
      { key: 'finance-review-decide', label: 'Review & Decide', path: '/org/finance/review', roles: ['org_admin'], icon: FileText },
      { key: 'finance-reimbursements', label: 'Reimbursements', path: '/org/finance/reimbursements', roles: ['org_admin'], icon: Receipt },
      { key: 'finance-payroll-posting', label: 'Payroll Posting', path: '/org/finance/payroll-posting', roles: ['org_admin'], icon: Banknote },
      { key: 'finance-costing-profit', label: 'Costing & Profit', path: '/org/finance/costing-profit', roles: ['org_admin'], icon: TrendingUp },
      { key: 'finance-reports', label: 'Reports', path: '/org/finance/reports', roles: ['org_admin'], icon: FileSpreadsheet },
      { key: 'finance-loans-liabilities', label: 'Loans & Liabilities', path: '/org/finance/loans', roles: ['org_admin'], icon: CreditCard },
      { key: 'finance-team-permissions', label: 'Team Permissions', path: '/org/finance/team-permissions', roles: ['org_admin'], icon: Key },
      { key: 'finance-settings', label: 'Finance Settings', path: '/org/finance/settings', roles: ['org_admin'], icon: Settings },
    ],
  },
  {
    key: 'communication',
    label: 'COMMUNICATION',
    roles: ['org_admin'],
    children: [
      { key: 'communication-team-hub', label: 'Team Hub', path: '/communication/team-hub', roles: ['org_admin'], icon: Users },
      { key: 'communication-conversations', label: 'Conversations', path: '/communication/conversations', roles: ['org_admin'], badge: 12, icon: MessageSquare },
      { key: 'communication-channels', label: 'Channels', path: '/communication/channels', roles: ['org_admin'], icon: MessageSquare },
    ],
  },
  {
    key: 'analytics',
    label: 'ANALYTICS',
    roles: ['org_admin'],
    children: [
      { key: 'analytics-live-activity', label: 'Live Activity', path: '/analytics/live-activity', roles: ['org_admin'], icon: Activity },
      { key: 'analytics-activity-overview', label: 'Activity Overview', path: '/analytics/activity-overview', roles: ['org_admin'], icon: BarChart3 },
      { key: 'analytics-input-counters', label: 'Input Counters', path: '/analytics/input-counters', roles: ['org_admin'], icon: List },
      { key: 'analytics-screenshot-review', label: 'Screenshot Review', path: '/analytics/screenshot-review', roles: ['org_admin'], icon: FileText },
      { key: 'analytics-app-reports', label: 'App Reports', path: '/analytics/app-reports', roles: ['org_admin'], icon: FileSpreadsheet },
      { key: 'analytics-analytics', label: 'Analytics', path: '/analytics/analytics', roles: ['org_admin'], icon: PieChart },
      { key: 'analytics-reports', label: 'Reports', path: '/analytics/reports', roles: ['org_admin'], icon: FileSpreadsheet },
    ],
  },
  {
    key: 'security_compliance',
    label: 'SECURITY & COMPLIANCE',
    roles: ['org_admin'],
    children: [
      { key: 'security-consent-privacy', label: 'Consent & Privacy', path: '/security/consent-privacy', roles: ['org_admin'], icon: Shield },
      { key: 'security-data-retention', label: 'Data Retention', path: '/security/data-retention', roles: ['org_admin'], icon: Database },
      { key: 'security-audit-logs', label: 'Audit Logs', path: '/security/audit-logs', roles: ['org_admin'], icon: FileText },
      { key: 'security-security', label: 'Security', path: '/security/security', roles: ['org_admin'], icon: Shield },
    ],
  },
  {
    key: 'platform',
    label: 'PLATFORM',
    roles: ['org_admin', 'platform_admin'],
    children: [
      { key: 'platform-org-settings', label: 'Organization Settings', path: '/platform/org-settings', roles: ['org_admin'], icon: Building },
      { key: 'platform-platform-settings', label: 'Platform Settings', path: '/platform/platform-settings', roles: ['platform_admin'], icon: Settings },
      { key: 'platform-billing', label: 'Billing', path: '/platform/billing', roles: ['org_admin', 'platform_admin'], icon: CreditCard },
      { key: 'platform-billing-plans', label: 'Billing Plans', path: '/platform/billing-plans', roles: ['platform_admin'], icon: CreditCard },
    ],
  },
  {
    key: 'integrations',
    label: 'INTEGRATIONS',
    roles: ['org_admin', 'platform_admin'],
    children: [
      { key: 'integrations-list', label: 'Integrations', path: '/integrations/list', roles: ['org_admin', 'platform_admin'], icon: Link },
      { key: 'integrations-api-docs', label: 'API Documentation', path: '/integrations/api-docs', roles: ['org_admin', 'platform_admin'], icon: FileText },
    ],
  },
];

export function getAllPaths(): string[] {
  const paths: string[] = [];
  function extractPaths(items: NavItem[]) {
    for (const item of items) {
      if (item.path) paths.push(item.path);
      if (item.children) extractPaths(item.children);
    }
  }
  extractPaths(NAV_MANIFEST);
  return paths;
}

export function getPathsForRole(role: Role): string[] {
  const paths: string[] = [];
  function extractPaths(items: NavItem[]) {
    for (const item of items) {
      if (item.roles.includes(role)) {
        if (item.path) paths.push(item.path);
        if (item.children) extractPaths(item.children);
      }
    }
  }
  extractPaths(NAV_MANIFEST);
  return paths;
}

export function findNavItemByPath(path: string): NavItem | null {
  function search(items: NavItem[]): NavItem | null {
    for (const item of items) {
      if (item.path === path) return item;
      if (item.children) {
        const found = search(item.children);
        if (found) return found;
      }
    }
    return null;
  }
  return search(NAV_MANIFEST);
}