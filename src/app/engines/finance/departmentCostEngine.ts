// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-01 — DEPARTMENT COST MATRIX ENGINE
// ═══════════════════════════════════════════════════════════════════════════
// Creates an always-live cost table for profit/hour, burn rate, and quote logic
// Version: 1.0 | Build: ENGINE-01

import { DepartmentCostMatrix, DepartmentCostRow } from './types';

interface Employee {
  id: string;
  departmentId: string;
  monthlySalary: number;
}

interface Department {
  id: string;
  name: string;
  code: string;
}

interface OverheadData {
  totalMonthlyOverhead: number;
  departmentAllocations: Record<string, number>; // departmentId -> overhead share
}

/**
 * Computes the Department Cost Matrix
 * This is the BASE for all profit intelligence
 */
export function computeDepartmentCostMatrix(
  departments: Department[],
  employees: Employee[],
  overheadData: OverheadData
): DepartmentCostMatrix {
  const HOURS_PER_MONTH = 160; // Standard 40hr/week × 4 weeks
  const HOURS_PER_MINUTE = 60;

  const rows: DepartmentCostRow[] = departments.map((dept) => {
    // Calculate employee count and total salary
    const deptEmployees = employees.filter((emp) => emp.departmentId === dept.id);
    const employeeCount = deptEmployees.length;
    const monthlySalary = deptEmployees.reduce((sum, emp) => sum + emp.monthlySalary, 0);

    // Get overhead share
    const overheadShare = overheadData.departmentAllocations[dept.id] || 0;

    // Total cost = Salary + Overhead
    const totalMonthlyCost = monthlySalary + overheadShare;

    // Calculate cost per hour and minute
    const costPerHour = employeeCount > 0 ? totalMonthlyCost / HOURS_PER_MONTH : 0;
    const costPerMinute = costPerHour / HOURS_PER_MINUTE;

    return {
      departmentId: dept.id,
      departmentName: dept.name,
      departmentCode: dept.code,
      employeeCount,
      monthlySalary,
      overheadShare,
      costPerHour,
      costPerMinute,
      lastUpdated: new Date().toISOString(),
      salaryChangeDetected: false,
      teamChangeDetected: false,
      overheadChangeDetected: false,
    };
  });

  const totalMonthlySalary = rows.reduce((sum, row) => sum + row.monthlySalary, 0);
  const totalOverhead = rows.reduce((sum, row) => sum + row.overheadShare, 0);
  const totalEmployees = rows.reduce((sum, row) => sum + row.employeeCount, 0);
  const averageCostPerHour = totalEmployees > 0
    ? (totalMonthlySalary + totalOverhead) / HOURS_PER_MONTH
    : 0;

  return {
    rows,
    totalMonthlySalary,
    totalOverhead,
    totalEmployees,
    averageCostPerHour,
    lastComputed: new Date().toISOString(),
    autoUpdateEnabled: true,
  };
}

/**
 * Get department cost per hour (used by other engines)
 */
export function getDepartmentCostPerHour(
  matrix: DepartmentCostMatrix,
  departmentId: string
): number {
  const row = matrix.rows.find((r) => r.departmentId === departmentId);
  return row?.costPerHour || 0;
}

/**
 * Get department cost per minute (used for granular tracking)
 */
export function getDepartmentCostPerMinute(
  matrix: DepartmentCostMatrix,
  departmentId: string
): number {
  const row = matrix.rows.find((r) => r.departmentId === departmentId);
  return row?.costPerMinute || 0;
}

/**
 * Detect changes that require matrix recomputation
 */
export function detectMatrixChanges(
  currentMatrix: DepartmentCostMatrix,
  newEmployees: Employee[],
  newOverheadData: OverheadData
): {
  requiresUpdate: boolean;
  salaryChanged: boolean;
  teamChanged: boolean;
  overheadChanged: boolean;
} {
  const currentTotalSalary = currentMatrix.totalMonthlySalary;
  const newTotalSalary = newEmployees.reduce((sum, emp) => sum + emp.monthlySalary, 0);
  const salaryChanged = Math.abs(currentTotalSalary - newTotalSalary) > 0.01;

  const currentTotalEmployees = currentMatrix.totalEmployees;
  const newTotalEmployees = newEmployees.length;
  const teamChanged = currentTotalEmployees !== newTotalEmployees;

  const currentTotalOverhead = currentMatrix.totalOverhead;
  const newTotalOverhead = newOverheadData.totalMonthlyOverhead;
  const overheadChanged = Math.abs(currentTotalOverhead - newTotalOverhead) > 0.01;

  return {
    requiresUpdate: salaryChanged || teamChanged || overheadChanged,
    salaryChanged,
    teamChanged,
    overheadChanged,
  };
}

/**
 * Calculate project burn based on department costs
 */
export function calculateProjectBurn(
  matrix: DepartmentCostMatrix,
  timeEntries: Array<{ departmentId: string; hours: number }>
): number {
  return timeEntries.reduce((total, entry) => {
    const costPerHour = getDepartmentCostPerHour(matrix, entry.departmentId);
    return total + costPerHour * entry.hours;
  }, 0);
}

/**
 * Calculate quote cost based on department allocations
 */
export function calculateQuoteCost(
  matrix: DepartmentCostMatrix,
  departmentAllocations: Array<{ departmentId: string; hours: number }>,
  overheadMultiplier: number = 1.0
): {
  laborCost: number;
  overheadCost: number;
  totalCost: number;
  breakdown: Array<{ departmentName: string; hours: number; cost: number }>;
} {
  const breakdown = departmentAllocations.map((alloc) => {
    const row = matrix.rows.find((r) => r.departmentId === alloc.departmentId);
    const costPerHour = row?.costPerHour || 0;
    const cost = costPerHour * alloc.hours;
    return {
      departmentName: row?.departmentName || 'Unknown',
      hours: alloc.hours,
      cost,
    };
  });

  const laborCost = breakdown.reduce((sum, item) => sum + item.cost, 0);
  const overheadCost = laborCost * (overheadMultiplier - 1);
  const totalCost = laborCost + overheadCost;

  return {
    laborCost,
    overheadCost,
    totalCost,
    breakdown,
  };
}
