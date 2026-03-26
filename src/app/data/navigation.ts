import { Home, Calendar, Activity, Clock, Umbrella, BarChart3, DollarSign, Bell, User, Users, Settings, Shield, FileText, Building, Database, Key, GitBranch, Link, CreditCard, Layers, CheckSquare, Briefcase, UserCheck, PieChart, MessageSquare, Wallet, AlertTriangle, Inbox, Plus, List, Upload, GanttChart, Receipt, Send, TrendingUp, FileSpreadsheet, Banknote, UserCog, Zap } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  path: string;
  badge?: number;
  children?: NavItem[];
}

export const employeeNavItems: NavItem[] = [
  { id: 'e-01', label: 'Dashboard', icon: Home, path: '/employee/dashboard' },
  { id: 'e-w01', label: 'My Work', icon: CheckSquare, path: '/employee/my-work', badge: 3 },
  { id: 'e-c01', label: 'Communicate', icon: MessageSquare, path: '/employee/communicate', badge: 12 },
  { id: 'e-m01', label: 'My Money', icon: Wallet, path: '/employee/money/dashboard', badge: 3 },
  { id: 'e-02', label: 'My Day', icon: Calendar, path: '/employee/my-day' },
  { id: 'e-03', label: 'My Activity', icon: Activity, path: '/employee/my-activity' },
  { id: 'e-04', label: 'Time Logs', icon: Clock, path: '/employee/time-logs' },
  { id: 'e-05', label: 'Leave', icon: Umbrella, path: '/employee/leave' },
  { id: 'e-06', label: 'Activity Overview', icon: BarChart3, path: '/employee/activity-overview' },
  { id: 'e-07', label: 'Analytics', icon: BarChart3, path: '/employee/analytics' },
  { id: 'e-08', label: 'My Earnings', icon: DollarSign, path: '/employee/earnings' },
  { id: 'e-09', label: 'Notifications', icon: Bell, path: '/employee/notifications', badge: 5 },
  { id: 'e-10', label: 'Profile', icon: User, path: '/employee/profile' },
];

export const adminNavItems: NavItem[] = [
  { id: 'a-01', label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { id: 'a-02', label: 'Live Activity', icon: Activity, path: '/admin/live-activity' },
  { id: 'a-w00', label: 'Work Home', icon: Briefcase, path: '/admin/work-home' },
  { id: 'a-w02', label: 'Projects', icon: Briefcase, path: '/admin/projects' },
  { id: 'a-w03', label: 'Tasks', icon: CheckSquare, path: '/admin/tasks' },
  { id: 'a-w06', label: 'Milestones', icon: CheckSquare, path: '/admin/milestones' },
  { id: 'a-w04', label: 'Assignments', icon: UserCheck, path: '/admin/assignments' },
  { id: 'a-w05', label: 'Work Reports', icon: PieChart, path: '/admin/work-reports' },
  { id: 'a-c01', label: 'Communicate', icon: MessageSquare, path: '/admin/communicate', badge: 18 },
  { id: 'a-t00', label: 'Time Tracking', icon: Clock, path: '/admin/time-logs' },
  { id: 'a-t01', label: 'Fines', icon: AlertTriangle, path: '/admin/fines' },
  { 
    id: 'a-f01', 
    label: 'Finance Corporate', 
    icon: Wallet, 
    path: '/org/finance', 
    badge: 3,
    children: [
      { id: 'a-f01-cockpit', label: 'Cockpit', icon: BarChart3, path: '/org/finance/cockpit' },
      { id: 'a-f01-inbox', label: 'Inbox (Approvals)', icon: Inbox, path: '/org/finance/inbox', badge: 3 },
      { id: 'a-f01-quick', label: 'Quick Add', icon: Plus, path: '/org/finance/quick-add' },
      { id: 'a-f01-ledger', label: 'Ledger', icon: List, path: '/org/finance/ledger-control' },
      { id: 'a-f01-accounts', label: 'Accounts & Wallets', icon: Wallet, path: '/org/finance/accounts' },
      { id: 'a-f01-import', label: 'Import Center', icon: Upload, path: '/org/finance/import' },
      { id: 'a-f01-review', label: 'Review & Decide', icon: GanttChart, path: '/org/finance/review' },
      { id: 'a-f01-reimburse', label: 'Reimbursements', icon: Receipt, path: '/org/finance/reimbursements' },
      { id: 'a-f01-payroll', label: 'Payroll Posting', icon: Send, path: '/org/finance/payroll-posting' },
      { id: 'a-f01-costing', label: 'Costing & Profit', icon: TrendingUp, path: '/org/finance/costing-profit' },
      { id: 'a-f01-reports', label: 'Reports', icon: FileSpreadsheet, path: '/org/finance/reports' },
      { id: 'a-f01-loans', label: 'Loans & Liabilities', icon: Banknote, path: '/org/finance/loans' },
      { id: 'a-f01-team', label: 'Team & Permissions', icon: UserCog, path: '/org/finance/team-permissions' },
      { id: 'a-f01-settings', label: 'Finance Settings', icon: Settings, path: '/org/finance/settings' },
    ]
  },
  { id: 'a-03', label: 'Users', icon: Users, path: '/admin/users' },
  { id: 'a-04', label: 'Members', icon: Users, path: '/admin/members' },
  { id: 'a-05', label: 'Departments', icon: Building, path: '/admin/departments' },
  { id: 'a-06', label: 'Roles & Access', icon: Shield, path: '/admin/roles-access' },
  { id: 'a-07', label: 'Sessions', icon: Clock, path: '/admin/sessions' },
  { id: 'a-08', label: 'Workday Rules', icon: Calendar, path: '/admin/workday-rules' },
  { id: 'a-09', label: 'Break Rules', icon: Calendar, path: '/admin/break-rules' },
  { id: 'a-10', label: 'Corrections', icon: FileText, path: '/admin/corrections', badge: 3 },
  { id: 'a-11', label: 'Leave Management', icon: Umbrella, path: '/admin/leave-management' },
  { id: 'a-12', label: 'Leave Approvals', icon: FileText, path: '/admin/leave-approvals', badge: 7 },
  { id: 'a-13', label: 'Activity Overview', icon: BarChart3, path: '/admin/activity-overview' },
  { id: 'a-14', label: 'App Reports', icon: BarChart3, path: '/admin/app-reports' },
  { id: 'a-15', label: 'Input Counters', icon: Activity, path: '/admin/input-counters' },
  { id: 'a-16', label: 'Screenshot Review', icon: FileText, path: '/admin/screenshot-review' },
  { id: 'a-17', label: 'Offline Sync', icon: Database, path: '/admin/offline-sync' },
  { id: 'a-18', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { id: 'a-19', label: 'Reports', icon: FileText, path: '/admin/reports' },
  { id: 'a-20', label: 'Consent & Privacy', icon: Shield, path: '/admin/consent' },
  { id: 'a-21', label: 'Data Retention', icon: Database, path: '/admin/data-retention' },
  { id: 'a-22', label: 'Audit Logs', icon: FileText, path: '/admin/audit-logs' },
  { id: 'a-23', label: 'Security', icon: Shield, path: '/admin/security' },
  { id: 'a-24', label: 'Payroll', icon: DollarSign, path: '/admin/payroll' },
  { id: 'a-25', label: 'Billing', icon: CreditCard, path: '/admin/billing' },
  { id: 'a-26', label: 'Billing Plans', icon: CreditCard, path: '/admin/billing-plans' },
  { id: 'a-27', label: 'Integrations', icon: Link, path: '/admin/integrations' },
  { id: 'a-28', label: 'API Docs', icon: GitBranch, path: '/admin/api-docs' },
  { id: 'a-29', label: 'Notifications', icon: Bell, path: '/admin/notifications' },
  { id: 'a-30', label: 'Org Settings', icon: Settings, path: '/admin/settings' },
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SUPER ADMIN NAVIGATION - OPERATIONAL SCREENS ONLY
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * ✅ PRODUCT UI: Only operational/production screens visible
 * 🚫 EXCLUDED: Diagnostics, Analysis, Engines, Propagation
 * 
 * Internal system tools moved to: /src/app/data/internalSystemRoutes.ts
 * - 5 Diagnostic tools (/diagnostics/*)
 * - 2 Analysis tools (/analysis/*)
 * - 6 Engine monitors (/engines/*)
 * - 2 Propagation dashboards (/propagation/*)
 * 
 * These are accessible via direct URL but NOT shown in sidebar.
 * ═══════════════════════════════════════════════════════════════════════════
 */
export const superAdminNavItems: NavItem[] = [
  { id: 's-01', label: 'Console', icon: Layers, path: '/super/console' },
  { id: 's-02', label: 'Organizations', icon: Building, path: '/super/organizations' },
  { id: 's-03', label: 'Org Detail', icon: FileText, path: '/super/org-detail' },
  { id: 's-f01', label: 'Finance Platform', icon: Wallet, path: '/platform/finance-console' },
  { id: 's-04', label: 'Platform Billing', icon: CreditCard, path: '/super/billing' },
  { id: 's-05', label: 'Global Policies', icon: Shield, path: '/super/policies' },
  { id: 's-06', label: 'System Health', icon: Activity, path: '/super/health' },
  { id: 's-07', label: 'Global Audit Logs', icon: FileText, path: '/super/audit-logs' },
  { id: 's-08', label: 'Platform Admins', icon: Key, path: '/super/admins' },
  { id: 's-09', label: 'Seat Sales', icon: DollarSign, path: '/super/seat-sales' },
];