// ═══════════════════════════════════════════════════════════════════════════
// ORG-F-ENGINE-07 — SANDBOX REALITY EMULATOR
// ═══════════════════════════════════════════════════════════════════════════
// What-if simulator for hiring, salary changes, tool changes, price changes
// Version: 1.0 | Build: ENGINE-07

import { WhatIfScenario, WhatIfOutput } from './types';
import { DepartmentCostMatrix } from './types';

interface OrganizationSnapshot {
  totalMonthlyCost: number;
  totalMonthlyRevenue: number;
  costPerHour: number;
  employeeCount: number;
  monthlyProfit: number;
  marginPercentage: number;
}

/**
 * Create organization snapshot (current state)
 */
export function createOrganizationSnapshot(
  departmentCostMatrix: DepartmentCostMatrix,
  monthlyRevenue: number
): OrganizationSnapshot {
  const totalMonthlyCost = departmentCostMatrix.totalMonthlySalary + departmentCostMatrix.totalOverhead;
  const monthlyProfit = monthlyRevenue - totalMonthlyCost;
  const marginPercentage = monthlyRevenue > 0 ? (monthlyProfit / monthlyRevenue) * 100 : 0;

  return {
    totalMonthlyCost,
    totalMonthlyRevenue: monthlyRevenue,
    costPerHour: departmentCostMatrix.averageCostPerHour,
    employeeCount: departmentCostMatrix.totalEmployees,
    monthlyProfit,
    marginPercentage,
  };
}

/**
 * Simulate hiring scenario
 */
function simulateHiring(
  scenario: WhatIfScenario,
  currentSnapshot: OrganizationSnapshot,
  departmentCostMatrix: DepartmentCostMatrix
): OrganizationSnapshot {
  if (!scenario.inputs.hiring) return currentSnapshot;

  const { count, salaryPerPerson } = scenario.inputs.hiring;
  const totalNewSalary = count * salaryPerPerson;

  // Estimate overhead increase (proportional to headcount increase)
  const currentOverheadPerEmployee = departmentCostMatrix.totalOverhead / (departmentCostMatrix.totalEmployees || 1);
  const newOverhead = currentOverheadPerEmployee * count;

  const totalCostIncrease = totalNewSalary + newOverhead;
  const newTotalCost = currentSnapshot.totalMonthlyCost + totalCostIncrease;
  const newEmployeeCount = currentSnapshot.employeeCount + count;

  // Cost per hour calculation (assuming 160 hours/month per employee)
  const totalMonthlyHours = newEmployeeCount * 160;
  const newCostPerHour = totalMonthlyHours > 0 ? newTotalCost / totalMonthlyHours : 0;

  const newProfit = currentSnapshot.totalMonthlyRevenue - newTotalCost;
  const newMargin = currentSnapshot.totalMonthlyRevenue > 0
    ? (newProfit / currentSnapshot.totalMonthlyRevenue) * 100
    : 0;

  return {
    totalMonthlyCost: newTotalCost,
    totalMonthlyRevenue: currentSnapshot.totalMonthlyRevenue,
    costPerHour: newCostPerHour,
    employeeCount: newEmployeeCount,
    monthlyProfit: newProfit,
    marginPercentage: newMargin,
  };
}

/**
 * Simulate salary change scenario
 */
function simulateSalaryChange(
  scenario: WhatIfScenario,
  currentSnapshot: OrganizationSnapshot
): OrganizationSnapshot {
  if (!scenario.inputs.salaryChange) return currentSnapshot;

  const { newSalary, changePercentage } = scenario.inputs.salaryChange;

  // Calculate impact
  let salaryIncrease = 0;
  if (changePercentage) {
    // If percentage change, apply to total salary
    salaryIncrease = currentSnapshot.totalMonthlyCost * (changePercentage / 100);
  } else if (newSalary) {
    // If specific salary change, use that
    salaryIncrease = newSalary;
  }

  const newTotalCost = currentSnapshot.totalMonthlyCost + salaryIncrease;
  const newCostPerHour = currentSnapshot.employeeCount > 0
    ? newTotalCost / (currentSnapshot.employeeCount * 160)
    : 0;

  const newProfit = currentSnapshot.totalMonthlyRevenue - newTotalCost;
  const newMargin = currentSnapshot.totalMonthlyRevenue > 0
    ? (newProfit / currentSnapshot.totalMonthlyRevenue) * 100
    : 0;

  return {
    ...currentSnapshot,
    totalMonthlyCost: newTotalCost,
    costPerHour: newCostPerHour,
    monthlyProfit: newProfit,
    marginPercentage: newMargin,
  };
}

/**
 * Simulate tool/overhead change scenario
 */
function simulateToolChange(
  scenario: WhatIfScenario,
  currentSnapshot: OrganizationSnapshot
): OrganizationSnapshot {
  if (!scenario.inputs.toolChange) return currentSnapshot;

  const { newMonthlyCost, oldMonthlyCost } = scenario.inputs.toolChange;
  const costChange = newMonthlyCost - (oldMonthlyCost || 0);

  const newTotalCost = currentSnapshot.totalMonthlyCost + costChange;
  const newCostPerHour = currentSnapshot.employeeCount > 0
    ? newTotalCost / (currentSnapshot.employeeCount * 160)
    : currentSnapshot.costPerHour;

  const newProfit = currentSnapshot.totalMonthlyRevenue - newTotalCost;
  const newMargin = currentSnapshot.totalMonthlyRevenue > 0
    ? (newProfit / currentSnapshot.totalMonthlyRevenue) * 100
    : 0;

  return {
    ...currentSnapshot,
    totalMonthlyCost: newTotalCost,
    costPerHour: newCostPerHour,
    monthlyProfit: newProfit,
    marginPercentage: newMargin,
  };
}

/**
 * Simulate price change scenario
 */
function simulatePriceChange(
  scenario: WhatIfScenario,
  currentSnapshot: OrganizationSnapshot
): OrganizationSnapshot {
  if (!scenario.inputs.priceChange) return currentSnapshot;

  const { changePercentage } = scenario.inputs.priceChange;
  const revenueChange = currentSnapshot.totalMonthlyRevenue * (changePercentage / 100);
  const newRevenue = currentSnapshot.totalMonthlyRevenue + revenueChange;

  const newProfit = newRevenue - currentSnapshot.totalMonthlyCost;
  const newMargin = newRevenue > 0 ? (newProfit / newRevenue) * 100 : 0;

  return {
    ...currentSnapshot,
    totalMonthlyRevenue: newRevenue,
    monthlyProfit: newProfit,
    marginPercentage: newMargin,
  };
}

/**
 * Run what-if scenario simulation
 */
export function runWhatIfSimulation(
  scenario: WhatIfScenario,
  departmentCostMatrix: DepartmentCostMatrix,
  currentMonthlyRevenue: number
): WhatIfOutput {
  // Create current state snapshot
  const before = createOrganizationSnapshot(departmentCostMatrix, currentMonthlyRevenue);

  // Run appropriate simulation based on scenario type
  let after: OrganizationSnapshot;
  switch (scenario.type) {
    case 'hiring':
      after = simulateHiring(scenario, before, departmentCostMatrix);
      break;
    case 'salary-change':
      after = simulateSalaryChange(scenario, before);
      break;
    case 'tool-change':
      after = simulateToolChange(scenario, before);
      break;
    case 'price-change':
      after = simulatePriceChange(scenario, before);
      break;
    default:
      after = before;
  }

  // Calculate impact metrics
  const marginDrift = after.marginPercentage - before.marginPercentage;
  const burnChange = after.totalMonthlyCost - before.totalMonthlyCost;
  const netProfitShift = after.monthlyProfit - before.monthlyProfit;
  const costPerHourChange = after.costPerHour - before.costPerHour;

  // Generate recommendation
  const recommendation = generateWhatIfRecommendation(scenario, marginDrift, netProfitShift);

  return {
    scenarioId: scenario.id,
    scenarioName: scenario.name,
    marginDrift,
    burnChange,
    netProfitShift,
    costPerHourChange,
    before,
    after,
    recommendation,
    computedAt: new Date().toISOString(),
  };
}

/**
 * Generate recommendation based on what-if results
 */
function generateWhatIfRecommendation(
  scenario: WhatIfScenario,
  marginDrift: number,
  netProfitShift: number
): string {
  const recommendations: string[] = [];

  if (scenario.type === 'hiring') {
    if (netProfitShift < 0) {
      recommendations.push('⚠️ This hire will reduce profit. Ensure increased revenue to offset cost.');
    } else if (marginDrift < -5) {
      recommendations.push('⚠️ Margin will decrease significantly. Consider raising prices or improving efficiency.');
    } else {
      recommendations.push('✅ Hiring impact is manageable. Proceed if revenue growth is projected.');
    }
  } else if (scenario.type === 'salary-change') {
    if (netProfitShift < -5000) {
      recommendations.push('⚠️ Significant profit impact. Consider phased implementation or revenue increase.');
    } else if (marginDrift < -3) {
      recommendations.push('⚠️ Margin will compress. Monitor closely and adjust pricing if needed.');
    } else {
      recommendations.push('✅ Salary change is affordable within current margins.');
    }
  } else if (scenario.type === 'tool-change') {
    if (netProfitShift > 0) {
      recommendations.push('✅ Tool change will improve profitability. Good investment.');
    } else if (netProfitShift < -1000) {
      recommendations.push('⚠️ Tool adds significant cost. Ensure it provides offsetting value.');
    } else {
      recommendations.push('➡️ Minor cost impact. Proceed if tool improves productivity.');
    }
  } else if (scenario.type === 'price-change') {
    if (marginDrift > 5) {
      recommendations.push('✅ Price increase significantly improves margins. Recommend implementation.');
    } else if (marginDrift < -5) {
      recommendations.push('❌ Price decrease heavily impacts margins. Not recommended unless strategic.');
    } else {
      recommendations.push('➡️ Price change has moderate impact. Evaluate market response.');
    }
  }

  return recommendations.join(' ');
}

/**
 * Compare multiple what-if scenarios
 */
export function compareWhatIfScenarios(
  scenarios: WhatIfScenario[],
  departmentCostMatrix: DepartmentCostMatrix,
  currentMonthlyRevenue: number
): Array<WhatIfOutput & { rank: number }> {
  const results = scenarios.map((scenario) =>
    runWhatIfSimulation(scenario, departmentCostMatrix, currentMonthlyRevenue)
  );

  // Rank by net profit shift (descending)
  const ranked = results
    .map((result, index) => ({ ...result, rank: 0 }))
    .sort((a, b) => b.netProfitShift - a.netProfitShift);

  ranked.forEach((result, index) => {
    result.rank = index + 1;
  });

  return ranked;
}

/**
 * Calculate break-even point for a scenario
 */
export function calculateBreakEven(
  scenario: WhatIfScenario,
  output: WhatIfOutput
): {
  currentRevenue: number;
  requiredRevenue: number;
  revenueIncrease: number;
  increasePercentage: number;
} {
  const currentRevenue = output.before.totalMonthlyRevenue;
  const newCost = output.after.totalMonthlyCost;
  const requiredRevenue = newCost; // Break-even is when revenue = cost
  const revenueIncrease = requiredRevenue - currentRevenue;
  const increasePercentage = currentRevenue > 0
    ? (revenueIncrease / currentRevenue) * 100
    : 0;

  return {
    currentRevenue,
    requiredRevenue,
    revenueIncrease,
    increasePercentage,
  };
}

/**
 * Validate scenario inputs
 */
export function validateScenarioInputs(
  scenario: WhatIfScenario
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  switch (scenario.type) {
    case 'hiring':
      if (!scenario.inputs.hiring) {
        errors.push('Hiring scenario requires hiring inputs');
      } else {
        if (scenario.inputs.hiring.count <= 0) {
          errors.push('Hiring count must be greater than 0');
        }
        if (scenario.inputs.hiring.salaryPerPerson <= 0) {
          errors.push('Salary per person must be greater than 0');
        }
      }
      break;

    case 'salary-change':
      if (!scenario.inputs.salaryChange) {
        errors.push('Salary change scenario requires salary change inputs');
      }
      break;

    case 'tool-change':
      if (!scenario.inputs.toolChange) {
        errors.push('Tool change scenario requires tool change inputs');
      } else {
        if (scenario.inputs.toolChange.newMonthlyCost < 0) {
          errors.push('Tool cost cannot be negative');
        }
      }
      break;

    case 'price-change':
      if (!scenario.inputs.priceChange) {
        errors.push('Price change scenario requires price change inputs');
      }
      break;
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
