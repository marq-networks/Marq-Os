/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICE CONTRACTS — Interface Definitions
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * These interfaces define WHAT each service can do, without saying HOW.
 * Mock implementations use in-memory data.
 * Real implementations will use fetch()/axios calls to your API.
 *
 * TO SWAP TO REAL API: Implement these same interfaces with real HTTP calls.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import type {
  AuthUser, Organization, UserRole,
  Employee, Department, RoleDefinition,
  TimeSession, TimeCorrection, LeaveRequest, LeaveBalance,
  WorkdayRule, BreakRule, Fine,
  Channel, Message,
  ActivityLogEntry, ProductivityMetric, AppUsageReport,
  Notification,
  Payslip, PayrollRun, BillingInvoice, OfflineSyncRecord, ScreenshotRecord,
  FinanceTransaction, FinanceAccount, Reimbursement, LoanLiability,
  FinanceInboxItem, CostCenter, ExpenseReport, FinanceReport,
  PayrollPosting,
  LiveActivitySnapshot,
  Project, Sprint, TaskList, Milestone, Task, Issue, TeamMember, TimeLog,
  TaskDependency, SkillRating,
  TaskStatus, Priority, ProjectStatus, SprintStatus, MilestoneStatus,
  QueryParams, PaginatedResponse, ServiceResponse,
} from './types';

// ═══════════════════════════════════════════════════════════════════════
// 1. AUTH SERVICE
// ═══════════════════════════════════════════════════════════════════════

export interface IAuthService {
  /** Get current authenticated user */
  getCurrentUser(): Promise<AuthUser>;

  /** Login with credentials */
  login(email: string, password: string, role: UserRole): Promise<ServiceResponse<AuthUser>>;

  /** Logout current user */
  logout(): Promise<void>;

  /** Switch active organization */
  switchOrganization(orgId: string): Promise<ServiceResponse<Organization>>;

  /** Get all organizations for current user */
  getOrganizations(): Promise<Organization[]>;

  /** Get current organization */
  getCurrentOrganization(): Promise<Organization>;
}

// ═══════════════════════════════════════════════════════════════════════
// 2. PEOPLE SERVICE
// ═══════════════════════════════════════════════════════════════════════

export interface IPeopleService {
  // ─── Employees ─────────────────────────────────────────
  getEmployees(params?: QueryParams): Promise<PaginatedResponse<Employee>>;
  getEmployeeById(id: string): Promise<Employee>;
  createEmployee(data: Omit<Employee, 'id'>): Promise<Employee>;
  updateEmployee(id: string, data: Partial<Employee>): Promise<Employee>;
  deleteEmployee(id: string): Promise<void>;
  getEmployeesByDepartment(departmentId: string): Promise<Employee[]>;

  // ─── Departments ───────────────────────────────────────
  getDepartments(params?: QueryParams): Promise<PaginatedResponse<Department>>;
  getDepartmentById(id: string): Promise<Department>;
  createDepartment(data: Omit<Department, 'id'>): Promise<Department>;
  updateDepartment(id: string, data: Partial<Department>): Promise<Department>;
  deleteDepartment(id: string): Promise<void>;

  // ─── Roles & Access ────────────────────────────────────
  getRoles(params?: QueryParams): Promise<PaginatedResponse<RoleDefinition>>;
  getRoleById(id: string): Promise<RoleDefinition>;
  createRole(data: Omit<RoleDefinition, 'id'>): Promise<RoleDefinition>;
  updateRole(id: string, data: Partial<RoleDefinition>): Promise<RoleDefinition>;
  deleteRole(id: string): Promise<void>;
}

// ═══════════════════════════════════════════════════════════════════════
// 3. TIME SERVICE
// ═══════════════════════════════════════════════════════════════════════

export interface ITimeService {
  // ─── Sessions ──────────────────────────────────────────
  getSessions(params?: QueryParams): Promise<PaginatedResponse<TimeSession>>;
  getSessionById(id: string): Promise<TimeSession>;
  clockIn(employeeId: string): Promise<TimeSession>;
  clockOut(sessionId: string): Promise<TimeSession>;
  getActiveSession(employeeId: string): Promise<TimeSession | null>;

  // ─── Corrections ───────────────────────────────────────
  getCorrections(params?: QueryParams): Promise<PaginatedResponse<TimeCorrection>>;
  submitCorrection(data: Omit<TimeCorrection, 'id' | 'status' | 'submittedAt'>): Promise<TimeCorrection>;
  approveCorrection(id: string, reviewedBy: string): Promise<TimeCorrection>;
  rejectCorrection(id: string, reviewedBy: string, reason: string): Promise<TimeCorrection>;

  // ─── Leave ─────────────────────────────────────────────
  getLeaveRequests(params?: QueryParams): Promise<PaginatedResponse<LeaveRequest>>;
  getLeaveRequestById(id: string): Promise<LeaveRequest>;
  submitLeaveRequest(data: Omit<LeaveRequest, 'id' | 'status' | 'submittedAt'>): Promise<LeaveRequest>;
  approveLeaveRequest(id: string, approvedBy: string): Promise<LeaveRequest>;
  rejectLeaveRequest(id: string, reason: string): Promise<LeaveRequest>;
  cancelLeaveRequest(id: string): Promise<LeaveRequest>;
  getLeaveBalances(employeeId: string): Promise<LeaveBalance[]>;

  // ─── Rules ─────────────────────────────────────────────
  getWorkdayRules(): Promise<WorkdayRule[]>;
  createWorkdayRule(data: Omit<WorkdayRule, 'id'>): Promise<WorkdayRule>;
  updateWorkdayRule(id: string, data: Partial<WorkdayRule>): Promise<WorkdayRule>;
  deleteWorkdayRule(id: string): Promise<void>;
  getBreakRules(): Promise<BreakRule[]>;
  createBreakRule(data: Omit<BreakRule, 'id'>): Promise<BreakRule>;
  updateBreakRule(id: string, data: Partial<BreakRule>): Promise<BreakRule>;
  deleteBreakRule(id: string): Promise<void>;

  // ─── Fines ─────────────────────────────────────────────
  getFines(params?: QueryParams): Promise<PaginatedResponse<Fine>>;
  getFineById(id: string): Promise<Fine>;
  createFine(data: Omit<Fine, 'id' | 'issuedAt'>): Promise<Fine>;
  updateFine(id: string, data: Partial<Fine>): Promise<Fine>;
  waiveFine(id: string, waivedBy: string, reason: string): Promise<Fine>;
  getMyFines(employeeId: string): Promise<Fine[]>;
}

// ═══════════════════════════════════════════════════════════════════════
// 4. COMMUNICATION SERVICE
// ══════════════════════════════════════════════════════════════════════

export interface ICommunicationService {
  // ─── Channels ──────────────────────────────────────────
  getChannels(params?: QueryParams): Promise<PaginatedResponse<Channel>>;
  getChannelById(id: string): Promise<Channel>;
  createChannel(data: Omit<Channel, 'id' | 'createdAt'>): Promise<Channel>;
  updateChannel(id: string, data: Partial<Channel>): Promise<Channel>;
  deleteChannel(id: string): Promise<void>;
  archiveChannel(id: string): Promise<Channel>;
  joinChannel(channelId: string, userId: string): Promise<void>;
  leaveChannel(channelId: string, userId: string): Promise<void>;

  // ─── Messages ──────────────────────────────────────────
  getMessages(channelId: string, params?: QueryParams): Promise<PaginatedResponse<Message>>;
  sendMessage(channelId: string, content: string, senderId: string): Promise<Message>;
  editMessage(messageId: string, content: string): Promise<Message>;
  deleteMessage(messageId: string): Promise<void>;
  addReaction(messageId: string, emoji: string, userId: string): Promise<void>;
  removeReaction(messageId: string, emoji: string, userId: string): Promise<void>;
  pinMessage(messageId: string): Promise<void>;
  unpinMessage(messageId: string): Promise<void>;
}

// ═══════════════════════════════════════════════════════════════════════
// 5. ANALYTICS SERVICE
// ═══════════════════════════════════════════════════════════════════════

export interface IAnalyticsService {
  /** Get activity log entries */
  getActivityLog(params?: QueryParams): Promise<PaginatedResponse<ActivityLogEntry>>;

  /** Get productivity metrics for a date range */
  getProductivityMetrics(
    dateFrom: string,
    dateTo: string,
    departmentId?: string,
  ): Promise<ProductivityMetric[]>;

  /** Get app usage reports */
  getAppUsageReports(dateFrom: string, dateTo: string): Promise<AppUsageReport[]>;

  /** Get real-time active users */
  getLiveActivity(): Promise<LiveActivitySnapshot>;
}

// ═══════════════════════════════════════════════════════════════════════
// 6. NOTIFICATION SERVICE
// ═══════════════════════════════════════════════════════════════════════

export interface INotificationService {
  getNotifications(params?: QueryParams): Promise<PaginatedResponse<Notification>>;
  getUnreadCount(): Promise<number>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  deleteNotification(id: string): Promise<void>;
}

// ═══════════════════════════════════════════════════════════════════════
// 7. FINANCE SERVICE (Phase 8 + Phase 13 extended)
// ═══════════════════════════════════════════════════════════════════════

export interface IFinanceService {
  // ─── Payroll ───────────────────────────────────────────────
  getPayrollRuns(params?: QueryParams): Promise<PaginatedResponse<PayrollRun>>;
  getPayrollRunById(id: string): Promise<PayrollRun>;
  processPayrollRun(id: string, processedBy: string): Promise<PayrollRun>;

  // ─── Payslips ──────────────────────────────────────────────
  getPayslips(params?: QueryParams): Promise<PaginatedResponse<Payslip>>;
  getMyPayslips(employeeId: string): Promise<Payslip[]>;
  getPayslipById(id: string): Promise<Payslip>;

  // ─── Billing ───────────────────────────────────────────────
  getBillingInvoices(params?: QueryParams): Promise<PaginatedResponse<BillingInvoice>>;
  getBillingInvoiceById(id: string): Promise<BillingInvoice>;

  // ─── Offline Sync ──────────────────────────────────────────
  getOfflineSyncRecords(params?: QueryParams): Promise<PaginatedResponse<OfflineSyncRecord>>;
  triggerSync(id: string): Promise<OfflineSyncRecord>;
  syncAll(): Promise<OfflineSyncRecord[]>;

  // ─── Screenshots ───────────────────────────────────────────
  getScreenshots(params?: QueryParams): Promise<PaginatedResponse<ScreenshotRecord>>;
  reviewScreenshot(id: string, reviewedBy: string): Promise<ScreenshotRecord>;
  flagScreenshot(id: string, reason: string): Promise<ScreenshotRecord>;

  // ─── Transactions / Ledger (Phase 13) ──────────────────────
  getTransactions(params?: QueryParams): Promise<PaginatedResponse<FinanceTransaction>>;
  getTransactionById(id: string): Promise<FinanceTransaction>;
  createTransaction(data: Omit<FinanceTransaction, 'id'>): Promise<FinanceTransaction>;
  updateTransaction(id: string, data: Partial<FinanceTransaction>): Promise<FinanceTransaction>;
  voidTransaction(id: string): Promise<FinanceTransaction>;

  // ─── Accounts / Wallets (Phase 13) ─────────────────────────
  getAccounts(params?: QueryParams): Promise<PaginatedResponse<FinanceAccount>>;
  getAccountById(id: string): Promise<FinanceAccount>;
  createAccount(data: Omit<FinanceAccount, 'id'>): Promise<FinanceAccount>;
  updateAccount(id: string, data: Partial<FinanceAccount>): Promise<FinanceAccount>;

  // ─── Reimbursements (Phase 13) ─────────────────────────────
  getReimbursements(params?: QueryParams): Promise<PaginatedResponse<Reimbursement>>;
  getReimbursementById(id: string): Promise<Reimbursement>;
  createReimbursement(data: Omit<Reimbursement, 'id' | 'submittedAt'>): Promise<Reimbursement>;
  approveReimbursement(id: string, reviewedBy: string): Promise<Reimbursement>;
  rejectReimbursement(id: string, reviewedBy: string, reason: string): Promise<Reimbursement>;
  markReimbursementPaid(id: string): Promise<Reimbursement>;
  getMyReimbursements(employeeId: string): Promise<Reimbursement[]>;

  // ─── Loans & Liabilities (Phase 13) ────────────────────────
  getLoans(params?: QueryParams): Promise<PaginatedResponse<LoanLiability>>;
  getLoanById(id: string): Promise<LoanLiability>;
  createLoan(data: Omit<LoanLiability, 'id'>): Promise<LoanLiability>;
  updateLoan(id: string, data: Partial<LoanLiability>): Promise<LoanLiability>;

  // ─── Finance Inbox (Phase 13) ──────────────────────────────
  getFinanceInbox(params?: QueryParams): Promise<PaginatedResponse<FinanceInboxItem>>;
  markInboxItemRead(id: string): Promise<FinanceInboxItem>;
  actionInboxItem(id: string): Promise<FinanceInboxItem>;
  getUnreadInboxCount(): Promise<number>;

  // ─── Cost Centers (Phase 13) ───────────────────────────────
  getCostCenters(params?: QueryParams): Promise<PaginatedResponse<CostCenter>>;
  getCostCenterById(id: string): Promise<CostCenter>;
  updateCostCenter(id: string, data: Partial<CostCenter>): Promise<CostCenter>;

  // ─── Expense Reports (Phase 13) ────────────────────────────
  getExpenseReports(params?: QueryParams): Promise<PaginatedResponse<ExpenseReport>>;
  getExpenseReportById(id: string): Promise<ExpenseReport>;
  createExpenseReport(data: Omit<ExpenseReport, 'id'>): Promise<ExpenseReport>;
  submitExpenseReport(id: string): Promise<ExpenseReport>;
  approveExpenseReport(id: string, approvedBy: string): Promise<ExpenseReport>;
  rejectExpenseReport(id: string, reason: string): Promise<ExpenseReport>;
  getMyExpenseReports(employeeId: string): Promise<ExpenseReport[]>;

  // ─── Finance Reports (Phase 13) ────────────────────────────
  getFinanceReports(params?: QueryParams): Promise<PaginatedResponse<FinanceReport>>;
  getFinanceReportById(id: string): Promise<FinanceReport>;
  generateReport(type: FinanceReport['type'], period: string): Promise<FinanceReport>;

  // ─── Payroll Postings (Phase 14 — gap closure) ─────────────
  /** List all payroll postings (paginated) */
  getPayrollPostings(params?: QueryParams): Promise<PaginatedResponse<PayrollPosting>>;
  /** Get a single payroll posting by ID */
  getPayrollPostingById(id: string): Promise<PayrollPosting>;
  /** Create a new draft payroll posting */
  createPayrollPosting(data: Omit<PayrollPosting, 'id' | 'createdAt'>): Promise<PayrollPosting>;
  /** Commit a draft posting to the finance ledger */
  postPayrollPosting(id: string, postedBy: string): Promise<PayrollPosting>;
  /** Reverse a posted payroll posting with an audit reason */
  reversePayrollPosting(id: string, reversedBy: string, reason: string): Promise<PayrollPosting>;
}

// ═══════════════════════════════════════════════════════════════════════
// 8. EXECUTION OS / WORK SERVICE (Phase 12)
// ═══════════════════════════════════════════════════════════════════════
//
// Currently powered by ExecutionOSContext (in-memory React state).
// To swap to a real API, implement this interface and replace the context.
// The UI components use `useExecutionOS()` — update that hook to call
// these methods instead of reading from context state.
//

export interface IExecutionOSService {
  // ─── Projects ──────────────────────────────────────────
  getProjects(params?: QueryParams): Promise<PaginatedResponse<Project>>;
  getProjectById(id: string): Promise<Project>;
  createProject(data: Omit<Project, 'id'>): Promise<Project>;
  updateProject(id: string, data: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // ─── Tasks ─────────────────────────────────────────────
  getTasks(params?: QueryParams): Promise<PaginatedResponse<Task>>;
  getTaskById(id: string): Promise<Task>;
  createTask(data: Omit<Task, 'id'>): Promise<Task>;
  updateTask(id: string, data: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  changeTaskStatus(id: string, status: TaskStatus): Promise<Task>;

  // ─── Sprints ───────────────────────────────────────────
  getSprints(params?: QueryParams): Promise<PaginatedResponse<Sprint>>;
  getSprintById(id: string): Promise<Sprint>;
  createSprint(data: Omit<Sprint, 'id'>): Promise<Sprint>;
  updateSprint(id: string, data: Partial<Sprint>): Promise<Sprint>;

  // ─── Milestones ────────────────────────────────────────
  getMilestones(params?: QueryParams): Promise<PaginatedResponse<Milestone>>;
  getMilestoneById(id: string): Promise<Milestone>;
  createMilestone(data: Omit<Milestone, 'id'>): Promise<Milestone>;
  updateMilestone(id: string, data: Partial<Milestone>): Promise<Milestone>;
  deleteMilestone(id: string): Promise<void>;

  // ─── Issues ────────────────────────────────────────────
  getIssues(params?: QueryParams): Promise<PaginatedResponse<Issue>>;
  getIssueById(id: string): Promise<Issue>;
  createIssue(data: Omit<Issue, 'id'>): Promise<Issue>;
  updateIssue(id: string, data: Partial<Issue>): Promise<Issue>;

  // ─── Team & Time Logs ──────────────────────────────────
  getTeamMembers(params?: QueryParams): Promise<PaginatedResponse<TeamMember>>;
  getTimeLogs(params?: QueryParams): Promise<PaginatedResponse<TimeLog>>;
  createTimeLog(data: Omit<TimeLog, 'id'>): Promise<TimeLog>;

  // ─── Dependencies ──────────────────────────────────────
  getDependencies(taskId: string): Promise<TaskDependency[]>;
  addDependency(data: TaskDependency): Promise<TaskDependency>;
  removeDependency(fromId: string, toId: string): Promise<void>;
}

// ═══════════════════════════════════════════════════════════════════════
// MASTER SERVICE REGISTRY
// ═══════════════════════════════════════════════════════════════════════

/**
 * Single interface that holds ALL services.
 * This is what gets provided via React Context.
 *
 * To swap mock → real: replace implementations, not the interface.
 *
 * NOTE (Phase 14): executionOS is now REQUIRED. ExecutionOSMockService
 * provides the in-memory implementation. ExecutionOSContext.tsx continues
 * to manage UI-level React state (optimistic updates, activity feed, emails).
 * When connecting a real API, replace ExecutionOSMockService with an HTTP
 * service class and update useExecutionOS() to delegate persistence to it.
 */
export interface ServiceRegistry {
  auth: IAuthService;
  people: IPeopleService;
  time: ITimeService;
  communication: ICommunicationService;
  analytics: IAnalyticsService;
  notifications: INotificationService;
  finance: IFinanceService;
  executionOS: IExecutionOSService; // was optional — FL-004 / PV-001 closed Phase 14
}