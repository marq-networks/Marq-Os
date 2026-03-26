/**
 * ═══════════════════════════════════════════════════════════════════════════
 * MOCK FINANCE DATA
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * Mock data for Finance Cockpit and Finance module screens.
 * Simulates real financial data for demo purposes.
 */

export interface CashAccount {
  id: string;
  name: string;
  type: 'bank' | 'wallet' | 'cash';
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface PLSummary {
  period: string; // YYYY-MM
  revenue: number;
  cost: number;
  netProfit: number;
  marginPercent: number;
}

export interface BurnMetric {
  projectId?: string;
  projectName?: string;
  burnPerDay: number;
  totalBurn: number;
  budget: number;
  daysRemaining: number;
  riskScore: number; // 0-100
}

export interface PayrollDepartment {
  departmentId: string;
  departmentName: string;
  employeeCount: number;
  monthlySalary: number;
}

export interface Reimbursement {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  category: string;
  description: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  paidDate?: string;
}

export interface AIAlert {
  id: string;
  type: 'burn_warning' | 'margin_drop' | 'cash_low' | 'payroll_risk';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  dismissed: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// CASH POSITION DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockCashAccounts: CashAccount[] = [
  {
    id: 'bank-001',
    name: 'Business Checking (DBS)',
    type: 'bank',
    balance: 284920.50,
    currency: 'USD',
    lastUpdated: '2026-01-07T14:30:00Z'
  },
  {
    id: 'bank-002',
    name: 'Savings Account (OCBC)',
    type: 'bank',
    balance: 150000.00,
    currency: 'USD',
    lastUpdated: '2026-01-07T14:30:00Z'
  },
  {
    id: 'wallet-001',
    name: 'PayPal Business',
    type: 'wallet',
    balance: 8450.25,
    currency: 'USD',
    lastUpdated: '2026-01-07T14:25:00Z'
  },
  {
    id: 'wallet-002',
    name: 'Stripe Balance',
    type: 'wallet',
    balance: 4850.75,
    currency: 'USD',
    lastUpdated: '2026-01-07T14:20:00Z'
  },
  {
    id: 'cash-001',
    name: 'Petty Cash',
    type: 'cash',
    balance: 1200.00,
    currency: 'USD',
    lastUpdated: '2026-01-07T09:00:00Z'
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// PROFIT & LOSS DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockPLSummary: PLSummary[] = [
  {
    period: '2025-08',
    revenue: 245000,
    cost: 178000,
    netProfit: 67000,
    marginPercent: 27.3
  },
  {
    period: '2025-09',
    revenue: 268000,
    cost: 185000,
    netProfit: 83000,
    marginPercent: 31.0
  },
  {
    period: '2025-10',
    revenue: 290000,
    cost: 192000,
    netProfit: 98000,
    marginPercent: 33.8
  },
  {
    period: '2025-11',
    revenue: 312000,
    cost: 198000,
    netProfit: 114000,
    marginPercent: 36.5
  },
  {
    period: '2025-12',
    revenue: 335000,
    cost: 205000,
    netProfit: 130000,
    marginPercent: 38.8
  },
  {
    period: '2026-01',
    revenue: 358000,
    cost: 212000,
    netProfit: 146000,
    marginPercent: 40.8
  }
];

export const currentMonthPL: PLSummary = mockPLSummary[mockPLSummary.length - 1];

// ═══════════════════════════════════════════════════════════════════════════
// BURN & RISK DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockProjectBurn: BurnMetric[] = [
  {
    projectId: 'proj-001',
    projectName: 'Website Redesign',
    burnPerDay: 1200,
    totalBurn: 42000,
    budget: 50000,
    daysRemaining: 7,
    riskScore: 85 // High risk
  },
  {
    projectId: 'proj-002',
    projectName: 'Mobile App v2',
    burnPerDay: 2500,
    totalBurn: 95000,
    budget: 120000,
    daysRemaining: 10,
    riskScore: 78 // High risk
  },
  {
    projectId: 'proj-003',
    projectName: 'CRM Integration',
    burnPerDay: 800,
    totalBurn: 24000,
    budget: 60000,
    daysRemaining: 45,
    riskScore: 35 // Low risk
  },
  {
    projectId: 'proj-004',
    projectName: 'Marketing Campaign',
    burnPerDay: 600,
    totalBurn: 18000,
    budget: 45000,
    daysRemaining: 45,
    riskScore: 40 // Medium risk
  },
  {
    projectId: 'proj-005',
    projectName: 'Infrastructure Upgrade',
    burnPerDay: 1500,
    totalBurn: 52500,
    budget: 80000,
    daysRemaining: 18,
    riskScore: 65 // Medium-High risk
  }
];

export const totalBurnPerDay = mockProjectBurn.reduce((sum, p) => sum + p.burnPerDay, 0);
export const averageRiskScore = Math.round(
  mockProjectBurn.reduce((sum, p) => sum + p.riskScore, 0) / mockProjectBurn.length
);

// ═══════════════════════════════════════════════════════════════════════════
// PAYROLL DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockPayrollByDepartment: PayrollDepartment[] = [
  {
    departmentId: 'dept-001',
    departmentName: 'Engineering',
    employeeCount: 12,
    monthlySalary: 84000
  },
  {
    departmentId: 'dept-002',
    departmentName: 'Design',
    employeeCount: 5,
    monthlySalary: 32000
  },
  {
    departmentId: 'dept-003',
    departmentName: 'Marketing',
    employeeCount: 4,
    monthlySalary: 24000
  },
  {
    departmentId: 'dept-004',
    departmentName: 'Sales',
    employeeCount: 6,
    monthlySalary: 38000
  },
  {
    departmentId: 'dept-005',
    departmentName: 'Operations',
    employeeCount: 3,
    monthlySalary: 18000
  },
  {
    departmentId: 'dept-006',
    departmentName: 'Executive',
    employeeCount: 2,
    monthlySalary: 16000
  }
];

export const totalMonthlyPayroll = mockPayrollByDepartment.reduce(
  (sum, dept) => sum + dept.monthlySalary,
  0
);

// ═══════════════════════════════════════════════════════════════════════════
// REIMBURSEMENTS DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockReimbursements: Reimbursement[] = [
  {
    id: 'reimb-001',
    employeeId: 'emp-001',
    employeeName: 'Sarah Chen',
    amount: 450.00,
    category: 'Travel',
    description: 'Client meeting - Airport taxi',
    submittedDate: '2026-01-05',
    status: 'pending'
  },
  {
    id: 'reimb-002',
    employeeId: 'emp-002',
    employeeName: 'Marcus Lee',
    amount: 1250.00,
    category: 'Equipment',
    description: 'Monitor purchase for home office',
    submittedDate: '2026-01-04',
    status: 'pending'
  },
  {
    id: 'reimb-003',
    employeeId: 'emp-003',
    employeeName: 'Emily Rodriguez',
    amount: 85.50,
    category: 'Meals',
    description: 'Team lunch during workshop',
    submittedDate: '2026-01-03',
    status: 'pending'
  },
  {
    id: 'reimb-004',
    employeeId: 'emp-004',
    employeeName: 'David Kim',
    amount: 320.00,
    category: 'Software',
    description: 'Adobe Creative Suite subscription',
    submittedDate: '2026-01-02',
    status: 'approved'
  },
  {
    id: 'reimb-005',
    employeeId: 'emp-005',
    employeeName: 'Jessica Wong',
    amount: 680.00,
    category: 'Travel',
    description: 'Conference registration + hotel',
    submittedDate: '2025-12-28',
    status: 'paid',
    paidDate: '2026-01-02'
  },
  {
    id: 'reimb-006',
    employeeId: 'emp-006',
    employeeName: 'Tom Harris',
    amount: 1150.00,
    category: 'Equipment',
    description: 'Ergonomic office chair',
    submittedDate: '2025-12-20',
    status: 'paid',
    paidDate: '2025-12-28'
  },
  {
    id: 'reimb-007',
    employeeId: 'emp-007',
    employeeName: 'Lisa Tan',
    amount: 95.00,
    category: 'Office',
    description: 'Office supplies from Staples',
    submittedDate: '2025-12-15',
    status: 'paid',
    paidDate: '2025-12-22'
  }
];

export const pendingReimbursements = mockReimbursements.filter(r => r.status === 'pending');
export const paidReimbursements = mockReimbursements.filter(r => r.status === 'paid');
export const totalPendingAmount = pendingReimbursements.reduce((sum, r) => sum + r.amount, 0);
export const totalPaidAmount = paidReimbursements.reduce((sum, r) => sum + r.amount, 0);

// ═══════════════════════════════════════════════════════════════════════════
// AI ALERTS DATA
// ═══════════════════════════════════════════════════════════════════════════

export const mockAIAlerts: AIAlert[] = [
  {
    id: 'alert-001',
    type: 'burn_warning',
    severity: 'high',
    title: 'Project burn rate exceeds forecast',
    description: 'Website Redesign is burning $1,200/day, 40% above projected rate. Budget will be exhausted in 7 days.',
    timestamp: '2026-01-07T14:00:00Z',
    dismissed: false
  },
  {
    id: 'alert-002',
    type: 'burn_warning',
    severity: 'high',
    title: 'High burn velocity detected',
    description: 'Mobile App v2 has accelerated burn rate. Currently at $95k spent of $120k budget (79%).',
    timestamp: '2026-01-07T13:30:00Z',
    dismissed: false
  },
  {
    id: 'alert-003',
    type: 'margin_drop',
    severity: 'medium',
    title: 'Project margin below threshold',
    description: 'CRM Integration margin dropped to 18% (target: 25%). Labor costs higher than estimated.',
    timestamp: '2026-01-07T11:15:00Z',
    dismissed: false
  },
  {
    id: 'alert-004',
    type: 'cash_low',
    severity: 'low',
    title: 'Petty cash below minimum',
    description: 'Petty cash balance at $1,200. Consider replenishing to maintain $2,000 buffer.',
    timestamp: '2026-01-07T09:00:00Z',
    dismissed: false
  },
  {
    id: 'alert-005',
    type: 'payroll_risk',
    severity: 'medium',
    title: 'Payroll due in 3 days',
    description: 'Monthly payroll of $212,000 due Jan 10. Current liquid cash: $449,421.',
    timestamp: '2026-01-06T16:00:00Z',
    dismissed: false
  }
];

export const activeAlerts = mockAIAlerts.filter(a => !a.dismissed);
export const highSeverityAlerts = activeAlerts.filter(a => a.severity === 'high');
