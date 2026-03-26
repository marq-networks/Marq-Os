// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-06 — QUOTE SIMULATION ENGINE
// ═══════════════════════════════════════════════════════════════════════════
// What-if quote simulator with margin calculation and recommendations
// Version: 1.0 | Build: ENGINE-06

import { QuoteSimulationInput, QuoteSimulationOutput } from './types';
import { DepartmentCostMatrix } from './types';
import { ClientProfitabilityData } from './types';

/**
 * Run quote simulation
 * Calculates expected margin, profit/hour, loss risk, and recommendation
 */
export function runQuoteSimulation(
  input: QuoteSimulationInput,
  departmentCostMatrix: DepartmentCostMatrix,
  clientHistory?: ClientProfitabilityData,
  overheadAllocationRate: number = 0.15 // 15% overhead allocation
): QuoteSimulationOutput {
  // Calculate department costs
  const departmentCosts = input.departments.map((dept) => {
    const row = departmentCostMatrix.rows.find((r) => r.departmentId === dept.departmentId);
    const costPerHour = row?.costPerHour || 0;
    const totalCost = costPerHour * dept.hours;

    return {
      departmentId: dept.departmentId,
      departmentName: row?.departmentName || 'Unknown',
      hours: dept.hours,
      costPerHour,
      totalCost,
    };
  });

  // Calculate totals
  const totalLaborCost = departmentCosts.reduce((sum, dept) => sum + dept.totalCost, 0);
  const overheadAllocation = totalLaborCost * overheadAllocationRate;
  const expenses = input.additionalExpenses || 0;
  const totalCost = totalLaborCost + overheadAllocation + expenses;

  // Calculate profit and margin
  const profit = input.quoteAmount - totalCost;
  const marginPercentage = input.quoteAmount > 0 ? (profit / input.quoteAmount) * 100 : 0;

  // Calculate profit per hour
  const totalHours = input.departments.reduce((sum, dept) => sum + dept.hours, 0);
  const profitPerHour = totalHours > 0 ? profit / totalHours : 0;

  // Assess loss risk
  let lossRisk: QuoteSimulationOutput['lossRisk'] = 'none';
  if (marginPercentage < 0) {
    lossRisk = 'high';
  } else if (marginPercentage < 10) {
    lossRisk = 'medium';
  } else if (marginPercentage < 20) {
    lossRisk = 'low';
  }

  // Generate recommendation
  let recommendation: QuoteSimulationOutput['recommendation'] = 'approve';
  if (lossRisk === 'high') {
    recommendation = 'reject';
  } else if (lossRisk === 'medium' || marginPercentage < 15) {
    recommendation = 'review';
  }

  // Compare with client history
  let clientHistoricalMargin: number | undefined;
  let clientComparison: QuoteSimulationOutput['clientComparison'];

  if (clientHistory) {
    const clientMargin = clientHistory.revenue30d > 0
      ? ((clientHistory.profit30d / clientHistory.revenue30d) * 100)
      : 0;
    clientHistoricalMargin = clientMargin;

    const marginDiff = marginPercentage - clientMargin;
    if (marginDiff > 5) {
      clientComparison = 'better';
    } else if (marginDiff < -5) {
      clientComparison = 'worse';
      if (recommendation === 'approve') {
        recommendation = 'review';
      }
    } else {
      clientComparison = 'similar';
    }
  }

  return {
    quoteAmount: input.quoteAmount,
    totalCost,
    expectedMargin: profit,
    marginPercentage,
    profitPerHour,
    lossRisk,
    recommendation,
    breakdown: {
      departmentCosts,
      overheadAllocation,
      expenses,
      profit,
    },
    clientHistoricalMargin,
    clientComparison,
    simulatedAt: new Date().toISOString(),
  };
}

/**
 * Calculate minimum viable quote amount
 * Returns the minimum quote amount to achieve target margin
 */
export function calculateMinimumViableQuote(
  departments: Array<{ departmentId: string; hours: number }>,
  departmentCostMatrix: DepartmentCostMatrix,
  targetMarginPercentage: number = 20,
  additionalExpenses: number = 0,
  overheadAllocationRate: number = 0.15
): {
  minimumQuote: number;
  costBreakdown: {
    labor: number;
    overhead: number;
    expenses: number;
    total: number;
  };
  targetMargin: number;
} {
  // Calculate labor cost
  const laborCost = departments.reduce((sum, dept) => {
    const row = departmentCostMatrix.rows.find((r) => r.departmentId === dept.departmentId);
    const costPerHour = row?.costPerHour || 0;
    return sum + costPerHour * dept.hours;
  }, 0);

  const overheadCost = laborCost * overheadAllocationRate;
  const totalCost = laborCost + overheadCost + additionalExpenses;

  // Calculate minimum quote
  // Formula: Quote = Cost / (1 - MarginPercentage/100)
  const minimumQuote = totalCost / (1 - targetMarginPercentage / 100);
  const targetMargin = minimumQuote - totalCost;

  return {
    minimumQuote,
    costBreakdown: {
      labor: laborCost,
      overhead: overheadCost,
      expenses: additionalExpenses,
      total: totalCost,
    },
    targetMargin,
  };
}

/**
 * Compare multiple quote scenarios
 */
export function compareQuoteScenarios(
  scenarios: Array<{ name: string; input: QuoteSimulationInput }>,
  departmentCostMatrix: DepartmentCostMatrix,
  clientHistory?: ClientProfitabilityData
): Array<{
  name: string;
  output: QuoteSimulationOutput;
  ranking: number;
}> {
  const results = scenarios.map((scenario) => ({
    name: scenario.name,
    output: runQuoteSimulation(scenario.input, departmentCostMatrix, clientHistory),
    ranking: 0,
  }));

  // Rank by profit per hour
  results.sort((a, b) => b.output.profitPerHour - a.output.profitPerHour);
  results.forEach((result, index) => {
    result.ranking = index + 1;
  });

  return results;
}

/**
 * Suggest quote adjustments
 */
export function suggestQuoteAdjustments(
  simulation: QuoteSimulationOutput,
  targetMarginPercentage: number = 20
): {
  currentMargin: number;
  targetMargin: number;
  suggestedQuoteAmount: number;
  increase: number;
  increasePercentage: number;
  rationale: string;
} {
  const currentMargin = simulation.marginPercentage;
  const marginGap = targetMarginPercentage - currentMargin;

  // Calculate suggested quote
  const suggestedQuoteAmount = simulation.totalCost / (1 - targetMarginPercentage / 100);
  const increase = suggestedQuoteAmount - simulation.quoteAmount;
  const increasePercentage = simulation.quoteAmount > 0
    ? (increase / simulation.quoteAmount) * 100
    : 0;

  let rationale = '';
  if (marginGap > 0) {
    rationale = `To achieve ${targetMarginPercentage}% margin, increase quote by ${increasePercentage.toFixed(1)}%`;
  } else {
    rationale = `Current margin (${currentMargin.toFixed(1)}%) exceeds target. Quote is competitive.`;
  }

  return {
    currentMargin,
    targetMargin: targetMarginPercentage,
    suggestedQuoteAmount,
    increase,
    increasePercentage,
    rationale,
  };
}

/**
 * Analyze quote risk factors
 */
export function analyzeQuoteRiskFactors(
  simulation: QuoteSimulationOutput,
  projectDuration?: number
): {
  riskFactors: Array<{ factor: string; level: 'low' | 'medium' | 'high'; description: string }>;
  overallRisk: 'low' | 'medium' | 'high';
} {
  const riskFactors: Array<{ factor: string; level: 'low' | 'medium' | 'high'; description: string }> = [];

  // Margin risk
  if (simulation.marginPercentage < 10) {
    riskFactors.push({
      factor: 'Low Margin',
      level: 'high',
      description: `Margin at ${simulation.marginPercentage.toFixed(1)}% is below safe threshold`,
    });
  } else if (simulation.marginPercentage < 20) {
    riskFactors.push({
      factor: 'Tight Margin',
      level: 'medium',
      description: `Margin at ${simulation.marginPercentage.toFixed(1)}% provides limited buffer`,
    });
  }

  // Profit per hour risk
  if (simulation.profitPerHour < 20) {
    riskFactors.push({
      factor: 'Low Profit/Hour',
      level: 'high',
      description: `Profit per hour at $${simulation.profitPerHour.toFixed(2)} is suboptimal`,
    });
  } else if (simulation.profitPerHour < 50) {
    riskFactors.push({
      factor: 'Moderate Profit/Hour',
      level: 'medium',
      description: `Profit per hour at $${simulation.profitPerHour.toFixed(2)} is acceptable but could be better`,
    });
  }

  // Client history risk
  if (simulation.clientComparison === 'worse') {
    riskFactors.push({
      factor: 'Below Client Average',
      level: 'medium',
      description: 'This quote performs worse than historical client average',
    });
  }

  // Project duration risk
  if (projectDuration && projectDuration > 90) {
    riskFactors.push({
      factor: 'Long Duration',
      level: 'medium',
      description: 'Extended project duration increases risk of scope creep',
    });
  }

  // Overall risk assessment
  const highRisks = riskFactors.filter((r) => r.level === 'high').length;
  const mediumRisks = riskFactors.filter((r) => r.level === 'medium').length;

  let overallRisk: 'low' | 'medium' | 'high' = 'low';
  if (highRisks > 0) {
    overallRisk = 'high';
  } else if (mediumRisks >= 2) {
    overallRisk = 'high';
  } else if (mediumRisks === 1) {
    overallRisk = 'medium';
  }

  return {
    riskFactors,
    overallRisk,
  };
}

/**
 * Generate quote recommendation text
 */
export function generateQuoteRecommendation(
  simulation: QuoteSimulationOutput,
  targetMargin: number = 20
): string {
  const { recommendation, marginPercentage, profitPerHour, lossRisk } = simulation;

  if (recommendation === 'approve') {
    return `✅ APPROVE: Strong margin (${marginPercentage.toFixed(1)}%) and profit/hour ($${profitPerHour.toFixed(2)}). Quote is profitable and competitive.`;
  } else if (recommendation === 'review') {
    return `⚠️ REVIEW: Margin (${marginPercentage.toFixed(1)}%) is below target. Consider negotiating higher or reducing scope.`;
  } else {
    return `❌ REJECT: Quote will result in loss or minimal profit. Margin: ${marginPercentage.toFixed(1)}%. Recommend declining or restructuring.`;
  }
}
