import {
  Transaction,
  Account,
  Category,
  StatementImport,
  ReviewQueueItem,
  NarrationRule,
  CostingRule,
  FinanceKPI,
  Loan,
  FinanceSettings,
  TeamMember,
  Department,
  Client,
  ExpenseType,
  TransactionOperational,
  ApprovalQueueItem,
  FinanceInboxSummary,
  PayrollBatch,
  Project
} from './types';

// Mock Accounts
export const mockAccounts: Account[] = [
  {
    id: 'acc-1',
    name: 'Cash in Hand',
    type: 'cash',
    balance: 45230,
    currency: 'USD',
    world: 'business',
    isActive: true,
    isPrimary: true,
    color: '#10b981',
    icon: '💵',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-2',
    name: 'Chase Business Checking',
    type: 'bank',
    balance: 284560,
    currency: 'USD',
    world: 'business',
    bankName: 'Chase Bank',
    accountNumber: '****4521',
    isActive: true,
    color: '#3b82f6',
    icon: '🏦',
    createdAt: '2024-01-01T00:00:00Z',
    lastSyncedAt: '2025-01-02T08:00:00Z'
  },
  {
    id: 'acc-3',
    name: 'PayPal Business',
    type: 'wallet',
    balance: 12840,
    currency: 'USD',
    world: 'business',
    isActive: true,
    color: '#8b5cf6',
    icon: '💳',
    createdAt: '2024-02-15T00:00:00Z'
  },
  {
    id: 'acc-4',
    name: 'Business Credit Card',
    type: 'credit-card',
    balance: -8450,
    currency: 'USD',
    world: 'business',
    bankName: 'American Express',
    accountNumber: '****9876',
    isActive: true,
    color: '#ef4444',
    icon: '💳',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'acc-5',
    name: 'Personal Savings',
    type: 'bank',
    balance: 68900,
    currency: 'USD',
    world: 'personal',
    bankName: 'Wells Fargo',
    accountNumber: '****7823',
    isActive: true,
    color: '#06b6d4',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Categories
export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'Client Payments', type: 'income', world: 'business', color: '#10b981', totalAmount: 285000, transactionCount: 42 },
  { id: 'cat-2', name: 'Consulting Revenue', type: 'income', world: 'business', color: '#10b981', totalAmount: 156000, transactionCount: 18 },
  { id: 'cat-3', name: 'Office Rent', type: 'expense', world: 'business', color: '#ef4444', totalAmount: 36000, transactionCount: 12 },
  { id: 'cat-4', name: 'Salaries', type: 'expense', world: 'business', color: '#ef4444', totalAmount: 180000, transactionCount: 36 },
  { id: 'cat-5', name: 'Software Subscriptions', type: 'expense', world: 'business', color: '#ef4444', totalAmount: 12400, transactionCount: 64 },
  { id: 'cat-6', name: 'Marketing', type: 'expense', world: 'business', color: '#ef4444', totalAmount: 28500, transactionCount: 45 },
  { id: 'cat-7', name: 'Travel', type: 'expense', world: 'business', color: '#ef4444', totalAmount: 14200, transactionCount: 23 },
  { id: 'cat-8', name: 'Office Supplies', type: 'expense', world: 'business', color: '#ef4444', totalAmount: 3800, transactionCount: 58 },
  { id: 'cat-9', name: 'Utilities', type: 'expense', world: 'business', color: '#ef4444', totalAmount: 4200, transactionCount: 12 },
  { id: 'cat-10', name: 'Salary Income', type: 'income', world: 'personal', color: '#10b981', totalAmount: 120000, transactionCount: 12 },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-1',
    date: '2025-01-02T14:30:00Z',
    amount: 5500,
    narration: 'Client payment for Mobile App Design project',
    type: 'income',
    paymentMethod: 'bank',
    accountId: 'acc-2',
    accountName: 'Chase Business Checking',
    categoryId: 'cat-1',
    categoryName: 'Client Payments',
    world: 'business',
    status: 'posted',
    confidenceScore: 98,
    autoClassified: true,
    createdBy: 'Sarah Johnson',
    createdAt: '2025-01-02T14:30:00Z'
  },
  {
    id: 'txn-2',
    date: '2025-01-02T10:15:00Z',
    amount: 1200,
    narration: 'Office supplies from Staples - printer paper, pens, folders',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-8',
    categoryName: 'Office Supplies',
    world: 'business',
    status: 'posted',
    confidenceScore: 95,
    autoClassified: true,
    tags: ['office', 'supplies'],
    createdBy: 'Michael Chen',
    createdAt: '2025-01-02T10:15:00Z'
  },
  {
    id: 'txn-3',
    date: '2025-01-01T16:45:00Z',
    amount: 850,
    narration: 'Google Workspace subscription - annual renewal',
    type: 'expense',
    paymentMethod: 'bank',
    accountId: 'acc-2',
    accountName: 'Chase Business Checking',
    categoryId: 'cat-5',
    categoryName: 'Software Subscriptions',
    world: 'business',
    status: 'posted',
    confidenceScore: 99,
    autoClassified: true,
    createdBy: 'System',
    createdAt: '2025-01-01T16:45:00Z'
  },
  {
    id: 'txn-4',
    date: '2025-01-01T09:00:00Z',
    amount: 3000,
    narration: 'Office rent - January 2025',
    type: 'expense',
    paymentMethod: 'bank',
    accountId: 'acc-2',
    accountName: 'Chase Business Checking',
    categoryId: 'cat-3',
    categoryName: 'Office Rent',
    world: 'business',
    status: 'posted',
    confidenceScore: 100,
    autoClassified: true,
    createdBy: 'Sarah Johnson',
    createdAt: '2025-01-01T09:00:00Z'
  },
  {
    id: 'txn-5',
    date: '2024-12-31T18:20:00Z',
    amount: 450,
    narration: 'ATM withdrawal for petty cash',
    type: 'transfer',
    paymentMethod: 'cash',
    accountId: 'acc-1',
    accountName: 'Cash in Hand',
    world: 'business',
    status: 'posted',
    confidenceScore: 100,
    autoClassified: true,
    notes: 'Auto-transferred from bank to cash',
    createdBy: 'System',
    createdAt: '2024-12-31T18:20:00Z'
  },
  {
    id: 'txn-6',
    date: '2024-12-30T11:30:00Z',
    amount: 2800,
    narration: 'Facebook ads campaign - December',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-6',
    categoryName: 'Marketing',
    world: 'business',
    status: 'posted',
    confidenceScore: 92,
    autoClassified: true,
    createdBy: 'Emily Martinez',
    createdAt: '2024-12-30T11:30:00Z'
  },
  {
    id: 'txn-7',
    date: '2024-12-29T14:00:00Z',
    amount: 12500,
    narration: 'Consulting project - Phase 2 completion',
    type: 'income',
    paymentMethod: 'wallet',
    accountId: 'acc-3',
    accountName: 'PayPal Business',
    categoryId: 'cat-2',
    categoryName: 'Consulting Revenue',
    world: 'business',
    status: 'posted',
    confidenceScore: 97,
    autoClassified: true,
    createdBy: 'David Kim',
    createdAt: '2024-12-29T14:00:00Z'
  },
  {
    id: 'txn-8',
    date: '2024-12-28T08:45:00Z',
    amount: 680,
    narration: 'Uber rides for client meetings',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-7',
    categoryName: 'Travel',
    world: 'business',
    status: 'posted',
    confidenceScore: 88,
    autoClassified: true,
    createdBy: 'James Wilson',
    createdAt: '2024-12-28T08:45:00Z'
  },
  
  // SYSTEM-GENERATED TRANSACTIONS FROM A24 PAYROLL
  // Auto-posted when payroll is processed/finalized
  {
    id: 'txn-payroll-1',
    date: '2024-12-28T10:00:00Z',
    amount: 6300,
    narration: 'Payroll - Emily Martinez (December 2024) - PAYROLL-2024-12',
    type: 'expense',
    paymentMethod: 'bank',
    accountId: 'acc-2',
    accountName: 'Chase Business Checking',
    categoryId: 'cat-4',
    categoryName: 'Salaries',
    world: 'business',
    status: 'posted',
    departmentId: 'dept-2',
    departmentName: 'Design',
    isSystemGenerated: true,
    sourceModule: 'payroll',
    sourceId: 'pay-em-2',
    tags: ['payroll', 'auto-generated', 'salary-expense'],
    createdBy: 'System - A24 Payroll',
    createdAt: '2024-12-28T10:00:00Z',
    notes: 'Auto-posted from A24 Payroll when batch was processed. Gross amount: $6,300 (Base: $5,500 + Bonus: $800)'
  },
  {
    id: 'txn-payroll-2',
    date: '2024-11-28T10:00:00Z',
    amount: 6100,
    narration: 'Payroll - Emily Martinez (November 2024) - PAYROLL-2024-11',
    type: 'expense',
    paymentMethod: 'bank',
    accountId: 'acc-2',
    accountName: 'Chase Business Checking',
    categoryId: 'cat-4',
    categoryName: 'Salaries',
    world: 'business',
    status: 'posted',
    departmentId: 'dept-2',
    departmentName: 'Design',
    isSystemGenerated: true,
    sourceModule: 'payroll',
    sourceId: 'pay-em-3',
    tags: ['payroll', 'auto-generated', 'salary-expense'],
    createdBy: 'System - A24 Payroll',
    createdAt: '2024-11-28T10:00:00Z',
    notes: 'Auto-posted from A24 Payroll when batch was processed. Gross amount: $6,100 (Base: $5,500 + Bonus: $600)'
  },
  {
    id: 'txn-payroll-3',
    date: '2024-10-28T10:00:00Z',
    amount: 6250,
    narration: 'Payroll - Emily Martinez (October 2024) - PAYROLL-2024-10',
    type: 'expense',
    paymentMethod: 'bank',
    accountId: 'acc-2',
    accountName: 'Chase Business Checking',
    categoryId: 'cat-4',
    categoryName: 'Salaries',
    world: 'business',
    status: 'posted',
    departmentId: 'dept-2',
    departmentName: 'Design',
    isSystemGenerated: true,
    sourceModule: 'payroll',
    sourceId: 'pay-em-4',
    tags: ['payroll', 'auto-generated', 'salary-expense'],
    createdBy: 'System - A24 Payroll',
    createdAt: '2024-10-28T10:00:00Z',
    notes: 'Auto-posted from A24 Payroll when batch was processed. Gross amount: $6,250 (Base: $5,500 + Bonus: $750)'
  },
  {
    id: 'txn-payroll-4',
    date: '2024-09-28T10:00:00Z',
    amount: 6000,
    narration: 'Payroll - Emily Martinez (September 2024) - PAYROLL-2024-09',
    type: 'expense',
    paymentMethod: 'bank',
    accountId: 'acc-2',
    accountName: 'Chase Business Checking',
    categoryId: 'cat-4',
    categoryName: 'Salaries',
    world: 'business',
    status: 'posted',
    departmentId: 'dept-2',
    departmentName: 'Design',
    isSystemGenerated: true,
    sourceModule: 'payroll',
    sourceId: 'pay-em-5',
    tags: ['payroll', 'auto-generated', 'salary-expense'],
    createdBy: 'System - A24 Payroll',
    createdAt: '2024-09-28T10:00:00Z',
    notes: 'Auto-posted from A24 Payroll when batch was processed. Gross amount: $6,000 (Base: $5,500 + Bonus: $500)'
  },
  {
    id: 'txn-payroll-5',
    date: '2025-01-02T10:00:00Z',
    amount: 8200,
    narration: 'Payroll - Sarah Johnson (January 2025) - PAYROLL-2025-01',
    type: 'expense',
    paymentMethod: 'bank',
    accountId: 'acc-2',
    accountName: 'Chase Business Checking',
    categoryId: 'cat-4',
    categoryName: 'Salaries',
    world: 'business',
    status: 'posted',
    departmentId: 'dept-3',
    departmentName: 'Marketing',
    isSystemGenerated: true,
    sourceModule: 'payroll',
    sourceId: 'pay-sj-1',
    tags: ['payroll', 'auto-generated', 'salary-expense'],
    createdBy: 'System - A24 Payroll',
    createdAt: '2025-01-02T10:00:00Z',
    notes: 'Auto-posted from A24 Payroll when batch was processed. Gross amount: $8,200 (Base: $7,000 + Bonus: $1,200)'
  }
];

// Mock Review Queue
export const mockReviewQueue: ReviewQueueItem[] = [
  {
    id: 'rev-1',
    transactionId: 'txn-pending-1',
    amount: 1250,
    narration: 'Payment to TechVendor Inc',
    date: '2025-01-02T15:30:00Z',
    accountName: 'Chase Business Checking',
    suggestedCategory: 'Software Subscriptions',
    suggestedWorld: 'business',
    confidenceScore: 65,
    reason: 'Similar to previous TechVendor payments',
    similarTransactions: 3,
    createdAt: '2025-01-02T15:30:00Z'
  },
  {
    id: 'rev-2',
    transactionId: 'txn-pending-2',
    amount: 420,
    narration: 'Coffee meeting expenses',
    date: '2025-01-02T11:15:00Z',
    accountName: 'Cash in Hand',
    suggestedCategory: 'Marketing',
    suggestedWorld: 'business',
    confidenceScore: 45,
    reason: 'Low confidence - could be Travel or Marketing',
    similarTransactions: 0,
    createdAt: '2025-01-02T11:15:00Z'
  },
  {
    id: 'rev-3',
    transactionId: 'txn-pending-3',
    amount: 8900,
    narration: 'Professional services',
    date: '2025-01-01T16:00:00Z',
    accountName: 'PayPal Business',
    confidenceScore: 25,
    reason: 'Ambiguous narration - needs clarification',
    similarTransactions: 0,
    createdAt: '2025-01-01T16:00:00Z'
  },
];

// Mock Statement Imports
export const mockStatementImports: StatementImport[] = [
  {
    id: 'imp-1',
    fileName: 'chase_statement_december_2024.csv',
    accountId: 'acc-2',
    accountName: 'Chase Business Checking',
    status: 'posted',
    uploadedAt: '2024-12-31T10:00:00Z',
    uploadedBy: 'Sarah Johnson',
    totalRows: 156,
    processedRows: 156,
    matchedRows: 142,
    reviewRows: 14,
    duplicatesFound: 8,
    completedAt: '2024-12-31T12:30:00Z'
  },
  {
    id: 'imp-2',
    fileName: 'paypal_transactions_q4.csv',
    accountId: 'acc-3',
    accountName: 'PayPal Business',
    status: 'review',
    uploadedAt: '2025-01-02T09:15:00Z',
    uploadedBy: 'Michael Chen',
    totalRows: 84,
    processedRows: 84,
    matchedRows: 76,
    reviewRows: 8,
    duplicatesFound: 2
  },
  {
    id: 'imp-3',
    fileName: 'amex_statement_jan_2025.pdf',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    status: 'parsing',
    uploadedAt: '2025-01-02T14:00:00Z',
    uploadedBy: 'Emily Martinez',
    totalRows: 0,
    processedRows: 0,
    matchedRows: 0,
    reviewRows: 0,
    duplicatesFound: 0
  },
];

// Mock Narration Rules
export const mockNarrationRules: NarrationRule[] = [
  {
    id: 'rule-1',
    pattern: 'office rent',
    categoryId: 'cat-3',
    categoryName: 'Office Rent',
    world: 'business',
    confidence: 100,
    matchCount: 12,
    lastMatched: '2025-01-01T09:00:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'System',
    isActive: true
  },
  {
    id: 'rule-2',
    pattern: 'google workspace|gsuite|gmail',
    categoryId: 'cat-5',
    categoryName: 'Software Subscriptions',
    world: 'business',
    confidence: 99,
    matchCount: 24,
    lastMatched: '2025-01-01T16:45:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    createdBy: 'Sarah Johnson',
    isActive: true
  },
  {
    id: 'rule-3',
    pattern: 'facebook ads|linkedin ads|google ads',
    categoryId: 'cat-6',
    categoryName: 'Marketing',
    world: 'business',
    confidence: 95,
    matchCount: 36,
    lastMatched: '2024-12-30T11:30:00Z',
    createdAt: '2024-02-01T00:00:00Z',
    createdBy: 'Emily Martinez',
    isActive: true
  },
  {
    id: 'rule-4',
    pattern: 'uber|lyft|taxi',
    categoryId: 'cat-7',
    categoryName: 'Travel',
    world: 'business',
    confidence: 88,
    matchCount: 67,
    lastMatched: '2024-12-28T08:45:00Z',
    createdAt: '2024-01-20T00:00:00Z',
    createdBy: 'System',
    isActive: true
  },
];

// Mock Costing Rules
export const mockCostingRules: CostingRule[] = [
  {
    id: 'cost-1',
    name: 'Engineering Department Rate',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    hourlyRate: 85,
    overheadPercentage: 35,
    description: 'Standard engineering hourly rate including benefits',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cost-2',
    name: 'Design Department Rate',
    departmentId: 'dept-2',
    departmentName: 'Design',
    hourlyRate: 75,
    overheadPercentage: 30,
    description: 'Design team billable rate',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'cost-3',
    name: 'Fixed Monthly Overhead',
    fixedMonthly: 12500,
    description: 'Rent, utilities, insurance, and fixed costs',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z'
  },
];

// Mock Finance KPIs
export const mockFinanceKPIs: FinanceKPI = {
  cashInHand: 45230,
  bankBalances: 284560,
  netWorth: 402180,
  profitToday: 4300,
  profitMonth: 142560,
  burnRate: 3840,
  profitPerHour: 179.17,
  quoteRisk: 12.5,
  overheadLeakage: 8.3
};

// Mock Loans
export const mockLoans: Loan[] = [
  {
    id: 'loan-1',
    name: 'Business Equipment Loan',
    lender: 'Chase Bank',
    principalAmount: 50000,
    outstandingAmount: 32500,
    interestRate: 6.5,
    startDate: '2024-03-01',
    endDate: '2027-03-01',
    emiAmount: 1520,
    emiDate: 5,
    accountId: 'acc-2',
    status: 'active',
    world: 'business',
    createdAt: '2024-03-01T00:00:00Z'
  },
  {
    id: 'loan-2',
    name: 'Office Renovation Loan',
    lender: 'Wells Fargo',
    principalAmount: 25000,
    outstandingAmount: 18750,
    interestRate: 7.2,
    startDate: '2024-06-01',
    endDate: '2026-06-01',
    emiAmount: 820,
    emiDate: 15,
    accountId: 'acc-2',
    status: 'active',
    world: 'business',
    createdAt: '2024-06-01T00:00:00Z'
  },
];

// Mock Finance Settings
export const mockFinanceSettings: FinanceSettings = {
  enablePersonalWorld: true,
  requireApproval: true,
  approvalThreshold: 5000,
  confidenceThreshold: 80,
  cashInHandAccountId: 'acc-1',
  defaultCurrency: 'USD',
  fiscalYearStart: '01-01',
  enableAutoBackup: true,
  dataRetentionDays: 2555,
  exportFormat: 'pdf'
};

// Mock Team Members
export const mockTeamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    role: 'owner',
    permissions: {
      canAddTransactions: true,
      canEditTransactions: true,
      canDeleteTransactions: true,
      canViewReports: true,
      canManageAccounts: true,
      canImportStatements: true,
      canManageSettings: true
    },
    world: ['business', 'personal'],
    isActive: true
  },
  {
    id: 'tm-2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    role: 'admin',
    permissions: {
      canAddTransactions: true,
      canEditTransactions: true,
      canDeleteTransactions: false,
      canViewReports: true,
      canManageAccounts: true,
      canImportStatements: true,
      canManageSettings: false
    },
    world: ['business'],
    isActive: true
  },
  {
    id: 'tm-3',
    name: 'Emily Martinez',
    email: 'emily.martinez@company.com',
    role: 'member',
    permissions: {
      canAddTransactions: true,
      canEditTransactions: false,
      canDeleteTransactions: false,
      canViewReports: true,
      canManageAccounts: false,
      canImportStatements: true,
      canManageSettings: false
    },
    world: ['business'],
    isActive: true
  },
  {
    id: 'tm-4',
    name: 'David Kim',
    email: 'david.kim@company.com',
    role: 'member',
    permissions: {
      canAddTransactions: true,
      canEditTransactions: false,
      canDeleteTransactions: false,
      canViewReports: false,
      canManageAccounts: false,
      canImportStatements: false,
      canManageSettings: false
    },
    world: ['business'],
    isActive: true
  },
];

// Mock Departments
export const mockDepartments: Department[] = [
  {
    id: 'dept-1',
    name: 'Engineering',
    code: 'ENG',
    color: '#3b82f6',
    managerId: 'tm-2',
    managerName: 'Michael Chen',
    isActive: true
  },
  {
    id: 'dept-2',
    name: 'Design',
    code: 'DES',
    color: '#8b5cf6',
    managerId: 'tm-3',
    managerName: 'Emily Martinez',
    isActive: true
  },
  {
    id: 'dept-3',
    name: 'Marketing',
    code: 'MKT',
    color: '#ec4899',
    managerId: 'tm-1',
    managerName: 'Sarah Johnson',
    isActive: true
  },
  {
    id: 'dept-4',
    name: 'Operations',
    code: 'OPS',
    color: '#10b981',
    isActive: true
  },
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Acme Corporation',
    code: 'ACME',
    email: 'contact@acme.com',
    phone: '+1-555-0100',
    isActive: true
  },
  {
    id: 'client-2',
    name: 'TechStart Inc',
    code: 'TECH',
    email: 'hello@techstart.io',
    phone: '+1-555-0200',
    isActive: true
  },
  {
    id: 'client-3',
    name: 'Global Solutions Ltd',
    code: 'GLOB',
    email: 'info@globalsolutions.com',
    isActive: true
  },
];

// Mock Expense Types
export const mockExpenseTypes: ExpenseType[] = [
  {
    id: 'exp-1',
    name: 'Client Meeting',
    categoryId: 'cat-7',
    requiresReceipt: true,
    requiresApproval: false
  },
  {
    id: 'exp-2',
    name: 'Office Supplies',
    categoryId: 'cat-8',
    requiresReceipt: true,
    requiresApproval: false
  },
  {
    id: 'exp-3',
    name: 'Software License',
    categoryId: 'cat-5',
    requiresReceipt: true,
    requiresApproval: true,
    approvalThreshold: 500
  },
  {
    id: 'exp-4',
    name: 'Travel Expense',
    categoryId: 'cat-7',
    requiresReceipt: true,
    requiresApproval: true,
    approvalThreshold: 1000
  },
];

// Mock Operational Transactions (with approval workflow)
export const mockOperationalTransactions: TransactionOperational[] = [
  {
    id: 'txn-op-1',
    date: '2025-01-02T16:30:00Z',
    amount: 1250,
    narration: 'Figma Professional subscription for design team',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-5',
    categoryName: 'Software Subscriptions',
    world: 'business',
    status: 'pending-approval',
    departmentId: 'dept-2',
    departmentName: 'Design',
    expenseTypeId: 'exp-3',
    expenseTypeName: 'Software License',
    isBillable: false,
    receiptUrls: ['https://example.com/receipt-figma.pdf'],
    submittedBy: 'tm-3',
    submittedAt: '2025-01-02T16:30:00Z',
    createdBy: 'Emily Martinez',
    createdAt: '2025-01-02T16:30:00Z'
  },
  {
    id: 'txn-op-2',
    date: '2025-01-02T14:15:00Z',
    amount: 340,
    narration: 'Lunch meeting with Acme Corp client',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-7',
    categoryName: 'Travel',
    world: 'business',
    status: 'pending-approval',
    departmentId: 'dept-3',
    departmentName: 'Marketing',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    expenseTypeId: 'exp-1',
    expenseTypeName: 'Client Meeting',
    isBillable: true,
    receiptUrls: ['https://example.com/receipt-lunch.jpg'],
    submittedBy: 'tm-4',
    submittedAt: '2025-01-02T14:15:00Z',
    createdBy: 'David Kim',
    createdAt: '2025-01-02T14:15:00Z'
  },
  {
    id: 'txn-op-3',
    date: '2025-01-02T10:00:00Z',
    amount: 2850,
    narration: 'Round-trip flight to San Francisco for client presentation',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-7',
    categoryName: 'Travel',
    world: 'business',
    status: 'pending-approval',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    clientId: 'client-2',
    clientName: 'TechStart Inc',
    expenseTypeId: 'exp-4',
    expenseTypeName: 'Travel Expense',
    isBillable: true,
    receiptUrls: ['https://example.com/receipt-flight.pdf'],
    submittedBy: 'tm-2',
    submittedAt: '2025-01-02T10:00:00Z',
    createdBy: 'Michael Chen',
    createdAt: '2025-01-02T10:00:00Z'
  },
  {
    id: 'txn-op-4',
    date: '2025-01-01T15:20:00Z',
    amount: 145,
    narration: 'Sticky notes, pens, and desk organizers',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-8',
    categoryName: 'Office Supplies',
    world: 'business',
    status: 'approved',
    departmentId: 'dept-4',
    departmentName: 'Operations',
    expenseTypeId: 'exp-2',
    expenseTypeName: 'Office Supplies',
    isBillable: false,
    receiptUrls: ['https://example.com/receipt-supplies.jpg'],
    submittedBy: 'tm-4',
    submittedAt: '2025-01-01T15:20:00Z',
    approvedBy: 'tm-1',
    approvedAt: '2025-01-01T16:00:00Z',
    createdBy: 'David Kim',
    createdAt: '2025-01-01T15:20:00Z'
  },
  {
    id: 'txn-op-5',
    date: '2025-01-01T09:30:00Z',
    amount: 890,
    narration: 'Conference tickets for design summit',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-7',
    categoryName: 'Travel',
    world: 'business',
    status: 'rejected',
    departmentId: 'dept-2',
    departmentName: 'Design',
    expenseTypeId: 'exp-4',
    expenseTypeName: 'Travel Expense',
    isBillable: false,
    submittedBy: 'tm-3',
    submittedAt: '2025-01-01T09:30:00Z',
    rejectedBy: 'tm-1',
    rejectedAt: '2025-01-01T11:00:00Z',
    rejectionReason: 'Budget already allocated for Q1. Please resubmit for Q2.',
    createdBy: 'Emily Martinez',
    createdAt: '2025-01-01T09:30:00Z'
  },
  {
    id: 'txn-op-6',
    date: '2025-01-02T18:00:00Z',
    amount: 560,
    narration: 'Team dinner after project completion',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-7',
    categoryName: 'Travel',
    world: 'business',
    status: 'draft',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    expenseTypeId: 'exp-1',
    expenseTypeName: 'Client Meeting',
    isBillable: false,
    isDraft: true,
    createdBy: 'Michael Chen',
    createdAt: '2025-01-02T18:00:00Z'
  },
  {
    id: 'txn-op-7',
    date: '2024-12-28T14:30:00Z',
    amount: 89,
    narration: 'Adobe Creative Cloud monthly subscription',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-5',
    categoryName: 'Software Subscriptions',
    world: 'business',
    status: 'approved',
    departmentId: 'dept-2',
    departmentName: 'Design',
    expenseTypeId: 'exp-3',
    expenseTypeName: 'Software License',
    isBillable: false,
    receiptUrls: ['https://example.com/receipt-adobe.pdf'],
    submittedBy: 'tm-3',
    submittedAt: '2024-12-28T14:30:00Z',
    approvedBy: 'tm-1',
    approvedAt: '2024-12-28T16:00:00Z',
    createdBy: 'Emily Martinez',
    createdAt: '2024-12-28T14:30:00Z'
  },
  {
    id: 'txn-op-8',
    date: '2024-12-20T11:15:00Z',
    amount: 450,
    narration: 'Uber rides to client site visits',
    type: 'expense',
    paymentMethod: 'card',
    accountId: 'acc-4',
    accountName: 'Business Credit Card',
    categoryId: 'cat-7',
    categoryName: 'Travel',
    world: 'business',
    status: 'rejected',
    departmentId: 'dept-2',
    departmentName: 'Design',
    expenseTypeId: 'exp-4',
    expenseTypeName: 'Travel Expense',
    isBillable: false,
    submittedBy: 'tm-3',
    submittedAt: '2024-12-20T11:15:00Z',
    rejectedBy: 'tm-1',
    rejectedAt: '2024-12-20T15:30:00Z',
    rejectionReason: 'Missing receipts. Please attach all ride receipts and resubmit.',
    createdBy: 'Emily Martinez',
    createdAt: '2024-12-20T11:15:00Z'
  },
];

// Mock Approval Queue
export const mockApprovalQueue: ApprovalQueueItem[] = [
  {
    id: 'appr-1',
    transactionId: 'txn-op-1',
    transaction: mockOperationalTransactions[0],
    submittedBy: 'tm-3',
    submittedByName: 'Emily Martinez',
    submittedAt: '2025-01-02T16:30:00Z',
    type: 'expense-approval',
    priority: 'medium',
    amount: 1250,
    requiresReceipt: true,
    hasReceipt: true
  },
  {
    id: 'appr-2',
    transactionId: 'txn-op-2',
    transaction: mockOperationalTransactions[1],
    submittedBy: 'tm-4',
    submittedByName: 'David Kim',
    submittedAt: '2025-01-02T14:15:00Z',
    type: 'expense-approval',
    priority: 'low',
    amount: 340,
    requiresReceipt: true,
    hasReceipt: true
  },
  {
    id: 'appr-3',
    transactionId: 'txn-op-3',
    transaction: mockOperationalTransactions[2],
    submittedBy: 'tm-2',
    submittedByName: 'Michael Chen',
    submittedAt: '2025-01-02T10:00:00Z',
    type: 'expense-approval',
    priority: 'high',
    amount: 2850,
    requiresReceipt: true,
    hasReceipt: true
  },
];

// Mock Finance Inbox Summary
export const mockFinanceInboxSummary: FinanceInboxSummary = {
  pendingApprovals: 3,
  importReviews: 2,
  revisionApprovals: 0,
  logicOverrides: 1,
  totalItems: 6
};

// Mock User (for filtering)
export const mockUser = {
  id: 'tm-3',
  name: 'Emily Martinez',
  email: 'emily.martinez@company.com'
};

// Mock Payroll Batches - Historical payroll data for all employees
export const mockPayrollBatches: PayrollBatch[] = [
  // Emily Martinez (tm-3) - Current User
  {
    id: 'pay-em-1',
    batchId: 'PAYROLL-2025-01',
    period: 'January 2025',
    month: '2025-01',
    employeeId: 'tm-3',
    employeeName: 'Emily Martinez',
    baseSalary: 5500,
    bonus: 0,
    gross: 5500,
    deductions: 1155, // 21% taxes + insurance
    netPay: 4345,
    status: 'pending',
    processedDate: undefined
  },
  {
    id: 'pay-em-2',
    batchId: 'PAYROLL-2024-12',
    period: 'December 2024',
    month: '2024-12',
    employeeId: 'tm-3',
    employeeName: 'Emily Martinez',
    baseSalary: 5500,
    bonus: 800,
    gross: 6300,
    deductions: 1323, // 21% taxes + insurance
    netPay: 4977,
    status: 'processed',
    processedDate: '2024-12-28T10:00:00Z',
    pdfUrl: '/payslips/emily-martinez-2024-12.pdf'
  },
  {
    id: 'pay-em-3',
    batchId: 'PAYROLL-2024-11',
    period: 'November 2024',
    month: '2024-11',
    employeeId: 'tm-3',
    employeeName: 'Emily Martinez',
    baseSalary: 5500,
    bonus: 600,
    gross: 6100,
    deductions: 1281, // 21% taxes + insurance
    netPay: 4819,
    status: 'processed',
    processedDate: '2024-11-28T10:00:00Z',
    pdfUrl: '/payslips/emily-martinez-2024-11.pdf'
  },
  {
    id: 'pay-em-4',
    batchId: 'PAYROLL-2024-10',
    period: 'October 2024',
    month: '2024-10',
    employeeId: 'tm-3',
    employeeName: 'Emily Martinez',
    baseSalary: 5500,
    bonus: 750,
    gross: 6250,
    deductions: 1312.5, // 21% taxes + insurance
    netPay: 4937.5,
    status: 'processed',
    processedDate: '2024-10-28T10:00:00Z',
    pdfUrl: '/payslips/emily-martinez-2024-10.pdf'
  },
  {
    id: 'pay-em-5',
    batchId: 'PAYROLL-2024-09',
    period: 'September 2024',
    month: '2024-09',
    employeeId: 'tm-3',
    employeeName: 'Emily Martinez',
    baseSalary: 5500,
    bonus: 500,
    gross: 6000,
    deductions: 1260, // 21% taxes + insurance
    netPay: 4740,
    status: 'processed',
    processedDate: '2024-09-28T10:00:00Z',
    pdfUrl: '/payslips/emily-martinez-2024-09.pdf'
  },
  {
    id: 'pay-em-6',
    batchId: 'PAYROLL-2024-08',
    period: 'August 2024',
    month: '2024-08',
    employeeId: 'tm-3',
    employeeName: 'Emily Martinez',
    baseSalary: 5500,
    bonus: 700,
    gross: 6200,
    deductions: 1302, // 21% taxes + insurance
    netPay: 4898,
    status: 'processed',
    processedDate: '2024-08-28T10:00:00Z',
    pdfUrl: '/payslips/emily-martinez-2024-08.pdf'
  },
  {
    id: 'pay-em-7',
    batchId: 'PAYROLL-2024-07',
    period: 'July 2024',
    month: '2024-07',
    employeeId: 'tm-3',
    employeeName: 'Emily Martinez',
    baseSalary: 5500,
    bonus: 550,
    gross: 6050,
    deductions: 1270.5, // 21% taxes + insurance
    netPay: 4779.5,
    status: 'processed',
    processedDate: '2024-07-28T10:00:00Z',
    pdfUrl: '/payslips/emily-martinez-2024-07.pdf'
  },
  {
    id: 'pay-em-8',
    batchId: 'PAYROLL-2024-06',
    period: 'June 2024',
    month: '2024-06',
    employeeId: 'tm-3',
    employeeName: 'Emily Martinez',
    baseSalary: 5500,
    bonus: 900,
    gross: 6400,
    deductions: 1344, // 21% taxes + insurance
    netPay: 5056,
    status: 'processed',
    processedDate: '2024-06-28T10:00:00Z',
    pdfUrl: '/payslips/emily-martinez-2024-06.pdf'
  },
  
  // Other employees (for reference in A24Payroll)
  {
    id: 'pay-mc-1',
    batchId: 'PAYROLL-2025-01',
    period: 'January 2025',
    month: '2025-01',
    employeeId: 'tm-2',
    employeeName: 'Michael Chen',
    baseSalary: 6000,
    bonus: 0,
    gross: 6000,
    deductions: 1260,
    netPay: 4740,
    status: 'pending'
  },
  {
    id: 'pay-dk-1',
    batchId: 'PAYROLL-2025-01',
    period: 'January 2025',
    month: '2025-01',
    employeeId: 'tm-4',
    employeeName: 'David Kim',
    baseSalary: 5800,
    bonus: 0,
    gross: 5800,
    deductions: 1218,
    netPay: 4582,
    status: 'pending'
  },
  {
    id: 'pay-sj-1',
    batchId: 'PAYROLL-2025-01',
    period: 'January 2025',
    month: '2025-01',
    employeeId: 'tm-1',
    employeeName: 'Sarah Johnson',
    baseSalary: 7000,
    bonus: 1200,
    gross: 8200,
    deductions: 1722,
    netPay: 6478,
    status: 'processed',
    processedDate: '2025-01-02T10:00:00Z',
    pdfUrl: '/payslips/sarah-johnson-2025-01.pdf'
  }
];

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    name: 'Mobile App Redesign',
    code: 'MAR',
    budget: 50000,
    spent: 18500,
    status: 'active',
    clientId: 'client-1',
    clientName: 'Acme Corporation',
    departmentId: 'dept-2',
    departmentName: 'Design',
    startDate: '2024-10-01',
    endDate: '2025-03-31'
  },
  {
    id: 'proj-2',
    name: 'Website Redesign - TechStart',
    code: 'WRT',
    budget: 35000,
    spent: 12400,
    status: 'active',
    clientId: 'client-2',
    clientName: 'TechStart Inc',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    startDate: '2024-11-01',
    endDate: '2025-02-28'
  },
  {
    id: 'proj-3',
    name: 'Q1 Marketing Campaign',
    code: 'Q1M',
    budget: 25000,
    spent: 8200,
    status: 'active',
    clientId: 'client-3',
    clientName: 'Global Solutions Ltd',
    departmentId: 'dept-3',
    departmentName: 'Marketing',
    startDate: '2025-01-01',
    endDate: '2025-03-31'
  },
  {
    id: 'proj-4',
    name: 'Internal CRM Development',
    code: 'CRM',
    budget: 60000,
    spent: 45200,
    status: 'active',
    departmentId: 'dept-1',
    departmentName: 'Engineering',
    startDate: '2024-09-01',
    endDate: '2025-06-30'
  },
  {
    id: 'proj-5',
    name: 'Brand Identity Refresh',
    code: 'BIR',
    budget: 15000,
    spent: 14800,
    status: 'completed',
    departmentId: 'dept-2',
    departmentName: 'Design',
    startDate: '2024-08-01',
    endDate: '2024-12-31'
  }
];