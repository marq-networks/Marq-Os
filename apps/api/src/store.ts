import type {
  ActivityLogEntry,
  AppUsageReport,
  AuthUser,
  BillingInvoice,
  BreakRule,
  Channel,
  CostCenter,
  Department,
  Employee,
  ExpenseReport,
  Fine,
  FinanceAccount,
  FinanceInboxItem,
  FinanceReport,
  FinanceTransaction,
  LeaveBalance,
  LeaveRequest,
  LoanLiability,
  Message,
  Notification,
  OfflineSyncRecord,
  Organization,
  PayrollPosting,
  PayrollRun,
  Payslip,
  ProductivityMetric,
  Reimbursement,
  ScreenshotRecord,
  TimeCorrection,
  TimeSession,
  WorkdayRule,
} from '../../../src/app/services/types';

import { loadSeed } from './seed';
import type {
  Issue,
  Milestone,
  Project,
  Sprint,
  Task,
  TaskDependency,
  TaskList,
  TeamMember,
  TimeLog,
} from '../../../src/app/services/types';

export type DataStore = {
  authUsers: AuthUser[];
  authAccounts: Array<{
    userId: string;
    email: string;
    password: string;
    role: AuthUser['role'];
  }>;
  organizations: Organization[];

  employees: Employee[];
  departments: Department[];
  roles: any[];

  timeSessions: TimeSession[];
  timeCorrections: TimeCorrection[];
  leaveRequests: LeaveRequest[];
  leaveBalances: LeaveBalance[];
  workdayRules: WorkdayRule[];
  breakRules: BreakRule[];
  fines: Fine[];

  channels: Channel[];
  messages: Message[];

  activityLog: ActivityLogEntry[];
  productivityMetrics: ProductivityMetric[];
  appUsageReports?: AppUsageReport[];

  notifications: Notification[];

  payrollRuns: PayrollRun[];
  payslips: Payslip[];
  billingInvoices: BillingInvoice[];
  offlineSync: OfflineSyncRecord[];
  screenshots: ScreenshotRecord[];

  transactions: FinanceTransaction[];
  accounts: FinanceAccount[];
  reimbursements: Reimbursement[];
  loans: LoanLiability[];
  financeInbox: FinanceInboxItem[];
  costCenters: CostCenter[];
  expenseReports: ExpenseReport[];
  financeReports: FinanceReport[];
  payrollPostings: PayrollPosting[];

  // Work / Execution OS
  projects: Project[];
  tasks: Task[];
  sprints: Sprint[];
  milestones: Milestone[];
  issues: Issue[];
  teamMembers: TeamMember[];
  timeLogs: TimeLog[];
  taskDependencies: TaskDependency[];
  taskLists: TaskList[];
};

let store: DataStore | null = null;

export function getStore(): DataStore {
  if (!store) store = loadSeed() as DataStore;
  return store;
}

export function resetStore(): void {
  store = loadSeed() as DataStore;
}

