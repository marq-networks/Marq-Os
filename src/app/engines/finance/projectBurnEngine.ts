// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-04 — PROJECT BURN RISK CORE
// ═══════════════════════════════════════════════════════════════════════════
// Live cost injection, burn-risk scoring, margin drift warnings
// Version: 1.0 | Build: ENGINE-04

import { ProjectBurnData, BurnRiskAlert } from './types';
import { DepartmentCostMatrix } from './types';

interface Project {
  id: string;
  name: string;
  budget: number;
  spent: number;
  billableDefault?: boolean;
}

interface TimeEntry {
  projectId: string;
  departmentId: string;
  hours: number;
  date: string;
}

interface ExpenseEntry {
  projectId: string;
  amount: number;
  date: string;
}

/**
 * Calculate time-based cost injection for a project
 */
export function calculateTimeCostInjection(
  projectId: string,
  timeEntries: TimeEntry[],
  departmentCostMatrix: DepartmentCostMatrix
): number {
  const projectTimeEntries = timeEntries.filter((entry) => entry.projectId === projectId);

  return projectTimeEntries.reduce((total, entry) => {
    const deptRow = departmentCostMatrix.rows.find((row) => row.departmentId === entry.departmentId);
    const costPerHour = deptRow?.costPerHour || 0;
    return total + costPerHour * entry.hours;
  }, 0);
}

/**
 * Calculate expense allocation for a project
 */
export function calculateExpenseAllocation(
  projectId: string,
  expenseEntries: ExpenseEntry[]
): number {
  return expenseEntries
    .filter((entry) => entry.projectId === projectId)
    .reduce((total, entry) => total + entry.amount, 0);
}

/**
 * Calculate burn risk score (0-100)
 * Higher score = higher risk
 */
export function calculateBurnRiskScore(
  totalCost: number,
  budget: number,
  spent: number,
  daysRemaining: number
): number {
  // Factor 1: Budget utilization
  const budgetUtilization = budget > 0 ? ((totalCost + spent) / budget) * 100 : 0;
  
  // Factor 2: Burn rate acceleration
  const currentBurn = totalCost + spent;
  const burnRatePerDay = daysRemaining > 0 ? currentBurn / (30 - daysRemaining) : 0;
  const projectedTotal = currentBurn + burnRatePerDay * daysRemaining;
  const projectedOverrun = budget > 0 ? Math.max(0, ((projectedTotal - budget) / budget) * 100) : 0;

  // Factor 3: Days to overrun
  const daysToOverrun = burnRatePerDay > 0 ? Math.max(0, (budget - currentBurn) / burnRatePerDay) : 999;
  const timeRisk = daysToOverrun < 7 ? 100 : daysToOverrun < 14 ? 75 : daysToOverrun < 30 ? 50 : 25;

  // Weighted score
  const riskScore = Math.min(100, (
    budgetUtilization * 0.4 +
    projectedOverrun * 0.4 +
    timeRisk * 0.2
  ));

  return Math.round(riskScore);
}

/**
 * Calculate margin drift
 */
export function calculateMarginDrift(
  revenue: number,
  totalCost: number,
  originalProjectedMargin: number
): {
  currentMargin: number;
  drift: number;
  driftPercentage: number;
} {
  const currentMargin = revenue > 0 ? ((revenue - totalCost) / revenue) * 100 : 0;
  const drift = currentMargin - originalProjectedMargin;
  const driftPercentage = originalProjectedMargin !== 0 
    ? (drift / originalProjectedMargin) * 100 
    : 0;

  return {
    currentMargin,
    drift,
    driftPercentage,
  };
}

/**
 * Determine margin drift warning level
 */
export function getMarginDriftWarning(driftPercentage: number): ProjectBurnData['marginDriftWarning'] {
  const absDrift = Math.abs(driftPercentage);
  
  if (absDrift < 5) return 'none';
  if (absDrift < 15) return 'low';
  if (absDrift < 30) return 'medium';
  if (absDrift < 50) return 'high';
  return 'critical';
}

/**
 * Compute full project burn data
 */
export function computeProjectBurnData(
  project: Project,
  timeEntries: TimeEntry[],
  expenseEntries: ExpenseEntry[],
  departmentCostMatrix: DepartmentCostMatrix,
  projectedMargin: number = 20,
  daysRemaining: number = 30
): ProjectBurnData {
  // Calculate cost components
  const timeCostInjection = calculateTimeCostInjection(project.id, timeEntries, departmentCostMatrix);
  const expenseAllocation = calculateExpenseAllocation(project.id, expenseEntries);
  const totalCost = timeCostInjection + expenseAllocation + project.spent;

  // Calculate burn risk
  const burnRiskScore = calculateBurnRiskScore(totalCost, project.budget, project.spent, daysRemaining);

  // Calculate margins
  const revenue = project.budget; // Assuming budget = revenue for now
  const { currentMargin, drift } = calculateMarginDrift(revenue, totalCost, projectedMargin);
  const marginDriftWarning = getMarginDriftWarning(drift);

  const profitMargin = currentMargin;
  const profitMarginProjected = projectedMargin;

  return {
    projectId: project.id,
    projectName: project.name,
    timeCostInjection,
    expenseAllocation,
    totalCost,
    budget: project.budget,
    spent: project.spent,
    burnRiskScore,
    marginDrift: drift,
    marginDriftWarning,
    profitMargin,
    profitMarginProjected,
    feedsProjectDashboard: true,
    feedsFinanceCockpit: true,
    feedsAlertsInbox: burnRiskScore > 50,
    lastComputed: new Date().toISOString(),
  };
}

/**
 * Generate burn risk alerts for projects
 */
export function generateBurnRiskAlerts(
  projectBurnData: ProjectBurnData[],
  alertThreshold: number = 50
): BurnRiskAlert[] {
  const alerts: BurnRiskAlert[] = [];

  projectBurnData.forEach((burnData) => {
    if (burnData.burnRiskScore < alertThreshold) return;

    // Determine alert type and severity
    let type: BurnRiskAlert['type'] = 'budget-overrun';
    let severity: BurnRiskAlert['severity'] = 'low';
    let message = '';

    const overrunAmount = burnData.totalCost - burnData.budget;
    const overrunPercentage = burnData.budget > 0 ? (overrunAmount / burnData.budget) * 100 : 0;

    if (burnData.marginDriftWarning === 'critical') {
      type = 'margin-drift';
      severity = 'critical';
      message = `Critical margin drift: ${burnData.marginDrift.toFixed(1)}% below target`;
    } else if (overrunPercentage > 20) {
      type = 'budget-overrun';
      severity = 'critical';
      message = `Budget overrun: ${overrunPercentage.toFixed(1)}% over budget`;
    } else if (overrunPercentage > 10) {
      type = 'budget-overrun';
      severity = 'high';
      message = `Approaching budget limit: ${overrunPercentage.toFixed(1)}% over`;
    } else if (burnData.marginDriftWarning === 'high') {
      type = 'margin-drift';
      severity = 'high';
      message = `High margin drift: ${burnData.marginDrift.toFixed(1)}% deviation`;
    } else if (burnData.burnRiskScore > 75) {
      type = 'burn-rate-high';
      severity = 'medium';
      message = `High burn rate detected: Risk score ${burnData.burnRiskScore}`;
    } else {
      type = 'cost-spike';
      severity = 'low';
      message = `Cost spike detected: Monitoring required`;
    }

    // Calculate days to overrun
    const remainingBudget = burnData.budget - burnData.totalCost;
    const burnRate = burnData.totalCost / 30; // Assuming 30-day period
    const daysToOverrun = burnRate > 0 ? Math.floor(remainingBudget / burnRate) : undefined;

    alerts.push({
      id: `alert-${burnData.projectId}-${Date.now()}`,
      projectId: burnData.projectId,
      projectName: burnData.projectName,
      type,
      severity,
      message,
      currentBurn: burnData.totalCost,
      projectedBurn: burnData.totalCost + (burnRate * (daysToOverrun || 0)),
      daysToOverrun,
      createdAt: new Date().toISOString(),
      acknowledged: false,
    });
  });

  return alerts;
}

/**
 * Get burn health status
 */
export function getBurnHealthStatus(
  burnRiskScore: number
): { status: 'healthy' | 'warning' | 'critical'; color: string; label: string } {
  if (burnRiskScore < 30) {
    return { status: 'healthy', color: 'green', label: 'Healthy' };
  } else if (burnRiskScore < 70) {
    return { status: 'warning', color: 'yellow', label: 'Warning' };
  } else {
    return { status: 'critical', color: 'red', label: 'Critical' };
  }
}

/**
 * Calculate project profit
 */
export function calculateProjectProfit(
  revenue: number,
  totalCost: number
): { profit: number; margin: number; marginPercentage: number } {
  const profit = revenue - totalCost;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  
  return {
    profit,
    margin,
    marginPercentage: margin,
  };
}

/**
 * Estimate completion cost
 */
export function estimateCompletionCost(
  currentCost: number,
  progressPercentage: number
): { estimatedTotal: number; remainingCost: number; variance: number } {
  const estimatedTotal = progressPercentage > 0 ? (currentCost / progressPercentage) * 100 : currentCost;
  const remainingCost = estimatedTotal - currentCost;
  const variance = estimatedTotal - currentCost;

  return {
    estimatedTotal,
    remainingCost,
    variance,
  };
}
