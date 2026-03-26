/**
 * ═══════════════════════════════════════════════════════════════════════════
 * FINANCIAL INTELLIGENCE ENGINE
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * AI-powered financial analysis and forecasting.
 * 
 * CONSTITUTIONAL RULES:
 * - All calculations derive from ledger ONLY
 * - NEVER writes to ledger (read-only observer)
 * - Auto-updates when ledger changes
 * - No fake numbers - pure computation
 */

import { LedgerEntry } from '../stores/ledgerStore';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CashflowHealth {
  monthlyBurnRate: number;
  runwayMonths: number;
  revenueVelocity: number; // % change month-over-month
  expenseGrowth: number; // % change month-over-month
  payrollPercentOfRevenue: number;
  currentBalance: number;
}

export interface RiskSignal {
  id: string;
  type: 'project_burn' | 'negative_cashflow' | 'late_payment' | 'reimbursement_pile' | 'payroll_overload';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  detectedAt: string;
  metrics?: Record<string, any>;
}

export interface AIAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  cause: string;
  impact: string;
  suggestedAction: string;
  timestamp: string;
  category: 'cashflow' | 'revenue' | 'expense' | 'payroll' | 'risk';
}

export interface Projection {
  periodDays: 30 | 60 | 90;
  bestCase: {
    endingBalance: number;
    projectedRevenue: number;
    projectedExpenses: number;
    netChange: number;
  };
  worstCase: {
    endingBalance: number;
    projectedRevenue: number;
    projectedExpenses: number;
    netChange: number;
  };
  mostLikely: {
    endingBalance: number;
    projectedRevenue: number;
    projectedExpenses: number;
    netChange: number;
  };
}

export interface CashExhaustion {
  willExhaust: boolean;
  exhaustionDate: string | null;
  daysUntilExhaustion: number | null;
  averageDailyBurn: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

function getMonthKey(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getDaysDiff(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function addDays(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ═══════════════════════════════════════════════════════════════════════════
// 1. CASHFLOW HEALTH METRICS
// ═══════════════════════════════════════════════════════════════════════════

export function calculateCashflowHealth(entries: readonly LedgerEntry[]): CashflowHealth {
  if (entries.length === 0) {
    return {
      monthlyBurnRate: 0,
      runwayMonths: 0,
      revenueVelocity: 0,
      expenseGrowth: 0,
      payrollPercentOfRevenue: 0,
      currentBalance: 0
    };
  }

  const currentBalance = entries[entries.length - 1].balance;
  
  // Group by month
  const monthlyData = new Map<string, { revenue: number; expenses: number; payroll: number }>();
  
  entries.forEach(entry => {
    const monthKey = getMonthKey(entry.date);
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { revenue: 0, expenses: 0, payroll: 0 });
    }
    
    const data = monthlyData.get(monthKey)!;
    
    if (entry.entryType === 'income') {
      data.revenue += entry.credit;
    } else if (entry.entryType === 'expense') {
      data.expenses += entry.debit;
    } else if (entry.entryType === 'salary') {
      data.payroll += entry.debit;
      data.expenses += entry.debit; // Payroll is also an expense
    } else if (entry.entryType === 'reimbursement') {
      data.expenses += entry.debit;
    }
  });

  const months = Array.from(monthlyData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  
  if (months.length === 0) {
    return {
      monthlyBurnRate: 0,
      runwayMonths: 0,
      revenueVelocity: 0,
      expenseGrowth: 0,
      payrollPercentOfRevenue: 0,
      currentBalance
    };
  }

  // Get current and previous month
  const currentMonth = months[months.length - 1][1];
  const previousMonth = months.length > 1 ? months[months.length - 2][1] : null;

  // Monthly burn rate (expenses - revenue)
  const monthlyBurnRate = currentMonth.expenses - currentMonth.revenue;

  // Runway (months until cash exhaustion at current burn rate)
  const runwayMonths = monthlyBurnRate > 0 ? currentBalance / monthlyBurnRate : Infinity;

  // Revenue velocity (month-over-month growth)
  const revenueVelocity = previousMonth && previousMonth.revenue > 0
    ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100
    : 0;

  // Expense growth (month-over-month)
  const expenseGrowth = previousMonth && previousMonth.expenses > 0
    ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
    : 0;

  // Payroll as % of revenue
  const payrollPercentOfRevenue = currentMonth.revenue > 0
    ? (currentMonth.payroll / currentMonth.revenue) * 100
    : 0;

  return {
    monthlyBurnRate,
    runwayMonths: Math.min(runwayMonths, 999), // Cap at 999 months
    revenueVelocity,
    expenseGrowth,
    payrollPercentOfRevenue,
    currentBalance
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. RISK RADAR
// ═══════════════════════════════════════════════════════════════════════════

export function detectRiskSignals(entries: readonly LedgerEntry[]): RiskSignal[] {
  const risks: RiskSignal[] = [];

  // Detect negative cashflow streak
  const recentEntries = entries.slice(-10);
  let negativeStreak = 0;
  for (let i = recentEntries.length - 1; i >= 0; i--) {
    const entry = recentEntries[i];
    const netChange = entry.credit - entry.debit;
    if (netChange < 0) {
      negativeStreak++;
    } else {
      break;
    }
  }

  if (negativeStreak >= 5) {
    risks.push({
      id: `risk-negative-cashflow-${Date.now()}`,
      type: 'negative_cashflow',
      severity: negativeStreak >= 7 ? 'critical' : 'high',
      title: 'Negative Cashflow Streak Detected',
      description: `${negativeStreak} consecutive transactions with negative net change`,
      detectedAt: new Date().toISOString(),
      metrics: { streakLength: negativeStreak }
    });
  }

  // Detect reimbursement pile-up
  const reimbursements = entries.filter(e => e.entryType === 'reimbursement');
  const last30Days = entries.filter(e => {
    const daysDiff = getDaysDiff(e.date, new Date().toISOString().split('T')[0]);
    return daysDiff <= 30;
  });
  const recentReimbursements = last30Days.filter(e => e.entryType === 'reimbursement');
  const reimbursementTotal = recentReimbursements.reduce((sum, e) => sum + e.debit, 0);

  if (recentReimbursements.length >= 5 && reimbursementTotal > 5000) {
    risks.push({
      id: `risk-reimbursement-pile-${Date.now()}`,
      type: 'reimbursement_pile',
      severity: reimbursementTotal > 10000 ? 'high' : 'medium',
      title: 'Reimbursement Volume Spike',
      description: `${recentReimbursements.length} reimbursements totaling $${reimbursementTotal.toLocaleString()} in last 30 days`,
      detectedAt: new Date().toISOString(),
      metrics: { count: recentReimbursements.length, total: reimbursementTotal }
    });
  }

  // Detect payroll overload (payroll > 70% of revenue)
  const monthlyData = new Map<string, { revenue: number; payroll: number }>();
  entries.forEach(entry => {
    const monthKey = getMonthKey(entry.date);
    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, { revenue: 0, payroll: 0 });
    }
    const data = monthlyData.get(monthKey)!;
    if (entry.entryType === 'income') data.revenue += entry.credit;
    if (entry.entryType === 'salary') data.payroll += entry.debit;
  });

  const months = Array.from(monthlyData.values());
  const currentMonth = months[months.length - 1];
  
  if (currentMonth && currentMonth.revenue > 0) {
    const payrollPercent = (currentMonth.payroll / currentMonth.revenue) * 100;
    if (payrollPercent > 70) {
      risks.push({
        id: `risk-payroll-overload-${Date.now()}`,
        type: 'payroll_overload',
        severity: payrollPercent > 90 ? 'critical' : 'high',
        title: 'Payroll Cost Exceeds Safe Threshold',
        description: `Payroll is ${payrollPercent.toFixed(1)}% of revenue (healthy range: 40-60%)`,
        detectedAt: new Date().toISOString(),
        metrics: { payrollPercent, payroll: currentMonth.payroll, revenue: currentMonth.revenue }
      });
    }
  }

  // Detect low cash balance
  const currentBalance = entries[entries.length - 1]?.balance || 0;
  const avgMonthlyExpenses = months.length > 0
    ? months.reduce((sum, m) => sum + (m.revenue - 0), 0) / months.length
    : 0;

  if (currentBalance < avgMonthlyExpenses * 2) {
    risks.push({
      id: `risk-low-cash-${Date.now()}`,
      type: 'negative_cashflow',
      severity: currentBalance < avgMonthlyExpenses ? 'critical' : 'high',
      title: 'Low Cash Reserves',
      description: `Current balance ($${currentBalance.toLocaleString()}) is below 2 months of operating expenses`,
      detectedAt: new Date().toISOString(),
      metrics: { currentBalance, monthsOfRunway: avgMonthlyExpenses > 0 ? currentBalance / avgMonthlyExpenses : 0 }
    });
  }

  return risks;
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. AI FINANCIAL ALERTS
// ═══════════════════════════════════════════════════════════════════════════

export function generateAIAlerts(
  entries: readonly LedgerEntry[],
  cashflowHealth: CashflowHealth,
  riskSignals: RiskSignal[]
): AIAlert[] {
  const alerts: AIAlert[] = [];

  // Alert: Low runway
  if (cashflowHealth.runwayMonths < 6 && cashflowHealth.runwayMonths > 0) {
    alerts.push({
      id: `alert-runway-${Date.now()}-1`,
      severity: cashflowHealth.runwayMonths < 3 ? 'critical' : 'high',
      title: 'Cash Runway Below Safe Threshold',
      cause: `Monthly burn rate of $${cashflowHealth.monthlyBurnRate.toLocaleString()} exceeds revenue generation`,
      impact: `Company will exhaust cash reserves in ${cashflowHealth.runwayMonths.toFixed(1)} months at current rate`,
      suggestedAction: 'Reduce non-essential expenses, accelerate receivables collection, or secure additional funding',
      timestamp: new Date().toISOString(),
      category: 'cashflow'
    });
  }

  // Alert: Negative revenue velocity
  if (cashflowHealth.revenueVelocity < -10) {
    alerts.push({
      id: `alert-revenue-${Date.now()}-2`,
      severity: cashflowHealth.revenueVelocity < -20 ? 'critical' : 'high',
      title: 'Revenue Decline Detected',
      cause: `Revenue dropped ${Math.abs(cashflowHealth.revenueVelocity).toFixed(1)}% compared to previous month`,
      impact: 'Declining revenue combined with fixed costs increases burn rate and shortens runway',
      suggestedAction: 'Review sales pipeline, reactivate dormant clients, launch promotional campaigns',
      timestamp: new Date().toISOString(),
      category: 'revenue'
    });
  }

  // Alert: Rapid expense growth
  if (cashflowHealth.expenseGrowth > 15) {
    alerts.push({
      id: `alert-expense-${Date.now()}-3`,
      severity: cashflowHealth.expenseGrowth > 30 ? 'high' : 'medium',
      title: 'Expense Growth Outpacing Revenue',
      cause: `Expenses increased ${cashflowHealth.expenseGrowth.toFixed(1)}% month-over-month`,
      impact: 'Margin compression reduces profitability and accelerates cash burn',
      suggestedAction: 'Conduct expense audit, renegotiate vendor contracts, defer non-critical purchases',
      timestamp: new Date().toISOString(),
      category: 'expense'
    });
  }

  // Alert: Payroll cost concern
  if (cashflowHealth.payrollPercentOfRevenue > 60) {
    alerts.push({
      id: `alert-payroll-${Date.now()}-4`,
      severity: cashflowHealth.payrollPercentOfRevenue > 80 ? 'critical' : 'high',
      title: 'Payroll Cost Ratio Unhealthy',
      cause: `Payroll represents ${cashflowHealth.payrollPercentOfRevenue.toFixed(1)}% of revenue (healthy: 40-60%)`,
      impact: 'Unsustainable labor costs reduce operational flexibility and profit margins',
      suggestedAction: 'Review team structure, consider hiring freeze, optimize resource allocation',
      timestamp: new Date().toISOString(),
      category: 'payroll'
    });
  }

  // Convert risk signals to alerts
  riskSignals.forEach(risk => {
    let category: AIAlert['category'] = 'risk';
    let suggestedAction = 'Review financial operations and take corrective action';

    if (risk.type === 'reimbursement_pile') {
      category = 'expense';
      suggestedAction = 'Review reimbursement approval process, set spending limits, batch payment processing';
    } else if (risk.type === 'payroll_overload') {
      category = 'payroll';
      suggestedAction = 'Analyze revenue per employee, consider org restructuring, delay new hires';
    } else if (risk.type === 'negative_cashflow') {
      category = 'cashflow';
      suggestedAction = 'Immediate action required: cut discretionary spending, accelerate invoicing, delay payables';
    }

    alerts.push({
      id: `alert-risk-${risk.id}`,
      severity: risk.severity,
      title: risk.title,
      cause: risk.description,
      impact: `Risk detected: ${risk.type.replace(/_/g, ' ')}`,
      suggestedAction,
      timestamp: risk.detectedAt,
      category
    });
  });

  return alerts;
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. SMART PROJECTIONS
// ═══════════════════════════════════════════════════════════════════════════

export function calculateProjections(entries: readonly LedgerEntry[]): {
  projections30: Projection;
  projections60: Projection;
  projections90: Projection;
  exhaustion: CashExhaustion;
} {
  if (entries.length < 5) {
    // Not enough data for projections
    const empty: Projection = {
      periodDays: 30,
      bestCase: { endingBalance: 0, projectedRevenue: 0, projectedExpenses: 0, netChange: 0 },
      worstCase: { endingBalance: 0, projectedRevenue: 0, projectedExpenses: 0, netChange: 0 },
      mostLikely: { endingBalance: 0, projectedRevenue: 0, projectedExpenses: 0, netChange: 0 }
    };
    
    return {
      projections30: { ...empty, periodDays: 30 },
      projections60: { ...empty, periodDays: 60 },
      projections90: { ...empty, periodDays: 90 },
      exhaustion: {
        willExhaust: false,
        exhaustionDate: null,
        daysUntilExhaustion: null,
        averageDailyBurn: 0
      }
    };
  }

  const currentBalance = entries[entries.length - 1].balance;
  
  // Calculate historical averages (last 60 days)
  const last60DaysDate = addDays(new Date().toISOString().split('T')[0], -60);
  const recentEntries = entries.filter(e => e.date >= last60DaysDate);
  
  let totalRevenue = 0;
  let totalExpenses = 0;
  
  recentEntries.forEach(entry => {
    if (entry.entryType === 'income') {
      totalRevenue += entry.credit;
    } else {
      totalExpenses += entry.debit;
    }
  });

  const daysCovered = recentEntries.length > 0 
    ? getDaysDiff(recentEntries[0].date, recentEntries[recentEntries.length - 1].date) || 1
    : 1;

  const avgDailyRevenue = totalRevenue / daysCovered;
  const avgDailyExpenses = totalExpenses / daysCovered;
  const avgDailyBurn = avgDailyExpenses - avgDailyRevenue;

  // Helper to create projection
  const createProjection = (days: 30 | 60 | 90): Projection => {
    // Best case: revenue +20%, expenses -10%
    const bestRevenue = avgDailyRevenue * 1.2 * days;
    const bestExpenses = avgDailyExpenses * 0.9 * days;
    const bestNet = bestRevenue - bestExpenses;
    const bestEnding = currentBalance + bestNet;

    // Worst case: revenue -20%, expenses +10%
    const worstRevenue = avgDailyRevenue * 0.8 * days;
    const worstExpenses = avgDailyExpenses * 1.1 * days;
    const worstNet = worstRevenue - worstExpenses;
    const worstEnding = currentBalance + worstNet;

    // Most likely: current trends continue
    const likelyRevenue = avgDailyRevenue * days;
    const likelyExpenses = avgDailyExpenses * days;
    const likelyNet = likelyRevenue - likelyExpenses;
    const likelyEnding = currentBalance + likelyNet;

    return {
      periodDays: days,
      bestCase: {
        endingBalance: bestEnding,
        projectedRevenue: bestRevenue,
        projectedExpenses: bestExpenses,
        netChange: bestNet
      },
      worstCase: {
        endingBalance: worstEnding,
        projectedRevenue: worstRevenue,
        projectedExpenses: worstExpenses,
        netChange: worstNet
      },
      mostLikely: {
        endingBalance: likelyEnding,
        projectedRevenue: likelyRevenue,
        projectedExpenses: likelyExpenses,
        netChange: likelyNet
      }
    };
  };

  // Calculate cash exhaustion
  const exhaustion: CashExhaustion = {
    willExhaust: avgDailyBurn > 0,
    exhaustionDate: null,
    daysUntilExhaustion: null,
    averageDailyBurn: avgDailyBurn
  };

  if (avgDailyBurn > 0) {
    const daysUntilExhaustion = Math.floor(currentBalance / avgDailyBurn);
    const exhaustionDate = addDays(new Date().toISOString().split('T')[0], daysUntilExhaustion);
    
    exhaustion.daysUntilExhaustion = daysUntilExhaustion;
    exhaustion.exhaustionDate = exhaustionDate;
  }

  return {
    projections30: createProjection(30),
    projections60: createProjection(60),
    projections90: createProjection(90),
    exhaustion
  };
}
