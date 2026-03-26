// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-08 — PROFIT VELOCITY ENGINE
// ═══════════════════════════════════════════════════════════════════════════
// Real-time velocity calculation: profit/hour, burn/day, margin velocity, overhead leakage
// Version: 1.0 | Build: ENGINE-08

import { ProfitVelocityMetrics } from './types';

interface VelocityInput {
  totalRevenue: number;
  totalCost: number;
  totalOverhead: number;
  totalHours: number;
  timePeriodDays: number; // Period over which data was collected
  previousMetrics?: ProfitVelocityMetrics; // For calculating acceleration
}

/**
 * Calculate profit velocity metrics
 * Feeds the 2050 Cockpit with real-time financial intelligence
 */
export function calculateProfitVelocity(
  input: VelocityInput,
  computationFrequency: 'realtime' | 'hourly' | 'daily' = 'hourly'
): ProfitVelocityMetrics {
  const { totalRevenue, totalCost, totalOverhead, totalHours, timePeriodDays } = input;

  // Basic profit calculation
  const totalProfit = totalRevenue - totalCost;

  // Velocity calculations
  const profitPerHour = totalHours > 0 ? totalProfit / totalHours : 0;
  const profitPerDay = timePeriodDays > 0 ? totalProfit / timePeriodDays : 0;
  const profitPerWeek = profitPerDay * 7;
  const profitPerMonth = profitPerDay * 30;

  // Burn metrics (cost velocity)
  const burnPerDay = timePeriodDays > 0 ? totalCost / timePeriodDays : 0;
  const burnPerWeek = burnPerDay * 7;
  const burnPerMonth = burnPerDay * 30;

  // Margin velocity (rate of margin change)
  let marginVelocity = 0;
  let marginAcceleration = 0;

  if (input.previousMetrics) {
    const currentMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    const previousMargin = input.previousMetrics.profitPerHour > 0
      ? ((input.previousMetrics.profitPerHour * totalHours - totalCost) / totalRevenue) * 100
      : 0;
    
    // Velocity = change in margin over time
    marginVelocity = currentMargin - previousMargin;
    
    // Acceleration = change in velocity
    const previousVelocity = input.previousMetrics.marginVelocity || 0;
    marginAcceleration = marginVelocity - previousVelocity;
  }

  // Overhead leakage detection
  const overheadPercentage = totalCost > 0 ? (totalOverhead / totalCost) * 100 : 0;
  const overheadLeakage = overheadPercentage > 30 ? overheadPercentage - 30 : 0; // 30% is baseline
  const leakagePerDay = burnPerDay * (overheadLeakage / 100);

  return {
    profitPerHour,
    profitPerDay,
    profitPerWeek,
    profitPerMonth,
    burnPerDay,
    burnPerWeek,
    burnPerMonth,
    marginVelocity,
    marginAcceleration,
    overheadLeakage,
    leakagePerDay,
    feeds2050Cockpit: true,
    lastComputed: new Date().toISOString(),
    computationFrequency,
  };
}

/**
 * Detect velocity anomalies
 */
export function detectVelocityAnomalies(
  current: ProfitVelocityMetrics,
  historical: ProfitVelocityMetrics[]
): Array<{
  type: 'profit-spike' | 'profit-drop' | 'burn-spike' | 'margin-acceleration' | 'leakage-increase';
  severity: 'low' | 'medium' | 'high';
  message: string;
  currentValue: number;
  historicalAverage: number;
  deviation: number;
}> {
  if (historical.length === 0) return [];

  const anomalies: Array<{
    type: 'profit-spike' | 'profit-drop' | 'burn-spike' | 'margin-acceleration' | 'leakage-increase';
    severity: 'low' | 'medium' | 'high';
    message: string;
    currentValue: number;
    historicalAverage: number;
    deviation: number;
  }> = [];

  // Calculate historical averages
  const avgProfitPerDay = historical.reduce((sum, m) => sum + m.profitPerDay, 0) / historical.length;
  const avgBurnPerDay = historical.reduce((sum, m) => sum + m.burnPerDay, 0) / historical.length;
  const avgLeakage = historical.reduce((sum, m) => sum + m.overheadLeakage, 0) / historical.length;

  // Profit anomalies
  const profitDeviation = avgProfitPerDay > 0 ? ((current.profitPerDay - avgProfitPerDay) / avgProfitPerDay) * 100 : 0;
  
  if (profitDeviation > 50) {
    anomalies.push({
      type: 'profit-spike',
      severity: 'low',
      message: `Profit per day increased ${profitDeviation.toFixed(1)}% above average`,
      currentValue: current.profitPerDay,
      historicalAverage: avgProfitPerDay,
      deviation: profitDeviation,
    });
  } else if (profitDeviation < -30) {
    anomalies.push({
      type: 'profit-drop',
      severity: profitDeviation < -50 ? 'high' : 'medium',
      message: `Profit per day dropped ${Math.abs(profitDeviation).toFixed(1)}% below average`,
      currentValue: current.profitPerDay,
      historicalAverage: avgProfitPerDay,
      deviation: profitDeviation,
    });
  }

  // Burn anomalies
  const burnDeviation = avgBurnPerDay > 0 ? ((current.burnPerDay - avgBurnPerDay) / avgBurnPerDay) * 100 : 0;
  
  if (burnDeviation > 30) {
    anomalies.push({
      type: 'burn-spike',
      severity: burnDeviation > 50 ? 'high' : 'medium',
      message: `Burn rate increased ${burnDeviation.toFixed(1)}% above average`,
      currentValue: current.burnPerDay,
      historicalAverage: avgBurnPerDay,
      deviation: burnDeviation,
    });
  }

  // Margin acceleration anomalies
  if (Math.abs(current.marginAcceleration) > 5) {
    anomalies.push({
      type: 'margin-acceleration',
      severity: Math.abs(current.marginAcceleration) > 10 ? 'high' : 'medium',
      message: `Margin ${current.marginAcceleration > 0 ? 'accelerating' : 'decelerating'} rapidly`,
      currentValue: current.marginAcceleration,
      historicalAverage: 0,
      deviation: current.marginAcceleration,
    });
  }

  // Leakage anomalies
  const leakageIncrease = current.overheadLeakage - avgLeakage;
  
  if (leakageIncrease > 5) {
    anomalies.push({
      type: 'leakage-increase',
      severity: leakageIncrease > 10 ? 'high' : 'medium',
      message: `Overhead leakage increased by ${leakageIncrease.toFixed(1)}%`,
      currentValue: current.overheadLeakage,
      historicalAverage: avgLeakage,
      deviation: leakageIncrease,
    });
  }

  return anomalies;
}

/**
 * Project future velocity
 */
export function projectFutureVelocity(
  current: ProfitVelocityMetrics,
  historical: ProfitVelocityMetrics[],
  daysForward: number = 30
): {
  projectedProfitPerDay: number;
  projectedBurnPerDay: number;
  projectedMargin: number;
  confidence: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
} {
  if (historical.length < 2) {
    // Not enough data for projection
    return {
      projectedProfitPerDay: current.profitPerDay,
      projectedBurnPerDay: current.burnPerDay,
      projectedMargin: current.marginVelocity,
      confidence: 20,
      trend: 'stable',
    };
  }

  // Calculate linear trend
  const profitTrend = historical.map((m) => m.profitPerDay);
  const burnTrend = historical.map((m) => m.burnPerDay);

  const profitSlope = calculateTrendSlope(profitTrend);
  const burnSlope = calculateTrendSlope(burnTrend);

  // Project forward
  const projectedProfitPerDay = current.profitPerDay + profitSlope * daysForward;
  const projectedBurnPerDay = current.burnPerDay + burnSlope * daysForward;
  const projectedMargin = current.marginVelocity + current.marginAcceleration * (daysForward / 30);

  // Calculate confidence based on trend consistency
  const profitVariance = calculateVariance(profitTrend);
  const confidence = Math.max(20, Math.min(100, 100 - profitVariance * 10));

  // Determine trend
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (profitSlope > 100) {
    trend = 'improving';
  } else if (profitSlope < -100) {
    trend = 'declining';
  }

  return {
    projectedProfitPerDay,
    projectedBurnPerDay,
    projectedMargin,
    confidence,
    trend,
  };
}

/**
 * Calculate trend slope (simple linear regression)
 */
function calculateTrendSlope(values: number[]): number {
  const n = values.length;
  if (n < 2) return 0;

  const xMean = (n - 1) / 2;
  const yMean = values.reduce((sum, val) => sum + val, 0) / n;

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < n; i++) {
    numerator += (i - xMean) * (values[i] - yMean);
    denominator += (i - xMean) * (i - xMean);
  }

  return denominator !== 0 ? numerator / denominator : 0;
}

/**
 * Calculate variance
 */
function calculateVariance(values: number[]): number {
  if (values.length < 2) return 0;

  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map((val) => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

  return Math.sqrt(variance);
}

/**
 * Get velocity health status
 */
export function getVelocityHealthStatus(
  metrics: ProfitVelocityMetrics
): {
  status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  color: string;
  insights: string[];
} {
  const insights: string[] = [];
  let status: 'excellent' | 'good' | 'fair' | 'poor' | 'critical' = 'good';
  let color = 'green';

  // Analyze profit velocity
  if (metrics.profitPerHour < 0) {
    status = 'critical';
    color = 'red';
    insights.push('Negative profit per hour - immediate action required');
  } else if (metrics.profitPerHour < 20) {
    status = 'poor';
    color = 'orange';
    insights.push('Low profit per hour - review pricing and costs');
  } else if (metrics.profitPerHour > 100) {
    status = 'excellent';
    color = 'green';
    insights.push('Excellent profit per hour');
  }

  // Analyze margin velocity
  if (metrics.marginVelocity < -5) {
    if (status === 'good') {
      status = 'fair';
      color = 'yellow';
    }
    insights.push('Margin declining rapidly');
  } else if (metrics.marginVelocity > 5) {
    insights.push('Margin improving');
  }

  // Analyze leakage
  if (metrics.overheadLeakage > 20) {
    if (status === 'good' || status === 'excellent') {
      status = 'fair';
      color = 'yellow';
    }
    insights.push(`High overhead leakage: ${metrics.overheadLeakage.toFixed(1)}%`);
  }

  // Analyze burn rate
  if (metrics.burnPerMonth > metrics.profitPerMonth * 0.9) {
    insights.push('Burn rate approaching profit - monitor closely');
  }

  return { status, color, insights };
}

/**
 * Calculate runway based on velocity
 */
export function calculateRunway(
  currentCash: number,
  metrics: ProfitVelocityMetrics
): {
  runwayDays: number;
  runwayMonths: number;
  burnRate: number;
  criticalDate: string;
} {
  const burnRate = metrics.burnPerDay;
  const runwayDays = burnRate > 0 ? currentCash / burnRate : 999;
  const runwayMonths = runwayDays / 30;

  const criticalDate = new Date();
  criticalDate.setDate(criticalDate.getDate() + Math.floor(runwayDays));

  return {
    runwayDays: Math.floor(runwayDays),
    runwayMonths: Math.floor(runwayMonths * 10) / 10,
    burnRate,
    criticalDate: criticalDate.toISOString().split('T')[0],
  };
}
