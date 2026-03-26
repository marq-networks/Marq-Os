/**
 * ═══════════════════════════════════════════════════════════════════════════
 * NAVIGATION REGISTRY - Route Component Mapping
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * SINGLE SOURCE OF TRUTH for all routes and their components.
 * Maps paths from navManifest.ts to actual React components.
 */

import { type Role } from '../nav/navManifest';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// COMPONENT IMPORTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Execution OS v2 Screens
import { WorkMyWorkOS }      from '../components/screens/work/WorkMyWorkOS';
import { WorkProjectsOS }    from '../components/screens/work/WorkProjectsOS';
import { WorkTasksOS }       from '../components/screens/work/WorkTasksOS';
import { WorkMilestonesOS }  from '../components/screens/work/WorkMilestonesOS';
import { WorkAssignmentsOS } from '../components/screens/work/WorkAssignmentsOS';
import { WorkCalendarOS }    from '../components/screens/work/WorkCalendarOS';
import { WorkReportsOS }     from '../components/screens/work/WorkReportsOS';
import { WorkEmailOS }       from '../components/screens/work/WorkEmailOS';

// Employee Screens
import { E01Dashboard } from '../components/screens/employee/E01Dashboard';
import { EC00TeamHub } from '../components/screens/employee/EC00TeamHub';
import { EC01CommunicateHome } from '../components/screens/employee/EC01CommunicateHome';
import { EC02ChannelView } from '../components/screens/employee/EC02ChannelView';
import { EC03DirectMessages } from '../components/screens/employee/EC03DirectMessages';
import { E02MyDay } from '../components/screens/employee/E02MyDay';
import { E03MyActivity } from '../components/screens/employee/E03MyActivity';
import { E04TimeLogs } from '../components/screens/employee/E04TimeLogs';
import { E05Leave } from '../components/screens/employee/E05Leave';
import { ET01MyFines } from '../components/screens/employee/ET01MyFines';
import { E06ActivityOverview } from '../components/screens/employee/E06ActivityOverview';
import { E07Analytics } from '../components/screens/employee/E07Analytics';
import { E08MyEarnings } from '../components/screens/employee/E08MyEarnings';
import { E09Notifications } from '../components/screens/employee/E09Notifications';
import { E10Profile } from '../components/screens/employee/E10Profile';
import { E11Calendar } from '../components/screens/employee/E11Calendar';

// Employee Money Screens
import { M01MyMoneyDashboard } from '../components/screens/employee/M01MyMoneyDashboard';
import { M02SubmitExpense } from '../components/screens/employee/M02SubmitExpense';
import { M03MySubmissions } from '../components/screens/employee/M03MySubmissions';
import { M04PayslipsHistory } from '../components/screens/employee/M04PayslipsHistory';
import { M05MyFinanceSubmissions } from '../components/screens/employee/M05MyFinanceSubmissions';

// Admin Screens
import { A01AdminDashboard } from '../components/screens/admin/A01AdminDashboard';
import { A02LiveActivity } from '../components/screens/admin/A02LiveActivity';
import { W00WorkHome } from '../components/screens/admin/work/W00WorkHome';
import { W02Projects } from '../components/screens/admin/W02Projects';
import { W03Tasks } from '../components/screens/admin/W03Tasks';
import { W04Assignments } from '../components/screens/admin/W04Assignments';
import { W04TimeLogs } from '../components/screens/admin/W04TimeLogs';
import { W05WorkReports } from '../components/screens/admin/W05WorkReports';
import { W06Milestones } from '../components/screens/admin/work/W06Milestones';
import { W07Calendar } from '../components/screens/admin/work/W07Calendar';
import { W08Email } from '../components/screens/admin/work/W08Email';
import { AC00TeamHub } from '../components/screens/admin/AC00TeamHub';
import { AC01CommunicateHome } from '../components/screens/admin/AC01CommunicateHome';
import { AC02ChannelManagement } from '../components/screens/admin/AC02ChannelManagement';
import { AC03ChannelView } from '../components/screens/admin/AC03ChannelView';
// import { AC04BotIntegrationManager } from '../components/screens/admin/AC04BotIntegrationManager';

// Finance Screens
import { 
  F01FinanceHome,
  F01FinanceInbox,
  F02QuickAdd,
  F02QuickAddOperational,
  F03TransactionsLedger,
  F04AccountsWallets,
  F05StatementImport,
  F06ReviewDecideQueue,
  F07LogicLearning,
  F08CostingPricing,
  F09Reports,
  F10LoansLiabilities,
  F11TeamPermissions,
  F12FinanceSettings,
  F14ProjectBurnMargin,
  FC01FinanceCockpit,
  FC02FinanceInbox,
  FC03QuickAddAdmin,
  FC04LedgerControl,
  FC05Reimbursements,
  FC06PayrollPosting,
  FC07CostingProfitCommand,
  FC08TeamFinancePermissions,
  FC09FinanceSettings,
  FC10FinanceIntelligence
} from '../components/screens/org/financeScreens';
import { PF01FinancePlatformConsole } from '../components/screens/platform/PF01FinancePlatformConsole';

// Other Admin Screens
import { A03Users } from '../components/screens/admin/A03Users';
import { A03UsersEnhanced } from '../components/screens/admin/A03UsersEnhanced';
import { A04Members } from '../components/screens/admin/A04Members';
import { A05Departments } from '../components/screens/admin/A05Departments';
import { A05DepartmentsEnhanced } from '../components/screens/admin/A05DepartmentsEnhanced';
import { A06RolesAccess } from '../components/screens/admin/A06RolesAccess';
import { A07Sessions } from '../components/screens/admin/A07Sessions';
import { A08WorkdayRules } from '../components/screens/admin/A08WorkdayRules';
import { A09BreakRules } from '../components/screens/admin/A09BreakRules';
import { A10Corrections } from '../components/screens/admin/A10Corrections';
import { AT01Fines } from '../components/screens/admin/AT01Fines';
import { A11LeaveManagement } from '../components/screens/admin/A11LeaveManagement';
import { A12LeaveApprovals } from '../components/screens/admin/A12LeaveApprovals';
import { A12LeaveApprovalsEnhanced } from '../components/screens/admin/A12LeaveApprovalsEnhanced';
import { A13ActivityOverview } from '../components/screens/admin/A13ActivityOverview';
import { A14AppReports } from '../components/screens/admin/A14AppReports';
import { A15InputCounters } from '../components/screens/admin/A15InputCounters';
import { A16ScreenshotReview } from '../components/screens/admin/A16ScreenshotReview';
import { A17OfflineSync } from '../components/screens/admin/A17OfflineSync';
import { A18Analytics } from '../components/screens/admin/A18Analytics';
import { A19Reports } from '../components/screens/admin/A19Reports';
import { A20Consent } from '../components/screens/admin/A20Consent';
import { A21DataRetention } from '../components/screens/admin/A21DataRetention';
import { A22AuditLogs } from '../components/screens/admin/A22AuditLogs';
import { A23Security } from '../components/screens/admin/A23Security';
import { A24Payroll } from '../components/screens/admin/A24Payroll';
import { A25Billing } from '../components/screens/admin/A25Billing';
import { A26BillingPlans } from '../components/screens/admin/A26BillingPlans';
import { A27Integrations } from '../components/screens/admin/A27Integrations';
import { A28APIDocs } from '../components/screens/admin/A28APIDocs';
import { A28APIDocsEnhanced } from '../components/screens/admin/A28APIDocsEnhanced';
import { A29Notifications } from '../components/screens/admin/A29Notifications';
import { A30Settings } from '../components/screens/admin/A30Settings';
import { A99EngineConsole } from '../components/screens/admin/A99EngineConsole';

// Super Admin Screens
import { S01Console } from '../components/screens/super/S01Console';
import { S02Organizations } from '../components/screens/super/S02Organizations';
import { S03OrgDetail } from '../components/screens/super/S03OrgDetail';
import { S04PlatformBilling } from '../components/screens/super/S04PlatformBilling';
import { S05GlobalPolicies } from '../components/screens/super/S05GlobalPolicies';
import { S06SystemHealth } from '../components/screens/super/S06SystemHealth';
import { S07GlobalAuditLogs } from '../components/screens/super/S07GlobalAuditLogs';
import { S08PlatformAdmins } from '../components/screens/super/S08PlatformAdmins';
import { S09SeatSales } from '../components/screens/super/S09SeatSales';
import { S10PlatformSettings } from '../components/screens/super/S10PlatformSettings';
import { P04Calendar } from '../components/screens/platform/P04Calendar';

// Skeleton Stub Screens
import {
  WorkHome,
  WorkMyWork,
  WorkProjects,
  WorkTasks,
  WorkMilestones,
  WorkAssignments,
  WorkReports,
  PeopleEmployees,
  PeopleMembers,
  PeopleDepartments,
  PeopleRolesAccess,
  TimeTracking,
  TimeSessions,
  TimeCorrections,
  TimeBreakRules,
  TimeLeaveManagement,
  TimeLeaveApprovals,
  TimeFines,
  TimeMyFines,
  FinanceCockpit,
  FinanceInbox,
  FinanceQuickAdd,
  FinanceLedger,
  FinanceIntelligence,
  FinanceAccountsWallets,
  FinanceImportCenter,
  FinanceReviewDecide,
  FinanceReimbursements,
  FinancePayrollPosting,
  FinanceCostingProfit,
  FinanceReports,
  FinanceLoansLiabilities,
  FinanceTeamPermissions,
  FinanceSettings,
  FinanceBilling,
  FinanceBillingPlans,
  CommunicateCommunicate,
  AnalyticsLiveActivity,
  AnalyticsActivityOverview,
  AnalyticsInputCounters,
  AnalyticsScreenshotReview,
  AnalyticsAppReports,
  AnalyticsAnalytics,
  AnalyticsReports,
  SecurityConsentPrivacy,
  SecurityDataRetention,
  SecurityAuditLogs,
  SecuritySecurity,
  PlatformOrgSettings,
  PlatformPlatformSettings,
  IntegrationsIntegrations,
  IntegrationsAPIDocs
} from '../components/screens/common';

// Diagnostic Screens
import { UIBindingDiagnostic } from '../components/screens/diagnostics/UIBindingDiagnostic';
import { ServiceLayerStatus } from '../components/screens/diagnostics/ServiceLayerStatus';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPE DEFINITIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface RouteDefinition {
  /** Route path */
  path: string;
  
  /** Component to render (undefined if placeholder) */
  component?: React.ComponentType;
  
  /** Roles that can access this route */
  roles: Role[];
  
  /** Is this a placeholder/ComingSoon route? */
  placeholder?: boolean;
  
  /** Title for ComingSoon page */
  placeholderTitle?: string;
  
  /** Description for ComingSoon page */
  placeholderDescription?: string;
  
  /** Related module path for ComingSoon */
  placeholderRelatedPath?: string;
  
  /** Related module label for ComingSoon */
  placeholderRelatedLabel?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ROUTE REGISTRY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const ROUTE_REGISTRY: RouteDefinition[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // EMPLOYEE ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  
  { path: '/employee/dashboard', component: E01Dashboard, roles: ['employee'] },
  { path: '/employee/my-work', component: WorkMyWorkOS, roles: ['employee'] },
  { path: '/employee/team-hub', component: EC00TeamHub, roles: ['employee'] },
  { path: '/employee/communicate', component: EC01CommunicateHome, roles: ['employee'] },
  { path: '/employee/communicate/channel', component: EC02ChannelView, roles: ['employee'] },
  { path: '/employee/communicate/dm', component: EC03DirectMessages, roles: ['employee'] },
  { path: '/employee/my-day', component: E02MyDay, roles: ['employee'] },
  { path: '/employee/my-activity', component: E03MyActivity, roles: ['employee'] },
  { path: '/employee/time-logs', component: E04TimeLogs, roles: ['employee'] },
  { path: '/employee/leave', component: E05Leave, roles: ['employee'] },
  { path: '/employee/my-fines', component: ET01MyFines, roles: ['employee'] },
  { path: '/employee/activity-overview', component: E06ActivityOverview, roles: ['employee'] },
  { path: '/employee/analytics', component: E07Analytics, roles: ['employee'] },
  { path: '/employee/earnings', component: E08MyEarnings, roles: ['employee'] },
  { path: '/employee/notifications', component: E09Notifications, roles: ['employee'] },
  { path: '/employee/profile', component: E10Profile, roles: ['employee'] },
  { path: '/employee/calendar', component: E11Calendar, roles: ['employee'] },
  
  // Employee Money Routes
  { path: '/employee/money/dashboard', component: M01MyMoneyDashboard, roles: ['employee'] },
  { path: '/employee/money/submit-expense', component: M02SubmitExpense, roles: ['employee'] },
  { path: '/employee/money/my-submissions', component: M03MySubmissions, roles: ['employee'] },
  { path: '/employee/money/payslips-history', component: M04PayslipsHistory, roles: ['employee'] },
  { path: '/employee/money/finance-submissions', component: M05MyFinanceSubmissions, roles: ['employee'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // ADMIN ROUTES
  // ═════════════════════════════════════════════════════════════════════
  
  { path: '/admin/dashboard', component: A01AdminDashboard, roles: ['org_admin'] },
  { path: '/org/admin/dashboard', component: A01AdminDashboard, roles: ['org_admin'] },
  { path: '/admin/live-activity', component: A02LiveActivity, roles: ['org_admin'] },
  { path: '/admin/work-home', component: W00WorkHome, roles: ['org_admin'] },
  { path: '/admin/projects', component: W02Projects, roles: ['org_admin'] },
  { path: '/admin/tasks', component: W03Tasks, roles: ['org_admin'] },
  { path: '/admin/assignments', component: W04Assignments, roles: ['org_admin'] },
  { path: '/admin/time-logs', component: W04TimeLogs, roles: ['org_admin'] },
  { path: '/admin/work-reports', component: W05WorkReports, roles: ['org_admin'] },
  { path: '/admin/milestones', component: W06Milestones, roles: ['org_admin'] },
  { path: '/admin/calendar', component: W07Calendar, roles: ['org_admin'] },
  { path: '/admin/email', component: W08Email, roles: ['org_admin'] },
  { path: '/admin/communicate', component: AC01CommunicateHome, roles: ['org_admin'] },
  { path: '/admin/communicate/channels', component: AC02ChannelManagement, roles: ['org_admin'] },
  { path: '/admin/communicate/channel', component: AC03ChannelView, roles: ['org_admin'] },
  // { path: '/admin/communicate/bots', component: AC04BotIntegrationManager, roles: ['org_admin'] },
  
  // ORG Finance Routes
  { path: '/org/finance', component: F01FinanceHome, roles: ['org_admin'] },
  { path: '/org/finance/cockpit', component: FC01FinanceCockpit, roles: ['org_admin'] },
  { path: '/org/finance/inbox', component: FC02FinanceInbox, roles: ['org_admin'] },
  { path: '/org/finance/quick-add', component: FC03QuickAddAdmin, roles: ['org_admin'] },
  { path: '/org/finance/ledger-control', component: FC04LedgerControl, roles: ['org_admin'] },
  { path: '/org/finance/intelligence', component: FC10FinanceIntelligence, roles: ['org_admin'] },
  { path: '/org/finance/reimbursements', component: FC05Reimbursements, roles: ['org_admin'] },
  { path: '/org/finance/payroll-posting', component: FC06PayrollPosting, roles: ['org_admin'] },
  { path: '/org/finance/costing-profit', component: FC07CostingProfitCommand, roles: ['org_admin'] },
  { path: '/org/finance/team-permissions', component: FC08TeamFinancePermissions, roles: ['org_admin'] },
  { path: '/org/finance/settings', component: FC09FinanceSettings, roles: ['org_admin'] },
  { path: '/org/finance/quick-add-basic', component: F02QuickAdd, roles: ['org_admin'] },
  { path: '/org/finance/transactions', component: F03TransactionsLedger, roles: ['org_admin'] },
  { path: '/org/finance/accounts', component: F04AccountsWallets, roles: ['org_admin'] },
  { path: '/org/finance/import', component: F05StatementImport, roles: ['org_admin'] },
  { path: '/org/finance/review', component: F06ReviewDecideQueue, roles: ['org_admin'] },
  { path: '/org/finance/logic', component: F07LogicLearning, roles: ['org_admin'] },
  { path: '/org/finance/costing', component: F08CostingPricing, roles: ['org_admin'] },
  { path: '/org/finance/reports', component: F09Reports, roles: ['org_admin'] },
  { path: '/org/finance/loans', component: F10LoansLiabilities, roles: ['org_admin'] },
  { path: '/org/finance/team', component: F11TeamPermissions, roles: ['org_admin'] },
  { path: '/org/finance/project-burn-margin', component: F14ProjectBurnMargin, roles: ['org_admin'] },
  
  { path: '/admin/users', component: A03Users, roles: ['org_admin'] },
  { path: '/admin/users-enhanced', component: A03UsersEnhanced, roles: ['org_admin'] },
  { path: '/admin/members', component: A04Members, roles: ['org_admin'] },
  { path: '/admin/departments', component: A05Departments, roles: ['org_admin'] },
  { path: '/admin/departments-enhanced', component: A05DepartmentsEnhanced, roles: ['org_admin'] },
  { path: '/admin/roles-access', component: A06RolesAccess, roles: ['org_admin'] },
  { path: '/admin/sessions', component: A07Sessions, roles: ['org_admin'] },
  { path: '/admin/workday-rules', component: A08WorkdayRules, roles: ['org_admin'] },
  { path: '/admin/break-rules', component: A09BreakRules, roles: ['org_admin'] },
  { path: '/admin/corrections', component: A10Corrections, roles: ['org_admin'] },
  { path: '/admin/fines', component: AT01Fines, roles: ['org_admin'] },
  { path: '/admin/leave-management', component: A11LeaveManagement, roles: ['org_admin'] },
  { path: '/admin/leave-approvals', component: A12LeaveApprovals, roles: ['org_admin'] },
  { path: '/admin/leave-approvals-enhanced', component: A12LeaveApprovalsEnhanced, roles: ['org_admin'] },
  { path: '/admin/activity-overview', component: A13ActivityOverview, roles: ['org_admin'] },
  { path: '/admin/app-reports', component: A14AppReports, roles: ['org_admin'] },
  { path: '/admin/input-counters', component: A15InputCounters, roles: ['org_admin'] },
  { path: '/admin/screenshot-review', component: A16ScreenshotReview, roles: ['org_admin'] },
  { path: '/admin/offline-sync', component: A17OfflineSync, roles: ['org_admin'] },
  { path: '/admin/analytics', component: A18Analytics, roles: ['org_admin'] },
  { path: '/admin/reports', component: A19Reports, roles: ['org_admin'] },
  { path: '/admin/consent', component: A20Consent, roles: ['org_admin'] },
  { path: '/admin/data-retention', component: A21DataRetention, roles: ['org_admin'] },
  { path: '/admin/audit-logs', component: A22AuditLogs, roles: ['org_admin'] },
  { path: '/admin/security', component: A23Security, roles: ['org_admin'] },
  { path: '/admin/payroll', component: A24Payroll, roles: ['org_admin'] },
  { path: '/admin/billing', component: A25Billing, roles: ['org_admin'] },
  { path: '/admin/billing-plans', component: A26BillingPlans, roles: ['org_admin'] },
  { path: '/admin/integrations', component: A27Integrations, roles: ['org_admin', 'platform_admin'] },
  { path: '/admin/api-docs', component: A28APIDocs, roles: ['org_admin'] },
  { path: '/admin/api-docs-enhanced', component: A28APIDocsEnhanced, roles: ['org_admin'] },
  { path: '/admin/notifications', component: A29Notifications, roles: ['org_admin'] },
  { path: '/admin/settings', component: A30Settings, roles: ['org_admin'] },
  { path: '/admin/engine-console', component: A99EngineConsole, roles: ['org_admin'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // WORK DOMAIN ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  
  { path: '/work/home', component: WorkHome, roles: ['employee', 'org_admin'] },
  { path: '/work/my-work', component: WorkMyWorkOS, roles: ['employee', 'org_admin'] },
  { path: '/work/projects', component: WorkProjectsOS, roles: ['employee', 'org_admin'] },
  { path: '/work/tasks', component: WorkTasksOS, roles: ['employee', 'org_admin'] },
  { path: '/work/milestones', component: WorkMilestonesOS, roles: ['employee', 'org_admin'] },
  { path: '/work/assignments', component: WorkAssignmentsOS, roles: ['employee', 'org_admin'] },
  { path: '/work/calendar', component: WorkCalendarOS, roles: ['employee', 'org_admin'] },
  { path: '/work/email', component: WorkEmailOS, roles: ['employee', 'org_admin'] },
  { path: '/work/reports', component: WorkReportsOS, roles: ['employee', 'org_admin'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // PEOPLE DOMAIN ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  
  { path: '/people/employees', component: A03Users, roles: ['org_admin'] },
  { path: '/people/members', component: A04Members, roles: ['org_admin'] },
  { path: '/people/departments', component: A05Departments, roles: ['org_admin'] },
  { path: '/people/roles-access', component: A06RolesAccess, roles: ['org_admin'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // TIME DOMAIN ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  
  { path: '/time/tracking', component: W04TimeLogs, roles: ['org_admin'] },
  { 
    path: '/time/time-logs',
    roles: ['employee', 'org_admin'],
    placeholder: true,
    placeholderTitle: 'Time Logs',
    placeholderDescription: 'Track and review detailed time entries across the organization. Monitor employee hours, productivity metrics, and attendance patterns.',
    placeholderRelatedPath: '/time/sessions',
    placeholderRelatedLabel: 'Sessions'
  },
  { path: '/time/my-day', component: E02MyDay, roles: ['employee'] },
  { path: '/time/leave', component: E05Leave, roles: ['employee', 'org_admin'] },
  { path: '/time/sessions', component: A07Sessions, roles: ['org_admin'] },
  { path: '/time/corrections', component: A10Corrections, roles: ['org_admin'] },
  { path: '/time/break-rules', component: A09BreakRules, roles: ['org_admin'] },
  { path: '/time/workday-rules', component: A08WorkdayRules, roles: ['org_admin'] },
  { path: '/time/leave-management', component: A11LeaveManagement, roles: ['org_admin'] },
  { path: '/time/leave-approvals', component: A12LeaveApprovals, roles: ['org_admin'] },
  { path: '/time/fines', component: AT01Fines, roles: ['org_admin'] },
  { path: '/time/fines-management', component: AT01Fines, roles: ['org_admin'] },
  { path: '/time/my-fines', component: ET01MyFines, roles: ['employee'] },
  { path: '/time/input-counters', component: A15InputCounters, roles: ['org_admin'] },
  { path: '/time/screenshot-review', component: A16ScreenshotReview, roles: ['org_admin'] },
  { path: '/time/offline-sync', component: A17OfflineSync, roles: ['org_admin'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // FINANCE DOMAIN ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  
  { path: '/finance/cockpit', component: FC01FinanceCockpit, roles: ['org_admin'] },
  { path: '/finance/inbox', component: FC02FinanceInbox, roles: ['org_admin'] },
  { path: '/finance/quick-add', component: FinanceQuickAdd, roles: ['org_admin'] },
  { path: '/finance/ledger', component: FinanceLedger, roles: ['org_admin'] },
  { path: '/finance/intelligence', component: FinanceIntelligence, roles: ['org_admin'] },
  { path: '/finance/accounts-wallets', component: FinanceAccountsWallets, roles: ['org_admin'] },
  { path: '/finance/import-center', component: FinanceImportCenter, roles: ['org_admin'] },
  { path: '/finance/review-decide', component: FinanceReviewDecide, roles: ['org_admin'] },
  { path: '/finance/reimbursements', component: FinanceReimbursements, roles: ['org_admin'] },
  { path: '/finance/payroll-posting', component: FinancePayrollPosting, roles: ['org_admin'] },
  { path: '/finance/costing-profit', component: FinanceCostingProfit, roles: ['org_admin'] },
  { path: '/finance/reports', component: FinanceReports, roles: ['org_admin'] },
  { path: '/finance/loans-liabilities', component: FinanceLoansLiabilities, roles: ['org_admin'] },
  { path: '/finance/team-permissions', component: FinanceTeamPermissions, roles: ['org_admin'] },
  { path: '/finance/settings', component: FinanceSettings, roles: ['org_admin'] },
  { path: '/finance/billing', component: FinanceBilling, roles: ['org_admin'] },
  { path: '/finance/billing-plans', component: FinanceBillingPlans, roles: ['org_admin'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // COMMUNICATION DOMAIN ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  
  { 
    path: '/communication/team-hub',
    component: AC00TeamHub,
    roles: ['org_admin']
  },
  { 
    path: '/communication/conversations',
    component: AC01CommunicateHome,
    roles: ['org_admin']
  },
  { 
    path: '/communication/channels',
    component: AC02ChannelManagement,
    roles: ['org_admin']
  },
  { 
    path: '/communication/communicate',
    component: EC01CommunicateHome,
    roles: ['employee', 'org_admin']
  },
  
  // ═══════════════════════════════════════════════════════════════════════
  // ANALYTICS DOMAIN ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  
  { path: '/analytics/live-activity', component: A02LiveActivity, roles: ['org_admin'] },
  { 
    path: '/analytics/activity-overview',
    component: A13ActivityOverview,
    roles: ['employee', 'org_admin']
  },
  { path: '/analytics/input-counters', component: A15InputCounters, roles: ['org_admin'] },
  { path: '/analytics/screenshot-review', component: A16ScreenshotReview, roles: ['org_admin'] },
  { path: '/analytics/app-reports', component: A14AppReports, roles: ['org_admin'] },
  { path: '/analytics/analytics', component: A18Analytics, roles: ['org_admin'] },
  { path: '/analytics/reports', component: A19Reports, roles: ['org_admin'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // SECURITY & COMPLIANCE DOMAIN ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  
  { path: '/security/consent-privacy', component: A20Consent, roles: ['org_admin'] },
  { path: '/security/data-retention', component: A21DataRetention, roles: ['org_admin'] },
  { path: '/security/audit-logs', component: A22AuditLogs, roles: ['org_admin'] },
  { path: '/security/security', component: A23Security, roles: ['org_admin'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // PLATFORM DOMAIN ROUTES
  // ══════════════════════════════════════════════════════════════════════
  
  { path: '/platform/settings', component: PlatformOrgSettings, roles: ['org_admin'] },
  { path: '/platform/org-settings', component: A30Settings, roles: ['org_admin'] },
  { path: '/platform/platform-settings', component: S10PlatformSettings, roles: ['platform_admin'] },
  { path: '/platform/billing', component: S04PlatformBilling, roles: ['org_admin', 'platform_admin'] },
  { path: '/platform/billing-plans', component: A26BillingPlans, roles: ['platform_admin'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // INTEGRATIONS DOMAIN ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  
  { path: '/integrations/integrations', component: A27Integrations, roles: ['org_admin', 'platform_admin'] },
  { path: '/integrations/list', component: A27Integrations, roles: ['org_admin', 'platform_admin'] },
  { path: '/integrations/api-docs', component: A28APIDocs, roles: ['org_admin', 'platform_admin'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // SUPER ADMIN / PLATFORM ROUTES
  // ═══════════════════════════════════════════════════════════════════════
  
  { path: '/super/console', component: S01Console, roles: ['platform_admin'] },
  { path: '/super/calendar', component: P04Calendar, roles: ['platform_admin'] },
  { path: '/platform/overview', component: S01Console, roles: ['platform_admin'] },
  { path: '/super/organizations', component: S02Organizations, roles: ['platform_admin'] },
  { path: '/super/org-detail', component: S03OrgDetail, roles: ['platform_admin'] },
  { path: '/platform/finance-console', component: PF01FinancePlatformConsole, roles: ['platform_admin'] },
  { path: '/super/billing', component: S04PlatformBilling, roles: ['platform_admin'] },
  { path: '/super/policies', component: S05GlobalPolicies, roles: ['platform_admin'] },
  { path: '/super/health', component: S06SystemHealth, roles: ['platform_admin'] },
  { path: '/super/audit-logs', component: S07GlobalAuditLogs, roles: ['platform_admin'] },
  { path: '/super/admins', component: S08PlatformAdmins, roles: ['platform_admin'] },
  { path: '/super/seat-sales', component: S09SeatSales, roles: ['platform_admin'] },
  { path: '/platform/calendar', component: P04Calendar, roles: ['platform_admin'] },
  
  // ═══════════════════════════════════════════════════════════════════════
  // DIAGNOSTIC ROUTES
  // ══════════════════════════════════════════════════════════════════════
  
  { path: '/diagnostics/ui-binding', component: UIBindingDiagnostic, roles: ['org_admin'] },
  { path: '/diagnostics/service-layer', component: ServiceLayerStatus, roles: ['org_admin'] },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HELPER FUNCTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Get route definition by path
 */
export function getRouteByPath(path: string): RouteDefinition | undefined {
  return ROUTE_REGISTRY.find(route => route.path === path);
}

/**
 * Get all routes for a specific role
 */
export function getRoutesForRole(role: Role): RouteDefinition[] {
  return ROUTE_REGISTRY.filter(route => route.roles.includes(role));
}

/**
 * Get default home route for a role
 */
export function getDefaultHomeForRole(role: Role): string {
  const defaults: Record<Role, string> = {
    employee: '/work/my-work',
    org_admin: '/org/admin/dashboard',
    platform_admin: '/super/console',
  };
  
  return defaults[role];
}

/**
 * Check if a path is valid for a role
 */
export function canAccessPath(path: string, role: Role): boolean {
  const route = getRouteByPath(path);
  return route ? route.roles.includes(role) : false;
}

/**
 * Export navigation manifest for sidebar
 */
export { NAV_MANIFEST, getAllPaths, getPathsForRole } from '../nav/navManifest';