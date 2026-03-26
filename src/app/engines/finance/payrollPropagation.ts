// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-02 — PAYROLL IMPACT ROUTER
// ═══════════════════════════════════════════════════════════════════════════
// Auto-explodes payroll into department costs, salary liabilities, cash deductions
// Version: 1.0 | Build: ENGINE-02

import { PayrollImpactEntry, PayrollPropagationResult } from './types';
import { Transaction } from '../../components/screens/finance/types';

interface PayrollEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  grossSalary: number;
  deductions: number;
  netSalary: number;
}

interface LedgerEntryInput {
  type: 'department-cost' | 'salary-liability' | 'cash-deduction';
  date: string;
  amount: number;
  narration: string;
  departmentId?: string;
  departmentName?: string;
  employeeId?: string;
  employeeName?: string;
  payrollId: string;
}

/**
 * Generate ledger entry from payroll data
 */
function generateLedgerEntry(input: LedgerEntryInput): Transaction {
  const id = `ledger-${input.type}-${input.payrollId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    date: input.date,
    amount: input.amount,
    narration: input.narration,
    type: input.type === 'cash-deduction' ? 'expense' : 'expense',
    paymentMethod: input.type === 'cash-deduction' ? 'bank' : 'bank',
    accountId: 'system-payroll-account',
    accountName: 'Payroll Account',
    categoryId: input.type === 'department-cost' ? 'cat-dept-cost' : 
                input.type === 'salary-liability' ? 'cat-salary-liability' : 
                'cat-cash-deduction',
    categoryName: input.type === 'department-cost' ? 'Department Cost' :
                  input.type === 'salary-liability' ? 'Salary Liability' :
                  'Cash Deduction',
    world: 'business',
    status: 'posted',
    autoClassified: true,
    confidenceScore: 100,
    tags: ['payroll', 'auto-generated', input.type],
    createdBy: 'system-payroll-router',
    createdAt: new Date().toISOString(),
  };
}

/**
 * Propagate payroll to ledger and cost systems
 * Creates:
 * 1. Department cost entries
 * 2. Salary liability entries
 * 3. Cash/bank deductions
 */
export function propagatePayrollToLedger(
  payrollId: string,
  payrollEntries: PayrollEntry[],
  processDate: string
): PayrollPropagationResult {
  const ledgerEntries: Transaction[] = [];
  const impactEntries: PayrollImpactEntry[] = [];

  let totalGross = 0;
  let totalNet = 0;
  let totalDeductions = 0;

  payrollEntries.forEach((entry) => {
    totalGross += entry.grossSalary;
    totalNet += entry.netSalary;
    totalDeductions += entry.deductions;

    // 1. Create Department Cost Entry
    const deptCostEntry = generateLedgerEntry({
      type: 'department-cost',
      date: processDate,
      amount: entry.grossSalary,
      narration: `Department cost: ${entry.employeeName} (${entry.departmentName}) - Payroll ${payrollId}`,
      departmentId: entry.departmentId,
      departmentName: entry.departmentName,
      employeeId: entry.employeeId,
      employeeName: entry.employeeName,
      payrollId,
    });
    ledgerEntries.push(deptCostEntry);

    // 2. Create Salary Liability Entry
    const salaryLiabilityEntry = generateLedgerEntry({
      type: 'salary-liability',
      date: processDate,
      amount: entry.netSalary,
      narration: `Salary liability: ${entry.employeeName} - Net pay ${entry.netSalary.toFixed(2)}`,
      employeeId: entry.employeeId,
      employeeName: entry.employeeName,
      payrollId,
    });
    ledgerEntries.push(salaryLiabilityEntry);

    // 3. Create Cash Deduction Entry (if any deductions)
    if (entry.deductions > 0) {
      const cashDeductionEntry = generateLedgerEntry({
        type: 'cash-deduction',
        date: processDate,
        amount: entry.deductions,
        narration: `Deductions: ${entry.employeeName} - Tax/Benefits ${entry.deductions.toFixed(2)}`,
        employeeId: entry.employeeId,
        employeeName: entry.employeeName,
        payrollId,
      });
      ledgerEntries.push(cashDeductionEntry);
    }

    // Create impact entry
    impactEntries.push({
      id: `impact-${payrollId}-${entry.employeeId}`,
      payrollId,
      employeeId: entry.employeeId,
      employeeName: entry.employeeName,
      departmentId: entry.departmentId,
      departmentName: entry.departmentName,
      grossSalary: entry.grossSalary,
      deductions: entry.deductions,
      netSalary: entry.netSalary,
      processedAt: new Date().toISOString(),
      departmentCostEntryId: deptCostEntry.id,
      salaryLiabilityEntryId: salaryLiabilityEntry.id,
      cashDeductionEntryId: entry.deductions > 0 ? ledgerEntries[ledgerEntries.length - 1].id : undefined,
      linkedToCostMatrix: true,
    });
  });

  return {
    payrollId,
    totalGross,
    totalNet,
    totalDeductions,
    departmentCostEntries: payrollEntries.length,
    salaryLiabilityEntries: payrollEntries.length,
    cashDeductionEntries: payrollEntries.filter((e) => e.deductions > 0).length,
    costMatrixUpdated: true,
    ledgerEntriesCreated: ledgerEntries.map((e) => e.id),
    propagatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate department cost impact from payroll
 */
export function calculateDepartmentCostImpact(
  payrollEntries: PayrollEntry[]
): Record<string, { departmentName: string; totalCost: number; employeeCount: number }> {
  const impact: Record<string, { departmentName: string; totalCost: number; employeeCount: number }> = {};

  payrollEntries.forEach((entry) => {
    if (!impact[entry.departmentId]) {
      impact[entry.departmentId] = {
        departmentName: entry.departmentName,
        totalCost: 0,
        employeeCount: 0,
      };
    }
    impact[entry.departmentId].totalCost += entry.grossSalary;
    impact[entry.departmentId].employeeCount += 1;
  });

  return impact;
}

/**
 * Validate payroll before propagation
 */
export function validatePayrollForPropagation(
  payrollEntries: PayrollEntry[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (payrollEntries.length === 0) {
    errors.push('Payroll has no entries');
  }

  payrollEntries.forEach((entry, index) => {
    if (!entry.employeeId || !entry.employeeName) {
      errors.push(`Entry ${index + 1}: Missing employee information`);
    }
    if (!entry.departmentId || !entry.departmentName) {
      errors.push(`Entry ${index + 1}: Missing department information`);
    }
    if (entry.grossSalary <= 0) {
      errors.push(`Entry ${index + 1}: Invalid gross salary`);
    }
    if (entry.netSalary <= 0) {
      errors.push(`Entry ${index + 1}: Invalid net salary`);
    }
    if (entry.deductions < 0) {
      errors.push(`Entry ${index + 1}: Invalid deductions`);
    }
    if (entry.grossSalary !== entry.netSalary + entry.deductions) {
      errors.push(`Entry ${index + 1}: Gross salary doesn't match net + deductions`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get payroll summary for reporting
 */
export function getPayrollSummary(payrollEntries: PayrollEntry[]): {
  totalGross: number;
  totalNet: number;
  totalDeductions: number;
  employeeCount: number;
  averageGross: number;
  averageNet: number;
  departmentBreakdown: Record<string, number>;
} {
  const totalGross = payrollEntries.reduce((sum, e) => sum + e.grossSalary, 0);
  const totalNet = payrollEntries.reduce((sum, e) => sum + e.netSalary, 0);
  const totalDeductions = payrollEntries.reduce((sum, e) => sum + e.deductions, 0);
  const employeeCount = payrollEntries.length;

  const departmentBreakdown: Record<string, number> = {};
  payrollEntries.forEach((entry) => {
    if (!departmentBreakdown[entry.departmentName]) {
      departmentBreakdown[entry.departmentName] = 0;
    }
    departmentBreakdown[entry.departmentName] += entry.grossSalary;
  });

  return {
    totalGross,
    totalNet,
    totalDeductions,
    employeeCount,
    averageGross: employeeCount > 0 ? totalGross / employeeCount : 0,
    averageNet: employeeCount > 0 ? totalNet / employeeCount : 0,
    departmentBreakdown,
  };
}
