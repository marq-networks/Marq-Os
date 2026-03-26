// Finance Module Types - Logic-First Design

export type TransactionType = 'income' | 'expense' | 'transfer';
export type PaymentMethod = 'cash' | 'bank' | 'wallet' | 'card';
export type AccountType = 'cash' | 'bank' | 'wallet' | 'credit-card' | 'loan' | 'investment';
export type TransactionStatus = 'draft' | 'pending-approval' | 'approved' | 'rejected' | 'posted' | 'pending' | 'review';
export type CategoryType = 'income' | 'expense' | 'asset' | 'liability' | 'equity';
export type WorldType = 'business' | 'personal';
export type ImportStatus = 'uploaded' | 'mapping' | 'parsing' | 'matching' | 'review' | 'ready' | 'posted';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  narration: string;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  accountId: string;
  accountName: string;
  categoryId?: string;
  categoryName?: string;
  world: WorldType;
  status: TransactionStatus;
  confidenceScore?: number; // 0-100, AI classification confidence
  autoClassified?: boolean;
  tags?: string[];
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  revisionOf?: string; // ID of original transaction if edited
  notes?: string;
  
  // Payroll integration fields
  departmentId?: string;
  departmentName?: string;
  isSystemGenerated?: boolean; // Auto-posted from A24 Payroll or other systems
  sourceModule?: 'payroll' | 'expense-approval' | 'manual'; // Where transaction originated
  sourceId?: string; // Reference to source record (e.g., payroll batch ID)
}

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  world: WorldType;
  bankName?: string;
  accountNumber?: string;
  isActive: boolean;
  isPrimary?: boolean;
  color?: string;
  icon?: string;
  createdAt: string;
  lastSyncedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  parent?: string;
  description?: string;
  color?: string;
  isSystem?: boolean;
  world: WorldType;
  totalAmount?: number;
  transactionCount?: number;
}

export interface StatementImport {
  id: string;
  fileName: string;
  accountId: string;
  accountName: string;
  status: ImportStatus;
  uploadedAt: string;
  uploadedBy: string;
  totalRows: number;
  processedRows: number;
  matchedRows: number;
  reviewRows: number;
  duplicatesFound: number;
  errors?: string[];
  completedAt?: string;
}

export interface ReviewQueueItem {
  id: string;
  transactionId: string;
  amount: number;
  narration: string;
  date: string;
  accountName: string;
  suggestedCategory?: string;
  suggestedWorld?: WorldType;
  confidenceScore: number;
  reason: string;
  similarTransactions: number;
  createdAt: string;
}

export interface NarrationRule {
  id: string;
  pattern: string; // Regex or text pattern
  categoryId: string;
  categoryName: string;
  world: WorldType;
  confidence: number;
  matchCount: number;
  lastMatched?: string;
  createdAt: string;
  createdBy: string;
  isActive: boolean;
}

export interface CostingRule {
  id: string;
  name: string;
  departmentId?: string;
  departmentName?: string;
  hourlyRate?: number;
  overheadPercentage?: number;
  fixedMonthly?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface FinanceKPI {
  cashInHand: number;
  bankBalances: number;
  netWorth: number;
  profitToday: number;
  profitMonth: number;
  burnRate: number; // per day
  profitPerHour: number;
  quoteRisk: number; // percentage
  overheadLeakage: number; // percentage
}

export interface Report {
  id: string;
  name: string;
  type: 'profit-loss' | 'balance-sheet' | 'cashflow' | 'net-worth';
  dateFrom: string;
  dateTo: string;
  world?: WorldType;
  generatedAt: string;
  generatedBy: string;
  data: any; // Report-specific data structure
}

export interface Loan {
  id: string;
  name: string;
  lender: string;
  principalAmount: number;
  outstandingAmount: number;
  interestRate: number;
  startDate: string;
  endDate: string;
  emiAmount?: number;
  emiDate?: number; // day of month
  accountId: string;
  status: 'active' | 'paid' | 'overdue';
  world: WorldType;
  createdAt: string;
}

export interface FinanceSettings {
  enablePersonalWorld: boolean;
  requireApproval: boolean;
  approvalThreshold?: number;
  confidenceThreshold: number; // Auto-post if above this
  cashInHandAccountId: string;
  defaultCurrency: string;
  fiscalYearStart: string; // MM-DD format
  enableAutoBackup: boolean;
  dataRetentionDays: number;
  exportFormat: 'pdf' | 'excel' | 'csv';
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  permissions: {
    canAddTransactions: boolean;
    canEditTransactions: boolean;
    canDeleteTransactions: boolean;
    canViewReports: boolean;
    canManageAccounts: boolean;
    canImportStatements: boolean;
    canManageSettings: boolean;
  };
  world: WorldType[];
  isActive: boolean;
}

// Operational Types - Multi-User Workflow
export interface Department {
  id: string;
  name: string;
  code: string;
  color: string;
  managerId?: string;
  managerName?: string;
  isActive: boolean;
}

export interface Client {
  id: string;
  name: string;
  code: string;
  email?: string;
  phone?: string;
  isActive: boolean;
}

export interface ExpenseType {
  id: string;
  name: string;
  categoryId: string;
  requiresReceipt: boolean;
  requiresApproval: boolean;
  approvalThreshold?: number;
}

export interface TransactionOperational extends Transaction {
  departmentId?: string;
  departmentName?: string;
  clientId?: string;
  clientName?: string;
  expenseTypeId?: string;
  expenseTypeName?: string;
  isBillable?: boolean;
  receiptUrls?: string[];
  submittedBy?: string;
  submittedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  isDraft?: boolean;
}

export interface ApprovalQueueItem {
  id: string;
  transactionId: string;
  transaction: TransactionOperational;
  submittedBy: string;
  submittedByName: string;
  submittedAt: string;
  type: 'expense-approval' | 'import-review' | 'revision-approval' | 'logic-override';
  priority: 'high' | 'medium' | 'low';
  amount: number;
  requiresReceipt: boolean;
  hasReceipt: boolean;
}

export interface FinanceInboxSummary {
  pendingApprovals: number;
  importReviews: number;
  revisionApprovals: number;
  logicOverrides: number;
  totalItems: number;
}

export interface PayrollBatch {
  id: string;
  batchId: string; // e.g., "PAYROLL-2025-12"
  period: string; // e.g., "December 2025"
  month: string; // e.g., "2025-12"
  employeeId: string;
  employeeName: string;
  baseSalary: number;
  bonus: number;
  gross: number; // baseSalary + bonus
  deductions: number; // taxes, insurance, etc.
  netPay: number; // gross - deductions
  status: 'processed' | 'pending';
  processedDate?: string;
  pdfUrl?: string; // Link to payslip PDF
}

export interface Project {
  id: string;
  name: string;
  code: string;
  budget: number;
  spent: number;
  status: 'active' | 'completed' | 'on-hold';
  clientId?: string;
  clientName?: string;
  departmentId?: string;
  departmentName?: string;
  startDate: string;
  endDate: string;
}