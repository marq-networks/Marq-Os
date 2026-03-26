/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICE LAYER — Unified Type System
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * These types define the DATA CONTRACTS for every entity in the system.
 * When you connect a real database later, your DB schema should match these.
 *
 * DOMAINS COVERED:
 *   1. Auth / Users
 *   2. People (Employees, Departments, Roles)
 *   3. Time (Sessions, Corrections, Leave, Fines)
 *   4. Communication (Channels, Messages)
 *   5. Analytics (Reports, Activity Logs)
 *
 * NOTE: Work/Execution OS types live in workTypes.ts — we re-export them here
 * for a single import point. Finance types live in engines/finance/types.ts.
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Re-export Work domain types (already comprehensive)
export type {
  Project, Sprint, TaskList, Milestone, Task, SubTask,
  Issue, TeamMember, TimeLog, TaskDependency, SkillRating,
  TaskStatus, Priority, ProjectStatus, SprintStatus, MilestoneStatus,
  IssueStatus, IssueSeverity, ViewMode, GroupBy, SortBy, FilterState,
  EmailThread,
} from '../components/screens/work/workTypes';

// ═══════════════════════════════════════════════════════════════════════
// 1. AUTH / USER TYPES
// ═══════════════════════════════════════════════════════════════════════

export type UserRole = 'employee' | 'org_admin' | 'platform_admin';
export type UserStatus = 'Active' | 'Away' | 'Offline' | 'Suspended' | 'Deactivated';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationId: string;
  lastLogin?: string;
}

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  plan: 'Free' | 'Starter' | 'Professional' | 'Enterprise';
  seats: number;
  usedSeats: number;
  createdAt: string;
  status: 'Active' | 'Suspended' | 'Trial';
}

// ═══════════════════════════════════════════════════════════════════════
// 2. PEOPLE TYPES
// ═══════════════════════════════════════════════════════════════════════

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;         // Job title
  department: string;
  departmentId: string;
  status: UserStatus;
  lastSeen: string;
  joinDate: string;
  phone?: string;
  location?: string;
  manager?: string;
  managerId?: string;
  skills?: string[];
  salary?: number;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern';
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
  lead: string;
  leadId: string;
  memberCount: number;
  budget: number;
  parentDepartmentId?: string;
  createdAt: string;
  status: 'Active' | 'Archived';
}

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  isSystem: boolean; // system roles can't be deleted
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════
// 3. TIME TYPES
// ═══════════════════════════════════════════════════════════════════════

export type SessionStatus = 'Active' | 'Completed' | 'Incomplete' | 'Manual';
export type CorrectionStatus = 'Pending' | 'Approved' | 'Rejected';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
export type LeaveType = 'Vacation' | 'Sick Leave' | 'Personal' | 'Parental' | 'Bereavement' | 'Unpaid';
export type FineStatus = 'Active' | 'Paid' | 'Waived' | 'Disputed';

export interface TimeSession {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  duration: string;
  totalMinutes: number;
  status: SessionStatus;
  department: string;
  breaks?: TimeBreak[];
  notes?: string;
  ip?: string;
  location?: string;
}

export interface TimeBreak {
  id: string;
  startTime: string;
  endTime?: string;
  duration: string;
  type: 'Lunch' | 'Short' | 'Personal';
}

export interface TimeCorrection {
  id: string;
  employeeId: string;
  employeeName: string;
  sessionId: string;
  date: string;
  originalCheckIn: string;
  originalCheckOut: string;
  correctedCheckIn: string;
  correctedCheckOut: string;
  reason: string;
  status: CorrectionStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  submittedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  submittedAt: string;
  notes?: string;
}

export interface LeaveBalance {
  employeeId: string;
  type: LeaveType;
  total: number;
  used: number;
  pending: number;
  remaining: number;
}

export interface WorkdayRule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  gracePeriodMinutes: number;
  workingDays: number[]; // 0=Sun, 1=Mon, ... 6=Sat
  timezone: string;
  appliesTo: string[]; // department IDs or 'all'
  isDefault: boolean;
}

export interface BreakRule {
  id: string;
  name: string;
  maxBreaks: number;
  maxBreakDuration: number; // minutes per break
  maxTotalBreakTime: number; // total minutes per day
  paidBreak: boolean;
  appliesTo: string[];
  isDefault: boolean;
}

export interface Fine {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'Late Arrival' | 'Early Departure' | 'Absent' | 'Break Violation' | 'Policy Violation';
  amount: number;
  currency: string;
  date: string;
  description: string;
  status: FineStatus;
  sessionId?: string;
  issuedBy: string;
  issuedAt: string;
  paidAt?: string;
  waivedBy?: string;
  waivedReason?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// 4. COMMUNICATION TYPES
// ═══════════════════════════════════════════════════════════════════════

export type ChannelType = 'public' | 'private' | 'direct';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: ChannelType;
  createdBy: string;
  memberCount: number;
  members: string[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
  pinned: boolean;
  archived: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  status: MessageStatus;
  edited: boolean;
  editedAt?: string;
  replyTo?: string;
  reactions?: Record<string, string[]>; // emoji → userIds
  attachments?: MessageAttachment[];
  mentions?: string[];
  pinned: boolean;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

// ═══════════════════════════════════════════════════════════════════════
// 5. ANALYTICS TYPES
// ═══════════════════════════════════════════════════════════════════════

export interface ActivityLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  target: string;
  targetType: 'task' | 'project' | 'employee' | 'leave' | 'fine' | 'finance' | 'system';
  details?: string;
  timestamp: string;
  ip?: string;
}

export interface ProductivityMetric {
  employeeId: string;
  employeeName: string;
  department: string;
  date: string;
  activeHours: number;
  idleMinutes: number;
  tasksCompleted: number;
  keystrokes?: number;
  mouseClicks?: number;
  screenshotsCount: number;
  productivityScore: number; // 0-100
}

export interface AppUsageReport {
  appName: string;
  category: 'Productive' | 'Neutral' | 'Unproductive';
  totalMinutes: number;
  percentage: number;
  users: number;
}

// ═══════════════════════════════════════════════════════════════════════
// 6. NOTIFICATION TYPES
// ═══════════════════════════════════════════════════════════════════════

export type NotificationType = 'info' | 'warning' | 'success' | 'error' | 'action_required';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
  expiresAt?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// 7. FINANCE TYPES (Phase 8)
// ═══════════════════════════════════════════════════════════════════════

export type PayrollRunStatus = 'Draft' | 'Processing' | 'Processed' | 'Failed';
export type BillingStatus = 'Paid' | 'Pending' | 'Overdue' | 'Cancelled';
export type SyncStatus = 'Pending' | 'In Progress' | 'Completed' | 'Failed';
export type ScreenshotStatus = 'Pending' | 'Reviewed' | 'Flagged';
export type BlurLevel = 'None' | 'Low' | 'Medium' | 'High';

export interface PayslipDeduction {
  label: string;
  amount: number;
  type: 'deduction' | 'addition';
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  period: string;   // e.g. 'March 2026'
  month: string;    // e.g. '2026-03'
  grossSalary: number;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  currency: string;
  status: 'Processing' | 'Processed' | 'Pending';
  paymentDate?: string;
  pdfUrl?: string;
  breakdown: PayslipDeduction[];
  payrollRunId: string;
}

export interface PayrollRun {
  id: string;
  month: string;    // '2026-03'
  period: string;   // 'March 2026'
  employeeCount: number;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  currency: string;
  status: PayrollRunStatus;
  processedAt?: string;
  processedBy?: string;
  payslipIds: string[];
}

export interface BillingInvoice {
  id: string;
  invoiceNumber: string;
  organizationId: string;
  clientName: string;       // client/org display name
  period: string;
  issueDate: string;        // when the invoice was created
  date: string;
  dueDate: string;
  seats: number;
  pricePerSeat: number;
  subtotal: number;
  tax: number;
  amount: number;           // total amount (subtotal + tax)
  total: number;            // alias for amount (backwards compat)
  currency: string;
  status: BillingStatus;
  plan: string;
  paidAt?: string;
  downloadUrl?: string;
}

export interface OfflineSyncRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  recordType: 'Time Log' | 'Activity Data' | 'Screenshots' | 'Task Updates';
  recordCount: number;
  lastSyncAttempt: string;
  status: SyncStatus;
  errorMessage?: string;
  deviceId?: string;
  deviceName?: string;
}

export interface ScreenshotRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  timestamp: string;
  activity: string;
  blurLevel: BlurLevel;
  status: ScreenshotStatus;
  sessionId?: string;
  flagReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  thumbnailUrl?: string;
}

// ═══════════════════════════════════════════════════════════════════════
// 7b. FINANCE EXTENDED TYPES (Phase 13)
// ═══════════════════════════════════════════════════════════════════════

export type TransactionType = 'income' | 'expense' | 'transfer' | 'payroll' | 'reimbursement' | 'adjustment';
export type TransactionStatus = 'Posted' | 'Pending' | 'Voided' | 'Processing';
export type AccountType = 'bank' | 'wallet' | 'credit' | 'savings' | 'petty_cash' | 'investment';
export type ReimbursementStatus = 'Pending' | 'Approved' | 'Rejected' | 'Paid';
export type LoanStatus = 'Active' | 'Paid' | 'Overdue' | 'Defaulted';
export type FinanceInboxItemType = 'approval_request' | 'expense_submission' | 'payment_due' | 'alert' | 'reimbursement_request';
export type FinanceReportType = 'P&L' | 'Cash Flow' | 'Balance Sheet' | 'Expense Summary' | 'Payroll Summary' | 'Project Burn';
export type CostCenterStatus = 'On Track' | 'At Risk' | 'Over Budget';
export type ExpenseReportStatus = 'Draft' | 'Submitted' | 'Approved' | 'Rejected' | 'Paid';

/** General ledger / transaction entry */
export interface FinanceTransaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  accountId: string;
  accountName: string;
  reference?: string;
  status: TransactionStatus;
  createdBy: string;
  departmentId?: string;
  departmentName?: string;
  projectId?: string;
  tags?: string[];
}

/** Bank account / wallet */
export interface FinanceAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  status: 'Active' | 'Frozen' | 'Closed';
  lastTransactionAt?: string;
  accountNumber?: string;
  bankName?: string;
  notes?: string;
}

/** Employee expense reimbursement request */
export interface Reimbursement {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  receiptUrl?: string;
  status: ReimbursementStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  paidAt?: string;
  notes?: string;
}

/** Company loan or liability record */
export interface LoanLiability {
  id: string;
  type: 'loan' | 'liability' | 'advance';
  employeeId?: string;
  employeeName?: string;
  creditor: string;
  principalAmount: number;
  outstandingBalance: number;
  currency: string;
  interestRate: number;
  startDate: string;
  dueDate: string;
  status: LoanStatus;
  monthlyPayment: number;
  notes?: string;
}

/** Finance inbox / action-required item */
export interface FinanceInboxItem {
  id: string;
  type: FinanceInboxItemType;
  title: string;
  description: string;
  amount?: number;
  currency?: string;
  submittedBy?: string;
  submittedById?: string;
  submittedAt: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'unread' | 'read' | 'actioned';
  actionUrl?: string;
  referenceId?: string;
}

/** Departmental cost center / budget tracking */
export interface CostCenter {
  id: string;
  name: string;
  departmentId: string;
  departmentName: string;
  budget: number;
  spent: number;
  committed: number;
  currency: string;
  period: string;
  status: CostCenterStatus;
  managerId: string;
  managerName: string;
}

/** Individual line item inside an expense report */
export interface ExpenseLineItem {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  receiptUrl?: string;
}

/** Multi-item employee expense report */
export interface ExpenseReport {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  title: string;
  totalAmount: number;
  currency: string;
  period: string;
  status: ExpenseReportStatus;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  lineItems: ExpenseLineItem[];
}

/** Generated finance report (P&L, Cash Flow, etc.) */
export interface FinanceReport {
  id: string;
  type: FinanceReportType;
  title: string;
  period: string;
  generatedAt: string;
  generatedBy: string;
  fileUrl?: string;
  status: 'Generating' | 'Ready' | 'Failed';
  summary?: Record<string, number>;
}

// ═══════════════════════════════════════════════════════════════════════
// 7c. PAYROLL POSTING TYPES (Phase 14 — gap closure)
// ═══════════════════════════════════════════════════════════════════════

export type PayrollPostingStatus = 'Draft' | 'Posted' | 'Reversed';

/** Department-level cost breakdown inside a payroll posting */
export interface PayrollPostingDept {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  amount: number;
}

/**
 * A payroll posting records the act of pushing a payroll run into the
 * finance ledger. One PayrollPosting per period; it references the
 * source PayrollRun and carries department-level allocation data.
 *
 * DB table: payroll_postings  (SWAP_GUIDE.ts — table 29)
 */
export interface PayrollPosting {
  id: string;
  payrollRunId?: string;        // FK → PayrollRun.id (optional — can be manual)
  period: string;               // 'March 2026'
  month: string;                // '2026-03'
  totalAmount: number;
  currency: string;
  employeeCount: number;
  departmentBreakdown: PayrollPostingDept[];
  status: PayrollPostingStatus;
  ledgerRef?: string;           // Reference to the ledger entry created on posting
  postedAt?: string;
  postedBy?: string;
  reversedAt?: string;
  reversedBy?: string;
  reversalReason?: string;
  notes?: string;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════
// 7d. ANALYTICS SNAPSHOT TYPES (Phase 14 — PV-006 fix)
// ═══════════════════════════════════════════════════════════════════════

/**
 * Uniform return type for IAnalyticsService.getLiveActivity().
 * Replaces the anonymous object literal that previously violated the
 * "Uniform Service Response Format" pattern (PV-006).
 */
export interface LiveActivitySnapshot {
  activeUsers: number;
  totalUsers: number;
  /** Count of active users keyed by department name */
  byDepartment: Record<string, number>;
  recentActions: ActivityLogEntry[];
}

// ═══════════════════════════════════════════════════════════════════════
// GENERIC SERVICE HELPERS
// ═══════════════════════════════════════════════════════════════════════

/** Standard paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Standard filter/sort params */
export interface QueryParams {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

/** Standard API response wrapper */
export interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}